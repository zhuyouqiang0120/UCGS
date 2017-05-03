/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-11-25 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.List;

import com.chasonx.ucgs.common.Constant;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-11-25上午11:41:06
 * @remark
 */
public class BadWordDao {

	public static List<Record> getBadWordList(Integer state){
		String sql = "select * from t_badword where 1 = 1";
		if(null != state) sql += " and fstate = " + state;
		return Db.findByCache(Constant.CACHE_DEF_NAME, "badword", sql);
	}
}
