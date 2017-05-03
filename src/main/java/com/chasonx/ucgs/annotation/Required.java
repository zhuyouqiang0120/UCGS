/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年7月20日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年7月20日 下午2:27:33
 * @remark 
 */
@Target({ElementType.TYPE,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface Required {
	ParaEntity[] value() default @ParaEntity;
}
