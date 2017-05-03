/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月13日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.controller;

import java.lang.reflect.Method;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.CacheUtil;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.entity.TQuartz;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.plugin.quartz.QuartzPlugin;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月13日 下午2:54:13
 * @remark 
 */
public class TaskController extends Controller {

	public void index(){
		render(PageUtil.ADMIN_TASK);
	}
	
	@AnnPara("定时任务列表")
	@Before(SaveLog.class)
	public void list(){
		renderJson(TQuartz.quartz.find("select * from t_quartz"));
	}
	
	@AnnPara("定时任务操作")
	@Before({Para.class,SaveLog.class})
	public void modify(){
		TQuartz tz = Tools.recordConvertModel((Record)getAttr("RequestPara"),TQuartz.class);
		QuartzPlugin plugin = CacheUtil.getQuartzPlugin(tz.getStr("fclass"));
		if(tz.getInt("fstate") == 0){
			plugin.stop();
		}else{
			plugin.start();
		}
		renderJson(tz.update()?1:0);
	}
	
	@AnnPara("定时任务操作")
	@Before({SaveLog.class})
	public void excuteNow(){
		String classes = getPara("classes");
		boolean res = false;
		if(StringUtils.hasText(classes)){
			try {
				Class<?> clas = Class.forName(classes);
				Method mth = clas.getDeclaredMethod("startExecute");
				mth.invoke(clas.newInstance());
				res = true;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		renderJson(res?1:0);
	}
}
