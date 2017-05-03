/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.dao								 
 **    Type    Name : DeviceDao 							     	
 **    Create  Time : 2016年11月23日 下午1:08:12								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2016 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.dao;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.chasonx.tools.StringUtils;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2016年11月23日下午1:08:12
 * @version 1.0 
 */
public class DeviceDao {

	public static boolean syncDeviceList(String data,String dgGuid){
		if(!StringUtils.hasText(data)) return false;
		try {
			JSONObject obj = new JSONObject(data);
			JSONArray array = obj.getJSONArray("data");
			StringBuffer sb = new StringBuffer(100);
			sb.append("insert into t_devices(areacode,groupId,channelId,channelName,deviceId,)");
			for(int i = 0,len = array.length();i < len;i++){
				
			}
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return true;
	}
}
