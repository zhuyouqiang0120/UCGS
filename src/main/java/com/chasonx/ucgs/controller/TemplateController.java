/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-9 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.io.File;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.chasonx.directory.FileListUtil;
import com.chasonx.directory.FileUtil;
import com.chasonx.directory.RarDirUtil;
import com.chasonx.entity.FileEntity;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.HttpUtil;
import com.chasonx.tools.Md5Util;
import com.chasonx.tools.StringUtils;
import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Ssh2Util;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.dao.ResourceDao;
import com.chasonx.ucgs.dao.TaskDao;
import com.chasonx.ucgs.dao.TemplateDao;
import com.chasonx.ucgs.entity.AdminDevice;
import com.chasonx.ucgs.entity.PublishToDo;
import com.chasonx.ucgs.entity.ResourceEntity;
import com.chasonx.ucgs.entity.ResultData;
import com.chasonx.ucgs.entity.SitePublish;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.entity.TQuartz;
import com.chasonx.ucgs.entity.Template;
import com.chasonx.ucgs.entity.TemplateStatus;
import com.chasonx.ucgs.entity.TimeSet;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.chasonx.upload.DownLoadFileUtil;
import com.chasonx.upload.UploadFileUtil;
import com.google.gson.Gson;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.TableMapping;
import com.jfinal.plugin.activerecord.tx.Tx;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月9日下午3:41:10
 * @remark
 */
public class TemplateController extends Controller {
	
	public void tempreviewPage(){
		render("tpreview.ftl");
	}

	@AnnPara("访问模板页面")
	@Before(SaveLog.class)
	public void index(){
		Record loginUser = DHttpUtils.getLoginUser(getRequest());
		setAttr("LOGINUSER_GUID", loginUser.getStr("fguid"));
		setAttr("LOGINUSER_TYPE", loginUser.getInt("fsysroletype"));
		render(PageUtil.TEMP_LIST);
	}
	
	@AnnPara("访问模板上传")
	@Before(SaveLog.class)
	public void file(){
		render(PageUtil.TEMP_UPLOAD);
	}
	
	@AnnPara("访问模板状态页面")
	@Before(SaveLog.class)
	public void state(){
		render(PageUtil.TEMP_STATE);
	}
	
	@AnnPara("访问升级文件管理页面")
	@Before(SaveLog.class)
	public void upgrade(){
		setAttr("LOGINUSER_GUID", DHttpUtils.getLoginUser(getRequest()).get("fguid"));
		render(PageUtil.TEMP_UPGRADE);
	}
	
	@AnnPara("模板上传")
	@Before({Tx.class,SaveLog.class})
	public void upload(){
		int res = 0;
		UploadFileUtil item = UploadFileUtil.getAbsoluteFile(getRequest());
		try {
			String md5Code = Md5Util.md5InputStream(item.getFileItem().getInputStream());
			
			if(ResourceDao.checkExist(md5Code) <= 0L){
				String fileDir = PathKit.getWebRootPath() + "/tempfiles/" + md5Code;
				item.saveFile(fileDir + "/source/", md5Code);
				
				
				//String siteGuid = getPara("fileSite");
				String fname = md5Code + getPara("fileType");
				String tempGuid = Tools.getGuid();
				String assetName = URLDecoder.decode(getPara("fileName"),"UTF-8");
				String remark = URLDecoder.decode(getPara("remark"),"UTF-8");
				
				
				PublicDao.updateBatch("update t_resource set fstate = 0 where ftype = ? and fstate = 1",Constant.FILE_TYPE_TEMPLATE);
				ResourceEntity entity = new ResourceEntity();
				entity.set("fguid", tempGuid);
				entity.set("fassetname",  assetName);
				entity.set("fmd5code", md5Code);
				entity.set("fname", fname);
				entity.set("fsize", getPara("fileSize"));
				entity.set("ftype", Constant.FILE_TYPE_TEMPLATE);
				//entity.set("fsiteguid", siteGuid);
				entity.set("fpath", "/tempfiles/" + md5Code + "/upzipfiles/" + assetName.substring(0,assetName.lastIndexOf(".")));
				entity.set("fuploadtime", DateFormatUtil.formatString(null));
				entity.set("fuploader", DHttpUtils.getLoginUser(getRequest()).getStr("fadminname"));
				entity.set("fadminguid",DHttpUtils.getLoginUser(getRequest()).getStr("fguid"));
				entity.set("fremark", remark);
				entity.set("fstate", 1);
				res = ResourceDao.saveRes(entity);
				
				if(res > 0){
					RarDirUtil.deCompress(fileDir + "/source/" + fname, fileDir + "/upzipfiles");
					//String sql = "update t_site set ftempguid = ? where fguid = ?";
					//PublicDao.updateBatch(sql,tempGuid,siteGuid);
				}
			}else{
				res = 2;
			}
			
		} catch (Exception e) {
			res = 3;
			e.printStackTrace();
		}
		renderJson(res);
	}
	/**
	 * 模板文件包列表
	 * @author chasonx
	 * @create 2016年11月23日 下午2:11:32
	 * @update
	 * @param  
	 * @return void
	 */
	public void templatePackageList(){
		renderJson(ResourceEntity.res.find("select * from t_resource where ftype = ? and fdelete = 0 order by id desc",Constant.FILE_TYPE_TEMPLATE));
	}
	/**
	 * 更改当前使用的模板包
	 * @author chasonx
	 * @create 2016年11月23日 下午2:43:40
	 * @update
	 * @param  
	 * @return void
	 */
	public void changeTemplatePkg(){
		long id = getParaToInt("id");
		Db.update("update t_resource set fstate = 0 where ftype = ? and fstate = 1",Constant.FILE_TYPE_TEMPLATE);
		renderJson(Db.update("update t_resource set fstate = 1 where id = ?",id));
	}
	
	/**
	 * 发布升级文件
	 * @author chasonx
	 * @create 2016年10月31日 下午4:56:25
	 * @update
	 * @param  
	 * @return void
	 */
	@AnnPara("升级文件发布")
	@Before({Tx.class,SaveLog.class})
	public void uploadUpgrade(){
		int res = 0;
		int result = 0;
		UploadFileUtil item = UploadFileUtil.getAbsoluteFile(getRequest());
		Record user = DHttpUtils.getLoginUser(getRequest());
		try {
			String md5Code = Md5Util.md5InputStream(item.getFileItem().getInputStream());
			
			if(ResourceDao.checkExist(md5Code) <= 0L){
				String wbrPath = PathKit.getWebRootPath();
				String fileDir = "/upgradeFiles/" + DateFormatUtil.formatString("yyyyMMdd") + "/" + md5Code + "/";
				item.saveFile(wbrPath + fileDir, null);
				
				String assetName = URLDecoder.decode(getPara("fileName"),"UTF-8");
				String fname = URLDecoder.decode(getPara("fileName"),"UTF-8");
				String remark = URLDecoder.decode(getPara("remark"),"UTF-8");
				String upgradeType = getPara("upgradeType");
				String upgradeRcType = getPara("upgradeRcType");
				Integer upgradeMode = getParaToInt("upgradeMode");
				Integer pubType = getParaToInt("pubType");
				String upgradeName = URLDecoder.decode(getPara("pubValue"),"UTF-8");
				String _pubDevice = getPara("pubDevice");
				String _pubDevmac = getPara("pubDevmac");
				String _pubDevNames = URLDecoder.decode(getPara("pubDeviceNames"),"UTF-8");
				String[] pubDevice = _pubDevice.split(",");
//				String[] pubDevmac = _pubDevmac.split(",");
//				String[] pubDevNames = _pubDevNames.split(",");
				
				ResourceEntity entity = new ResourceEntity();
				entity.set("fguid", TokenUtil.getUUID());
				entity.set("fassetname",  assetName);
				entity.set("fmd5code", md5Code);
				entity.set("fname", fname);
				entity.set("fsize", getPara("fileSize"));
				entity.set("ftype", Constant.FILE_TYPE_UPGRADE);
				entity.set("fpath", fileDir + fname);
				entity.set("fuploadtime", DateFormatUtil.formatString(null));
				entity.set("fuploader", DHttpUtils.getLoginUser(getRequest()).getStr("fadminname"));
				entity.set("fadminguid",DHttpUtils.getLoginUser(getRequest()).getStr("fguid"));
				entity.set("fremark", remark);
				entity.set("fextdata",StringUtils.join(pubDevice, ","));
				res = ResourceDao.saveRes(entity);
				
				PublishToDo todo = new PublishToDo()
				.set("fpublishTitle", upgradeName)
				.set("fpublishMode", upgradeMode)
				.set("fpublishType", pubType)
				.set("fpublishDevice", _pubDevice)
				.set("fpublishDeviceMac", _pubDevmac)
				.set("fpublishDeviceNames", _pubDevNames)
				.set("fadminGuid", user.get("fguid"))
				.set("ftype", 2)
				.set("fcreateTime", DateFormatUtil.formatString(null))
				.set("fupgradeType", upgradeType)
				.set("fupgradeRcType", upgradeRcType)
				.set("fextData", fileDir + fname);
				
				result = todo.save()?1:0;
				/*
				String macPara = "";
				for(String s:pubDevmac){
					macPara += "&macs[]=" + s;
				}
				
				TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.Upgrade.toString());
				String packResult = HttpUtil.UrlGetResponse(config.getStr("localdir") + "?packPath=" + wbrPath + fileDir + fname + macPara + "&upgradeType=" + upgradeType + "&upgradeRcType=" + upgradeRcType);
				ResultData _return = new Gson().fromJson(packResult, ResultData.class);
				System.out.println("Xpackager Data : " + packResult);
				if(_return.isRes()){
					String para = "publishName="+ upgradeName + DateFormatUtil.formatString("yyyyMMddHHmmss") +"&publishMode="+ upgradeMode +"&publishFilePath="+ _return.getPublishPath() +"&rangeType="+ pubType + "&rangeValue=" + StringUtils.joinSimple(pubDevice, ",");
					System.out.println("Sync Param : " + para);
					result = HttpUtil.UrlPostResponse(config.getStr("remotedir"), "POST", para);
					System.out.println("Sync Data : " + result);
				}
				*/
			}else{
				res = 2;
				item.getFileItem().delete();
			}
		}catch(Exception e){
			res =  3;
			e.printStackTrace();
			item.getFileItem().delete();
		}
		renderJson(new Record().set("data", res).set("result", result));
	}
	
	/**
	 * 升级文件历史
	 * @author chasonx
	 * @create 2016年11月2日 下午5:31:47
	 * @update
	 * @param  
	 * @return void
	 */
	public void upgradeHistory(){
		int start = getParaToInt("PageNumber");
		int limit = getParaToInt("PageSize");
		start = (start + limit)/limit;
		renderJson(ResourceEntity.res.paginate(start, limit, "select * ", " from t_resource where ftype = ? order by id desc",Constant.FILE_TYPE_UPGRADE));
	}
	/**
	 * 升级文件确认下发
	 * @author chasonx
	 * @create 2016年11月28日 下午2:06:08
	 * @update
	 * @param  
	 * @return void
	 */
	public void upgradeFile(){
		String result = "";
		Long id = getParaToLong("id");
		PublishToDo todo = PublishToDo.todo.findById(id);
		String[] pubDevmac = todo.getStr("fpublishDeviceMac").split(",");
		String macPara = "";
		for(String s:pubDevmac){
			macPara += "&macs[]=" + s;
		}
		String webRoot = PathKit.getWebRootPath();
		TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.Upgrade.toString());
		String packResult = HttpUtil.UrlGetResponse(config.getStr("localdir") + "?packPath=" + webRoot + todo.getStr("fextData") + macPara + "&upgradeType=" + todo.getStr("fupgradeType") + "&upgradeRcType=" + todo.getStr("fupgradeRcType"));
		ResultData _return = new Gson().fromJson(packResult, ResultData.class);
		System.out.println("Xpackager Data : " + packResult);
		if(_return.isRes()){
			String para = "publishName="+ todo.getStr("fpublishTitle") + DateFormatUtil.formatString("yyyyMMddHHmmss") +"&publishMode="+ todo.getStr("fpublishMode") +"&publishFilePath="+ _return.getPublishPath() +"&rangeType="+ todo.getStr("fpublishType") + "&rangeValue=" + todo.getStr("fpublishDevice");
			System.out.println("Sync Param : " + para);
			result = HttpUtil.UrlPostResponse(config.getStr("remotedir"), "POST", para);
			System.out.println("Sync Data : " + result);
		}
		renderJson(result);
	}
	
	@AnnPara("查询模板列表")
	@Before(SaveLog.class)
	public void list(){
		String siteGuid = getPara("siteguid");
		String sql = "SELECT t.*,s.fsitename,s.ftempguid FROM `t_resource` t " +
					 " INNER JOIN t_site s on t.fsiteguid = s.fguid where t.ftype = ? and t.fadminguid = ? and t.fdelete = 0 ";
		if(StringUtils.hasText(siteGuid)) sql += " and t.fsiteguid = '"+ siteGuid +"'";
		renderJson(PublicDao.queryList(sql, Constant.FILE_TYPE_TEMPLATE,DHttpUtils.getLoginUser(getRequest()).getStr("fguid")));
	}
	
	@AnnPara("查询网站模板列表")
	@Before(SaveLog.class)
	public void siteTempList(){
		String sql = " SELECT * FROM t_resource where fsiteguid = ? and ftype = ? and fdelete = 0";
		renderJson(PublicDao.queryList(sql, getPara("siteguid") , Constant.FILE_TYPE_TEMPLATE));
	}
	
	@AnnPara("查询可模板文件列表")
	@Before(SaveLog.class)
	public void fileList(){
		String templateResourceId = getPara("templateResourceGuid");
		//Record tempPath = Db.findFirst("select r.fpath,r.fguid from t_resource r INNER JOIN t_site s ON r.fguid = s.ftempguid where s.fguid = ?",siteGuid);
		Record tempPath = Db.findFirst("select fpath,fguid from t_resource where  fguid = ?",templateResourceId);
		List<FileEntity> flist = null;
		if(StringUtils.hasText(tempPath.getStr("fpath"))){
			System.out.println(PathKit.getWebRootPath() + tempPath.getStr("fpath"));
			flist = FileListUtil.list(PathKit.getWebRootPath() + tempPath.getStr("fpath"),Constant.FILE_FILETER_SUFFIX);
			for(int i = 0,len = flist.size();i < len;i++){
				flist.get(i).setAbsuloteDirectory(tempPath.getStr("fpath"));
				flist.get(i).setParentDirectory(tempPath.getStr("fpath"));
			}
		}
		Record data = new Record().set("previewPath", tempPath.getStr("fpath")).set("list", flist).set("sourceGuid", tempPath.getStr("fguid"));
		renderJson(data);
	}
	
	@AnnPara("查询网站资源请求列表")
	@Before(SaveLog.class)
	public void templist(){
		String guid = getPara("siteGuid");
		renderJson(TemplateDao.getTemplateList(guid));
	}
	
	@AnnPara("编辑模板资源请求")
	@Before({Para.class,Tx.class})
	public void modifyad(){
		Record logUser = DHttpUtils.getLoginUser(getRequest());
		int res = 0;
		String guid = "";
		Template template = TemplateDao.getTemplateEntity(" and fpreviewpath = '"+ getPara("fpreviewpath") +"' and fcreateguid = '"+ logUser.get("fguid") +"'");
		if(template == null){
			guid = Tools.getGuid();
			template = Tools.recordConvertModel((Record)getAttr("RequestPara"), Template.class);
			template.set("fguid", guid);
			template.set("fcreater", logUser.get("fadminname"));
			template.set("fcreateguid", logUser.get("fguid"));
			template.set("fcreatetime", DateFormatUtil.formatString(null));
			res = template.save()?1:0;
		}else{
			res = 1;
			guid = template.getStr("fguid");
		}
		
		if(res > 0){
			String[] adType = getParaValues("adType[]");
			String[] adW = getParaValues("adW[]");
			String[] adH = getParaValues("adH[]");
			String[] adName = getParaValues("adName[]");	
			String[] adSize = getParaValues("adSize[]");
			String[] adCodec = getParaValues("adCodec[]");
			String[] adRate = getParaValues("adRate[]");
			String[] adPosition = getParaValues("adPosition[]");
			String[] adItems = getParaValues("adItems[]");
			
			if(adType.length > 0){
				TemplateStatus status;
				for(int i = 0,len = adType.length;i < len;i++){
					status = new TemplateStatus();
					status.set("fguid", Tools.getGuid());
					status.set("ftempguid", guid);
					status.set("fname", adName[i]);
					status.set("ftype", adType[i]);
					status.set("fwidth", adW[i]);
					status.set("fheight", adH[i]);
					status.set("fcodec", adCodec[i]);
					status.set("fsize", adSize[i]);
					status.set("fbigrate", adRate[i]);
					status.set("fmarkid", adPosition[i]);
					status.set("fitems", adItems[i]);
					status.save();
				}
			}
		}
		renderJson(res);
	}
	
	@AnnPara("删除资源请求")
	@Before(SaveLog.class)
	public void cancelAd(){
		String[] ids = getParaValues("id[]");
		renderJson(PublicDao.updateBatch("update " + TableMapping.me().getTable(TemplateStatus.class).getName() + " set fdelete = 1 where id in ("+ StringUtils.join(ids, ",") +")"));
	}
	@AnnPara("查询资源请求列表")
	@Before(SaveLog.class)
	public void mediaRequestInfoList(){
		String siteGuid = getPara("siteGuid");
		String statuGuidStr = getPara("statuGuid");
		Record rec = DHttpUtils.getLoginUser(getRequest());
		renderJson(TemplateDao.getTempMediaRequestInfoList(siteGuid + "@" + rec.getStr("fguid"),statuGuidStr));
	}
	@AnnPara("取消资源请求")
	@Before(SaveLog.class)
	public void cancelTemplate(){
		String sql = "update t_template set fdelete = 1 where fguid = ?";
		renderJson(Db.update(sql,getPara("tguid")));
	}
	/**
	 * 更改模版状态
	 * void
	 * @createTime:2015年9月16日 下午12:04:59
	 * @author: chason.x
	 */
	@AnnPara("更改模板状态")
	@Before(SaveLog.class)
	public void tempStateModify(){
		String guid = getPara("guid");
		int state = getParaToInt("state");
		renderJson(TemplateDao.updateTemplatePublisState(guid, state, false));
	}
	/**
	 * 资源详细
	 * void
	 * @createTime:2015年9月16日 下午12:04:49
	 * @author: chason.x
	 */
	@AnnPara("查询资源详细")
	@Before(SaveLog.class)
	public void adInfo(){
		renderJson(TemplateStatus.status.findById(getParaToLong("id")));
	}
	
	/**
	 * 网站发布
	 * 对于已发布的模版先去掉已写入的json数据
	 * void
	 * @createTime:2015年9月16日 下午12:01:21
	 * @author: chason.x
	 */
	@AnnPara("网站发布")
	@Before({SaveLog.class})
	public void publishSite(){
		String result = "{\"result\":\"0\"}";
		int num = 0;
		Integer publishState = 10;
		Integer addflag = 0;
		String sessionName = getPara("publishStatus");
		
		try{
			String siteGuid = getPara("siteGuid");
			int type = getParaToInt("type");
			setSessionAttr(sessionName, publishState);
			
			ResourceEntity entity = ResourceEntity.res.findFirst("SELECT r.* FROM t_resource r INNER JOIN t_site s ON s.ftempguid = r.fguid WHERE s.fguid = ?",siteGuid);
			List<Template> tempList = Template.temp.find("SELECT * FROM `t_template` where  ftempsourceguid = ? and fstate = 1 and fdelete = 0",entity.getStr("fguid"));
			
			String sql = "select a.* from t_template_status a " +
						 " INNER JOIN t_template t on a.ftempguid = t.fguid " +
						 " where t.ftempsourceguid = ? and t.fstate = 1 and t.fdelete = 0";
			List<TemplateStatus> statusList = TemplateStatus.status.find(sql,entity.getStr("fguid"));
			
			if(!tempList.isEmpty() && !statusList.isEmpty()){
				
				addflag = (int)70/tempList.size();
				
				String webroot = PathKit.getWebRootPath();
				
				String jsString = FileUtil.readFile(webroot + Constant.MEDIA_CTRL_JSPATH, null);
				FileUtil.writeFile(webroot + entity.getStr("fpath") + "/" + Constant.MEDIA_CTRL_JSNAME, jsString, null);
				
				String scripts = "<script type=\"text/javascript\" src=\""+ Constant.MEDIA_CTRL_JSNAME +"\"></script>";
				
				Record content;
				String jsonData;
				List<Record> media;
				Record mediaRec;
				String idList = "";
				String htmlContent;
				String existJson;
				for(int i = 0,len = tempList.size();i < len;i++){
					jsonData = "";
					
					idList += tempList.get(i).getLong("id") + "";
					if(i < (len - 1)) idList += ",";
					
					media = new ArrayList<Record>();
					for(int j = 0,jlen = statusList.size();j < jlen;j++){
						if(statusList.get(j).getStr("ftempguid").equals(tempList.get(i).getStr("fguid"))){
							mediaRec = new Record();
							mediaRec.set("id", statusList.get(j).getStr("fmarkid"));
							mediaRec.set("type", statusList.get(j).getStr("ftype"));
							mediaRec.set("name", statusList.get(j).getStr("fname"));
							mediaRec.set("width", statusList.get(j).getStr("fwidth"));
							mediaRec.set("height", statusList.get(j).getStr("fheight"));
							mediaRec.set("data", copyMediaFiles(statusList.get(j).getStr("fextdata"), webroot + tempList.get(i).getStr("fpreviewpath"),statusList.get(j).getLong("id"),statusList.get(j).getInt("fupload")));
							media.add(mediaRec);
						}
					}
					
					content = new Record();
					content.set("version", Constant.MEDIA_CTRL_VERSION);
					content.set("desc", Constant.MEDIA_CTRL_DESC);
					content.set("items", media);
					jsonData = "<script type=\"text/javascript\"> var "+ Constant.MEDIA_CTRL_JSONNAME +" = "+ JsonKit.toJson(content) +";</script>";
					
					htmlContent = FileUtil.readFile(webroot + tempList.get(i).getStr("fpreviewpath"), null);
					if(htmlContent.indexOf("<UCMS-OPG>") != -1){
						existJson = htmlContent.substring(htmlContent.indexOf("<UCMS-OPG>"), htmlContent.indexOf("</UCMS-OPG>") + 11);
						htmlContent = htmlContent.replace(existJson, "");
						htmlContent += "<UCMS-OPG>" + jsonData + scripts + "</UCMS-OPG>";
						FileUtil.writeFile(webroot + tempList.get(i).getStr("fpreviewpath"), htmlContent, null);
					}else{
						String source = FileUtil.readFile(webroot + tempList.get(i).getStr("fpreviewpath"), null);
						FileUtil.writeFile(webroot + tempList.get(i).getStr("fpreviewpath"), source + "<UCMS-OPG>" + jsonData  + scripts + "</UCMS-OPG>", null);
					}
					
					num ++;
					publishState += addflag;
					
					setSessionAttr(sessionName, publishState); 
				}
				
				/*publish state*/
				Db.update("update t_template set fpublish = 2 where id in(?)",idList);
				
				if(type == 1){
					/*sync file*/
					TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.Template.toString());
					if(config != null){
						Ssh2Util.putDirectory(config.getStr("remotehost"), config.getStr("remoteuser"), config.getStr("remotepwd"), webroot + entity.getStr("fpath"), config.getStr("remotedir"));
					}
					result =  num + "";
				}else if(type == 2){
					String publishName = getPara("pname");
					String publishMode = getPara("pmode");
					String rangeType = getPara("ptype");
					String[] rangeValue = getParaValues("device[]");
					String[] decMac = getParaValues("devmac[]");
					
					TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.PublisSite.toString());
					if(config != null){
						
						/*生成发布目录，只发布编辑过的页面*/
						String packPath = gennerPublishDirectory(tempList, webroot + entity.getStr("fpath"),webroot,entity.getInt("fpublishstate"));
						
						String macPara = "";
						for(String s:decMac){
							macPara += "&macs[]=" + s;
						}
						
						String packResult = HttpUtil.UrlGetResponse(config.getStr("localdir") + "?packPath=" + packPath + macPara);
						ResultData _return = new Gson().fromJson(packResult, ResultData.class);
						if(_return.isRes()){
							String para = "publishName="+ publishName + _return.getPublishName() +"&publishMode="+ publishMode +"&publishFilePath="+ _return.getPublishPath() +"&rangeType="+ rangeType + "&rangeValue=" + Tools.joinSimple(rangeValue, ",");
							System.out.println("调用参数：" + para);
							result = HttpUtil.UrlPostResponse(config.getStr("remotedir"), "POST", para);
							//保存发布历史
							savePublishHistory(siteGuid,DHttpUtils.getLoginUser(getRequest()).getStr("fguid"),_return.getTarPath(),rangeValue); 
							
							//更新资源发布状态
							entity.set("fpublishstate", 1).update();
						}
					}
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		setSessionAttr(sessionName, 100);
		renderJson(result);
	}
	
	/**
	 * 广告资源下发  播单形式
	 * @author chasonx
	 * @create 2016年11月15日 下午4:30:42
	 * @update 需求修改
	 * @param  
	 * @return void
	 */
	@AnnPara("广告资源发布")
	@Before({SaveLog.class})
	public void publishResource(){
		String result = "{\"result\":\"0\"}";
		int num = 0;
		Integer publishState = 10;
		Integer addflag = 0;
		String sessionName = getPara("publishStatus");
		Record loginUser = DHttpUtils.getLoginUser(getRequest());
		try{
			String tempSourceGuid = getPara("tempSourceGuid");
			String statuGuidStr = getPara("statuGuid");
			
			int type = getParaToInt("type");
			setSessionAttr(sessionName, publishState);
			
			ResourceEntity entity = ResourceEntity.res.findFirst("SELECT * FROM t_resource  WHERE fguid = ?",tempSourceGuid);
			List<Template> tempList = Template.temp.find("SELECT * FROM `t_template` where  ftempsourceguid = ? and fcreateguid = ? and fdelete = 0",tempSourceGuid,loginUser.getStr("fguid")); // and fstate = 1
			
			List<String> tempGuidList = new ArrayList<String>();
			if(tempList.isEmpty()){
				tempGuidList.add("aa");
			}else{
				for(int i = 0,len = tempList.size();i < len;i++){
					tempGuidList.add(tempList.get(i).getStr("fguid"));
				}
			}
			
			String sql = "select * from t_template_status  where ftempguid in ("+ StringUtils.joinForList(tempGuidList, ",") +")  and fdelete = 0"; //and t.fstate = 1
			if(StringUtils.hasText(statuGuidStr)) sql += " and fguid in("+ StringUtils.join(statuGuidStr.split(","), ",") +") ";
			List<TemplateStatus> statusList = TemplateStatus.status.find(sql);
			
			if(!tempList.isEmpty() && !statusList.isEmpty()){
				
				addflag = (int)70/tempList.size();
				
				String rand = DateFormatUtil.formatString("yyyyMMddHHmmss");
				String publishDir =  "updatedir_" + rand;
				String webroot = PathKit.getWebRootPath();
				File rootPath = new File(entity.getStr("fpath"));
				String parentDir = webroot + rootPath.getParent() + "/" + publishDir;
				File  pdir = new File(parentDir);
				if(pdir.exists()){
					FileUtil.deleteFloder(parentDir);
				}
				pdir.mkdirs();
				
				
				String jsString = FileUtil.readFile(webroot + Constant.MEDIA_CTRL_JSPATH, null);
				FileUtil.writeFile(webroot + entity.getStr("fpath") + "/" + Constant.MEDIA_CTRL_JSNAME, jsString, null);
				String scripts = "<script type=\"text/javascript\" src=\""+ Constant.MEDIA_CTRL_JSNAME +"\"></script>";
				
				Record content;
				String jsonData;
				List<Record> media;
				Record mediaRec;
				String htmlContent;
				String existJson;
				StringBuffer ctrlSB;
				TimeSet _set = null;
				String xmlSuffix = "";
				String xmlPrefix = "";
				String _position = "";
				boolean playOrder = true;
				for(int i = 0,len = tempList.size();i < len;i++){
					jsonData = "";
					
					media = new ArrayList<Record>();
					for(int j = 0,jlen = statusList.size();j < jlen;j++){
						if(statusList.get(j).getStr("ftempguid").equals(tempList.get(i).getStr("fguid"))
								&& StringUtils.hasText(statusList.get(j).getStr("fextdata"))){
							mediaRec = new Record();
							mediaRec.set("type", statusList.get(j).getStr("ftype"));
							mediaRec.set("name", statusList.get(j).getStr("fname"));
							mediaRec.set("width", statusList.get(j).getStr("fwidth"));
							mediaRec.set("height", statusList.get(j).getStr("fheight"));
							mediaRec.set("data", copyMediaFilesOrder(statusList.get(j).getStr("fextdata"), webroot + tempList.get(i).getStr("fpreviewpath"),statusList.get(j).getLong("id"),parentDir));
							media.add(mediaRec);
							
							_set = new Gson().fromJson(statusList.get(j).getStr("fmarkname"), TimeSet.class);
							if(null == _set) _set = new TimeSet();
							ctrlSB = new StringBuffer(50);
							playOrder = true;
							_position = statusList.get(j).getStr("fmarkid") == null?"":statusList.get(j).getStr("fmarkid");
							
							ctrlSB.append("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
							
							if(_position.equals("hotLive") || _position.equals("hotVideo")){
								xmlSuffix = "</Res>\n";
								xmlPrefix = "<Res>\n";
								playOrder = false;
							}else{
								xmlPrefix = "<schedule type=\"standard\">\n";
								xmlSuffix = "</schedule>";
							}
							
							ctrlSB.append(xmlPrefix);
							if(playOrder && StringUtils.hasText(_set.getStartDate())){
								ctrlSB.append("<timeslot ed=\""+ _set.getEndDate() +"\" et=\""+ _set.getEndTime() +"\" sd=\""+ _set.getStartDate() +"\" st=\""+ _set.getStartTime() +"\">\n");
							}else if(playOrder){
								ctrlSB.append("<default>\n");
							}
							ctrlSB.append(returnMedialistStr(statusList.get(j).getStr("fextdata"),_position));
							
							if(playOrder && StringUtils.hasText(_set.getStartDate())){
								ctrlSB.append("</timeslot>\n");
							}else if(playOrder){
								ctrlSB.append("</default>\n");
							}
							ctrlSB.append(xmlSuffix);
							
							gennerCtrlXml(parentDir,ctrlSB.toString(),_position);
						}
					}
					
					content = new Record();
					content.set("version", Constant.MEDIA_CTRL_VERSION);
					content.set("desc", Constant.MEDIA_CTRL_DESC);
					content.set("items", media);
					jsonData = "<script type=\"text/javascript\"> var "+ Constant.MEDIA_CTRL_JSONNAME +" = "+ JsonKit.toJson(content) +";</script>";
					
					htmlContent = FileUtil.readFile(webroot + tempList.get(i).getStr("fpreviewpath"), null);
					if(htmlContent.indexOf("<UCMS-OPG>") != -1){
						existJson = htmlContent.substring(htmlContent.indexOf("<UCMS-OPG>"), htmlContent.indexOf("</UCMS-OPG>") + 11);
						htmlContent = htmlContent.replace(existJson, "");
						htmlContent += "<UCMS-OPG>" + jsonData + scripts + "</UCMS-OPG>";
						FileUtil.writeFile(webroot + tempList.get(i).getStr("fpreviewpath"), htmlContent, null);
					}else{
						String source = FileUtil.readFile(webroot + tempList.get(i).getStr("fpreviewpath"), null);
						FileUtil.writeFile(webroot + tempList.get(i).getStr("fpreviewpath"), source + "<UCMS-OPG>" + jsonData  + scripts + "</UCMS-OPG>", null);
					}
					
					num ++;
					publishState += addflag;
					setSessionAttr(sessionName, publishState); 
				}
				
				/*publish state*/
				//Db.update("update t_template set fpublish = 2 where id in(?)",idList);
				
				if(type == 1){
					/*sync file*/
					TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.Template.toString());
					if(config != null){
						Ssh2Util.putDirectory(config.getStr("remotehost"), config.getStr("remoteuser"), config.getStr("remotepwd"), webroot + entity.getStr("fpath"), config.getStr("remotedir"));
					}
					result =  num + "";
				}else if(type == 2){
					String publishName = getPara("pname");
					String publishMode = getPara("pmode");
					String rangeType = getPara("ptype");
					String[] rangeValue = getParaValues("device[]");
					String[] decMac = getParaValues("devmac[]");
					
					TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.PublisSite.toString());
					if(config != null){
						
						//String packPath =  webroot + rootPath.getParent() + "/updateResouces";
						
						String macPara = "";
						for(String s:decMac){
							macPara += "&macs[]=" + s;
						}
						System.out.println(parentDir);
						String packResult = HttpUtil.UrlGetResponse(config.getStr("localdir") + "?packPath=" + parentDir + macPara + "&publishDir=" + publishDir);
						ResultData _return = new Gson().fromJson(packResult, ResultData.class);
						if(_return.isRes()){
							String para = "publishName="+ publishName + rand +"&publishMode="+ publishMode +"&publishFilePath="+ _return.getPublishPath() +"&rangeType="+ rangeType + "&rangeValue=" + Tools.joinSimple(rangeValue, ",");
							System.out.println("调用参数：" + para);
							result = HttpUtil.UrlPostResponse(config.getStr("remotedir"), "POST", para);
							//保存发布历史
							savePublishHistory(tempSourceGuid,loginUser.getStr("fguid"),_return.getTarPath(),rangeValue); 
							
							//更新资源发布状态
							//entity.set("fpublishstate", 1).update();
						}
					}
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		setSessionAttr(sessionName, 100);
		renderJson(result);
	}
	
	/**
	 * 返回资源列表xml字符串
	 * @author chasonx
	 * @create 2016年11月15日 下午6:00:10
	 * @update
	 * @param  
	 * @return String
	 */
	private String returnMedialistStr(String mediaJson,String position){
		if(!StringUtils.hasText(mediaJson)) return "";
		
		StringBuffer sb = new StringBuffer(20);
		try{
			JSONArray json = new JSONArray(mediaJson);
			JSONObject jsObj;
			
			for(int i = 0,len = json.length();i < len;i++){
				jsObj = json.getJSONObject(i);
				if(position.equals("hotLive") || position.equals("hotVideo")){
					sb.append("<HotInfo id=\""+ (i + 1) +"\" imageUrl=\""+ filterFileName(jsObj.getString("fullUri")) +"\" url=\""+ (jsObj.has("url")?jsObj.getString("url"):"") +"\" ");
					if(position.equals("hotVideo")) sb.append(" title=\""+ (jsObj.has("title")?jsObj.getString("title"):"") +"\" ");
					sb.append(" />\n");
				}else{
					sb.append("<list ");
					sb.append(" src=\""+  filterFileName(jsObj.getString("fullUri")) +"\" ");
					sb.append(" href=\""+ (jsObj.has("url")?jsObj.getString("url"):"") +"\" />\n");
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return sb.toString();
	}
	
	/**
	 * 生成广告控制文件
	 * @author chasonx
	 * @create 2016年11月15日 下午5:31:48
	 * @update
	 * @param  
	 * @return void
	 */
	private void gennerCtrlXml(String publishDir,String content,String position){
		String xmlPathString = "";
		if(position.equals("hotLive") || position.equals("hotVideo")){
			xmlPathString = publishDir + "/" + position + ".xml";
		}else{
			xmlPathString = publishDir + "/control" + position + DateFormatUtil.formatString("yyyyMMddHHmmss") + (Math.random() + "").substring(2,8) + ".xml";
		}
		FileUtil.writeFile(xmlPathString, content,null);
	}
	
	/**
	 * 广告播单下发
	 * @author chasonx
	 * @create 2016年11月15日 上午10:28:51
	 * @update
	 * @param  
	 * @return String
	 */
	private void gennerOrder(String publishPath,String filePath){
		File from = new File(filePath);
		File to = new File(publishPath  + "/" + from.getName());
		FileUtil.copyFile(from, to);
	}
	
	/**
	 * @Tag       : 生成发布目录
	 * @createTime: 2016年7月1日 下午4:56:17
	 * @author    : Chason.x
	 */
	private String gennerPublishDirectory(List<Template> list,String sourcePath,String webRoot,int respublishState){
		File sourFile = new File(sourcePath);
		String parentDir = sourFile.getParent() + "/updateDirectory";
		File  pdir = new File(parentDir);
		if(pdir.exists()){
			for(File file : pdir.listFiles()){
				if(file.isDirectory()) FileUtil.deleteFloder(file.getAbsolutePath());
				else file.delete();
			}
		}else{
			pdir.mkdirs();
		}
		if(respublishState == 0){
			FileUtil.copyDirectory(sourFile, pdir);
		}else{
			//拷贝ucmsMedia
			//拷贝页面
			//拷贝Ctrl Js
			FileUtil.copyFile(new File(sourcePath + "/" +  Constant.MEDIA_CTRL_JSNAME), new File(parentDir + "/" + Constant.MEDIA_CTRL_JSNAME));
			FileUtil.copyDirectory(new File(sourcePath + "/" + Constant.MEDIA_CTRL_PATH), new File(parentDir + "/" + Constant.MEDIA_CTRL_PATH));
			File temp;
			for(int i = 0,len = list.size();i < len;i++){
				temp = new File(webRoot + list.get(i).getStr("fpreviewpath"));
				FileUtil.copyFile(temp, new File(parentDir + "/" + temp.getName()));
			}
		}
		System.out.println("发布目录为：" + parentDir);
		return parentDir;
	}
	
	/**
	 * @Tag       : 发布历史存储
	 * @createTime: 2016年3月28日 上午11:04:46
	 * @author    : Chason.x
	 */
	private void savePublishHistory(String siteGuid,String adminGuid,String filePath,String[] device){
		SitePublish sp = new SitePublish();
		sp.set("fsiteGuid", siteGuid)
		.set("fadminGuid", adminGuid)
		.set("fpublishTime", DateFormatUtil.formatString(null))
		.set("fpublishFilePath", filePath)
		.set("fpublishFileLength", new File(filePath).length())
		.set("ftarget", Tools.joinSimple(device, ","))
		.save();
	}
	
	/**
	 * 上传进度
	 * void
	 * @createTime:2015-12-9 下午3:46:07
	 * @author: chason.x
	 */
	public void publishStatus(){
		renderJson(getSessionAttr(getPara("publishStatus")));
	}
	
	/**
	 * 广告资源 拷贝 页面支持预览
	 * @author chasonx
	 * @create 2016年11月15日 下午4:38:05
	 * @update
	 * @param  
	 * @return String
	 */
	private  String copyMediaFilesOrder(String mediaJson,String path,Long mid,String publishPath){
		if(!StringUtils.hasText(path) && !StringUtils.hasText(mediaJson)) return "";
		
		File pathFile = new File(path);
		path = pathFile.getParent() + "/" + Constant.MEDIA_CTRL_PATH + "/" + mid + "/";
		List<Record> retList = new ArrayList<Record>();
		try{
			JSONArray json = new JSONArray(mediaJson);
			JSONObject jsObj;
			
			Record obj;
			File exist;
			for(int i = 0,len = json.length();i < len;i++){
				jsObj = json.getJSONObject(i);
				obj = new Record();
				if(jsObj.has("title")) obj.set("title", jsObj.getString("title"));
				if(jsObj.has("posterUri")) obj.set("imageUri", Constant.MEDIA_CTRL_PATH + "/" + mid + "/" + filterFileName(jsObj.getString("posterUri")));
				if(jsObj.has("fullUri")) obj.set("fullUri", Constant.MEDIA_CTRL_PATH + "/" + mid + "/" + filterFileName(jsObj.getString("fullUri")));
				if(jsObj.has("type")) obj.set("type", jsObj.getString("type"));
				if(jsObj.has("url"))  obj.set("url", jsObj.getString("url"));
				retList.add(obj);
				
				exist = new File(path);
				if(exist.isDirectory()) exist.deleteOnExit();
				if(jsObj.has("posterUri")){
					DownLoadFileUtil.getRemoteFile(jsObj.getString("posterUri"), path);
					gennerOrder(publishPath,path + "/" + filterFileName(jsObj.getString("posterUri")));
				}
				if(jsObj.has("fullUri")){
					DownLoadFileUtil.getRemoteFile(jsObj.getString("fullUri"), path);
					gennerOrder(publishPath,path + "/" + filterFileName(jsObj.getString("fullUri")));
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return JsonKit.toJson(retList);
	}
	
	/**
	 * 拷贝资源文件
	 * String
	 * @createTime:2015-12-9 下午12:08:12
	 * @author: chason.x
	 */
	private  String copyMediaFiles(String mediaJson,String path,Long mid,int upload){
		if(!StringUtils.hasText(path)) return "";
		
		path = path.substring(0, path.lastIndexOf("/") + 1) + Constant.MEDIA_CTRL_PATH + "/" + mid + "/";
		List<Record> retList = new ArrayList<Record>();
		
		try{
			JSONArray json = new JSONArray(mediaJson);
			JSONObject jsObj;
			
			Record obj;
			File exist;
			for(int i = 0,len = json.length();i < len;i++){
				jsObj = json.getJSONObject(i);
				obj = new Record();
				if(jsObj.has("title")) obj.set("title", jsObj.getString("title"));
				if(jsObj.has("posterUri")) obj.set("imageUri", Constant.MEDIA_CTRL_PATH + "/" + mid + "/" + filterFileName(jsObj.getString("posterUri")));
				if(jsObj.has("fullUri")) obj.set("fullUri", Constant.MEDIA_CTRL_PATH + "/" + mid + "/" + filterFileName(jsObj.getString("fullUri")));
				if(jsObj.has("type")) obj.set("type", jsObj.getString("type"));
				if(jsObj.has("url"))  obj.set("url", jsObj.getString("url"));
				retList.add(obj);
				
				if(upload == 0){
					exist = new File(path);
					if(exist.isDirectory()) exist.deleteOnExit();
					if(jsObj.has("posterUri"))  DownLoadFileUtil.getRemoteFile(jsObj.getString("posterUri"), path);
					if(jsObj.has("fullUri")) DownLoadFileUtil.getRemoteFile(jsObj.getString("fullUri"), path);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return JsonKit.toJson(retList);
	}
	
	private String filterFileName(String file){
		if(!StringUtils.hasText(file)) return "";
		return file.substring(file.lastIndexOf("/") + 1, file.length());
	}
	
	@AnnPara("删除模板资源")
	@Before(SaveLog.class)
	public void delTemplate(){
		String guid = getPara("guid");
		int res = 0;
//		Site site = Site.siteDao.findFirst("select * from t_site where ftempguid = ?",guid);
//		if(null != site){
//			res = 2;
//		}else{
			res = Db.update("update t_resource set fdelete = 1 where fguid = ?",guid);
//		}
		renderJson(res);
	}
	@AnnPara("查询设备列表")
	@Before(SaveLog.class)
	public void deviceList(){
		String deviceName = getPara("deviceName");
		TQuartz tq = TQuartz.quartz.findFirst("select * from t_quartz where ftype = ?",deviceName);
		if(tq != null)
			renderJson(tq.getStr("fdata"));
		else
			renderJson("{}");
	}
	/**
	 * @Tag       : 检查模板页面是否已经编辑
	 * @createTime: 2016年3月18日 下午2:28:57
	 * @author    : Chason.x
	 */
	public void checkTemplateExist(){
		//String siteGuid = getPara("siteGuid");
		String createGuid = DHttpUtils.getLoginUser(getRequest()).getStr("fguid");
		String previewPath = getPara("previewPath");
		Record res = Db.findFirst("select * from t_template where fcreateguid = ? and fpreviewpath = ?",createGuid,previewPath);
		if(null != res){
			res.set("items", TemplateDao.getAdMediaList(res.getStr("fguid")));
		}
		renderJson(res == null?0:res);
	}
	/**
	 * 
	 * @Tag       : 发布之前预览模板
	 * @createTime: 2016年3月21日 下午3:57:44
	 * @author    : Chason.x
	 */
	@Before(Tx.class)
	public void afterPreview(){
		String tempGuid = getPara("tempGuid");
		Template temp = Template.temp.findFirst(" select * from t_template where fguid = ?",tempGuid);
		List<TemplateStatus> tempStatus = TemplateStatus.status.find("select * from t_template_status where ftempguid = ? and fdelete = 0",tempGuid);
		String basePath = PathKit.getWebRootPath();
		try{
		if(!tempStatus.isEmpty()){
			List<Record> media = new ArrayList<Record>();
			Record mediaRec;
			List<Long> mediaIdList = new ArrayList<Long>();
			for(int i = 0,len = tempStatus.size();i < len;i++){
				mediaRec = new Record();
				mediaRec.set("id", tempStatus.get(i).getStr("fmarkid"));
				mediaRec.set("name", tempStatus.get(i).getStr("fname"));
				mediaRec.set("type", tempStatus.get(i).getStr("ftype"));
				mediaRec.set("width", tempStatus.get(i).getStr("fwidth"));
				mediaRec.set("height", tempStatus.get(i).getStr("fheight"));
				mediaRec.set("data",copyMediaFiles(tempStatus.get(i).getStr("fextdata"), basePath + temp.getStr("fpreviewpath"),tempStatus.get(i).getLong("id"),tempStatus.get(i).getInt("fupload")));
				media.add(mediaRec);
				
				mediaIdList.add(tempStatus.get(i).getLong("id"));
			}
			
			Record content = new Record();
			content.set("version", Constant.MEDIA_CTRL_VERSION);
			content.set("desc", Constant.MEDIA_CTRL_DESC);
			content.set("items", media);
			String jsonData = "<script type=\"text/javascript\"> var "+ Constant.MEDIA_CTRL_JSONNAME +" = "+ JsonKit.toJson(content) +";</script>";
			
			String jsString = FileUtil.readFile(basePath + Constant.MEDIA_CTRL_JSPATH);
			FileUtil.writeFile(basePath + temp.getStr("fpreviewpath").substring(0,temp.getStr("fpreviewpath").lastIndexOf("/")) + "/" + Constant.MEDIA_CTRL_JSNAME, jsString, null);
			String scripts = "<script type=\"text/javascript\" src=\""+ Constant.MEDIA_CTRL_JSNAME +"\"></script>";
			
			String htmlContent = FileUtil.readFile(basePath + temp.getStr("fpreviewpath"), null);
			if(htmlContent.indexOf("<UCMS-OPG>") != -1){
				String existJson = htmlContent.substring(htmlContent.indexOf("<UCMS-OPG>"), htmlContent.indexOf("</UCMS-OPG>") + 11);
				htmlContent = htmlContent.replace(existJson, "");
				htmlContent += "<UCMS-OPG>" + jsonData + scripts + "</UCMS-OPG>";
				FileUtil.writeFile(basePath + temp.getStr("fpreviewpath"), htmlContent, null);
			}else{
				String source = FileUtil.readFile(basePath + temp.getStr("fpreviewpath"), null);
				FileUtil.writeFile(basePath + temp.getStr("fpreviewpath"), source + "<UCMS-OPG>" + jsonData  + scripts + "</UCMS-OPG>", null);
			}
			
			temp.set("fpublish", 1).update();
			Db.update("update t_template_status set fupload = 1 where id in("+ Tools.joinForList(mediaIdList, ",") +")");
		}
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(1);
	}
	/**
	 * @Tag       : 发布历史列表
	 * @createTime: 2016年3月22日 下午9:21:22
	 * @author    : Chason.x
	 */
	public void publishHistory(){
		Integer start = getParaToInt("PageNumber");
		Integer limit = getParaToInt("PageSize");
		String siteGuid = getPara("siteGuid");
		
		String sql = "SELECT p.fpublishTime,substring(p.fpublishFilePath,instr(p.fpublishFilePath,'upzipfiles') + 11) as publishFilePath,p.fpublishFileLength,s.fsitename,u.fadminname,p.ftarget ";
		String where = "FROM `t_site_publish` p  INNER JOIN t_site s ON p.fsiteGuid = s.fguid " +
					 "INNER JOIN t_adminuser u ON p.fadminGuid = u.fguid where p.fdelete = 0 ";
		if(StringUtils.hasText(siteGuid)) where += " and s.fguid = '"+ siteGuid +"'";
		where += " order by p.id desc ";
		Page<Record> list = Db.paginate(start, limit, sql, where);
		renderJson(list);
	}
	
	public void forwardUams(){
		String types = getPara("types");
		TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.GoUams.toString());
		Record logUser = DHttpUtils.getLoginUser(getRequest());
		String userGuid = logUser.getStr("fguid");
		String forwardUrl = config.getStr("remotehost");
		
		if(StringUtils.hasText(forwardUrl)) forwardUrl +=  "&authCode=" + userGuid + "&pmssionCode=" + types + "&uName=" + logUser.getStr("fadminuser") + "&uSession=" + logUser.getStr("floginSessionId");
		redirect(forwardUrl);
	}
	
	/**
	 * @Tag       : 同步设备
	 * @createTime: 2016年6月30日 下午3:12:19
	 * @author    : Chason.x
	 */
	public void syncDeviceData(){
		boolean res = false;
		try{
			res = TaskDao.syncDeviceList();
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(res?1:0);
	}
	
	/**
	 * @Tag       : 更新图片广告URL
	 * @createTime: 2016年7月1日 下午2:19:25
	 * @author    : Chason.x
	 */
	public void modifyMediaUrl(){
		String mediaList = getPara("mediaList");
		String timeSet = getPara("timeSet");
		Integer id = getParaToInt("id");
		renderJson(Db.update("update t_template_status set fextdata = ?,fmarkname = ?,fupload=0 where id = ?",mediaList,timeSet,id));
	}
	
	/**
	 * 设备管理
	 * @author chasonx
	 * @create 2016年11月21日 下午2:09:19
	 * @update
	 * @param  
	 * @return void
	 */
	public void deviceIndex(){
		render(PageUtil.TEMP_DEVICE);
	}
	/**
	 * 权限设置
	 * @author chasonx
	 * @create 2016年11月21日 下午3:03:54
	 * @update
	 * @param  
	 * @return void
	 */
	public void permissionIndex(){
		render(PageUtil.TEMP_PERMISSIOIN);
	}
	/**
	 * 
	 * @author chasonx
	 * @create 2016年11月26日 下午3:19:45
	 * @update
	 * @param  
	 * @return void
	 */
	public void check(){
		setAttr("PAGE_TYPE", "1");
		render(PageUtil.TEMP_CHECK);
	}
	/**
	 * 下发历史文件
	 * @author chasonx
	 * @create 2017年1月12日 下午6:13:21
	 * @update
	 * @param  
	 * @return void
	 */
	public void historyFile(){
		setAttr("PAGE_TYPE", "2");
		render(PageUtil.TEMP_HISTORY);
	}
	
	/**
	 * 设备权限设置
	 * @author chasonx
	 * @create 2016年11月21日 下午3:38:09
	 * @update
	 * @param  
	 * @return void
	 */
	public void setDevicePermission(){
		String deviceIdStr = getPara("deviceIdStr");
		String adminGuid = getPara("adminGuid");
		int type = getParaToInt("type");
		boolean res = false;
		AdminDevice ad = new AdminDevice();
		ad.set("fadminguid", adminGuid);
		ad.set("fdeviceid", deviceIdStr);
		switch(type){
		case 1:
			res = ad.save();
			break;
		case 2:
			ad.set("id", getPara("id"));
			res = ad.update();
			break;
		}
		renderJson(res?1:0);
	}
	/**
	 * 获取可操作设备ID
	 * @author chasonx
	 * @create 2016年11月21日 下午3:44:56
	 * @update
	 * @param  
	 * @return void
	 */
	public void getDevicePermission(){
		AdminDevice ad = AdminDevice.aDevice.findFirst("select * from t_admin_device where fadminguid = ?",getPara("adminGuid"));
		renderJson(null == ad?new AdminDevice():ad);
	}
	/**
	 * 添加发布计划
	 * @author chasonx
	 * @create 2016年11月25日 下午4:59:09
	 * @update
	 * @param  
	 * @return void
	 */
	@Before(Para.class)
	public void modifyPublishToDo(){
		PublishToDo todo = Tools.recordConvertModel((Record)(getAttr("RequestPara")), PublishToDo.class);
		Record user = DHttpUtils.getLoginUser(getRequest());
		int type = getParaToInt("type");
		boolean res = false;
		switch(type){
		case 1:
			todo.set("fcreateTime", DateFormatUtil.formatString(null));
			todo.set("fadminGuid", user.get("fguid"));
			res = todo.save();
			break;
		case 2:
			todo.set("fmodifyTime", DateFormatUtil.formatString(null));
			todo.set("fcheckerGuid", user.get("fguid"));
			res = todo.update();
			break;
		case 3:
			break;
		}
		renderJson(res ? 1:0);
	}
	/**
	 * 下发审核数据
	 * @author chasonx
	 * @create 2016年11月26日 下午3:22:33
	 * @update
	 * @param  
	 * @return void
	 */
	public void publishCheckDataList(){
		Integer status = getParaToInt("status");
		Integer type = getParaToInt("type");
		int start = getParaToInt("PageNumber");
		int limit = getParaToInt("PageSize");
		String uguid = getPara("uGuid");
		
		start = (start + limit)/limit;
		String sql = "SELECT `id`, `fpublishTitle`,`fpublishMode`,`fpublishType`,`fpublishDevice`,`fpublishDeviceMac`, `fpublishDeviceNames`," + 
					 "`fadminGuid`, (select fadminname from t_adminuser where fguid = fadminGuid) as fadminname, " +
					 "`fcheckerGuid`,(select fadminname from t_adminuser where fguid = fcheckerGuid) as fcheckname, " +
					 "`fstatus`,`ftype`, `fpanPublishTime`,`fcreateTime`,`fmodifyTime`, `fremark`,`ftemplateGuid`,`fextData`";
		String where = "from t_publish_todo where 1 = 1 ";
		if(null != status) where += " and fstatus = " + status;
		if(null != type) where += " and ftype = " + type;
		if(StringUtils.hasText(uguid)) where += " and fadminGuid = '"+ uguid +"'";
		renderJson(Db.paginate(start, limit, sql, where + "  order by id desc"));
	}
	
	/**
	 * 下发历史文件列表
	 * @author chasonx
	 * @create 2017年1月11日 下午3:41:08
	 * @update
	 * @param  
	 * @return void
	 */
	public void publishHistoryFileList(){
		Record loginRecord = DHttpUtils.getLoginUser(getRequest());
		Integer pageNumber = getParaToInt("PageNumber");
		Integer pageSize = getParaToInt("PageSize");
		pageNumber = (pageNumber + pageSize) / pageSize;
		String select = "SELECT p.id,p.fpublishTime,p.fpublishFilePath,p.fpublishFileLength,p.ftarget,u.fadminname ";
		String where = "FROM `t_site_publish` p	INNER JOIN t_adminuser u ON p.fadminGuid = u.fguid where 1 = 1 ";
		if(loginRecord.getInt("fsysroletype") != 1 && loginRecord.getInt("groupadmin") != 1){
			where += " and u.fguid = '"+ loginRecord.getStr("fguid") +"'";
		}
		renderJson(PublicDao.queryListForPage(select, where, pageNumber, pageSize));
	}
	/**
	 * 下发预设选项
	 * @author chasonx
	 * @create 2017年4月21日 上午10:14:10
	 * @update
	 * @param  
	 * @return void
	 */
	public void publishPresetData(){
		Record loginRecord = DHttpUtils.getLoginUser(getRequest());
		String sql = "SELECT * FROM `t_publish_todo` where fadminGuid = ? and fstatus = 2 and ftype = 1 GROUP BY fpublishDeviceMac";
		renderJson(Db.find(sql,loginRecord.getStr("fguid")));
	}
}
