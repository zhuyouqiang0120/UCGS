/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-11-17 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;


import java.util.List;

import com.chasonx.ucgs.common.Constant;
import com.jfinal.plugin.activerecord.Db;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-11-17下午11:27:56
 * @remark
 */
public class SiteDao {

	public static int delPermission(Long admingroupid){
		return Db.update("delete from t_admingroup_site where fadmingroupid = ?",admingroupid);
	}
	
	public static int addPermissionBatch(String[] siteguid,String userGuid){
		StringBuffer sb = new StringBuffer("insert into t_admin_auth(ftargetauthguid,fuserguid,ftype) values");
		for(int i = 0,len = siteguid.length;i < len;i++){
			sb.append("('"+ siteguid[i] +"','"+ userGuid +"','"+ Constant.AuthTypes.site.toString() + "')");
			if(i < (len - 1)) sb.append(",");
		}
		return Db.update(sb.toString());
	}
	
	public static List<String> getSiteGuidByCreater(String createGuid){
		return Db.query("select fguid from t_site where fcreaterguid = ?",createGuid);
	}
}
