/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-12 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.interceptor;

import java.util.Map;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

/**
 * 前台传参处理
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月12日上午10:16:44
 * @remark
 */
public class Para implements Interceptor {

	/* (non-Javadoc)
	 * @see com.jfinal.aop.Interceptor#intercept(com.jfinal.core.ActionInvocation)
	 */
	public void intercept(Invocation ai) {
		Controller ctrl = ai.getController();
		Map<String, String[]> paraMap = ctrl.getParaMap();
		if(!paraMap.isEmpty()){
			Record rec = new Record();
			for(String key : paraMap.keySet()){
				rec.set(key, paraMap.get(key)[0]);
			}
			ctrl.setAttr("RequestPara", rec);
		}
		ai.invoke();
	}

}
