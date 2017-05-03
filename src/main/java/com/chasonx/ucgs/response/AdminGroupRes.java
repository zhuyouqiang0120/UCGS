/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-12-11 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.response;

import java.util.List;

import com.jfinal.plugin.activerecord.Record;

public class AdminGroupRes {

	private Long id;
	private String  gname;
	private List<Record> records;
	
	public Long getId() {
		return id;
	}
	public void setId(Long long1) {
		this.id = long1;
	}
	public String getGname() {
		return gname;
	}
	public void setGname(String gname) {
		this.gname = gname;
	}
	public List<Record> getRecords() {
		return records;
	}
	public void setRecords(List<Record> records) {
		this.records = records;
	}
	
	
	
}
