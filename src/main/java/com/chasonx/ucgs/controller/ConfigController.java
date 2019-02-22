/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月14日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.controller;

import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.api.CacheServerUtil;
import com.chasonx.ucgs.api.Ret;
import com.chasonx.ucgs.common.Bean;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.TCacheServer;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月14日 下午4:32:43
 * @remark 
 */
public class ConfigController extends Controller{

	@AnnPara("访问业务配置页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ADMIN_CONFIG);
	}
	
	@AnnPara("缓存服务器配置页面")
	@Before(SaveLog.class)
	public void cacheServerManager(){
		render(PageUtil.CACHE_SERVER_INDEX);
	}
	
	@AnnPara("业务配置编辑")
	@Before({SaveLog.class,Para.class})
	public void modify(){
		TConfig config = Tools.recordConvertModel((Record)getAttr("RequestPara"), TConfig.class);
		int res = config.update() ? 1 : 0;
		TConfig cache = TConfig.config.findById(config.getLong("id"));
		if(null != cache && cache.getInt("cache") == Constant.UPDATE_CONFIG_CACHE){
			CacheKit.put(Constant.CACHE_DEF_NAME, cache.getStr("filetype"), cache);
		}
		renderJson(res);
	}
	
	@AnnPara("加载业务配置列表")
	@Before(SaveLog.class)
	public void list(){
		renderJson(TConfig.config.find("select id,localdir,remotedir,remotehost,remoteuser,filetype,filename from t_config"));
	}

	@AnnPara("缓存服务器信息编辑")
	@Before(SaveLog.class)
	public void modifyCacheServer(){
		TCacheServer server = Bean.getModel(getRequest(), TCacheServer.class);
		boolean res = false;
		Ret ret = new Ret();
		if(server.getInt("id") == null){
			server.set("guid", TokenUtil.getUUID());
			res = server.save();
			CacheServerUtil.modifyCacheServer(server, true);
		}else{
			res = server.update();
			CacheServerUtil.modifyCacheServer(server, false);
		}
		ret.setResult(res ? 1 : 0);
		renderJson(ret);
	}
	
	@AnnPara("删除缓存服务器")
	@Before(SaveLog.class)
	public void delCacheServer(){
		Integer id = getParaToInt("id");
		Ret ret = new Ret();
		if(id != null){
			TCacheServer server = TCacheServer.cacheServer.findById(id);
			server.set("cache_state", Constant.CACHE_SERVER_STATE_FREEZE);
			CacheServerUtil.modifyCacheServer(server, false);
			ret.setResult( TCacheServer.cacheServer.deleteById(id) ? 1:0);
		}
		renderJson(ret);
	}
	
	@AnnPara("获取缓存服务器列表")
	@Before(SaveLog.class)
	public void listCacheServer(){
		Ret ret = new Ret();
		ret.setData(TCacheServer.cacheServer.find("select * from " + PublicDao.getTableName(TCacheServer.class)));
		if(ret.getData() != null){
			ret.setResult(1);
		}
		renderJson(ret);
	}
	
}
