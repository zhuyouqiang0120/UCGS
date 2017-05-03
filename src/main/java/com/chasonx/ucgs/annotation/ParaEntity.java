/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年7月20日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年7月20日 下午2:49:35
 * @remark 
 */
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ParaEntity {

	 /*参数名称*/
	 String name() default "";
	 /*参数最短长度*/
	 int mlen() default -1;
	 /*最大长度*/
	 int xlen() default -1;
	 /*提示信息*/
	 String msg() default "";
	 /*验证是否为空*/
	 boolean empty() default true;
	 /*字段描述*/
	 String desc() default "";
	 /*类型*/
	 String type() default "String";
}
