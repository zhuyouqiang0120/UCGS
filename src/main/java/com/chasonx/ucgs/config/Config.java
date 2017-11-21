/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-25 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.config;

import java.util.ArrayList;
import java.util.List;

import org.quartz.Job;
import com.alibaba.druid.wall.WallFilter;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.api.ColumnRequestData;
import com.chasonx.ucgs.api.DesignerTemplateData;
import com.chasonx.ucgs.api.MediaRequestData;
import com.chasonx.ucgs.api.PagePreviewData;
import com.chasonx.ucgs.api.ParaTest;
import com.chasonx.ucgs.api.PublicSiteRequestData;
import com.chasonx.ucgs.api.TopicApi;
import com.chasonx.ucgs.api.TopicRequestData;
import com.chasonx.ucgs.api.UnifyRequestData;
import com.chasonx.ucgs.api.ValidateData;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.controller.AdminMenuController;
import com.chasonx.ucgs.controller.AdminUserController;
import com.chasonx.ucgs.controller.AdminUserGroupController;
import com.chasonx.ucgs.controller.AreaController;
import com.chasonx.ucgs.controller.BadWordController;
import com.chasonx.ucgs.controller.ColumnController;
import com.chasonx.ucgs.controller.ConfigController;
import com.chasonx.ucgs.controller.DatabaseController;
import com.chasonx.ucgs.controller.DimensionController;
import com.chasonx.ucgs.controller.LoadController;
import com.chasonx.ucgs.controller.LoginController;
import com.chasonx.ucgs.controller.MainController;
import com.chasonx.ucgs.controller.NoticeController;
import com.chasonx.ucgs.controller.PageDesignerController;
import com.chasonx.ucgs.controller.PageStatisticsController;
import com.chasonx.ucgs.controller.ResourceController;
import com.chasonx.ucgs.controller.SiteController;
import com.chasonx.ucgs.controller.TaskController;
import com.chasonx.ucgs.controller.TemplateController;
import com.chasonx.ucgs.controller.TopicController;
import com.chasonx.ucgs.controller.ULogController;
import com.chasonx.ucgs.controller.UnifyFXController;
import com.chasonx.ucgs.controller.WorkflowController;
import com.chasonx.ucgs.entity.AdminAuth;
import com.chasonx.ucgs.entity.AdminDevice;
import com.chasonx.ucgs.entity.AdminGroup;
import com.chasonx.ucgs.entity.AdminGroupColumn;
import com.chasonx.ucgs.entity.AdminGroupGroup;
import com.chasonx.ucgs.entity.AdminGroupSite;
import com.chasonx.ucgs.entity.AdminMenu;
import com.chasonx.ucgs.entity.AdminMenuGroup;
import com.chasonx.ucgs.entity.AdminRoles;
import com.chasonx.ucgs.entity.AdminUser;
import com.chasonx.ucgs.entity.Area;
import com.chasonx.ucgs.entity.BadWord;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.entity.PageDesigner;
import com.chasonx.ucgs.entity.PageResource;
import com.chasonx.ucgs.entity.PageResourceRelate;
import com.chasonx.ucgs.entity.PageStatistics;
import com.chasonx.ucgs.entity.PluginsGroup;
import com.chasonx.ucgs.entity.PublishToDo;
import com.chasonx.ucgs.entity.ResourceEntity;
import com.chasonx.ucgs.entity.Site;
import com.chasonx.ucgs.entity.SitePublish;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.entity.TMaps;
import com.chasonx.ucgs.entity.TQuartz;
import com.chasonx.ucgs.entity.Template;
import com.chasonx.ucgs.entity.TemplateStatus;
import com.chasonx.ucgs.entity.TmenuBtn;
import com.chasonx.ucgs.entity.TmenuBtnGroup;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.chasonx.ucgs.entity.TopicRelate;
import com.chasonx.ucgs.entity.ULog;
import com.chasonx.ucgs.entity.ULogVersion;
import com.chasonx.ucgs.interceptor.AdminUserInterceptor;
import com.chasonx.ucgs.interceptor.MyExceptionInterceptor;
import com.chasonx.ucgs.sql.SqlPathEntity;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.ext.handler.ContextPathHandler;
import com.jfinal.ext.plugin.quartz.QuartzPlugin;
import com.jfinal.ext.plugin.shiro.ShiroPlugin;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.tx.TxByMethods;
import com.jfinal.plugin.activerecord.tx.TxByRegex;
import com.jfinal.plugin.druid.DruidPlugin;
import com.jfinal.plugin.druid.DruidStatViewHandler;
import com.jfinal.plugin.ehcache.CacheKit;
import com.jfinal.plugin.ehcache.EhCachePlugin;
import com.jfinal.plugin.redis.RedisPlugin;
import com.jfinal.render.ViewType;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月25日下午3:16:06
 * @remark
 */
public class Config extends JFinalConfig {
	
	public  Routes shiroRoutes = null;
	public  Plugins configPlugins;

	/* (non-Javadoc)
	 * @see com.jfinal.config.JFinalConfig#configConstant(com.jfinal.config.Constants)
	 */
	@Override
	public void configConstant(Constants con) {
		con.setDevMode(true); 
		con.setViewType(ViewType.FREE_MARKER);
		con.setEncoding("UTF-8");
		con.setError404View(PageUtil.ERROR_404);
		con.setError500View(PageUtil.ERROR_500);
		con.setBaseViewPath("/WEB-INF/views/");
		con.setMaxPostSize(20 * 1024 * 1024);
		SqlKit.setBaseXmlPath(PathKit.getPath(SqlPathEntity.class));
		
		System.setProperty("WORKDIR_UCGS", PathKit.getWebRootPath());
	}

	/* (non-Javadoc)
	 * @see com.jfinal.config.JFinalConfig#configRoute(com.jfinal.config.Routes)
	 */
	@Override
	public void configRoute(Routes route) {
		
		route.add("/", LoginController.class);
		route.add("/main",MainController.class,"/");
		route.add("/main/resource",ResourceController.class,"main/files");
		route.add("/main/site",SiteController.class,"main/site");
		route.add("/main/admin",AdminUserController.class,"main/admin");
		route.add("/main/menu",AdminMenuController.class,"main/admin");
		route.add("/main/admingroup",AdminUserGroupController.class,"main/admin");
		route.add("/main/adminarea",AreaController.class,"main/admin");
		route.add("/main/template",TemplateController.class , "main/template");
		route.add("/main/column",ColumnController.class, "main/column");
		route.add("/main/topic",TopicController.class,"main/topic");
		route.add("/main/workflow",WorkflowController.class,"main/workflow");
		route.add("/main/badword",BadWordController.class,"main/topic");
		route.add("/main/operlog", ULogController.class, "main/log");
		route.add("/main/task", TaskController.class,"main/admin");
		route.add("/main/config",ConfigController.class,"main/admin");
		route.add("/main/db",DatabaseController.class,"main/admin");
		route.add("/main/pdesigner",PageDesignerController.class,"main/pagedesigner");
		route.add("/main/dimension",DimensionController.class,"main/admin");
		route.add("/main/unifyFX",UnifyFXController.class);
		route.add("/main/load",LoadController.class);
		route.add("/main/statistics",PageStatisticsController.class,"main/statistics");
		route.add("/main/notice", NoticeController.class,"main/notice");
		
		route.add("/data/mr", MediaRequestData.class);
		route.add("/data/topic",TopicRequestData.class);
		route.add("/data/public",PublicSiteRequestData.class,"preview");
		route.add("/data/uRequest",UnifyRequestData.class,"preview");
		route.add("/data/auth",ValidateData.class);
		route.add("/data/preview",PagePreviewData.class);
		route.add("/data/column",ColumnRequestData.class);
		route.add("/data/tscaler",DesignerTemplateData.class);
		
		route.add("/api/topic",TopicApi.class);
		
		route.add("/test",ParaTest.class,"/");
		shiroRoutes = route;
	}

	/* (non-Javadoc)
	 * @see com.jfinal.config.JFinalConfig#configPlugin(com.jfinal.config.Plugins)
	 */
	@Override
	public void configPlugin(Plugins plugins) {
		//连接池 druid 开启sql防火墙
		loadPropertyFile("variable/jdbc.properties");
		DruidPlugin druidPlugin = new DruidPlugin(getProperty("jdbc.url"), getProperty("jdbc.username"), getProperty("jdbc.password"));
		druidPlugin.set(50, 20, 150);
		WallFilter wall = new WallFilter();
		wall.setDbType("mysql");
		druidPlugin.addFilter(wall);
		
		//ehcache
		EhCachePlugin eheache = new EhCachePlugin();
		
		//activeRecord 
		ActiveRecordPlugin ar = new ActiveRecordPlugin(druidPlugin);
		ar.setShowSql(true);
		ar.setTransactionLevel(8);
		ar.addMapping("t_resource", ResourceEntity.class);
		ar.addMapping("t_admingroup", AdminGroup.class);
		ar.addMapping("t_admingroup_group", AdminGroupGroup.class);
		ar.addMapping("t_adminmenu", AdminMenu.class);
		ar.addMapping("t_adminmenugroup", AdminMenuGroup.class);
		ar.addMapping("t_adminroles", AdminRoles.class);
		ar.addMapping("t_adminuser", AdminUser.class);
		ar.addMapping("t_site", Site.class);
		ar.addMapping("t_template", Template.class);
		ar.addMapping("t_template_status", TemplateStatus.class);
		ar.addMapping("t_config", TConfig.class);
		ar.addMapping("t_column", Column.class);
		ar.addMapping("t_topic", Topic.class);
		ar.addMapping("t_topic_content", TopicContent.class);
		ar.addMapping("t_topic_relate", TopicRelate.class);
		ar.addMapping("t_area", Area.class);
		ar.addMapping("t_admingroup_site", AdminGroupSite.class);
		ar.addMapping("t_admingroup_column", AdminGroupColumn.class);
		ar.addMapping("t_badword", BadWord.class);
		ar.addMapping("t_quartz", TQuartz.class);
		ar.addMapping("t_operation_log", ULog.class);
		ar.addMapping("t_operation_version", ULogVersion.class);
		ar.addMapping("t_menu_btn", TmenuBtn.class);
		ar.addMapping("t_menu_btn_group", TmenuBtnGroup.class);
		ar.addMapping("t_site_publish", SitePublish.class);
		ar.addMapping("t_maps", TMaps.class);
		ar.addMapping("t_pagedesigner", PageDesigner.class);
		ar.addMapping("t_admin_auth", AdminAuth.class);
		ar.addMapping("t_admin_device", AdminDevice.class);
		ar.addMapping("t_publish_todo", PublishToDo.class);
		ar.addMapping("t_page_statistics", PageStatistics.class);
		ar.addMapping("t_pageplugins", com.chasonx.ucgs.entity.Plugins.class);
		ar.addMapping("t_pageplugingroup", PluginsGroup.class);
		ar.addMapping("t_pageresource", PageResource.class);
		ar.addMapping("t_pageresource_relate", PageResourceRelate.class);
		
		//shiro
		ShiroPlugin shiroPlugin = new ShiroPlugin(shiroRoutes);
		shiroPlugin.start();
		
		RedisPlugin redis = new RedisPlugin(getProperty("redis.name"), getProperty("redis.host"), getPropertyToInt("redis.port"),0,getProperty("redis.pwd"),getPropertyToInt("redis.db"));
		
		plugins.add(redis);
		plugins.add(shiroPlugin);
		plugins.add(druidPlugin);
		plugins.add(ar);
		plugins.add(eheache);
		
		configPlugins = plugins;
	}

	/* (non-Javadoc)
	 * @see com.jfinal.config.JFinalConfig#configInterceptor(com.jfinal.config.Interceptors)
	 */
	@Override
	public void configInterceptor(Interceptors me) {
		me.addGlobalActionInterceptor(new AdminUserInterceptor());
		me.addGlobalServiceInterceptor(new MyExceptionInterceptor());
		me.add(new TxByMethods("save","update","delete","modify"));
		me.add(new TxByRegex("(.*save.*|.*update.*)"));
		quartzInit();
		ulogInit();
		extendInit();
	}

	/* (non-Javadoc)
	 * @see com.jfinal.config.JFinalConfig#configHandler(com.jfinal.config.Handlers)
	 */
	@Override
	public void configHandler(Handlers dHandlers) {
		dHandlers.add(new ContextPathHandler("basePath"));
		dHandlers.add(new DruidStatViewHandler("/druid"));
	}

	/**
	 * @Tag       : 定时任务初始化
	 * @createTime: 2016年1月7日 下午3:57:09
	 * @author    : Chason.x
	 */
	public void quartzInit(){
		//定时任务
		List<TQuartz> quartzs = TQuartz.quartz.find("select * from t_quartz");
		if(!quartzs.isEmpty()){
			QuartzPlugin quartz;
			List<ExtQuartz> quartzPlugs = new ArrayList<ExtQuartz>();
			try{
				for(int i = 0,len = quartzs.size();i < len;i++){
					if(StringUtils.hasText(quartzs.get(i).getStr("fclass"))){
						quartz = new QuartzPlugin();
						quartz.add(quartzs.get(i).getStr("fcron"), (Job)Class.forName(quartzs.get(i).getStr("fclass")).newInstance());
						if(quartzs.get(i).getInt("fstate") == 1) quartz.start();
						quartzPlugs.add(new ExtQuartz().setClassName(quartzs.get(i).getStr("fclass")).setPlugin(quartz));
					}
				}
			}catch(Exception e){
				e.printStackTrace();
			}
			CacheKit.put(Constant.CACHE_DEF_NAME, Constant.CACHE_QUARTZ_NAME, quartzPlugs);
		}
	}
	/**
	 * @Tag       : 日志配置初始化
	 * @createTime: 2016年1月7日 下午3:56:48
	 * @author    : Chason.x
	 */
	public void ulogInit(){
		ULogVersion uv = ULogVersion.uv.findFirst("select * from t_operation_version where ftag = ? order by id ",SystemConstant.SYS_CODE);
		if(null == uv){
			uv = new ULogVersion();
			uv.set("fcurrversion", 1)
			.set("fpreversion", 0)
			.set("ftag", SystemConstant.SYS_CODE)
			.save();
		}
		ULogVersion.currVersion = uv.getInt("fpreversion");
	}
	
	/**
	 * 相关配置初始化
	 * @author chasonx
	 * @create 2017年1月4日 上午11:49:47
	 * @update
	 * @param  
	 * @return void
	 */
	public void extendInit(){
		String topicExt = CacheKit.get(Constant.CACHE_DEF_NAME, Constant.Config.TopicExtendView.toString());
		if(!StringUtils.hasText(topicExt)) CacheKit.put(Constant.CACHE_DEF_NAME, Constant.Config.TopicExtendView.toString(), "START");
	}
}
