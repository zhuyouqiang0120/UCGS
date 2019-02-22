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
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.Tuple;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.common.SystemStatistics;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.dao.RedisDao;
import com.chasonx.ucgs.entity.Column;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.redis.Redis;

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
	
	private Jedis getJedis(){
		return Redis.use().getJedis();
	}
	
	public void dataCheckForWeek(){  
		//主题总访问量，独立IP访问，日访问量
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		
		Record Device,OSType,Browser;
		List<Double> pvSize = new ArrayList<Double>();
		List<Integer> pageSize = new ArrayList<Integer>();
		List<Integer> siteSize = new ArrayList<Integer>();
		List<Integer> ipSize = new ArrayList<Integer>();
		List<String> pvDate = RedisDao.getDatesByBeforeCurrentDate(7);
		
		try{
			Double _pvSize;
			for(String d : pvDate) {
				_pvSize = jd.zscore("pv_date", d);
				pvSize.add( _pvSize == null?0:_pvSize );
				pageSize.add(jd.zrange("pv_topic_" + d, 0, -1).size() );
				siteSize.add( jd.zrange("pv_site_" + d, 0, -1).size() );
				ipSize.add( jd.zrange("pv_ip_" + d, 0, -1).size() );
			}
			
			Device = getStatistics("pv_device_" ,pvDate, jd);
			OSType = getStatistics("pv_osname_", pvDate, jd);
			Browser = getStatistics("pv_browser_", pvDate, jd);
		}finally{
			jd.close();
		}
		Record rec = new Record();
		rec.set("PDate", pvDate).set("IPSize", ipSize).set("PVSize", pvSize).set("PSize", pageSize).set("PSiteSite", siteSize);
		
		Record ret = new Record();
		ret.set("WeekData", rec);
		ret.set("Device", Device);
		ret.set("OSType", OSType);
		ret.set("Browser", Browser);
		ret.set("Elapsed", (System.currentTimeMillis() - st));
		
		renderJson(ret);
		
/*	Mysql 统计性能堪忧，改用Redis		
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
		*/
		
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
		long st = System.currentTimeMillis();
		Integer limit = getParaToInt("limit");
		Jedis jd = getJedis();
		List<Record> data = new ArrayList<Record>();
		
		try{
			Set<Tuple> page = jd.zrevrangeWithScores("pv_topic", 0, limit);
			Iterator<Tuple> ite = page.iterator();
			Tuple t;
			Record r;
			while(ite.hasNext()){
				t = ite.next();
				r = new Record();
				r.set("Guid", t.getElement());
				r.set("TopicSize", t.getScore());
				r.set("Title", jd.hget("pv_topic_title", t.getElement()) );
				data.add(r);
			}
		}finally{
			jd.close();
		}
		Record rec = new Record();
		rec.set("Elapsed",(System.currentTimeMillis() - st) );
		rec.set("List", data);
		renderJson(rec);
		
/*	Mysql方式统计	
		List<Record> list = Db.find(kit.loadSqlData("statisticsTopicLimit"),limit);
		renderJson(new Record().set("List", list).set("Elapsed", (System.currentTimeMillis() - startTime)));
		*/
	}
	
	
	public void allTopicDataStatistics(){
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		List<String> dates = RedisDao.getDatesByBeforeCurrentDate(30);
		List<Object[]> list = new ArrayList<Object[]>();
		try{
			Double pvCount;
			for(int i = 0,len = dates.size(); i < len; i++){
				pvCount = jd.zscore("pv_topic_count_" + dates.get(i), "topicView");
				list.add(new Object[]{dates.get(i), pvCount == null?0:pvCount });
			}
		}finally{
			jd.close();
		}
		
		Record rec = new Record();
		rec.set("StartDate", dates.get(0));
		rec.set("List", list);
		rec.set("Elapsed", (System.currentTimeMillis() - st));
		renderJson(rec);
/*	Mysql方式统计	
		List<Record> list = Db.find(kit.loadSqlData("statisticsAllTopicData"));
		String startDate = Db.queryStr(kit.loadSqlData("statisticsStartDate"));
		@SuppressWarnings("rawtypes")
		List<List> result = new  ArrayList<List>();
		if(!list.isEmpty()){
			for(int i = 0,len = list.size();i < len;i++)
				result.add(Arrays.asList(list.get(i).getStr("PDate"),list.get(i).getLong("PVSize")));
		}
		renderJson(new Record().set("List", result).set("Elapsed", (System.currentTimeMillis() - startTime)).set("StartDate", startDate));
*/		
	}
	
	public void topicDetail(){
		long st = System.currentTimeMillis();
		String date = getPara("date");
		Jedis jd = getJedis();
		List<Record> _tData = new ArrayList<Record>();
		
		Record OSName,Device,Browser;
		int ipSize = 0,topicSize = 0;
		
		try{
			Set<Tuple> topicList = jd.zrevrangeWithScores("pv_topic_" + date, 0, 10);
			
			Iterator<Tuple> ite = topicList.iterator();
			Tuple t;
			Record _topic;
			while(ite.hasNext()){
				t = ite.next();
				_topic = new Record();
				_topic.set("Title", jd.hget("pv_topic_title", t.getElement()));
				_topic.set("Guid", t.getElement());
				_topic.set("TopicSize", t.getScore());
				_tData.add(_topic);
			}
			ipSize = jd.zrange("pv_ip_" + date, 0, -1).size();
			topicSize = jd.zrange("pv_topic_" + date, 0, -1).size();
			
			List<String> _date = Arrays.asList(date);
			OSName =  getStatistics("pv_osname_",_date , jd);
			Device = getStatistics("pv_device_", _date, jd);
			Browser =  getStatistics("pv_browser_", _date, jd);
			
		}finally{
			jd.close();
		}
		
		Record rec = new Record();
		rec.set("TopList", _tData);
		rec.set("OSName", OSName);
		rec.set("Device", Device);
		rec.set("Browser", Browser);
		rec.set("Attr", new Record().set("IPSize", ipSize).set("PSize", topicSize));
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		renderJson(rec);
/*	Mysql方式统计	
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
*/		
	}
	
	public void topicTimeDetail(){
		long st = System.currentTimeMillis();
		String date = getPara("date");
		Jedis jd = getJedis();
		
		List<Integer> time = new ArrayList<Integer>();
		List<Object[]> data = new ArrayList<Object[]>();
		
		try{
			Set<Tuple> topicList = jd.zrevrangeWithScores("pv_topic_time_" + date, 0, -1);
			Iterator<Tuple> ite = topicList.iterator();
			Map<String, Double> timeMap = new HashMap<String, Double>();
		
			Tuple t;
			int _time;
			while(ite.hasNext()){
				t = ite.next();
				_time = Integer.parseInt(t.getElement());
				timeMap.put("_" + _time, t.getScore());
				time.add(_time);
			}
			Collections.sort(time);
			
			for(int i = 0,len = time.size();i < len;i++){
				data.add(new Object[]{time.get(i).toString(),timeMap.get("_" + time.get(i))});
			}
		}finally{
			jd.close();
		}
		Record rec = new Record();
		rec.set("starVal", time.get(0).toString());
		rec.set("List", data);
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		renderJson(rec);
/*	Mysql方式统计	
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
		*/
	}
	
	public void columnStatistics(){
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		
		List<Object[]> data = new ArrayList<Object[]>();
		try{
			Set<Tuple> cols = jd.zrevrangeWithScores("pv_global_column", 0, 30);
			List<Tuple> listCols = new ArrayList<Tuple>();
			listCols.addAll(cols);
			
			Collections.sort(listCols);
			
			List<String> cGuids = new ArrayList<String>();
			for(int i = 0,len = listCols.size(); i < len;i++){
				if(StringUtils.hasText(listCols.get(i).getElement()))
					cGuids.add(listCols.get(i).getElement());
			}
			
			List<Record> columns = Db.find("select fguid,fservicename from "+ PublicDao.getTableName(Column.class) +" where fguid in("+ StringUtils.joinForList(cGuids, ",") +")");
			
			int i,j,ilen,jlen = columns.size();
			Tuple _tTuple;
			for(i = 0,ilen = listCols.size();i < ilen;i++){
				_tTuple = listCols.get(i);
				for(j = 0;j < jlen;j++){
					if(_tTuple.getElement().equals(columns.get(j).getStr("fguid")))
						data.add(new Object[]{columns.get(j).getStr("fservicename"),_tTuple.getScore(),columns.get(j).getStr("fguid")});
				}
			}
		}finally{
			jd.close();
		}
		
		Record rec = new Record();
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		rec.set("List", data);
		renderJson(rec);
				
/*	Mysql方式统计		
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
*/		
	}
	
	public void scStatisticsDetail(){
		long st = System.currentTimeMillis();
		String guid = getPara("guid");
		Jedis jd = getJedis();
		
		List<String> dates = null;
		List<Object[]> data = null;
		try{
			int type = getParaToInt("type");
			type = (type > 2 || type < 0)? 0 : type;
			String[] key = new String[]{ "pv_column_", "pv_site_","pv_interface_"};
			
			dates = RedisDao.getDatesByBeforeCurrentDate(30);
			data = new ArrayList<Object[]>();
			
			Double score;
			for(int i = 0,len = dates.size();i < len;i++){
				score = jd.zscore(key[type] + dates.get(i), guid);
				data.add(new Object[]{ dates.get(i), score != null?score : 0 });
			}
		}finally{
			jd.close();
		}
		Record rec = new Record();
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		rec.set("starVal", dates.get(0));
		rec.set("List", data);
		renderJson(rec);
/*	Mysql方式统计			
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
*/		
	}
	
	public void siteStatistics(){
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		List<Object[]> data = new ArrayList<Object[]>();
		try{
			Set<Tuple> sites =  jd.zrevrangeWithScores("pv_global_site", 0, 30);
			List<Tuple> listSite = new ArrayList<Tuple>();
			listSite.addAll(sites);
			Collections.sort(listSite);
			
			List<String> siteGuid = new ArrayList<String>();
			for(int i = 0,len = listSite.size();i < len ;i++){
				if(StringUtils.hasText(listSite.get(i).getElement()))
					siteGuid.add(listSite.get(i).getElement());
			}
			
			List<Record> recSites = Db.find("select fguid,fsitename from t_site where fguid in ("+ StringUtils.joinForList(siteGuid, ",") + ") ");
			
			int i,j,ilen = listSite.size(),jlen = recSites.size();
			Tuple _t;
			for(i = 0;i < ilen;i++){
				_t = listSite.get(i);
				for(j = 0;j < jlen;j++){
					if(_t.getElement().equals(recSites.get(j).getStr("fguid")))
						data.add(new Object[]{ recSites.get(j).getStr("fsitename"),_t.getScore(),_t.getElement() });
				}
			}
			
 		}finally{
			jd.close();
		}
		
		Record rec = new Record();
		rec.set("List", data);
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		renderJson(rec);
		
/*	Mysql方式统计	
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
*/		
	}
	
	public void topicLimitByParam(){
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		String p = getPara();
		List<Record> data = new ArrayList<Record>();
		try{
			Set<Tuple> topics = jd.zrevrangeWithScores("pv_topic_" + p, 0, 10);
			List<Tuple> listTopics = new ArrayList<Tuple>();
			listTopics.addAll(topics);
			Collections.sort(listTopics);
			
			Record _topic;
			Tuple t;
			for(int i = listTopics.size() - 1;i >= 0;i --){
				t = listTopics.get(i);
				if(StringUtils.hasText(t.getElement())){
					_topic = new Record();
					_topic.set("Title", jd.hget("pv_topic_title", t.getElement()));
					_topic.set("Guid", t.getElement());
					_topic.set("TopicSize", t.getScore());
					data.add(_topic);
				}
			}
		}finally{
			jd.close();
		}
		Record rec = new Record();
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		rec.set("List", data);
		renderJson(rec);
		
/*	Mysql方式统计	
		String columnGuid = getPara("columnGuid");
		String siteGuid = getPara("siteGuid");
		Record result = new Record();
		Record param = new Record();
		param.set("columnGuid", columnGuid);
		param.set("siteGuid", siteGuid);
		result.set("List", Db.find(kit.loadSqlData("topicStatisticsByParam", param)));
		result.set("Elapsed", (System.currentTimeMillis()  - startTime));
		renderJson(result);
*/		
	}
	
	public void interStatistics(){
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		List<Object[]> data = new ArrayList<Object[]>();
		try{
			Set<Tuple> inters = jd.zrevrangeWithScores("pv_global_interface",0,30);
			List<Tuple> listInter = new ArrayList<Tuple>();
			listInter.addAll(inters);
			Collections.sort(listInter);
			for(int i = 0,len = listInter.size(); i < len;i++){
				data.add(new Object[]{ listInter.get(i).getElement(),listInter.get(i).getScore() });
			}
			
		}finally{
			jd.close();
		}
		Record rec = new Record();
		rec.set("List", data);
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		renderJson(rec);
/*	Mysql方式统计		
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
*/		
	}
	
	public void ipCaller(){
		long st = System.currentTimeMillis();
		Jedis jd = getJedis();
		List<Record> data = new ArrayList<Record>();
		try{
			String inter = getPara();
			Set<Tuple> ips = jd.zrevrangeWithScores("pv_interface_" + inter, 0, 100);
			List<Tuple> listIps = new ArrayList<Tuple>();
			listIps.addAll(ips);
			Collections.sort(listIps);
			
			Record rec;
			for(int i = listIps.size() - 1;i >= 0;i--){
				rec = new Record();
				rec.set("IP", listIps.get(i).getElement());
				rec.set("Size", listIps.get(i).getScore());
				rec.set("Data", jd.hget("pv_interface_caller", listIps.get(i).getElement()));
				data.add(rec);
			}
		}finally{
			jd.close();
		}
		
		Record rec = new Record();
		rec.set("List", data);
		rec.set("Elapsed", (System.currentTimeMillis() - st) );
		renderJson(rec);
		
/*	Mysql方式统计		
		String iName = getPara("iName");
		String iDate = getPara("iDate");
		List<Record> data = Db.find(kit.loadSqlData("ipCallerStatistics",new Record().set("iName", StringUtils.hasText(iName)?iName:null).set("iDate", StringUtils.hasText(iDate)?iDate:null)));
		renderJson(new Record().set("List", data).set("Elapsed", (System.currentTimeMillis() - startTime)));
*/		
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
	
	
	private Record getStatistics(String filed,List<String> dates,Jedis jr){
		Map<String, Double> data = new HashMap<String, Double>();
		Iterator<Tuple> ite;
		Tuple t;
		
		for(int i = 0,len = dates.size();i < len;i++){
		
			ite = jr.zrangeWithScores(filed + dates.get(i) , 0, -1).iterator();
			while(ite.hasNext()){
				t = ite.next();
				if(data.containsKey(t.getElement())){
					data.put(t.getElement(), data.get(t.getElement()) + t.getScore());
				}else{
					data.put(t.getElement(), t.getScore());
				}
			}
		}
		
		Iterator<String> keys = data.keySet().iterator();
		List<Record> _Data = new ArrayList<Record>();
		List<String> legend = new ArrayList<String>();
		String k;
		while(keys.hasNext()){
			k = keys.next();
			legend.add(k);
			_Data.add(new Record().set("name", k).set("value", data.get(k)));
		}
		
		Record rec = new Record();
		rec.set("Legend", legend).set("Data", _Data);
		return rec;
	}
}
