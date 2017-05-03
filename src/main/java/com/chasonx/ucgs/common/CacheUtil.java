/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.common								 
 **    Type    Name : CacheUtil 							     	
 **    Create  Time : 2017年3月1日 下午3:56:31								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import java.util.List;

import com.chasonx.ucgs.config.ExtQuartz;
import com.jfinal.ext.plugin.quartz.QuartzPlugin;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月1日下午3:56:31
 * @version 1.0 
 */
public class CacheUtil {

	public static QuartzPlugin getQuartzPlugin(String jobClass){
		List<ExtQuartz> quartzs = CacheKit.get(Constant.CACHE_DEF_NAME, Constant.CACHE_QUARTZ_NAME);
		QuartzPlugin plugin = null;
		for(ExtQuartz ext:quartzs){
			if(ext.getClassName().equals(jobClass)){
				plugin = ext.getPlugin();
				break;
			}
		}
		return  plugin;
	}
}
