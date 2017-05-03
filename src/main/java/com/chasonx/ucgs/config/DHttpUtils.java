package com.chasonx.ucgs.config;

import javax.servlet.http.HttpServletRequest;

import com.chasonx.ucgs.common.SystemConstant;
import com.jfinal.plugin.activerecord.Record;


public class DHttpUtils {

	/**
	 * 获取系统登录用户ID
	 * AdminUser
	 * @createTime:2015-5-28 下午2:54:35
	 * @author: chason.x
	 */
	public static Record getLoginUser(HttpServletRequest request){
		return (Record) request.getSession().getAttribute(SystemConstant.SYS_LOGIN_SESSION);
	}
}
