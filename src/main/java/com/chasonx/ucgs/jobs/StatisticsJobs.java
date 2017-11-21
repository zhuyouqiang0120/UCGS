/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.jobs								 
 **    Type    Name : StatisticsJobs 							     	
 **    Create  Time : 2017年3月3日 下午12:08:55								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.jobs;

import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.config.QuartzLog;
import com.chasonx.ucgs.dao.RedisDao;
import com.chasonx.ucgs.dao.StatisticsDao;
import com.chasonx.ucgs.entity.PageStatistics;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月3日下午12:08:55
 * @version 1.0 
 */
public class StatisticsJobs implements Job{
	

	/* (non-Javadoc)
	 * @see org.quartz.Job#execute(org.quartz.JobExecutionContext)
	 */
	@Override
	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		startExecute();
	}
	
	public void startExecute(){
		long stratTime = System.currentTimeMillis();
		QuartzLog.logger.info("-------- PageView Logs Start " + DateFormatUtil.formatString("yyyy-MM-dd HH:mm:ss") + " ------");
		QuartzLog.logger.info("Log Version : " + StatisticsDao.CURRENT_VERSION);
		List<PageStatistics> stistics = CacheKit.get(Constant.CACHE_PAGE_STATISTICS, Constant.CACHE_PAGE_STATISTICS + StatisticsDao.CURRENT_VERSION);
		if(!stistics.isEmpty()){
			QuartzLog.logger.info("Log Size : " + stistics.size());
			Integer currVer = StatisticsDao.CURRENT_VERSION;
			StatisticsDao.CURRENT_VERSION += 1;
			
			try {
				RedisDao.saveToRedis(stistics);
			} catch (Exception e) {
				e.printStackTrace();
			}
//			StringBuilder sb = new StringBuilder(200);
//			sb.append("insert into " + TableMapping.me().getTable(PageStatistics.class).getName());
//			String[] attr = stistics.get(0).getAttrNames();
//			sb.append("("+ StringUtils.joinSimple(attr, ",") +") values");
//			int j = 0;
//			int jlen = 0;
//			for(int i = 0,len = stistics.size();i < len; i++){
//				sb.append("(");
//					for(j = 0,jlen = attr.length;j < jlen;j++){
//						sb.append("'"+ stistics.get(i).get(attr[j]) +"'");
//						if(j < (jlen - 1)) sb.append(",");
//					}
//				sb.append(")");
//				if(i < (len - 1)) sb.append(",");
//			}
//			Db.update(sb.toString());
			
			
			CacheKit.remove(Constant.CACHE_PAGE_STATISTICS, Constant.CACHE_PAGE_STATISTICS + currVer);
		}
		QuartzLog.logger.info("Log Elapsed : " + (System.currentTimeMillis() - stratTime));
		QuartzLog.logger.info("-------- PageView Logs End ------");
	}

}
