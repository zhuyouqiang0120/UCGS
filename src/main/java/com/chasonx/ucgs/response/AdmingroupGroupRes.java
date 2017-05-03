/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-12-11 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.response;

public class AdmingroupGroupRes {

	private Integer id;
	private Integer menuid;
	private Integer mgroupid;
	private String comstr;
	private String menuname;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getMenuid() {
		return menuid;
	}
	public void setMenuid(Integer menuid) {
		this.menuid = menuid;
	}
	public Integer getMgroupid() {
		return mgroupid;
	}
	public void setMgroupid(Integer mgroupid) {
		this.mgroupid = mgroupid;
	}
	public String getComstr() {
		return comstr;
	}
	public void setComstr(String comstr) {
		this.comstr = comstr;
	}
	public String getMenuname() {
		return menuname;
	}
	public void setMenuname(String menuname) {
		this.menuname = menuname;
	}
	
	
}
