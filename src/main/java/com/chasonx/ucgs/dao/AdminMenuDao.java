/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-3-6 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;


import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.entity.AdminMenu;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;

/**
 * 
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-3-6上午10:06:34
 * @remark
 */
public class AdminMenuDao {
	
	private static SqlKit kit = new SqlKit("AdminMenu.xml");

	public static boolean add(Model<AdminMenu> menu){
		Integer sort = getMaxSort(menu.getLong("fparentid"));
		menu.set("fsort", sort != null?sort + 1:1);
		return menu.save();
	}
	
	public static Integer getMaxSort(Long pid){
		return Db.queryInt("SELECT max(fsort) FROM `t_adminmenu` where fparentid = ?",pid);
	}
	
	public static boolean update(Model<AdminMenu> menu){
		return menu.update();
	}
	
	public static boolean del(Integer id){
		return Db.update("delete from t_adminmenu where id = "+ id +" or fparentid =" + id) > 0?true:false;
	}
	
	public static List<AdminMenu> selectMenuList(Integer state){
		String where = "";
		if(state != null) where = " and fstate = " + state;
		return AdminMenu.adminMenuDao.find("select * from t_adminmenu where 1 = 1 "+ where +" order by fsort,flevel asc");
	}
	
	public static List<AdminMenu> getAllMenuByIdList(Integer state,String adminGuid,String roleGuid){
		String where = "";
		List<Long> ids = AdminAuthDao.getAuthFieldList("ftargetauthguid", adminGuid, Constant.AuthTypes.menu.toString(), null);
		if(ids.isEmpty()) ids = AdminAuthDao.getAuthFieldList("ftargetauthguid", roleGuid, Constant.AuthTypes.menu.toString(), null);
		if(state != null) where = " and fstate = " + state;
		if(ids.isEmpty()) ids.add(0L);
		String idStr = StringUtils.joinSimple(ids, ",");
		String sql = kit.loadSqlData("queryMenuForPermission");
		sql = sql.replaceAll("#ID#", idStr);
		
		return AdminMenu.adminMenuDao.find(sql + where +" order by fsort,flevel asc");
	}
	
	public static List<AdminMenu> selectAdminUserHasMenuList(String adminUserGuid,String roleGuid){
		List<AdminMenu> result = AdminMenu.adminMenuDao.find(kit.loadSqlData("queryUserMenuByGuid"),adminUserGuid,Constant.AuthTypes.menu.toString(),adminUserGuid,Constant.AuthTypes.menu.toString());
		if(result.isEmpty()){
			//result = AdminMenu.adminMenuDao.find(kit.loadSqlData("queryUserMenuByGroup"),userid,userid);
			result =  AdminMenu.adminMenuDao.find(kit.loadSqlData("queryUserMenuByGuid"),roleGuid,Constant.AuthTypes.menu.toString(),roleGuid,Constant.AuthTypes.menu.toString());
		}
		return result;
	}
	/**
	 * 获取菜单权限
	 * String
	 * @createTime:2015年7月7日 下午5:27:06
	 * @author: chason.x
	 */
	public static String selectUrlPermission(Long menuid,String adminUserGuid,String roleGuid){
		String sql = "select fauth from t_admin_auth where fuserguid = ? and ftargetauthguid = ? and ftype = ?";
		String permission = Db.queryStr(sql,adminUserGuid,menuid,Constant.AuthTypes.menu.toString()); 
		//Db.queryStr(kit.loadSqlData("queryComStr"),url,adminUserGuid);
		if(!StringUtils.hasText(permission)){
			permission = Db.queryStr(sql,roleGuid,menuid,Constant.AuthTypes.menu.toString());
		    //Db.queryStr(kit.loadSqlData("queryComStrByGruop"),adminUserGuid,url);
		}
		return StringUtils.hasText(permission)?permission:"0";
	}
	
}
