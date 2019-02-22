/**********************************************************************
 **********************************************************************
 **    Project Name : DocFactory
 **    Package Name : com.chasonx.docfactory.common								 
 **    Type    Name : Ret 							     	
 **    Create  Time : 2017��8��21�� ����4:19:08								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     ע�⣺ �����ݽ������Ϻ�������Ϣ�Ƽ����޹�˾�ڲ�ʹ�ã���ֹת��		 **
 **********************************************************************
 */
package com.chasonx.ucgs.annotation;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  
 * @version 1.0 
 */
public class Ret {

	private int result = 0;
	private String msg = "ok";
	private Object data = "";
	private long elapsed = 0;
	private String desc = "Unified Validator";
	
	public static Ret create(){
		return new Ret();
	}
	
	/**
	 * @return the result
	 */
	public int getResult() {
		return result;
	}
	/**
	 * @param result the result to set
	 */
	public void setResult(int result) {
		this.result = result;
	}
	/**
	 * @return the msg
	 */
	public String getMsg() {
		return msg;
	}
	/**
	 * @param msg the msg to set
	 */
	public void setMsg(String msg) {
		this.msg = msg;
	}
	/**
	 * @return the data
	 */
	public Object getData() {
		return data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(Object data) {
		this.data = data;
	}
	/**
	 * @return the elsped
	 */
	public long getElapsed() {
		return elapsed;
	}
	/**
	 * @param elsped the elsped to set
	 */
	public void setElapsed(long elapsed) {
		this.elapsed = elapsed;
	}
	/**
	 * @return the desc
	 */
	public String getDesc() {
		return desc;
	}
	/**
	 * @param desc the desc to set
	 */
	public void setDesc(String desc) {
		this.desc = desc;
	}
	
}
