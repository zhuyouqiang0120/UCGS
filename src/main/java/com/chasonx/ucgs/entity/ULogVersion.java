/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月7日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.entity;

import com.jfinal.plugin.activerecord.Model;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月7日 下午3:22:52
 * @remark 
 */
public class ULogVersion extends Model<ULogVersion> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public static ULogVersion uv = new ULogVersion();
	
	public static Integer currVersion = 0;
}
