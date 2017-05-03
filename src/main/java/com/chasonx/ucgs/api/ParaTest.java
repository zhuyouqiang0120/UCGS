/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年7月18日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.api;

import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年7月18日 下午2:12:26
 * @remark 
 */
public class ParaTest extends Controller {

	@Required({
	  @ParaEntity(name="aaa",mlen=2,xlen=13),
	  @ParaEntity(name="bbb",mlen=10,xlen=15),
	  @ParaEntity(name = "ccc" ,mlen = 3,empty = false)
	 }) 
	@Before(ParamInterceptor.class)
	public void index(){
		renderJson(111);
	}
	
	public void test(){
		renderText(getPara("param"));
	}
}
