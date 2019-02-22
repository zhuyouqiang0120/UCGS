/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.api								 
 **    Type    Name : Ret2 							     	
 **    Create  Time : 2017年12月15日 下午3:20:19								
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
 * @create  2017年12月15日下午3:20:19
 * @version 1.0 
 */
public class Ret2 {

	public String Msg = "ok";
	public long Elapsed = 0;
	public Object Data;
	public String Version = "2.0.0";
	public String Desc = "UCGS Unify JSON";
	/**
	 * @return the msg
	 */
	public String getMsg() {
		return Msg;
	}
	/**
	 * @param msg the msg to set
	 */
	public void setMsg(String msg) {
		Msg = msg;
	}
	/**
	 * @return the elapsed
	 */
	public long getElapsed() {
		return Elapsed;
	}
	/**
	 * @param elapsed the elapsed to set
	 */
	public void setElapsed(long elapsed) {
		Elapsed = elapsed;
	}
	/**
	 * @return the data
	 */
	public Object getData() {
		return Data;
	}
	/**
	 * @param data the data to set
	 */
	public void setData(Object data) {
		Data = data;
	}
	/**
	 * @return the version
	 */
	public String getVersion() {
		return Version;
	}
	/**
	 * @param version the version to set
	 */
	public void setVersion(String version) {
		Version = version;
	}
	/**
	 * @return the desc
	 */
	public String getDesc() {
		return Desc;
	}
	/**
	 * @param desc the desc to set
	 */
	public void setDesc(String desc) {
		Desc = desc;
	}
	
	
}
