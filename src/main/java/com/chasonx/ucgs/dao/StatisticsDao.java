/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.dao								 
 **    Type    Name : StatisticsDao 							     	
 **    Create  Time : 2017年3月2日 下午4:17:05								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.dao;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.UserAgentUtil;
import com.chasonx.ucgs.entity.PageStatistics;
import com.jfinal.plugin.ehcache.CacheKit;
import cz.mallat.uasparser.UserAgentInfo;


/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月2日下午4:17:05
 * @version 1.0 
 */
public class StatisticsDao {

	public static int CURRENT_VERSION = 1;
	/**
	 * 访问记录缓存
	 * @author chasonx
	 * @create 2017年3月2日 下午4:17:43
	 * @update
	 * @param  
	 * @return boolean
	 * @throws IOException 
	 */
	public static boolean cacheStatisticsData(HttpServletRequest req,String topicGuid,String siteGuid,String columnGuid,String title,long startTime,int type) throws IOException{
		try{
			
			UserAgentInfo info = UserAgentUtil.getUAinfo(req.getHeader("User-Agent"));
			String[] date = DateFormatUtil.formatString("yyyy-MM-dd HH:mm:ss").split(" ");
			
			PageStatistics page = new PageStatistics();
			page.set("ftopicguid", topicGuid != null?topicGuid:"")
			.set("fsiteguid", siteGuid != null?siteGuid:"")
			.set("fcolumnguid", columnGuid != null?columnGuid:"")
			.set("fip", req.getRemoteAddr())
			.set("ftype", type)
			.set("fbrowser", StringUtils.hasText( info.getUaName())?info.getUaName().replace(StringUtils.hasText(info.getBrowserVersionInfo())?info.getBrowserVersionInfo():"", "").trim():"")
			.set("fbroserversion", info.getBrowserVersionInfo())
			.set("fdevicetype", info.getDeviceType())
			.set("fosname", info.getOsName())
			.set("fosfamily", info.getOsFamily())
			.set("furl", req.getRequestURL())
			.set("fdate", date[0])
			.set("ftime", date[1])
			.set("felapsed", System.currentTimeMillis() - startTime);
			
//			Record ext = new Record();
//			ext.set("ip", req.getRemoteAddr())
//			.set("port", req.getRemotePort())
//			.set("uri", req.getRequestURI())
//			.set("url", req.getRequestURL())
//			.set("method", req.getMethod())
//			.set("contentlength", req.getContentLength())
//			.set("contentType", req.getContentType())
//			.set("cookie", req.getHeader("Cookie"))
//			.set("accept", req.getHeader("Accept"))
//			.set("accept-encoding", req.getHeader("Accept-Encoding"))
//			.set("accept-language", req.getHeader("Accept-Language"	))
//			.set("user-agent", req.getHeader("User-Agent"))
//			.set("request-time", (System.currentTimeMillis() - startTime))
//			.set("referer", req.getHeader("Referer"));
			
			page.set("fdata", title);
			
			List<PageStatistics> listPage = CacheKit.get(Constant.CACHE_PAGE_STATISTICS, Constant.CACHE_PAGE_STATISTICS + CURRENT_VERSION);
			if(listPage == null) listPage = new ArrayList<PageStatistics>();
			listPage.add(page);
			CacheKit.put(Constant.CACHE_PAGE_STATISTICS, Constant.CACHE_PAGE_STATISTICS + CURRENT_VERSION, listPage);
		}catch(Exception e){
			e.printStackTrace();
		}
		return true;
	}
}
