/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.dao								 
 **    Type    Name : DocDao 							     	
 **    Create  Time : 2017年12月15日 下午3:06:10								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.dao;

import com.alibaba.fastjson.JSONObject;
import com.chasonx.tools.Des3;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.entity.TConfig;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年12月15日下午3:06:10
 * @version 1.0 
 */
public class DocDao {

	public static JSONObject getAuthCode() throws Exception{
		String key = PublicDao.getFieldStr("remotehost", " and filetype = '"+ Constant.Config.DocFactory.toString() +"'", TConfig.class);
		if(StringUtils.hasText(key)){
			long st = System.currentTimeMillis();
			JSONObject json = new JSONObject();
			json.put("key",  Des3.encrypt(st + "", key, null) );
			json.put("_st", st);
			json.put("_cname", SystemConstant.SYS_CODE);
			return json;
		}
		return null;
	}
}
