/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-26 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.Md5Util;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminMenuDao;
import com.chasonx.ucgs.dao.AreaDao;
import com.chasonx.ucgs.entity.AdminMenu;
import com.chasonx.ucgs.entity.AdminUser;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.chasonx.ucgs.realm.MySessionDao;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月26日下午2:36:45
 * @remark
 */
public class MainController extends Controller {

	@AnnPara("访问UCMS首页")
	@Before(SaveLog.class)
	public void index(){
		Record adUser = DHttpUtils.getLoginUser(getRequest());
		Record user = new Record();
		user.set("username", adUser.get("fadminname"));
		user.set("groupname", adUser.get("rolename"));
		user.set("logcount", adUser.get("flogincount"));
		user.set("roletype", adUser.getInt("fsysroletype"));
		user.set("lastLoginTime", adUser.getStr("flastlogintime"));
		
		setAttr("LOGINUSER", user);
		setAttr("OnlineSize", MySessionDao.sessionMap.size());
		setAttr("ReqeustAddr", getRequest().getRemoteAddr());
		setAttr("DateYear", DateFormatUtil.formatString("yyyy"));
		
		/*区域*/
	    areaSessionList(getRequest());
		render(PageUtil.PAGE_MAIN);
	}
	
	public void desc(){
		Record sysRecord = new Record()
		.set("sysName", SystemConstant.SYS_NAME)
		.set("sysCode", SystemConstant.SYS_CODE)
		.set("sysVersion", SystemConstant.SYS_VERSION)
		.set("sysComName", SystemConstant.SYS_COMP_NAME)
		.set("sysComenName", SystemConstant.SYS_COMP_ENNAME)
		.set("sysComSite", SystemConstant.SYS_COMP_SITE)
		.set("jdkv", System.getProperty("java.version"))
		.set("os", System.getProperty("os.name"));
		setAttr("Systems", sysRecord);
		render(PageUtil.MAIN_DESC);
	}
	
	public static void areaSessionList(HttpServletRequest request){
		Record loginRec = DHttpUtils.getLoginUser(request);
		request.getSession().removeAttribute("ADMIN_AREA_LIST");
		//request.getSession().setAttribute("ADMIN_AREA_LIST", AreaDao.getHasAreaList(loginRec.getStr("roleareaguid"), loginRec.getInt("fsysroletype")));
		List<Record> areaList = AreaDao.getHadAreaList(loginRec.getStr("fguid"),loginRec.getInt("fsysroletype"));
		if(areaList.isEmpty()) areaList = AreaDao.getHadAreaList(StringUtils.hasText(loginRec.getStr("roleguid"))?loginRec.getStr("roleguid"):"",loginRec.getInt("fsysroletype"));
		request.getSession().setAttribute("ADMIN_AREA_LIST", areaList);
	}
	
	public void operationMenu(){
		Record adUser = DHttpUtils.getLoginUser(getRequest());
		/*系统用户所拥有菜单集合*/
		List<AdminMenu> userMenuList = null;
		
		/*超级管理员 fsysroletype = 1*/
		if(adUser.getInt("fsysroletype") == 1)  userMenuList = AdminMenuDao.selectMenuList(1);
		else userMenuList = AdminMenuDao.selectAdminUserHasMenuList(adUser.getStr("fguid"),adUser.getStr("roleguid"));
		renderJson(userMenuList);
	}
	
	@AnnPara("验证密码")
	@Before(SaveLog.class)
	public void validatePwd(){
		String oldPwd = getPara("oldPwd");
		boolean res = false;
		if(DHttpUtils.getLoginUser(getRequest()).getStr("fadminpwd").equals(Md5Util.md5String(oldPwd))) res = true;
		renderJson(res?1:0);
	}
	
	@AnnPara("修改密码")
	@Before(SaveLog.class)
	public void modifyPwd(){
		String pwd = getPara("newPwd");
		AdminUser user = new AdminUser();
		user.set("id", DHttpUtils.getLoginUser(getRequest()).getLong("id"));
		user.set("fadminpwd", Md5Util.md5String(pwd));
		renderJson(user.update()?1:0);
	}
}
