/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-31 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.entity.ResourceEntity;
import com.jfinal.plugin.activerecord.Db;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月31日下午2:06:38
 * @remark
 */
public class ResourceDao {

	public static int saveRes(ResourceEntity entity){
		return entity.save()?1:0;
	}
	
	public static Long checkExist(String md5Code){
		return Db.queryLong("select count(*) from t_resource where fmd5code = ? and fdelete = 0 ",md5Code);
	}
	
	public static int delAllResourceBySiteGuid(String siteGuid){
		return Db.update("delete from t_resource where fsiteguid = ?",siteGuid);
	}
	
	public static int delResourceByGuidList(List<String> list){
		return Db.update("delete from t_resource where fguid in ("+ StringUtils.joinForList(list, ",") +")");
	}
}
