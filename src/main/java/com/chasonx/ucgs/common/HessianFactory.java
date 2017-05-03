/**********************************************************************
 **********************************************************************
 **    Project Name : UBAS-SERVICE
 **    Package Name : com.zens.ubasservice.common								 
 **    Type    Name : HessianFactory 							     	
 **    Create  Time : 2016年9月19日 下午1:32:28								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2016 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import java.net.MalformedURLException;

import com.caucho.hessian.client.HessianProxyFactory;

/**Hessian客户端调用通用方法
 * @author  Chasonx
 * @email   xzc@zensvision.om
 * @create  2016年9月19日下午1:32:28
 * @version 1.0 
 */
public class HessianFactory {

	@SuppressWarnings("unchecked")
	public static <T> T create(Class<T> classes,String url) throws MalformedURLException{
		HessianProxyFactory factory = new HessianProxyFactory();
		return (T) factory.create(classes, url);
	}
}
