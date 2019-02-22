/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.dao								 
 **    Type    Name : RedisDao 							     	
 **    Create  Time : 2017年11月15日 下午5:05:16								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.dao;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import redis.clients.jedis.Jedis;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.PageViewConstant;
import com.chasonx.ucgs.entity.PageStatistics;
import com.chasonx.ucgs.entity.TConfig;
import com.jfinal.plugin.redis.Cache;
import com.jfinal.plugin.redis.Redis;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年11月15日下午5:05:16
 * @version 1.0 
 */
public class RedisDao {
	
	/**
	 * 
	 * @author chasonx
	 * @create 2017年11月15日 下午5:10:20
	 * @update
	 * @param  
	 * @return List<String>
	 */
	public static List<String> getDatesByBeforeCurrentDate(int number){
		List<String> dates = new ArrayList<String>();
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar ca = Calendar.getInstance();
		Date date = new Date();
		for(int i = number - 1 ;i >= 0;i --){
			ca.setTime(date);
			ca.add(Calendar.DATE, i * -1);
			dates.add(format.format(ca.getTime()));
		}
		return dates;
	}

	/**
	 * 生命周期默认为30天
	 * @author chasonx
	 * @create 2017年11月21日 下午3:42:31
	 * @update
	 * @param  
	 * @return boolean
	 */
	public static boolean saveToRedis(List<PageStatistics> list) throws Exception{
		if(null == list || list.isEmpty()) return false;
		
		Cache che = Redis.use();
		
		PageStatistics p;
		Jedis jedis = che.getJedis();
		try{
			String curr_date;
			String[] curr_time;
			String tGuid,cGuid,sGuid,ip;
			String deadtime = PublicDao.getFieldStr("localdir", " and filetype = '"+ Constant.Config.DataCacheTime.toString() +"'", TConfig.class);
			deadtime = StringUtils.hasText(deadtime)?deadtime : 2592000 + "";
			int _dt = Integer.parseInt(deadtime);
			for(int i = 0,len = list.size();i < len;i++){
				p = list.get(i);
				curr_date = p.getStr("fdate");
				tGuid =  p.getStr("ftopicguid");
				cGuid =  p.getStr("fcolumnguid");
				sGuid = p.getStr("fsiteguid");
				ip = p.getStr("fip");
				
				if(p.getInt("ftype") == PageViewConstant.PageViewType){
					jedis.zincrby("pv_date", 1, curr_date); // 每天访问总量
					
					jedis.zincrby("pv_ip_" + curr_date ,1, ip ); // 每天独立iP访问量
					jedis.expire("pv_ip_" + curr_date, _dt);
					
					jedis.zincrby("pv_device_" + curr_date, 1, p.getStr("fdevicetype")); //每天设备访问量
					jedis.expire("pv_device_" + curr_date, _dt);
					
					jedis.zincrby("pv_osname_" + curr_date,1, p.getStr("fosname")); //每天操作系统数量
					jedis.expire("pv_osname_" + curr_date, _dt);
					
					jedis.zincrby("pv_browser_" + curr_date ,1 , p.getStr("fbrowser")); //每天浏览器数量
					jedis.expire("pv_browser_" + curr_date, _dt);
					
					jedis.zincrby("pv_site_" + curr_date , 1 , sGuid); //每天站点访问量
					jedis.expire("pv_site_" + curr_date, _dt);
					
					jedis.zincrby("pv_column_" + curr_date ,1 , cGuid); //每天栏目访问量
					jedis.expire("pv_column_" + curr_date, _dt);
					
					jedis.zincrby("pv_global_column", 1, cGuid); //栏目访问总量
					jedis.zincrby("pv_global_site", 1, sGuid); //站点访问总量
					
					if(StringUtils.hasText(tGuid)){
						curr_time = p.getStr("ftime").split(":");
						jedis.hset("pv_topic_title", tGuid , p.getStr("fdata")); //文章标题
						
						jedis.zincrby("pv_topic_count_" + curr_date, 1, "topicView"); //每天主题访问总量
						jedis.expire("pv_topic_count_" + curr_date, _dt);
						
						jedis.zincrby("pv_topic_" + curr_date, 1, tGuid); //每天主题访问量
						jedis.expire("pv_topic_" + curr_date, _dt);
						
						jedis.zincrby("pv_topic_time_" + curr_date, 1,curr_time[0]); //文章时间段统计
						jedis.expire("pv_topic_time_" + curr_date, _dt);
						
						jedis.zincrby("pv_topic", 1, tGuid );   //文章主题访问量统计
						
						jedis.zincrby("pv_topic_" + cGuid, 1, tGuid); //栏目下主题访问量
						jedis.zincrby("pv_topic_" + sGuid , 1, tGuid); //站点下主题访问量
					}
				}else if(p.getInt("ftype") == PageViewConstant.InterFaceType){
					jedis.zincrby("pv_interface_" + curr_date, 1, tGuid ); //接口每天访问量
					jedis.expire("pv_interface_" + curr_date, _dt);
					
					jedis.zincrby("pv_global_interface",1, tGuid ); //接口总访问量
					
					jedis.zincrby("pv_interface_" + tGuid, 1, ip); //接IP访问量
					jedis.hset("pv_interface_caller", ip , "{\"B\":\""+ p.getStr("fbrowser") +"\",\"D\":\""+ p.getStr("fdevicetype") +"\",\"OS\":\""+ p.getStr("fosname") +"\"}");
				}
			}
			
		}finally{
			jedis.close();
		}
		return true;
	}
}
