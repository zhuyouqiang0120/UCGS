/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.annotation								 
 **    Type    Name : ParamValidator 							     	
 **    Create  Time : 2017年9月11日 上午11:12:05								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.annotation;

import java.lang.annotation.Annotation;
import org.apache.log4j.Logger;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年9月11日上午11:12:05
 * @version 1.0 
 */
public class ParamValidator implements Interceptor {
	
	private static final Logger log = Logger.getLogger(ParamValidator.class);

	/* (non-Javadoc)
	 * @see com.jfinal.aop.Interceptor#intercept(com.jfinal.aop.Invocation)
	 */
	@Override
	public void intercept(Invocation inv) {
		long st = System.currentTimeMillis();
		boolean require = false;
		String mess = "";
		String fieldName = "";
		Controller con = inv.getController();
		try{
			Required req = inv.getMethod().getAnnotation(Required.class);
			Annotation[] anno = req.value();
			String _v;
			String[] _vs;
			String _suffix = "";
			ParaEntity p;
			for(Annotation a : anno){
				p = (ParaEntity) a;
				if(Api.hasText(p.name())){
					
					fieldName = p.name();
					_suffix = "参数["+ p.name() +"] ";
					
					if(fieldName.indexOf("[]") != -1){
						_vs = con.getParaValues(fieldName);
						if(!p.empty() && (_vs == null || _vs.length == 0)){
							require = true;
							mess = Api.hasText(p.msg())?p.msg():_suffix + "不能为空";
							break;
						}else if(_vs != null){
							if(p.mlen() != -1 && _vs.length < p.mlen()){
								require = true;
								mess = Api.hasText(p.msg())?p.msg():_suffix + "长度 不能小于" + p.mlen() + "个字符";
								break;
							}else if(p.xlen() != -1 && _vs.length > p.xlen()){
								require = true;
								mess = Api.hasText(p.msg())?p.msg():_suffix + "长度不能超过" + p.xlen() + "个字符";
								break;
							}
						}
					}else{
						_v = con.getPara(p.name());
						if(Api.hasText(_v)){
							_v = Api.deUnicode(_v);
						}
						if(!p.empty() && !Api.hasText(_v)){
							require = true;
							mess = Api.hasText(p.msg())?p.msg():_suffix + "不能为空";
							break;
						}else if(Api.hasText(_v)){
							if(p.mlen() != 0 && _v.trim().length() < p.mlen()){
								require = true;
								mess = Api.hasText(p.msg())?p.msg():_suffix + "长度不能小于 " + p.mlen() + " 个字符";
								break;
							}else if(p.xlen() != 0 && _v.trim().length() > p.xlen()){
								require = true;
								mess = Api.hasText(p.msg())?p.msg():_suffix + "长度不能超过 " + p.xlen() + " 个字符";
								break;
							}else if(p.typeClass() != String.class && !typeCheck(p.typeClass(), _v)){
								require = true;
								mess = "数据类型错误("+ p.typeClass().toString() +")";
							}
						}
					}
				}
			}
			
			if(require){
				Ret ret = Ret.create();
				ret.setMsg(_suffix + mess);
				ret.setResult(500);
				ret.setElapsed(System.currentTimeMillis() - st);
				con.renderJson(ret);
			}else{
				inv.invoke();
			}
		}catch(Exception e){
			writeLog(inv, e);
		}
	}
	
	public boolean typeCheck(Class<?> clazz,String v){
		if(clazz == String.class) return true;
		Object res = null;
		try{
			if(clazz == Integer.class || clazz == int.class) res = Integer.parseInt(v);
			if(clazz == Double.class || clazz == double.class) res = Double.parseDouble(v);
			if(clazz == Float.class || clazz == float.class) res = Float.parseFloat(v);
			if(clazz == Long.class || clazz == long.class) res = Long.parseLong(v);
			if(clazz == Boolean.class) res = Boolean.parseBoolean(v);
		}catch(Exception e){
			res = null;
		}
		return res != null;
	}

	private void writeLog(Invocation inv,Exception e){
		StringBuilder sb = new StringBuilder();
		sb.append("Controller 	   : " + inv.getController().getClass().getName() + "\n")
		  .append("Method 		   : " + inv.getMethodName() + "\n")
		  .append("Action          :" + inv.getControllerKey() + "\n")
		  .append("UrlPara         : " + JsonKit.toJson(inv.getController().getParaMap()) + "\n")
		  .append("Exception Type  : " + e.getClass().getName() + "\n")
		  .append("Exception Detail: " + e.getMessage());
		log.error(sb.toString());
	}
}
