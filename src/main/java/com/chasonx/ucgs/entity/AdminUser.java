/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-2-9 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.entity;

import com.jfinal.plugin.activerecord.Model;

/**
 * 系统用户类
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-2-9上午10:15:52
 * @remark
 */
public class AdminUser extends Model<AdminUser> {

	/**
	 * @param 
	 */
	private static final long serialVersionUID = 1L;
	
	public static  AdminUser adminUserDao = new AdminUser();
	

}
