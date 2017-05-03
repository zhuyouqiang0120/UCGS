/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-11-12 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.entity.Area;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-11-12下午5:27:07
 * @remark
 */
public class AreaDao {
	
	public static boolean save(Area area){
		Integer sort = getMaxSort(area.getInt("flevel"), area.getStr("fparentguid"));
		area.set("fsortnumber", null == sort?1:sort + 1);
		return area.save();
	}

	public static Integer getMaxSort(int level,String parentGuid){
		return Db.queryInt("select max(fsortnumber) from t_area where flevel = ? and fparentguid = ?",level,parentGuid);
	}
	
	public static boolean checkPermission(List<Record> list,String areaGuid){
		boolean result = false;
		if(!StringUtils.hasText(areaGuid) || null == list) return result;
		 
		for(int i = 0,len = list.size();i < len;i++){
			if(list.get(i).getStr("fguid").equals(areaGuid) &&
					StringUtils.hasText(list.get(i).getStr("required")) &&
					list.get(i).getStr("required").equals("allow")){
				result = true;
				break;
			}
		}
		
		return result;
	}
	/**
	 * @Tag       : 获取可操作区域列表
	 * @createTime: 2016年3月3日 下午1:28:10
	 * @author    : Chason.x
	 */
	public static List<Record> getHasAreaList(String pAreaGuid,int systemRoleGroup){
		List<Record> list = Db.find("select a.*,m.fadminname from t_area a INNER JOIN t_adminuser m on a.fadminguid = m.fguid");
		/*
		 * 设置登录角色允许管理自己角色所在区域和其子区域  管理员除外
		 */
		for(int i = 0,len = list.size();i < len;i++){
			if(systemRoleGroup == 0 && list.get(i).getStr("fguid").equals(pAreaGuid)){
				list.get(i).set("required", "allow");
				changeChildList(list, list.get(i).getStr("fguid"));
			}else if(systemRoleGroup == 1){
				list.get(i).set("required", "allow");
			}
		}
		return list;
	}
	
	/**
	 * @Tag       : 获取所有可操作的区域GUID
	 * @createTime: 2016年3月3日 下午1:42:42
	 * @author    : Chason.x
	 */
	public static List<String> getHasAreaGuidList(String pAreaGuid,int systemRoleGroup){
		List<Record> list = Db.find("select a.*,m.fadminname from t_area a INNER JOIN t_adminuser m on a.fadminguid = m.fguid");
		/*
		 * 设置登录角色允许管理自己角色所在区域和其子区域  管理员除外
		 */
		for(int i = 0,len = list.size();i < len;i++){
			if(systemRoleGroup == 0 && list.get(i).getStr("fguid").equals(pAreaGuid)){
				list.get(i).set("required", "allow");
				changeChildList(list, list.get(i).getStr("fguid"));
			}else if(systemRoleGroup == 1){
				list.get(i).set("required", "allow");
			}
		}
		List<String> areaGuid = new ArrayList<String>();
		for(int i = 0,len = list.size();i < len;i++){
			if(null != list.get(i).getStr("required") && list.get(i).getStr("required").equals("allow"))
				areaGuid.add(list.get(i).getStr("fguid"));
		}
		return areaGuid;
	}
	
	private static void changeChildList(List<Record> data,String parentGuid){
		for(int i = 0,len = data.size();i < len;i ++){
			if(null != data.get(i).getStr("fparentguid") && data.get(i).getStr("fparentguid").equals(parentGuid)){
				data.get(i).set("required", "allow");
				changeChildList(data, data.get(i).getStr("fguid"));
			}
		}
	}
	
	
	public static List<Record> getHadAreaList(String userGuid,int admin){
		List<Record> list = null;
		if(admin == 1) list = Db.find("select * from t_area");
		else list = Db.find("select a.* from t_area a inner join t_admin_auth t on a.fguid = t.ftargetauthguid where t.fuserguid = ? and t.ftype = ?",userGuid,Constant.AuthTypes.area.toString());
		
		if(!list.isEmpty()){
			for(int i = 0,len = list.size();i < len;i++){
				list.get(i).set("required", "allow");
			}
		}
		return list;
	}
	
	
}
