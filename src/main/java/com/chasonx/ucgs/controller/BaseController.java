/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : BaseController 							     	
 **    Create  Time : 2017年1月11日 下午3:42:34								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.TableMapping;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年1月11日下午3:42:34
 * @version 1.0 
 */
public abstract class BaseController extends Controller {

	@SuppressWarnings("rawtypes")
	public  String getTableName(Class<? extends Model> classes){
		return TableMapping.me().getTable(classes).getName();
	}
	
}
