/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月7日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.interceptor;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.entity.ULog;
import com.chasonx.ucgs.entity.ULogVersion;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月7日 下午2:56:02
 * @remark  统一操作日志记录
 */
public class SaveLog implements Interceptor {

	/* (non-Javadoc)
	 * @see com.jfinal.aop.Interceptor#intercept(com.jfinal.aop.Invocation)
	 */
	@Override
	public void intercept(Invocation ai) {
		Controller ctrl = ai.getController();
		HttpServletRequest req = ctrl.getRequest();
		String logTitle = ai.getMethod().getAnnotation(AnnPara.class).value();
		
		long startTime = System.currentTimeMillis();
		String error = "";
		boolean result = false;
		try{
			ai.invoke();
			result = true;
		}catch(Exception e){
			error = e.getMessage();
			Tools.writeLog(ai, e);
		}
		
		if(ai.getActionKey().equals("/getcaptcha")) return;
		
		ULog log = new ULog();
		Record login = null;
		try{
			if(req.getSession() != null && req.getSession().getAttribute(SystemConstant.SYS_LOGIN_SESSION) != null)
				login = DHttpUtils.getLoginUser(ctrl.getRequest());
		}catch(Exception e){
			e.printStackTrace();
		}
		
		log.set("fmodifytime", DateFormatUtil.formatString(null))
		.set("fmodifyer", login == null?"":login.get("fadminname"))
		.set("fmodifyerguid", login == null?"":login.getStr("fguid"))
		.set("fmodifyresult", result?"success":"faild")
		.set("ftitle", logTitle)
		.set("fuse", SystemConstant.SYS_CODE);
		
		Record action = new Record();
		action.set("url", ai.getActionKey())
		.set("method", ai.getMethodName())
		.set("ctrl", ai.getControllerKey())
		.set("ispara",ctrl.getParaMap().size() > 0)
		.set("error", error);
		log.set("fcontent", JsonKit.toJson(action));
		
		Record ext = new Record();
		ext.set("ip", req.getRemoteAddr())
		.set("port", req.getRemotePort())
		.set("uri", req.getRequestURI())
		.set("url", req.getRequestURL())
		.set("method", req.getMethod())
		.set("contentlength", req.getContentLength())
		.set("contentType", req.getContentType())
		.set("cookie", req.getHeader("Cookie"))
		.set("accept", req.getHeader("Accept"))
		.set("accept-encoding", req.getHeader("Accept-Encoding"))
		.set("accept-language", req.getHeader("Accept-Language"	))
		.set("user-agent", req.getHeader("User-Agent"))
		.set("request-time", (System.currentTimeMillis() - startTime))
		.set("referer", req.getHeader("Referer"));
		log.set("fextdata", JsonKit.toJson(ext));
		
		List<ULog> logList = CacheKit.get(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + ULogVersion.currVersion);
		if(null == logList) logList = new ArrayList<ULog>();
		
		logList.add(log);
		CacheKit.put(Constant.CACHE_LOG_NAME, SystemConstant.SYS_CODE + "_" + ULogVersion.currVersion, logList);
	}

}
