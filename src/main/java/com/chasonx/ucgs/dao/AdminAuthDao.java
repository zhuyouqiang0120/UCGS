/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.dao								 
 **    Type    Name : AdminAuthDao 							     	
 **    Create  Time : 2016年10月26日 下午3:47:01								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2016 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.dao;

import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.entity.AdminAuth;
import com.jfinal.plugin.activerecord.Db;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.om
 * @create  2016年10月26日下午3:47:01
 * @version 1.0 
 */
public class AdminAuthDao {

	public static boolean add(AdminAuth auth){
		return auth.save();
	}
	
	public static boolean modify(AdminAuth auth){
		if(auth.getLong("id") == null) return false;
		return auth.update();
	}
	
	public static boolean del(String userGuid,String type){
		if(!StringUtils.hasText(userGuid)) return false;
		String sql = "";
		if(StringUtils.hasText(type)) sql += " and ftype = '"+ type +"'";
		return Db.update("delete from t_admin_auth where fuserguid = ?" + sql,userGuid) > 0;
	}
	
	public static List<AdminAuth> getAuths(String userGuid,String type){
		return AdminAuth.auth.find("select * from t_admin_auth where fuserguid = ? and ftype = ?",userGuid,type);
	}
	
	public static  <T> List<T> getAuthFieldList(String field,String userGuid,String type,String condition){
		return Db.query("select " + field + " from t_admin_auth where fuserguid = ? and ftype = ?" + (StringUtils.hasText(condition)?condition:""),userGuid,type);
	}
}
