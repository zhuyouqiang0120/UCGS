/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-2 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.chasonx.directory.FileListUtil;
import com.chasonx.directory.FileUtil;
import com.chasonx.entity.FileEntity;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminAuthDao;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.dao.ResourceDao;
import com.chasonx.ucgs.dao.SiteDao;
import com.chasonx.ucgs.dao.TopicDao;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.entity.ResourceEntity;
import com.chasonx.ucgs.entity.Site;
import com.chasonx.ucgs.entity.Template;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.chasonx.ucgs.entity.TopicRelate;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.jfinal.upload.UploadFile;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月2日下午3:15:02
 * @remark
 */
public class SiteController extends Controller {
	
	@AnnPara("访问网站管理页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.SITE_LIST);
	}
	
	@AnnPara("网站信息编辑")
	@Before({Para.class,SaveLog.class})
	public void modify(){
		int type = getParaToInt("type");
		Site site = Tools.recordConvertModel((Record)getAttr("RequestPara"),Site.class);
		int res = 0;
		switch(type){
		case 1:
			site.set("fguid", Tools.getGuid());
			site.set("fcreatetime", DateFormatUtil.formatString(null));
			site.set("fcreaterguid", DHttpUtils.getLoginUser(getRequest()).get("fguid"));
			res = PublicDao.execute("insert", site);
			break;
		case 2:
			res = PublicDao.execute("update", site);
			break;
		case 3:
			res = PublicDao.execute("delete", site);
			break;
		}
		renderJson(res);
	}
	
	@AnnPara("网站权限编辑操作")
	@Before(SaveLog.class)
	public void permission(){
		int type = getParaToInt("type");
		String roleid = getPara("roleid");
		String[] siteGuid  = getParaValues("siteguid[]");
		int res = 0;
		switch(type){
		case 1:
			//SiteDao.delPermission(roleid);
			res = AdminAuthDao.del(roleid, Constant.AuthTypes.site.toString()) ? 1: 0;
			res = SiteDao.addPermissionBatch(siteGuid, roleid);
			break;
		case 2:
			//res = SiteDao.delPermission(roleid);
			res = AdminAuthDao.del(roleid, Constant.AuthTypes.site.toString()) ? 1: 0;
			break;
		}
		renderJson(res);
	}
	
	@AnnPara("查询可操作网站列表")
	@Before(SaveLog.class)
	public void permissionList(){
		renderJson(AdminAuthDao.getAuths(getPara("roleid"), Constant.AuthTypes.site.toString()));
	}
	
	@AnnPara("查询角色可操作网站列表")
	@Before(SaveLog.class)
	public void adminRoleSiteList(){
		renderJson(Db.find("select s.* from t_site s INNER JOIN t_admin_auth a on a.ftargetauthguid = s.fguid where s.fdelete = 0 and a.fuserguid = ? and a.ftype = ?",getPara("roleId"),Constant.AuthTypes.site.toString()));
	}
	
	@AnnPara("查询公共网站列表")
	@Before(SaveLog.class)
	public void publicSiteList(){
		renderJson(Db.find("select * from t_site where ftype = ?",Constant.SITE_TYPE_PUBLIC));
	}
	
	@AnnPara("验证网站别名")
	@Before(SaveLog.class)
	public void validateAlias(){
		String sql = "select * from  t_site where fsitealias = ?";
		renderJson(PublicDao.query(sql, getPara("alias")) == null?0:1);
	}
	
	@AnnPara("查询网站列表")
	@Before(SaveLog.class)
	public void sitelist(){
		String areaguid = getPara("areaguid");
		int PageNumber = getParaToInt("PageNumber");
		int PageSize = getParaToInt("PageSize");
		int delete = getParaToInt("del");
		PageNumber = (PageNumber + PageSize)/PageSize;
		
		String type = getPara("queryType");
		Integer state = getParaToInt("queryState");
		String sitename = getPara("siteName");
		
		try{
			String wherext = "";
			if(type != null) wherext += " and s.ftype = '"+ type +"'";
			if(state != null) wherext += " and s.fstate = " + state;
			if(StringUtils.hasText(sitename)) wherext += " and s.fsitename like '%"+ sitename +"%'";
			
			String whereSql = "from t_site s INNER JOIN t_adminuser u on s.fcreaterguid = u.fguid LEFT JOIN t_area a on s.fareaguid = a.fguid  where s.fdelete = ? ";
			Record loginRec = DHttpUtils.getLoginUser(getRequest());
			
			List<String> areaGuidList = AdminAuthDao.getAuthFieldList("ftargetauthguid",loginRec.getStr("fguid"),Constant.AuthTypes.area.toString(),null);
			if(areaGuidList.isEmpty()) areaGuidList = AdminAuthDao.getAuthFieldList("ftargetauthguid",loginRec.getStr("roleguid"),Constant.AuthTypes.area.toString(),null);
			
			/*系统管理员或机构管理员权限查询*/
			if(loginRec.getInt("fsysroletype") == 0){
				if(loginRec.getInt("groupadmin") == 1){
//					 AreaDao.getHasAreaGuidList(loginRec.getStr("roleareaguid"), 0);
//					if(StringUtils.hasText(areaguid)){
//						whereSql += " and s.fareaguid = '"+ areaguid + "'";
//					} 
				}else{
					List<String> siteGuids = AdminAuthDao.getAuthFieldList("ftargetauthguid",loginRec.getStr("fguid"),Constant.AuthTypes.site.toString(),null);
					if(siteGuids.isEmpty()) siteGuids = AdminAuthDao.getAuthFieldList("ftargetauthguid",loginRec.getStr("roleguid"),Constant.AuthTypes.site.toString(),null);
					if(siteGuids.isEmpty()) siteGuids = SiteDao.getSiteGuidByCreater(loginRec.getStr("fguid"));
					if(siteGuids.isEmpty()) siteGuids.add("0");
						
					whereSql += " and s.fguid in ("+ StringUtils.joinForList(siteGuids, ",") +") ";
				}
				
				if(areaGuidList.isEmpty()) areaGuidList.add("0");
				whereSql += " and s.fareaguid in ("+ Tools.joinForList(areaGuidList, ",") +")";
			}
			if(StringUtils.hasText(areaguid)){
				whereSql += " and s.fareaguid = '"+ areaguid + "'";
			}
			whereSql += wherext;
			//whereSql += " or (s.fcreaterguid = '"+ loginRec.getStr("fguid") +"') ";
			whereSql += " order by s.id desc";
			renderJson(PublicDao.queryListForPage("select s.*,u.fadminname,a.fname as areaname,(select fassetname from t_resource where s.ftempguid = fguid) as fassetname ", whereSql, PageNumber, PageSize,delete));
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	@AnnPara("查询网站详细")
	@Before(SaveLog.class)
	public void siteEntity(){
		renderJson(Db.findFirst("select s.*,a.fname as areaname from t_site s LEFT JOIN t_area a on s.fareaguid = a.fguid where s.id = ? ",getParaToLong("id")));
	}
	
	public void siteExportInfo(){
		String siteGuid = getPara("siteGuid");
		Record record = new Record();
		
		if(StringUtils.hasText(siteGuid)){
			Long colCount = Db.queryLong("select count(id) from t_column where fsiteguid = ?",siteGuid);
			Long topicCount = Db.queryLong("select count(id) from t_topic_relate where fcolguid in ( select fguid from t_column where fsiteguid = ?)",siteGuid);
			Long resCount = Db.queryLong("select count(id) from t_resource where fsiteguid = ?",siteGuid);
			record.set("colCount", colCount);
			record.set("topicCount", topicCount);
			record.set("resCount", resCount);
		}
		renderJson(record);
	}
	
	@AnnPara("站点数据导出")
	@Before(SaveLog.class)
	public void siteExport(){
		String siteGuid = getPara("siteGuid");
		String[] colIdStr = getParaValues("cidArray[]");
		String topic = getPara("topic");
		String column = getPara("column");
		String res = getPara("res");
		
		String basePath = PathKit.getWebRootPath();
		
		Site site = Site.siteDao.findFirst("select * from t_site where fguid = ?",siteGuid);
		List<Column> col = null;
		List<TopicRelate> relate = null;
		List<Topic> tEntity = null;
		List<TopicContent> tContent = null;
		List<ResourceEntity> resourceEntity = null;
		List<Template> templates = null;
		boolean allColumn = true;
		
		if(null != colIdStr && colIdStr.length > 0){
			col = Column.columnDao.find("select * from t_column where fguid in("+ StringUtils.join(colIdStr, ",") +")");
			allColumn = false;
		}else if(StringUtils.hasText(column) && column.equals("true")){
			col = Column.columnDao.find("select * from t_column where fsiteguid = ?",siteGuid);
		}
		if(StringUtils.hasText(topic) && topic.equals("true")){
			if(allColumn){
				relate = TopicDao.getAllTopicRelateBySiteGuid(siteGuid);
				tEntity = TopicDao.getAllTopicBySiteGuid(siteGuid);
				tContent = TopicDao.getAllTopicContentBySiteGuid(siteGuid);
				templates = TopicDao.getTemplateListBySiteGuid(siteGuid);
			}else{
				List<String> colGuidList = getImportDataGuid(col, "fguid");
				relate = TopicDao.getAllTopicRelateByColumnGuidList(colGuidList);
				tEntity = TopicDao.getAllTopicByColumnGuidList(colGuidList);
				tContent = TopicDao.getAllTopicContentByColumnGuidList(colGuidList);
				templates = TopicDao.getTemplateListByColumnGuidList(colGuidList);
			}
		}
		if(StringUtils.hasText(res) && res.equals("true")){
			resourceEntity = ResourceEntity.res.find("select * from t_resource where fsiteguid = ? ",siteGuid);
		}
		
		int ret = 0;
		String filePath = "";
		Record seria = new Record()
		.set("Site", site)
		.set("Column", col)
		.set("AllColumn", allColumn)
		.set("TopicRelate", relate)
		.set("Template", templates)
		.set("Topic", tEntity)
		.set("TopicContent", tContent)
		.set("Resource", resourceEntity);
		try {
			filePath = "SiteData_" + site.getStr("fsitealias") + "_" + DateFormatUtil.formatString("yyyyMMddHHmmss") + ".ucgs";;
			FileUtil.enSerializeObject(seria,  basePath + "/files/export/" + siteGuid + "/" + filePath);
			ret = 1;
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		renderJson("{\"result\":\""+ ret +"\",\"sn\":\""+ filePath +"\"}");
	}
	
	@Required({
		@ParaEntity(name = "siteGuid"),
		@ParaEntity(name = "filename")
	})
	@Before(ParamInterceptor.class)
	public void downloadExportFile(){
		String siteGuid = getPara("siteGuid");
		String fileName = getPara("filename");
		renderFile(new File(PathKit.getWebRootPath() + "/files/export/" + siteGuid + "/" + fileName));
	}
	
	@AnnPara("站点数据导入")
	@Before({SaveLog.class,Tx.class})
	public void importExportData(){
		String bPath = PathKit.getWebRootPath();
		UploadFile upload = getFile("ucgsDataFile", bPath + "/files/import");
		int result = 0;
		try{
			File file = upload.getFile();
			Record deSeria = FileUtil.deSerializeObject(file.getAbsolutePath());
			Site site = deSeria.get("Site");
			List<Column> columns = deSeria.get("Column");
			List<TopicRelate> relate = deSeria.get("TopicRelate");
			List<Topic> tEntity = deSeria.get("Topic");
			List<TopicContent> tContent = deSeria.get("TopicContent");
			List<ResourceEntity> resourceEntity = deSeria.get("Resource");
			List<Template> templates = deSeria.get("Template");
			
			boolean allColumn = deSeria.getBoolean("AllColumn");
			
			if(checkSiteExist(site,columns,relate,tEntity,tContent,resourceEntity,templates,allColumn)){
				importSeriaModel(columns);
				importSeriaModel(relate);
				importSeriaModel(tEntity);
				importSeriaModel(tContent);
				importSeriaModel(resourceEntity);
				importSeriaModel(templates);
				result = 1;
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(result);
	}

	@Required(@ParaEntity(name = "siteGuid"))
	@Before(ParamInterceptor.class)
	public void historyDataList(){
		String siteGuid = getPara("siteGuid");
		List<FileEntity> list = FileListUtil.list(PathKit.getWebRootPath() + "/files/export/" + siteGuid, "ucgs");
		for(int i = 0,len = list.size();i < len;i++){
			list.get(i).setAbsuloteDirectory(null);
			list.get(i).setParentDirectory(null);
		}
		renderJson(list == null?"":list);
	}
	
	@Required({
		@ParaEntity(name = "siteGuid"),
		@ParaEntity(name = "filename")
	})
	@Before(ParamInterceptor.class)
	public void removeSiteData(){
		renderJson(FileUtil.delfile(PathKit.getWebRootPath() + "/files/export/" + getPara("siteGuid") + "/" + getPara("filename"))?1:0);
	}
	
	public boolean checkSiteExist(Site site,List<Column> columns,List<TopicRelate> relate,List<Topic> tEntity
			,List<TopicContent> tContent,List<ResourceEntity> resourceEntity,List<Template> templates,boolean allColumn){
		try{
			String siteGuid = site.getStr("fguid");
			Site _cksite = Site.siteDao.findFirst("select * from t_site where fguid = ?",siteGuid);
			if(null == _cksite){
				site.remove("id").save();
			}else{
				site.set("id", _cksite.get("id")).update();
			}
			if(allColumn){
				ColumnDao.deleteAllColumnBySiteGuid(siteGuid);
				TopicDao.delAllTopicContentBySiteGuid(siteGuid);
				TopicDao.delAllTopicBySiteGuid(siteGuid);
				TopicDao.delAllTopicRelativeBySiteGuid(siteGuid);
				ResourceDao.delAllResourceBySiteGuid(siteGuid);
			}else{
				ColumnDao.deleteColumnByGuidList(getImportDataGuid(columns, "fguid"));
				TopicDao.delTopicByGuidList(getImportDataGuid(tEntity, "fguid"));
				TopicDao.delTopicRelateByTopicGuidList(getImportDataGuid(relate, "ftopicguid"));
				TopicDao.delTopicContentByTopicGuidList(getImportDataGuid(tContent, "ftopicguid"));
				ResourceDao.delResourceByGuidList(getImportDataGuid(resourceEntity, "fguid"));
			}
			
			if(templates != null && !templates.isEmpty()){
				List<Integer> tIdList = new ArrayList<Integer>();
				for(int i = 0,len = templates.size();i < len;i++){
					tIdList.add(Integer.parseInt(templates.get(i).getLong("id").toString()));
				}
				TopicDao.delTemplateByIdList(tIdList);
			}
			
		}catch(Exception e){
			e.printStackTrace();
			return false;
		}
		return true;
	}
	/**
	 * 获取集合GUID
	 * @author chasonx
	 * @create 2016年10月13日 下午3:57:06
	 * @update
	 * @param  
	 * @return List<String>
	 */
	public List<String> getImportDataGuid(@SuppressWarnings("rawtypes") List<? extends Model> list,String idFieldName){
		List<String> guids = new ArrayList<String>();
		for(int i = 0,len = list.size();i < len;i++){
			guids.add(list.get(i).getStr(idFieldName));
		}
		if(guids.isEmpty()) guids.add("0");
		return guids;
	}
	
	/**
	 * 导入数据通用方法
	 * @author chasonx
	 * @create 2016年9月26日 下午6:02:48
	 * @update
	 * @param  
	 * @return void
	 */
	public  void importSeriaModel(@SuppressWarnings("rawtypes") List<? extends Model> list){
		if(list == null || list.isEmpty()) return;
		
		for(int i = 0,len = list.size();i < len;i++){
			list.get(i).remove("id").save();
		}
	}
}
