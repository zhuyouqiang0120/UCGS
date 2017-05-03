/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.common								 
 **    Type    Name : Bean 							     	
 **    Create  Time : 2017年4月13日 下午12:22:31								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.Table;
import com.jfinal.plugin.activerecord.TableMapping;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年4月13日下午12:22:31
 * @version 1.0 
 */
public class Bean {

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T> T getModel(HttpServletRequest request,Class<? extends Model> clazz){
		Map<String, String[]> paraMap = request.getParameterMap();
		if(paraMap.isEmpty()) return null;
		
		Record rec = new Record();
		for(String key : paraMap.keySet()){
			rec.set(key, paraMap.get(key)[0]);
		}
		
		Object model = null;
		try {
			model = clazz.newInstance();
		} catch (Exception e) {
			e.printStackTrace();
		} 
		if(model instanceof Model){
			setModelVal((Model)model, rec);
		}
		return (T)model;
	}
	
	private static void setModelVal(Model<?> model,Record rec){
		Table table = TableMapping.me().getTable(model.getClass());
		Class<?> otype;
		Map<String, Object> map = rec.getColumns();
		try{
			for(String key : map.keySet()){
				otype = table.getColumnType(key);
				if(otype != null){
					model.set(key,TypeConverter.convert(otype, map.get(key).toString()));
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
