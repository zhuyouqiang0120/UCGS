/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.entity								 
 **    Type    Name : TimeSet 							     	
 **    Create  Time : 2016年11月15日 下午5:48:12								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2016 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.entity;

import com.chasonx.tools.StringUtils;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2016年11月15日下午5:48:12
 * @version 1.0 
 */
public class TimeSet {

	private String startDate;
	private String endDate;
	private String startTime;
	private String endTime;
	/**
	 * @return the startDate
	 */
	public String getStartDate() {
		return StringUtils.hasText(startDate)?startDate:"";
	}
	/**
	 * @param startDate the startDate to set
	 */
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	/**
	 * @return the endDate
	 */
	public String getEndDate() {
		return StringUtils.hasText(endDate)?endDate:"";
	}
	/**
	 * @param endDate the endDate to set
	 */
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	/**
	 * @return the startTime
	 */
	public String getStartTime() {
		return StringUtils.hasText(startTime)?startTime:"";
	}
	/**
	 * @param startTime the startTime to set
	 */
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	/**
	 * @return the endTime
	 */
	public String getEndTime() {
		return StringUtils.hasText(endTime)?endTime:"";
	}
	/**
	 * @param endTime the endTime to set
	 */
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	
}
