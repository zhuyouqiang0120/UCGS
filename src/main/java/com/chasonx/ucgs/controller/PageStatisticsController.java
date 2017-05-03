/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : PageStatisticsController 							     	
 **    Create  Time : 2017年3月7日 上午11:06:11								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.common.SystemStatistics;
import com.chasonx.ucgs.config.PageUtil;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月7日上午11:06:11
 * @version 1.0 
 */
public class PageStatisticsController extends Controller {
	
	private static SqlKit kit = new SqlKit("Statistics.xml");

	public void index(){
		render(PageUtil.PAGE_STATISTICS);
	}
	
	public void dataCheckForWeek(){  
		//主题总访问量，独立IP访问，日访问量
		long startTime = System.currentTimeMillis();
		List<Record> dataList = Db.find(kit.loadSqlData("statisticsForWeek"));
		
		Record result = new Record();
		List<String> date = new ArrayList<String>();
		List<Long> pvSize = new ArrayList<Long>();
		List<Long> ipSize = new ArrayList<Long>();
		List<Long> pSize = new ArrayList<Long>();
		List<Long> pSiteSize = new ArrayList<Long>();
		if(!dataList.isEmpty()){
			int len = dataList.size();
			for(int i = (len - 1);i >= 0;i--){
				date.add(dataList.get(i).getStr("PDate"));
				pvSize.add(dataList.get(i).getLong("PVSize"));
				ipSize.add(dataList.get(i).getLong("IPSize"));
				pSiteSize.add(dataList.get(i).getLong("PSiteSize"));
				pSize.add(dataList.get(i).getLong("PSize"));
			}
		}
		result.set("PDate", date)
		.set("PVSize", pvSize)
		.set("IPSize", ipSize)
		.set("PSize", pSize)
		.set("PSiteSite", pSiteSize)
		.set("Elapsed", (System.currentTimeMillis() - startTime));
		renderJson(result);
	}
	
	public void dataCheckForDevice(){
		long startTime = System.currentTimeMillis();
		List<Record> deviceCount = Db.find(kit.loadSqlData("statisticsDevicBeforeValDay"),dateCalenderMinuter(30));
		List<String> legend = new ArrayList<String>();
		if(!deviceCount.isEmpty()){
			for(Record r : deviceCount)
				legend.add(r.getStr("name"));
		}
		renderJson(new Record().set("Legend", legend).set("Data", deviceCount).set("Elapsed", (System.currentTimeMillis() - startTime)));
	}
	
	public void dataCheckForOSType(){
		long startTime = System.currentTimeMillis();
		List<Record> osCount = Db.find(kit.loadSqlData("statisticsOSNameBeforeValDay"), dateCalenderMinuter(30));
		List<String> legend = new ArrayList<String>();
		if(!osCount.isEmpty()){
			for(Record r : osCount)
				legend.add(r.getStr("name"));
		}
		renderJson(new Record().set("Legend", legend).set("Data", osCount).set("Elapsed", (System.currentTimeMillis() - startTime)));
	}
	
	public void dataCheckForBrowser(){
		long startTime = System.currentTimeMillis();
		List<Record> browser = Db.find(kit.loadSqlData("statisticsBrowserBeforValDay"),dateCalenderMinuter(30));
		List<String> legend = new ArrayList<String>();
		if(!browser.isEmpty()){
			for(Record r : browser)
				legend.add(r.getStr("name"));
		}
		renderJson(new Record().set("Legend", legend).set("Data", browser).set("Elapsed", (System.currentTimeMillis() - startTime)));
	}
	
	public void topicStatistics(){
		long startTime = System.currentTimeMillis();
		Integer limit = getParaToInt("limit");
		List<Record> list = Db.find(kit.loadSqlData("statisticsTopicLimit"),limit);
		renderJson(new Record().set("List", list).set("Elapsed", (System.currentTimeMillis() - startTime)));
	}
	
	
	public void allTopicDataStatistics(){
		long startTime = System.currentTimeMillis();
		List<Record> list = Db.find(kit.loadSqlData("statisticsAllTopicData"));
		String startDate = Db.queryStr(kit.loadSqlData("statisticsStartDate"));
		@SuppressWarnings("rawtypes")
		List<List> result = new  ArrayList<List>();
		if(!list.isEmpty()){
			for(int i = 0,len = list.size();i < len;i++)
				result.add(Arrays.asList(list.get(i).getStr("PDate"),list.get(i).getLong("PVSize")));
		}
		renderJson(new Record().set("List", result).set("Elapsed", (System.currentTimeMillis() - startTime)).set("StartDate", startDate));
	}
	
	public void topicDetail(){
		long startTime = System.currentTimeMillis();
		String date = getPara("date");
		Record result = new Record();
		if(StringUtils.hasText(date)){
			Record attr = Db.findFirst(kit.loadSqlData("statisticsTopicAttrByDay"),date);
			List<Record> topList = Db.find(kit.loadSqlData("statisticsTopicLimitByDay"),date);
			List<Record> deviceList = Db.find(kit.loadSqlData("statisticsTopicDeviceByDay"),date);
			List<Record> osnameList =  Db.find(kit.loadSqlData("statisticsTopicOSNameByDay"),date);
			List<Record> browser = Db.find(kit.loadSqlData("statisticsTopicBrowserByDay"),date);
			result.set("Attr", attr)
			.set("TopList", topList)
			.set("Device", deviceList)
			.set("OSName", osnameList)
			.set("Browser", browser);
		}
		result.set("Elapsed", (System.currentTimeMillis()  - startTime));
		renderJson(result);
	}
	
	public void topicTimeDetail(){
		long startTime = System.currentTimeMillis();
		String date = getPara("date");
		Record result = new Record();
		if(StringUtils.hasText(date)){
			@SuppressWarnings("rawtypes")
			List<List> list = new ArrayList<List>();
			List<Record> data = Db.find(kit.loadSqlData("statisticsTopicTimeDetail"),date);
			for(int i = 0,ilen = data.size();i < ilen;i++){
				if(i == 0) result.set("startVal", data.get(i).getStr("PTime"));
				list.add(Arrays.asList(data.get(i).getStr("PTime"),data.get(i).getLong("PSize")));
			}
			result.set("List", list);
		}
		result.set("Elapsed", (System.currentTimeMillis() - startTime));
		renderJson(result);
	}
	
	public void columnStatistics(){
		long startTime = System.currentTimeMillis();
		List<Record> data = Db.find(kit.loadSqlData("statisticsColumn"));
		Record result = new Record();
		if(!data.isEmpty()){
			@SuppressWarnings("rawtypes")
			List<List> list = new ArrayList<List>();
			int len = data.size() - 1;
			for(int i = len;i >= 0;i --){
				list.add(Arrays.asList(data.get(i).getStr("CName"),data.get(i).getLong("ColumnSize"),data.get(i).getStr("CGuid")));
			}
			result.set("List", list);
		}
		result.set("Elapsed", (System.currentTimeMillis() - startTime));
		renderJson(result);
	}
	
	public void columnStatisticsDetail(){
		long startTime = System.currentTimeMillis();
		String guid = getPara("guid");
		Record result = new Record();
		List<Record> data = Db.find(kit.loadSqlData("statisticsColumnDetail"),guid);
		if(StringUtils.hasText(guid) && !data.isEmpty()){
			@SuppressWarnings("rawtypes")
			List<List> list = new ArrayList<List>();
			for(int i = 0,ilen = data.size();i < ilen;i ++){
				if(i == 0) result.set("startVal", data.get(i).getStr("name"));
				list.add(Arrays.asList(data.get(i).getStr("name"),data.get(i).getLong("value")));
			}
			result.set("List", list);
		}
		result.set("Elapsed", (System.currentTimeMillis() - startTime));
		renderJson(result);
	}
	
	public void siteStatistics(){
		long startTime = System.currentTimeMillis();
		String guid = getPara("guid");
		Record result = new Record();
		List<Record> data = Db.find(kit.loadSqlData("siteStatistics", new Record().set("siteGuid", guid)));
		if(!data.isEmpty()){
			@SuppressWarnings("rawtypes")
			List<List> list = new ArrayList<List>();
			for(int i = 0,ilen = data.size();i < ilen;i++){
				if(i == 0) result.set("startVal", data.get(i).getStr("date"));
				if(StringUtils.hasText(guid))
					list.add(Arrays.asList(data.get(i).getStr("date"),data.get(i).getLong("value"),data.get(i).getStr("guid")));
				else 
					list.add(Arrays.asList(data.get(i).getStr("name"),data.get(i).getLong("value"),data.get(i).getStr("guid")));
			}
			result.set("List", list);
		}
		result.set("Elapsed", (System.currentTimeMillis() - startTime));
		renderJson(result);
	}
	
	public void topicLimitByParam(){
		long startTime = System.currentTimeMillis();
		String columnGuid = getPara("columnGuid");
		String siteGuid = getPara("siteGuid");
		Record result = new Record();
		Record param = new Record();
		param.set("columnGuid", columnGuid);
		param.set("siteGuid", siteGuid);
		result.set("List", Db.find(kit.loadSqlData("topicStatisticsByParam", param)));
		result.set("Elapsed", (System.currentTimeMillis()  - startTime));
		renderJson(result);
	}
	
	public void interStatistics(){
		long startTime = System.currentTimeMillis();
		String iName = getPara("iName");
		List<Record> data = Db.find(kit.loadSqlData("interfaceStatistics",new Record().set("iName", iName)));
		Record result = new Record();
		if(!data.isEmpty()){
			@SuppressWarnings("rawtypes")
			List<List> list = new ArrayList<List>();
			for(int i = 0,ilen = data.size();i < ilen;i++){
				if(i == 0) result.set("startVal", data.get(i).getStr("IDate"));
				if(StringUtils.hasText(iName)) list.add(Arrays.asList(data.get(i).getStr("IDate"),data.get(i).getLong("ISize")));
				else list.add(Arrays.asList(data.get(i).getStr("IName"),data.get(i).getLong("ISize")));
			}
			result.set("List", list);
		}
		result.set("Elapsed", (System.currentTimeMillis() - startTime));
		renderJson(result);
	}
	
	public void ipCaller(){
		long startTime = System.currentTimeMillis();
		String iName = getPara("iName");
		String iDate = getPara("iDate");
		List<Record> data = Db.find(kit.loadSqlData("ipCallerStatistics",new Record().set("iName", StringUtils.hasText(iName)?iName:null).set("iDate", StringUtils.hasText(iDate)?iDate:null)));
		renderJson(new Record().set("List", data).set("Elapsed", (System.currentTimeMillis() - startTime)));
	}
	
	private static String dateCalenderMinuter(int val){
		Date nowDate = new Date();
		Calendar ca = Calendar.getInstance();
		ca.setTime(nowDate);
		ca.set(Calendar.DATE, ca.get(Calendar.DATE) - 30);
		return new SimpleDateFormat("yyyy-MM-dd").format(ca.getTime());
	}
	
	public void system(){
		render(PageUtil.SYSTEM_STATISTICS);
	}
	
	public void systemStatistics(){
		long startTime = System.currentTimeMillis();
		String[] dateStr = DateFormatUtil.formatString("yyyy-MM-dd HH:mm:ss").split(" ");
		Record result = new Record();
		result.set("Elapsed", (System.currentTimeMillis() - startTime));
		result.set("Date", dateStr[0])
		.set("Time", dateStr[1])
		.set("List", SystemStatistics.getTopData());
		renderJson(result);
	}
}
