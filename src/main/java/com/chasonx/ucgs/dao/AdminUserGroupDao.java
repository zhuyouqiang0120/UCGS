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

import com.chasonx.ucgs.entity.AdminGroup;
import com.chasonx.ucgs.entity.AdminGroupGroup;
import com.chasonx.ucgs.response.AdminGroupRes;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统用户组业务操作
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-3-4下午4:37:06
 * @remark
 */
public class AdminUserGroupDao {

	public static boolean add(Model<AdminGroup> group){
		return group.save();
	}
	
	public static int[] modifyAdminGroupGroup(Integer[] menuidArr,String[] comArr,String guid){
		List<String> sql = new ArrayList<String>();
		if(menuidArr != null){
			for(int i = 0,len = menuidArr.length;i < len;i++){
				sql.add("insert into t_admingroup_group(fmenuid,fadmingroupid,fcompstr) values("+ menuidArr[i] +"," + guid +",'" + comArr[i]+ "')");
			}
		}
		return sql.size() > 0?Db.batch(sql, sql.size()):new int[0];
	}
	
	public static boolean update(Model<AdminGroup> group){
		return group.update();
	}
	
	public static boolean del(String guid){
		if(Db.update("delete from t_admingroup where fguid = ?",guid) > 0)
			//return Db.update("delete from t_admingroup_group where fadmingroupid =" + id) > 0?true:false;
			return AdminAuthDao.del(guid, null);
		else
			return false;
	}
	
	public static List<AdminGroupRes> selectList(){
		List<AdminGroupRes> list = new ArrayList<AdminGroupRes>();
		List<AdminGroup> groups = AdminGroup.adminGroupDao.find("select * from t_admingroup");
		
		List<Record> groupRes;
		String groupSql = "SELECT g.id,g.fmenuid,g.fadmingroupid,g.fcompstr,m.fmenuname FROM t_admingroup_group g "+
						  "INNER JOIN t_adminmenu m ON g.fmenuid = m.id " +
					      " WHERE g.fadmingroupid = ";
		
		AdminGroupRes menuGroup;
		for(int i = 0,len = groups.size();i < len;i++){
			menuGroup = new AdminGroupRes();
			menuGroup.setId(groups.get(i).getLong("id"));
			menuGroup.setGname(groups.get(i).getStr("fgname"));
			
			groupRes = Db.find(groupSql + groups.get(i).getLong("id"));
			
			menuGroup.setRecords(groupRes);
			list.add(menuGroup);
		}
		return list;
	}
	
	public static List<AdminGroupGroup> admingroupGroupList(Long id){
		return AdminGroupGroup.adminGroupGroupDao.find("select * from t_admingroup_group where fadmingroupid = " + id);
	}
	
	public static int delAdmingroupByGroupId(Long id){
		return Db.update("delete from t_admingroup_group where fadmingroupid = " + id);
	}
	
	public static List<AdminGroup> selectAdminGroupEntityList(){
		return AdminGroup.adminGroupDao.find("select * from t_admingroup");
	}
}
