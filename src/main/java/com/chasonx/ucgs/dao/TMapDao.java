/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年4月26日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.dao;

import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.entity.TMaps;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年4月26日 上午10:36:16
 * @remark 
 */
public class TMapDao {

	public static List<TMaps> getMaps(String ftargetGuid,String key){
		String sql = "select * from t_maps where 1 = 1 ";
		if(StringUtils.hasText(ftargetGuid)){
			sql += " and  ftargetguid = '"+ ftargetGuid +"'";
		}
		if(StringUtils.hasText(key)){
			sql += " and fkey = '"+ key +"'";
		}
		return TMaps.maps.find(sql);
	}
	
	public static int setValue(String targetGuid,String key,String value,Long id,int type){
		TMaps maps = TMaps.maps.findFirst("select * from t_maps where ftargetguid = ? and fkey = ?",targetGuid,key);
		if(maps != null && type == 1){
				return 2;
		}else if(type == 2){
			maps = TMaps.maps.findFirst("select * from t_maps where ftargetguid = ? and fkey = ? and id != ?",targetGuid,key,id);
			if(maps != null) 
				return 2;
			
			maps = new TMaps()
			.set("id", id)
			.set("fkey", key)
			.set("fvalue", value);
			return maps.update()?1:0;
		}
			
		maps = new TMaps()
		.set("ftargetguid", targetGuid)
		.set("fkey", key)
		.set("fvalue", value);
		return maps.save()?1:0;
	}
	
	public static int removeValue(long id){
		return TMaps.maps.deleteById(id)?1:0;
	}
	
}
