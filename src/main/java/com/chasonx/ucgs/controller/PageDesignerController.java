/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年4月14日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.controller;


import java.io.File;
import java.util.List;

import com.chasonx.directory.FileListUtil;
import com.chasonx.directory.FileUtil;
import com.chasonx.directory.RarUtil;
import com.chasonx.entity.FileEntity;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.Bean;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.common.TemplateUtil;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.PageDesigner;
import com.chasonx.ucgs.entity.PageResource;
import com.chasonx.ucgs.entity.Plugins;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.entity.Template;
import com.chasonx.ucgs.interceptor.Form;
import com.chasonx.ucgs.interceptor.Para;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.jfinal.plugin.ehcache.CacheKit;
import com.jfinal.upload.UploadFile;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年4月14日 下午3:22:10
 * @remark 
 */
public class PageDesignerController extends Controller {
	
	private static SqlKit kit = new SqlKit("PageDesigner.xml");

	public void index(){
		createToken(Constant.FORMDATA_TOKEN_NAME, 300);
		render(PageUtil.PAGE_DESIGNER);
	}
	
	public void templateIdx(){
		render(PageUtil.PAGE_TEMPLATE_IDX);
	}
	
	public void pluginIdx(){
		render(PageUtil.PAGE_PLUGIN_IDX);
	}
	
	/**
	 * @Tag       : 保存配置  参数验证
	 * @createTime: 2016年7月28日 上午11:41:27
	 * @author    : Chason.x
	 */
	@Required({
		@ParaEntity(name = "fsiteguid"),
		@ParaEntity(name = "fhtmldata"),
		@ParaEntity(name = "fhtmlconf"),
		@ParaEntity(name = "ftitle")
	})
	@Before({ParamInterceptor.class,Form.class,Tx.class,Para.class})
	public void modifyPage(){
		PageDesigner pd = Tools.recordConvertModel((Record)getAttr("RequestPara"), PageDesigner.class);
		pd.set("fmodifytime", DateFormatUtil.formatString(null));
		int type = getParaToInt("type");
		boolean res = false;
		switch(type){
		case 1:
			pd.set("fguid", TokenUtil.getUUID());
			pd.set("fadminguid", DHttpUtils.getLoginUser(getRequest()).getStr("fguid"));
			res = pd.save();
			break;
		case 2:
			res = pd.update();
			break;
		case 3:
			break;
		}
		createToken(Constant.FORMDATA_TOKEN_NAME,300);
		Record ret = new Record()
		.set("Token", getAttr(Constant.FORMDATA_TOKEN_NAME))
		.set("Guid", pd.getStr("fguid"));
		renderJson(res?ret:0);
	}
	
	/**
	 * @Tag       : 模板预览
	 * @createTime: 2016年8月1日 下午12:31:12
	 * @author    : Chason.x
	 */
	public void previewHtml(){
		CacheKit.put("UCMSDATACHCACHE", "htmlData", getPara("htmlData"));
		renderJson(1);
	}
	
	/**
	 * @Tag       : 模板列表
	 * @createTime: 2016年8月1日 下午12:34:22
	 * @author    : Chason.x
	 */
	@Required({
		@ParaEntity(name = "siteGuid")
	})
	@Before(ParamInterceptor.class)
	public void pageList(){
		renderJson(PageDesigner.pDesigner.find("select fguid,furl,flinkpageurl,ftitle,fstate,ftype from "+ PublicDao.getTableName(PageDesigner.class) +" where fsiteguid = ? order by id desc",getPara("siteGuid")));
	}
	
	/**
	 * @Tag       : 模板编辑
	 * @createTime: 2016年8月24日 下午3:37:30
	 * @author    : Chason.x
	 */
	@Required(@ParaEntity(name = "guid"))
	@Before(ParamInterceptor.class)
	public void templateEntity(){
		renderJson(PageDesigner.pDesigner.findFirst("select * from "+ PublicDao.getTableName(PageDesigner.class) +" where fguid = ?",getPara("guid")));
	}
	
	/**
	 * 模板文件列表
	 * @author chasonx
	 * @create 2017年3月23日 下午4:45:32
	 * @update
	 * @param  
	 * @return void
	 */
	public void ptemplateList(){
		String siteGuid = getPara("siteGuid");
		Integer delete = getParaToInt("delete");
		Integer checked = getParaToInt("checked");
		int pageSize = getParaToInt("PageSize");
		int pageNumber = getParaToInt("PageNumber");
		Record query = new Record();
		query.set("siteGuid", siteGuid)
		.set("delete", delete)
		.set("tempType", Constant.TemplateType.TSCaler)
		.set("checked", checked);
		
		Page<Record> list = Db.paginate(pageNumber, pageSize, kit.loadSqlData("selectPageTemplateListField"), kit.loadSqlData("selectPageTemplateList", query));
		renderJson(list);
	}
	/**
	 * 创建插件
	 * @author chasonx
	 * @create 2017年4月24日 下午4:41:03
	 * @update
	 * @param  
	 * @return void
	 */ 
	@Before(Tx.class)
	public void savePlugin(){
		Plugins plugins = Bean.getModel(getRequest(), Plugins.class);
		Record loginUser = DHttpUtils.getLoginUser(getRequest());
		String groupName = getPara("groupName");
		int type = getParaToInt("type");
		long res = 0;
		try{
			String path = PathKit.getWebRootPath() + "/res/plugs/mod/pdesigner/";
			String jsPath = path + "plugins/" + plugins.getStr("fpluginame") + ".js";
			
				/*save plugin*/
				if(type == 1 && !checkPluginame(plugins.getStr("fpluginame"))){ 
					plugins.set("fdevguid", loginUser.getStr("fguid"))
					.set("fcreatetime", DateFormatUtil.formatString(null))
					.set("fdevname", loginUser.getStr("fadminname"))
					.save();
					
					String pluginCode = FileUtil.readFile(new File(path + "temp/plugin"), null);
					pluginCode = pluginCode.replace("${PLUGINGROUP}", groupName).replace("${CLASSNAME}", plugins.getStr("ficon")).replace("${PLUGINTITLE}", plugins.getStr("ftitle"));
					
					File pFile = new File(jsPath);
					if(!pFile.exists()) pFile.createNewFile();
					FileUtil.writeFile(jsPath, pluginCode, null);
					
					res = plugins.getLong("id");
				/*update plugin*/	
				}else if(type == 2){
					plugins.set("fmodifytime", DateFormatUtil.formatString(null));
					plugins.update();
					
					String pluginCode = getPara("pluginCodeStr");
					FileUtil.writeFile(jsPath, pluginCode, null);
					res = plugins.getLong("id");
				}
				
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(res);
	}
	
	/**
	 * 获取插件信息
	 * @author chasonx
	 * @create 2017年4月25日 上午11:10:58
	 * @update
	 * @param  
	 * @return void
	 */
	public void getPlugin(){
		int pluginID = getParaToInt("pluginid");
		Record plugins = Db.findById(PublicDao.getTableName(Plugins.class), pluginID);
		
		String path = PathKit.getWebRootPath() + "/res/plugs/mod/pdesigner/";
		String jsPath = path + "plugins/" + plugins.getStr("fpluginame") + ".js";
		plugins.set("codeStr", FileUtil.readFile(new File(jsPath), null));
		
		renderJson(plugins);
	}
	/**
	 * 插件列表
	 * @author chasonx
	 * @create 2017年4月25日 下午3:03:59
	 * @update
	 * @param  
	 * @return void
	 */
	public void getPluginList(){
		Record param = new Record().set("fdevguid", DHttpUtils.getLoginUser(getRequest()).getStr("fguid"))
		.set("fstate", 0);
		renderJson(PublicDao.getList(Plugins.class, param));
	}
	/**
	 * 判断插件名称存在否
	 * @author chasonx
	 * @create 2017年4月25日 上午11:55:51
	 * @update
	 * @param  
	 * @return void
	 */
	public void checkPluginName(){
		String pluginName = getPara("pluginName");
		renderJson(checkPluginame(pluginName) ?1:0 );
	}
	
	private boolean checkPluginame(String pname){
		return StringUtils.hasText(PublicDao.getFieldStr("fpluginame", " and fpluginame = '"+ pname +"'", Plugins.class));
	}
	
	/**
	 * 自定义模板上传
	 * @author chasonx
	 * @create 2017年5月17日 下午9:35:23
	 * @update
	 * @param  
	 * @return void
	 */
	public void customTemplateUpload(){
		boolean res= false;
		try{
			String basePath = PathKit.getWebRootPath();
			String mainDir = "ctempfiles";
			String date = DateFormatUtil.formatString("yyyyMMdd");
			long st = System.nanoTime();
			String savePath = File.separator + mainDir + File.separator + date + File.separator + st;
			UploadFile file = getFile("filetemplateBrowserFile",basePath + File.separator + savePath + File.separator + "source");
			
			String siteGuid = getPara("tempSiteList");
			String tempSiteName = getPara("tempSiteName");
			String templateDesc = getPara("templateDesc");
			siteGuid = StringUtils.hasText(siteGuid)?siteGuid:TokenUtil.getToken();
			String adminGuid = DHttpUtils.getLoginUser(getRequest()).getStr("fguid");
			
			RarUtil.deCompress(basePath + File.separator + savePath + File.separator + "source" + File.separator + file.getFileName(),basePath + File.separator +  savePath + File.separator + "files");
			List<FileEntity> files = FileListUtil.list(basePath + File.separator + savePath + File.separator + "files", "html");
			for(int i = 0,len = files.size();i < len;i++){
				PageDesigner pd = new PageDesigner();
				pd.set("fguid", TokenUtil.getUUID())
				.set("fsiteguid", siteGuid)
				.set("fcustomsitename", tempSiteName)
				.set("fadminguid", adminGuid)
				.set("ftitle", files.get(i).getFileName())
				.set("furl", savePath.replaceAll("\\\\", "/") + "/files/" + files.get(i).getFileName() )
				.set("ftype", Constant.TemplateType.Custom)
				.set("fmodifytime", date)
				.set("fchecked", 2)
				.set("fremark", templateDesc);
				pd.save();
			}
			res = true;
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(res?1:0);
	}
	/**
	 * 自定义模板列表
	 * @author chasonx
	 * @create 2017年5月18日 上午10:08:26
	 * @update
	 * @param  
	 * @return void
	 */
	public void customTemplateFolder(){
		int getType = getParaToInt("getType");
		if(getType == 1){
			renderJson(Db.find(kit.loadSqlData("selectCustomTemplateFolder")));
		}else{
			String siteGuid = getPara("siteGuid");
			Integer pageNumber = getParaToInt("PageNumber");
			Integer pageSize = getParaToInt("PageSize");
			renderJson(Db.paginate(pageNumber, pageSize, kit.loadSqlData("selectCustomTemplateListField"), kit.loadSqlData("selectCustomTemplateList", new Record().set("siteGuid", siteGuid))));
		}
	}
	
	/**
	 * 检测模板资源
	 * @author chasonx
	 * @create 2017年6月7日 下午1:48:55
	 * @update
	 * @param  
	 * @return void
	 */
	public void checkTemplateResouceState(){
		String[] tGuids = getParaValues("tGuids[]");
		int res = 0;
		if(tGuids != null){
			PageResource resource;
			String auditUrl = PublicDao.getFieldStr("localdir", " and filetype = '"+ Constant.Config.AuditResouce.toString() +"' " , TConfig.class);
			for(int i = 0,len = tGuids.length;i < len;i++){
				resource = PageResource.page.findFirst(kit.loadSqlData("selectTemplateRelateResouceEntity",new Record().set("tempGuid", tGuids[i])));
				resource = TemplateUtil.checkResouceState(resource, auditUrl);
				res += (resource.update()?1:0);
			}
		}
		renderJson(res);
	}
	/**
	 * 发布模板
	 * @author chasonx
	 * @create 2017年6月7日 下午1:49:29
	 * @update
	 * @param  
	 * @return void
	 */
	public void publishTemplate(){
		String[] tGuids = getParaValues("tGuids[]");
		int res = 0;
		String msg = "";
		String xpackageUrl = "";
		if(tGuids != null){
			try{
				String basePath = PathKit.getWebRootPath();
				String tempPath = "";
				String auditUrl = PublicDao.getFieldStr("localdir", " and filetype = '"+ Constant.Config.AuditResouce.toString() +"' " , TConfig.class);
				xpackageUrl = PublicDao.getFieldStr("localdir", " and filetype = '"+ Constant.Config.PublishTemplate +"'", TConfig.class);
				
				List<PageDesigner> pages = PageDesigner.pDesigner.find("select * from " + PublicDao.getTableName(PageDesigner.class) + " where fguid in("+ StringUtils.join(tGuids, ",") +")");
				if(!pages.isEmpty()){
					PageDesigner pd;
					PageResource pr;
					String templateContent;
					String confJsonName;
					int jsIdx;
					
					for(int i = 0,len = pages.size();i < len;i++){
						
						pd = pages.get(i);
						tempPath = pd.getStr("furl");
						tempPath = tempPath.substring(0, tempPath.lastIndexOf("/") + 1);
						
						pr = PageResource.page.findFirst(kit.loadSqlData("selectTemplateRelateResouceEntity", new Record().set("tempGuid", pd.getStr("fguid"))));
						
						confJsonName = Constant.MEDIA_CTRL_PATH + "/" + pr.getStr("fguid") + ".json";
						pr = TemplateUtil.downloadResouce(pr, auditUrl, basePath + tempPath + Constant.MEDIA_CTRL_PATH + "/" , Constant.MEDIA_CTRL_PATH + "/");
						FileUtil.writeFile(basePath + tempPath + confJsonName,"{ \"data\" : [" + pr.getStr("fmediadata") + "] }",null);
						
						templateContent = FileUtil.readFile(basePath + pd.getStr("furl"), null) ;
						jsIdx = templateContent.lastIndexOf("<ucgs-asset>");
						if(jsIdx != -1)
							templateContent = templateContent.substring(0, jsIdx);
						
						FileUtil.copyFile(new File(basePath + Constant.TEMPLATE_CTRL_JSNAME_V2),new File(basePath + tempPath + Constant.MEDIA_CTRL_JSNAME_V2) );
						templateContent += "<ucgs-asset>\n<script src=\""+ Constant.MEDIA_CTRL_JSNAME_V2 +"\" type=\"text/javascript\"></script>";
						templateContent  += "\n<script type=\"text/javascript\">$activePageADLoader.init('"+ confJsonName +"');</script>";
						templateContent += "\n</ucgs-asset>";
						
						FileUtil.writeFile(basePath + pd.getStr("furl"), templateContent, null);
					}
					msg =  basePath + tempPath;
				}
			}catch(Exception e){
				res = 500;
				msg = e.getMessage();
			}
		}
		
		renderJson(new Record().set("result", res).set("path", msg).set("xpackager", xpackageUrl));
	}
	
	public void saveTemplateToTopic(){
		int type = getParaToInt("type");
		boolean res = false;
		Template template = Bean.getModel(getRequest(), Template.class);
		if(type == 1){
			template.set("fguid", TokenUtil.getUUID())
			.set("fcreateguid", DHttpUtils.getLoginUser(getRequest()).getStr("fguid"))
			.set("fcreatetime", DateFormatUtil.formatString(null));
			res = template.save();
		}else{
			res = template.update();
		}
		
		renderJson(res?1:0);
	}
}
