/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-3-3 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminAuthDao;
import com.chasonx.ucgs.dao.AdminUserGroupDao;
import com.chasonx.ucgs.entity.AdminGroup;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.chasonx.ucgs.response.AdminGroupRes;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
/***
 * 系统用户组管理
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-3-3下午1:15:42
 * @remark
 */
public class AdminUserGroupController extends Controller {

	@AnnPara("访问权限设置界面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ADMIN_USERGROUP);
	}
	
	/**
	 * 用户组修改
	 * void
	 */
	@AnnPara("用户角色信息编辑")
	@Before({POST.class,SaveLog.class})
	public void admingroupmodify(){
		int otype = getParaToInt("type");
		Model<AdminGroup> ag = getModel(AdminGroup.class);
		
		boolean res = false;
		try{
			switch(otype){
			case 1:
				ag.set("fguid", TokenUtil.getUUID());
				res = AdminUserGroupDao.add(ag);
	//			res = AdminUserGroupDao.modifyAdminGroupGroup(menuidArr, comArr, ag.getLong("id")).length > 0?true:false;
				break;
			case 2:
				res = AdminUserGroupDao.update(ag);
				break;
			case 3:
				res = AdminUserGroupDao.del(getPara("guid"));
				break;
			case 4:
				Integer[] menuidArr = getParaValuesToInt("marr[]");
				String[] comArr = getParaValues("comarr[]");
				
	/* 2016-10-26 16:08 */			
	//			AdminUserGroupDao.delAdmingroupByGroupId(ag.getLong("id"));
	//			if(StringUtils.hasText(exType) && exType.equals("update"))
	//				res = AdminUserGroupDao.modifyAdminGroupGroup(menuidArr, comArr, ag.getLong("id")).length > 0?true:false;
				String exType = getPara("exType");
				
				res = AdminAuthDao.del(ag.getStr("fguid"), Constant.AuthTypes.menu.toString());
				if(StringUtils.hasText(exType) && exType.equals("update")){
					List<String> sql = new ArrayList<String>();
					if(menuidArr != null){
						for(int i = 0,len = menuidArr.length;i < len;i++){
							sql.add("insert into t_admin_auth(ftargetauthguid,fuserguid,fauth,ftype) values('"+ menuidArr[i] +"','" + ag.getStr("fguid") +"','" + comArr[i]+ "','"+ Constant.AuthTypes.menu.toString() +"')");
						}
					}
					res = Db.batch(sql, sql.size()).length > 0;
				}
				break;
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(res?1:0);
	}
	
	/**
	 * 权限组详细列表
	 * void
	 */
	public void admingroupgrouplist(){
		/* 2016-10-26 16:08 */	
		//renderJson(AdminUserGroupDao.admingroupGroupList(getParaToLong("gid")));
		
		renderJson(AdminAuthDao.getAuths(getPara("guid"), Constant.AuthTypes.menu.toString()));
	}
	
	/**
	 * 组列表概览
	 * void
	 */
	@Before(POST.class)
	public void admingrouplist(){
		List<AdminGroupRes> list = AdminUserGroupDao.selectList();
		renderJson(list);
	}
	/**
	 * 角色/组 列表
	 * void
	 * @createTime:2015-11-16 下午4:08:16
	 * @author: chason.x
	 */
	@AnnPara("角色/组 列表")
	@Before(SaveLog.class)
	//@SuppressWarnings("unchecked")
	public void rolelist(){
		boolean result = false;
		String dimensionguid = getPara("dimensionguid");
	//	if(StringUtils.hasText(dimensionguid)) result = AreaDao.checkPermission((List<Record>) getSession().getAttribute("ADMIN_AREA_LIST"), dimensionguid);
		result = true;
		if(result)
			renderJson(AdminGroup.adminGroupDao.find("select * from t_admingroup where fdimensionguid = ?",dimensionguid));
		else
			renderJson(0);
	}
	
	/**
	 * 组信息列表
	 * void
	 */
	@AnnPara("查询角色列表")
	@Before({POST.class,SaveLog.class})
	public void admingroupentitylist(){
		renderJson(AdminUserGroupDao.selectAdminGroupEntityList());
	}
}
