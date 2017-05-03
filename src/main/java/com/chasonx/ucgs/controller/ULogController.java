/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月6日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.controller;


import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月6日 下午2:45:59
 * @remark 
 */
public class ULogController extends Controller {

	@AnnPara("访问日志页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ULOG_INDEX);
	}
	/**
	 * 
	 * @Tag       : 日志数据列表
	 * @createTime: 2016年1月11日 下午3:47:06
	 * @author    : Chason.x
	 */
	@AnnPara("查询日志列表")
	@Before(SaveLog.class)
	public void logList(){
		Integer start = getParaToInt("PageNumber");
		Integer limit = getParaToInt("PageSize");
		String startTime = getPara("startTime");
		String endTime = getPara("endTime");
		String title = getPara("title");
		String user = getPara("userGuid");
		
		String whereCase = " from t_operation_log where 1 = 1 ";
		if(StringUtils.hasText(title)) whereCase += " and ftitle = '"+ title +"'";
		if(StringUtils.hasText(user)) whereCase += " and fmodifyerguid = '"+ user +"'";
		if(StringUtils.hasText(startTime) && !StringUtils.hasText(endTime))
			whereCase += " and TO_DAYS(fmodifytime) >= TO_DAYS('"+ startTime +"')";
		else if(!StringUtils.hasText(startTime) && StringUtils.hasText(endTime))
			whereCase += " and TO_DAYS(fmodifytime) <= TO_DAYS('"+ endTime +"')";
		else if(StringUtils.hasText(startTime) && StringUtils.hasText(endTime))
			whereCase += " and TO_DAYS(fmodifytime) between TO_DAYS('"+ startTime +"') and TO_DAYS('"+ endTime +"')";
		whereCase += " and fuse = ? order by id desc ";
		
		renderJson(Db.paginate(start, limit, "select * ", whereCase,SystemConstant.SYS_CODE));
	}
	
	/**
	 * @Tag       :
	 * @createTime: 2016年1月11日 下午5:56:23
	 * @author    : Chason.x
	 */
	public void logTypeGroup(){
		List<String> title = Db.query("SELECT ftitle FROM `t_operation_log` group by ftitle");
		List<Record> user = Db.find("select fmodifyer,fmodifyerguid from t_operation_log GROUP BY fmodifyer");
		Record res = new Record().set("title", title).set("user", user);
		renderJson(res);
	}
}
