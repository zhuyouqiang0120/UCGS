/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.config								 
 **    Type    Name : ExtQuartz 							     	
 **    Create  Time : 2017年3月1日 下午2:59:05								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.config;

import com.jfinal.ext.plugin.quartz.QuartzPlugin;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月1日下午2:59:05
 * @version 1.0 
 */
public class ExtQuartz {

	private String className;
	private QuartzPlugin plugin;
	/**
	 * @return the className
	 */
	public String getClassName() {
		return className;
	}
	/**
	 * @param className the className to set
	 */
	public ExtQuartz setClassName(String className) {
		this.className = className;
		return this;
	}
	/**
	 * @return the plugin
	 */
	public QuartzPlugin getPlugin() {
		return plugin;
	}
	/**
	 * @param plugin the plugin to set
	 */
	public ExtQuartz setPlugin(QuartzPlugin plugin) {
		this.plugin = plugin;
		return this;
	}
	
}
