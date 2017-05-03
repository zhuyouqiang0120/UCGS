/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月14日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.controller;

import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

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
	
	@AnnPara("业务配置编辑")
	@Before({SaveLog.class,Para.class})
	public void modify(){
		TConfig config = Tools.recordConvertModel((Record)getAttr("RequestPara"), TConfig.class);
		renderJson(config.update()?1:0);
	}
	
	@AnnPara("加载业务配置列表")
	@Before(SaveLog.class)
	public void list(){
		renderJson(TConfig.config.find("select id,localdir,remotedir,remotehost,remoteuser,filetype,filename from t_config"));
	}

}
