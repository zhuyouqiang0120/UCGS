/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-12-2 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.jobs;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.ucgs.config.QuartzLog;
import com.chasonx.ucgs.config.RuntimeLog;
import com.chasonx.ucgs.dao.TaskDao;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-12-2下午12:58:08
 * @remark
 */
public class GetDeviceJobs implements Job {

	
	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		startExecute();
	} 
	
	public void startExecute(){
		try {
			QuartzLog.logger.info("-------- GetDeviceList Logs Start " + DateFormatUtil.formatString("yyyy-MM-dd HH:mm:ss") + " ------");
			TaskDao.syncDeviceList();
			
			QuartzLog.logger.info("-------- GetDeviceList Logs End --------");
		} catch (Exception e) {
			e.printStackTrace();
			RuntimeLog.logger.error(e.getMessage());
		}
	}

}
