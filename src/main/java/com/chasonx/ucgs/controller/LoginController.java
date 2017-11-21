/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-26 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.util.List;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminUserDao;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.dao.RedisDao;
import com.chasonx.ucgs.entity.AdminUser;
import com.chasonx.ucgs.entity.PageStatistics;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.chasonx.ucgs.realm.MySessionDao;
import com.chasonx.ucgs.response.MyCaptcha;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.render.CaptchaRender;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月26日下午2:35:04
 * @remark
 */
public class LoginController extends Controller {

	@AnnPara("访问登录页面")
	@Before(SaveLog.class)
	public void index(){
		setAttr("ucmsVersion", SystemConstant.SYS_VERSION);
		render(PageUtil.PAGE_LOGIN);
	}
	
	
	public void getCaptcha(){
		Integer type = getParaToInt("type");
		int[] bgColor = null;
		int[] fontColor = null;
		switch (type) {
		case 1:
			bgColor = new  int[]{73,74,74};
			fontColor = new int[]{255, 255, 255};
			break;
		case 2:
			bgColor = new int[]{246,246,246};
			fontColor = new int[]{61, 170, 230};
		case 3:
			bgColor = new int[]{246,246,246};
			fontColor = new int[]{61, 170, 230};
			break;
		default:
			break;
		}
		render(new MyCaptcha("UCMSLOGINCAPTCHA",bgColor,fontColor));
	}
	
	@AnnPara("登录操作")
	@Before(SaveLog.class)
	public void userlogin(){
		String username = getPara("logname");
		String pwd = getPara("logpwd");
		String captcha = getPara("captcha");
		String mess = "ok";
		boolean res = false;
		if(!StringUtils.hasText(username) || !StringUtils.hasText(pwd) || !StringUtils.hasText(captcha)){
			mess = "参数不能为空";
		}else if(!CaptchaRender.validate(this, captcha, "UCMSLOGINCAPTCHA")){
			mess = "验证码错误";
		}else{
			Record user = AdminUserDao.getUserEntity(username);
			if(null == user){
				mess = "用户名或密码错误";
			}else if(!pwd.equals(user.getStr("fadminpwd"))){
				mess = "用户名或密码错误";
			}else if(user.getInt("fstate") != 0){
				mess = "该账户已被冻结，无法登录";
			}else if(user.getInt("fdimensionState") == 0){
				mess = "该账户所在机构组已被冻结，无法登录";
			}else{
				try{
					AdminUser adminUser = new AdminUser();
					adminUser.set("id", user.getLong("id"));
					adminUser.set("flogincount", null != user.get("flogincount")?user.getInt("flogincount") + 1:1);
					if(StringUtils.hasText(user.getStr("flogintime"))){
						adminUser.set("flastlogintime", user.get("flogintime"));
					}
					adminUser.set("flogintime", DateFormatUtil.formatString(null));
					
					UsernamePasswordToken token = new UsernamePasswordToken(username, pwd);
					Subject shiroSubject = SecurityUtils.getSubject();
					shiroSubject.login(token);
					
					String logInSessionId = user.getStr("floginSessionId");
					if(StringUtils.hasText(logInSessionId) && MySessionDao.sessionMap.containsKey(logInSessionId)){
						MySessionDao.sessionMap.remove(user.getStr("floginSessionId"));
					}
					logInSessionId = shiroSubject.getSession().getId().toString();
					adminUser.set("floginSessionId", logInSessionId);
					user.set("floginSessionId", logInSessionId);
					/*更新用户登录信息*/
					adminUser.update();
					
					Session logInUserSession = SecurityUtils.getSubject().getSession();
					logInUserSession.setAttribute("LOGINUSERS", user);
					
					res = true;
				}catch(Exception e){
					e.printStackTrace();
					mess = "系统出错，请稍候再试";
				}
			}
		}
		renderJson("{\"result\":"+ (res?1:0) +",\"mess\":\""+ mess +"\"}");
	}
	
	@AnnPara("用户登出")
	@Before(SaveLog.class)
	public void logout(){
		Subject subject = SecurityUtils.getSubject();
		subject.logout();
		redirect("/");
	}
	
	public void mysqlSyncRedis(){
		long st = System.currentTimeMillis();
		List<PageStatistics> list = PublicDao.getList(PageStatistics.class, null);
		try {
			RedisDao.saveToRedis(list);
			long ela = (System.currentTimeMillis() - st);
			int s = 1000,h = 3600 * s,m = 60 * s;
			renderText("Elapsed - " + ( ela / h) + " : " + (ela%h/m) + " : " + (ela%h%m/s) + "." + (ela%h%m%s) );
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
