/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-6-1 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.interceptor;

import com.chasonx.tools.StringUtils;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-6-1下午2:50:26
 * @remark
 */
public class JSONP implements Interceptor {

	/* (non-Javadoc)
	 * @see com.jfinal.aop.Interceptor#intercept(com.jfinal.core.ActionInvocation)
	 */
	public void intercept(Invocation ai) {
		String cb = ai.getController().getPara("jsoncallback");
		if(!StringUtils.hasText(cb)){
			cb = "callback";
		}
		try{
			ai.getController().getRequest().setAttribute("callback", cb);
			ai.invoke();
		}catch(Exception e){
		}
	}

}
