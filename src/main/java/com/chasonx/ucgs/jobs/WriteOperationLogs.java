/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月8日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.jobs;

import java.util.List;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.config.QuartzLog;
import com.chasonx.ucgs.config.RuntimeLog;
import com.chasonx.ucgs.entity.ULog;
import com.chasonx.ucgs.entity.ULogVersion;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月8日 下午4:45:41
 * @remark 
 */
public class WriteOperationLogs implements Job {

	/* (non-Javadoc)
	 * @see org.quartz.Job#execute(org.quartz.JobExecutionContext)
	 */
	
	@Override
	public void execute(JobExecutionContext job) throws JobExecutionException {
		startExecute();
	}
	
	@SuppressWarnings("unchecked")
	public void startExecute(){
		QuartzLog.logger.info("-------- Operation Logs Start " + DateFormatUtil.formatString("yyyy-MM-dd HH:mm:ss") + " ------");
		Long startTime = System.currentTimeMillis();
		ULogVersion uv = ULogVersion.uv.findFirst("select * from t_operation_version where ftag = ?",SystemConstant.SYS_CODE);
		if(uv == null) return;
		try{
			
		List<ULog> list = CacheKit.get(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + ULogVersion.currVersion);
		
		QuartzLog.logger.info("ULog Size : " + list.size());
		if(list == null || list.isEmpty()) return;
		
		ULogVersion.currVersion += 1;
		StringBuffer sb = new StringBuffer(500);
		sb.append("insert into t_operation_log(ftitle,fcontent,fmodifyresult,fmodifyer,fmodifytime,fmodifyerguid,fuse,fextdata) values");
		for(int i = 0,len = list.size();i < len;i++){
			sb.append("('"+ list.get(i).getStr("ftitle") +"','"+ list.get(i).getStr("fcontent") +"','"+ list.get(i).getStr("fmodifyresult") +"',")
			.append("'"+ list.get(i).getStr("fmodifyer") +"','"+ list.get(i).getStr("fmodifytime") +"','"+ list.get(i).getStr("fmodifyerguid") +"',")
			.append("'"+ list.get(i).getStr("fuse") +"','"+ list.get(i).getStr("fextdata") +"')");
			if(i < (len - 1)) sb.append(",");
		}
		
		int res = Db.update(sb.toString());
		if(res > 0){
			CacheKit.remove(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + (ULogVersion.currVersion - 1));
			
			uv.set("fcurrversion", ULogVersion.currVersion)
			.set("fresponsetime", (System.currentTimeMillis() - startTime)).update();
		}else{
			list.addAll( (List<ULog>) CacheKit.get(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + ULogVersion.currVersion) );
			CacheKit.remove(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + ULogVersion.currVersion);
			ULogVersion.currVersion -= 1;
			CacheKit.put(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + ULogVersion.currVersion, list);
		}
		
		QuartzLog.logger.info("Log Elapsed : " + (System.currentTimeMillis() - startTime));
		QuartzLog.logger.info("-------- Operation Logs End --------");
		}catch(Exception e){
			RuntimeLog.logger.error(e.getMessage());
		}
	}
}
