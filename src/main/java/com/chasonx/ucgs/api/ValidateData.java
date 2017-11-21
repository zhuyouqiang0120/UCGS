/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年3月27日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.api;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.session.Session;
import org.apache.shiro.subject.Subject;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.Api;
import com.chasonx.ucgs.annotation.ApiRemark;
import com.chasonx.ucgs.annotation.ApiTitle;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.dao.AdminUserDao;
import com.chasonx.ucgs.entity.AdminUser;
import com.chasonx.ucgs.realm.MySessionDao;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年3月27日 下午2:44:14
 * @remark 
 */
public class ValidateData extends Controller {
	
	public void api(){
		String result = "";
		try {
			result = Api.getInfo(ValidateData.class, "/UCGS/data/auth/", "POST/GET","UCGS用户登录状态验证接口");
		} catch (Exception e) {
			e.printStackTrace();
			result = e.getMessage();
		}
		renderHtml(result);
	}

	/**
	 * @Tag       : 
	 * @createTime: 2016年3月27日 下午2:45:45
	 * @author    : Chason.x
	 */
	@ApiTitle("UCGS用户登录状态验证")
	@ApiRemark("用户第三方系统验证用户状态")
	@Required({
		@ParaEntity(name = "uName",desc = "用户名"),
		@ParaEntity(name = "uSession",desc = "会话ID")
	})
	@Before(ParamInterceptor.class)
	public void loginAuth(){
		String cb = getPara(ApiConstant.jsonpName);
		String uname = getPara("uName");
		String usession = getPara("uSession");
		if(!StringUtils.hasText(uname)) uname = "";
		if(!StringUtils.hasText(usession)) usession = "";
		
		AdminUser au = AdminUser.adminUserDao.findFirst("select * from t_adminuser where fadminuser = ? and floginSessionId = ?",uname,usession);
		Record res = new Record()
		.set("result", (au != null?1:0));
		renderJavascript(cb + "("+ JsonKit.toJson(res) +")");
	}
	
	
	public void singletonLogin(){
		try{
			String userName = getPara("authCode");
			Record user = AdminUserDao.getUserEntity(userName);
			if(user != null){
				UsernamePasswordToken token = new UsernamePasswordToken(userName, user.getStr("fadminpwd"));
				Subject shiroSubject = SecurityUtils.getSubject();
				shiroSubject.login(token);
				
				AdminUser au = new AdminUser();
				au.set("id", user.get("id"));
				String logInSessionId = user.getStr("floginSessionId");
				if(StringUtils.hasText(logInSessionId) && MySessionDao.sessionMap.containsKey(logInSessionId)){
					MySessionDao.sessionMap.remove(logInSessionId);
				}
				logInSessionId = shiroSubject.getSession().getId().toString();
				au.set("floginSessionId", logInSessionId);
				user.set("floginSessionId", logInSessionId);
				/*更新用户登录信息*/
				au.update();
				
				Session logInUserSession  = SecurityUtils.getSubject().getSession();
				logInUserSession.setAttribute("LOGINUSERS", user);
				
				redirect("/main");
			}else{
				renderHtml("<h3 style=\"text-align:center;\">验证未通过</h3>");
			}
		}catch(Exception e){
			e.printStackTrace();
			renderHtml("<script type=\"text/javascript\">window.location.reload();</script>");
		}
		
	}
}
