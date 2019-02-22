/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.api								 
 **    Type    Name : Ret 							     	
 **    Create  Time : 2017年5月5日 下午3:22:04								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.api;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月5日下午3:22:04
 * @version 1.0 
 */
public class Ret {
	
	private String msg = "";
	private Integer result = 0;
	private Object data = "";
	private Long elapsed = 0L;
	private String desc = "UCGS UnifyJson v2.0";
	/**
	 * @return the msg
	 */
	public String getMsg() {
		return msg == null?"":msg;
	}
	/**
	 * @param msg the msg to set
	 */
	public void setMsg(String msg) {
		this.msg = msg;
	}
	/**
	 * @return the result
	 */
	public int getResult() {
		return result == null?0:result;
	}
	/**
	 * @param result the result to set
	 */
	public void setResult(int result) {
		this.result = result;
	}
	/**
	 * @return the data
	 */
	public Object getData() {
		return data == null?"":data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(Object data) {
		this.data = data;
	}
	/**
	 * @return the elapsed
	 */
	public long getElapsed() {
		return elapsed == null?0:elapsed;
	}
	/**
	 * @param elapsed the elapsed to set
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
