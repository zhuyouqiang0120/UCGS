/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-5-4 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.entity;

import com.jfinal.plugin.activerecord.Model;

/**
 * 业务栏目类
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-5-4上午9:38:56
 * @remark
 */
public class Column extends Model<Column> {

	/**
	 * @param 
	 */
	private static final long serialVersionUID = 1L;
	
	public static Column columnDao = new Column();

}
