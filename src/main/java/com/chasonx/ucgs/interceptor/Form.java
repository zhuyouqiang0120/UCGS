/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-10-20 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.interceptor;

import com.chasonx.ucgs.common.Constant;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.token.TokenManager;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-10-20下午3:39:05
 * @remark
 */
public class Form implements Interceptor {

	/* (non-Javadoc)
	 * @see com.jfinal.aop.Interceptor#intercept(com.jfinal.aop.Invocation)
	 */
	public void intercept(Invocation ai) {
		boolean token = TokenManager.validateToken(ai.getController(), Constant.FORMDATA_TOKEN_NAME);
 		if(token){
			ai.invoke();
		}else{
			ai.getController().renderJson("请不要重复交提数据");
		}
	}

}
