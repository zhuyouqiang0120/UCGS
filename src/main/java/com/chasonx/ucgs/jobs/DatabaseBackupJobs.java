/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月27日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.jobs;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.ucgs.config.QuartzLog;
import com.chasonx.ucgs.dao.TaskDao;
import com.jfinal.kit.PathKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月27日 下午12:05:55
 * @remark 
 */
public class DatabaseBackupJobs implements Job {

	/* (non-Javadoc)
	 * @see org.quartz.Job#execute(org.quartz.JobExecutionContext)
	 */
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		startExecute();
	}
	
	public void startExecute(){
		QuartzLog.logger.info("-------- DataBaseBackUp Logs Start " + DateFormatUtil.formatString("yyyy-MM-dd HH:mm:ss") + " ------");
		long startTime = System.currentTimeMillis();
		String path = PathKit.getWebRootPath() + "/databackup/";
		TaskDao.databaseBackUp(path);
		QuartzLog.logger.info(" Log Elapsed : " + (System.currentTimeMillis() - startTime));
		QuartzLog.logger.info("-------- DataBaseBackUp Logs End -------");
	}

}
