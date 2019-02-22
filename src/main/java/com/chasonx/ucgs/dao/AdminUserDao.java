/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-3-4 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.entity.AdminGroup;
import com.chasonx.ucgs.entity.AdminMenuGroup;
import com.chasonx.ucgs.entity.AdminUser;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统用户操作
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-3-4下午4:36:50
 * @remark
 */
public class AdminUserDao {
	
	/**
	 * 添加用户
	 * @param model
	 * @return
	 * boolean
	 */
	public static boolean insert(Model<AdminUser> model){
		return model.save();
	}
	
	public static boolean update(Model<AdminUser> model){
		return model.update();
	}
	
	public static int delUser(String idStr,Long selfId){
		String[] idArr = idStr.split(";");
		String sql = "delete from t_adminuser where id in (0";
		for(int i = 0;i < idArr.length;i++){
			if(!idArr[i].equals("") && !idArr[i].equals(selfId.toString()))
				sql += ',' + idArr[i];
		}
		sql += ") and fsysroletype = 0";
		return Db.update(sql);
	}
	
	public static Record selectUserEntity(Integer uid){
		return Db.findFirst("select a.*,g.fgname as rolename,e.fname as areaname from t_adminuser a LEFT JOIN t_admingroup g on a.fadmingroup = g.id LEFT JOIN t_area e on g.fareaguid = e.fguid where a.id = ?",uid);
//		return AdminUser.adminUserDao.findById(uid);
	}
	
	public static AdminUser selectUserEntity(String logname){
		return AdminUser.adminUserDao.findFirst("select * from t_adminuser where fadminuser = ?",logname);
	}
	
	public static Record getUserEntity(String logname){
		//return Db.findFirst("select a.*,g.fgname as rolename,g.fareaguid as roleareaguid,g.fstate as rolestate,g.fisadmin as groupadmin,e.fstate as areastate from t_adminuser a LEFT JOIN t_admingroup g on a.fadmingroup = g.id LEFT JOIN t_area e on g.fareaguid = e.fguid where a.fadminuser = ?",logname);
		return Db.findFirst("select a.*,g.fgname as rolename,g.fguid as roleguid,g.fstate as folestate,g.fisadmin as groupadmin from t_adminuser a LEFT JOIN t_admingroup g on a.froleguid = g.fguid where a.fadminuser = ?",logname);
	}
	
	public static Page<AdminUser> getAdminUserList(int startPage,int limitPage,Model<AdminUser> user,String[] dimensionGuids){
		String sql = " from t_adminuser a LEFT JOIN t_admingroup g on a.froleguid = g.fguid  where 1 = 1 ";
		if(user.getInt("fadmingroup") != null)
			sql += " and a.fadmingroup = " + user.getInt("fadmingroup");
		if(user.getInt("fstate") != null)
			sql += " and a.fstate = " + user.getInt("fstate");
		if(null != dimensionGuids && dimensionGuids.length > 0)
			sql += " and a.fdimensionGuid in ("+ StringUtils.join(dimensionGuids, ",") +")";
		sql += " order by a.id desc ";
		Page<AdminUser> page = AdminUser.adminUserDao.paginate(startPage, limitPage, "select a.*,g.fgname as rolename ", sql);
		return page;
	}
	
	public static List<AdminUser> selectUserListByGroupId(Integer groupid){
		String sql = "select id,fadminname,fadminuser,fadmingroup,flogincount,flogintime,flastlogintime,femail,fstate,fremark from t_adminuser where 1 = 1 ";
		if(null != groupid) sql += " and fadmingroup = " + groupid;
		return AdminUser.adminUserDao.find(sql);
	}
	
	public static List<AdminMenuGroup> selectHasComList(String adminUserGuid){
		return AdminMenuGroup.adminMenuGroupDao.find("select * from t_adminmenugroup where fadminguid = ?", adminUserGuid);
	}
	
	public static boolean addAdminUserMenuGroup(String adminUserGuid,Integer[] menuidArr,String[] comArr){
		List<String> sql = new ArrayList<String>();
		if(menuidArr != null && menuidArr.length > 0){
			for(int i = 0,len = menuidArr.length;i < len;i++){
				sql.add("insert into t_adminmenugroup(fmenuid,fadminguid,fcompstr) values('"+ menuidArr[i] +"','"+ adminUserGuid +"','"+ comArr[i] +"')");
			}
			return Db.batch(sql, sql.size()).length > 0?true:false;
		}else{
			return true;
		}
	}
	
	public static boolean delAdminUserMenuGroup(String adminUserGuid){
		return Db.update("delete from t_adminmenugroup where fadminguid = ?",adminUserGuid) > 0?true:false;
	}
	
	public static AdminGroup selectAdminUserGroupName(Integer gid){
		return AdminGroup.adminGroupDao.findById(gid);
	}
	
	public static String getAdminUserGuid(Long adminId){
		return Db.queryStr("select fguid from t_adminuser where id = ?",adminId);
	}
	
	public static int selectUserByLoginName(String username){
		return AdminUser.adminUserDao.findFirst("select id from t_adminuser where fadminuser = ?",username) != null?1:0;
	}
	
	public static int updateDimensionState(String dimensionGuid,int state){
		return Db.update("update t_adminuser set fdimensionState = ? where fdimensionGuid = ?",state,dimensionGuid);
	}
	
	public static List<Record> getAdminUserList(){
		String sql = "select fguid as guid,fadminname as name from t_adminuser where fstate = 0";
		return Db.find(sql);
	}
}
