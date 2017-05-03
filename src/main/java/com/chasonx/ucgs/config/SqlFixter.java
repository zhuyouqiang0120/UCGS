/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.config								 
 **    Type    Name : SqlFixter 							     	
 **    Create  Time : 2017年3月2日 上午11:10:23								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.config;

import java.util.HashMap;
import java.util.Map;

import com.chasonx.tools.StringUtils;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.TableMapping;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月2日上午11:10:23
 * @version 1.0 
 */
public class SqlFixter {

	@SuppressWarnings("rawtypes")
	private Class<? extends Model> model = null;
	private Map<String, Object> paramMap = null;
	
	@SuppressWarnings("rawtypes")
	public SqlFixter setModel(Class<? extends Model> model){
		this.model = model;
		return this;
	}
	
	public SqlFixter addParam(String field,Object value){
		if(paramMap == null) paramMap = new HashMap<String, Object>();
		paramMap.put(field, value);
		return this;
	}
	
	public String toString(){
		StringBuilder sb = new StringBuilder("select * from " + TableMapping.me().getTable(model).getName());
		sb.append(" where 1 = 1");
		if(null != paramMap){
			String[] vals;
			for(String k : paramMap.keySet()){
				vals = paramMap.get(k).toString().split("\\|");
				if(vals.length < 3) continue;
				sb.append(vals[0].replaceAll("(&){1}", " and ").replaceAll("(@){1}", " or "));
				if(vals[1].equalsIgnoreCase("between")){
					String[] bet = vals[2].split("$");
					sb.append(k + " " + vals[1] + "'" + bet[0] + "' and '" + bet[1] + "' ");
				}else{
					sb.append(k + " " + vals[1] + " ");
				}
				if(vals[1].equalsIgnoreCase("in")) sb.append("(" + StringUtils.join(vals[2].split(","), ",")+")");
				else sb.append("'" + vals[2] + "'");
			}
		}
		return sb.toString();
	}
}
