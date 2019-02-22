/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年6月21日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.interceptor;


import com.chasonx.ucgs.common.Tools;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年6月21日 上午10:41:46
 * @remark 
 */
public class MyExceptionInterceptor implements Interceptor {
	

	/* (non-Javadoc)
	 * @see com.jfinal.aop.Interceptor#intercept(com.jfinal.aop.Invocation)
	 */
	@Override
	public void intercept(Invocation inv) {
		try {
			inv.invoke();
		} catch (Exception e) {
			e.printStackTrace();
			Tools.writeLog(inv, e);
		}
	}
}
