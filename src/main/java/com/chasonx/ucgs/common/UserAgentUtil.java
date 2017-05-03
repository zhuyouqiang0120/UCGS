/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.common								 
 **    Type    Name : UserAgentUtil 							     	
 **    Create  Time : 2017年3月3日 上午11:31:30								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import java.io.IOException;

import cz.mallat.uasparser.OnlineUpdater;
import cz.mallat.uasparser.UASparser;
import cz.mallat.uasparser.UserAgentInfo;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月3日上午11:31:30
 * @version 1.0 
 */
public class UserAgentUtil {

	static UASparser parse;
	static{
		try {
			parse = new UASparser(OnlineUpdater.getVendoredInputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public static UserAgentInfo getUAinfo(String userAgent) throws IOException{
		return parse.parse(userAgent);
	}
}
