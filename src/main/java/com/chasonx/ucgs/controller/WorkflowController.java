/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-10-30 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import com.chasonx.ucgs.config.PageUtil;
import com.jfinal.core.Controller;

/**工作流 
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-10-30下午3:05:57
 * @remark
 */
public class WorkflowController extends Controller{

	public void index(){
		render(PageUtil.WORKFLOW_MAIN);
	}
	
	public void edit(){
		render(PageUtil.WORKFLOW_EDIT);
	}
}
