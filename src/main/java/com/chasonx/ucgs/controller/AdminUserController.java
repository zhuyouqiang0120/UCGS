/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-2-9 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import com.chasonx.tools.Md5Util;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminUserDao;
import com.chasonx.ucgs.entity.AdminUser;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统用户操作 控制类
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-2-9下午5:24:29
 * @remark
 */
public class AdminUserController extends Controller {

	@AnnPara("访问系统用户页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ADMIN_USERLIST);
	}
	
	/**
	 * 系统用户操作
	 * void
	 */
	@AnnPara("系统用户信息操作")
	@Before({Para.class,SaveLog.class})
	public void adminusermodify(){
		int otype = getParaToInt("otype");
		boolean res = false;
		AdminUser user = Tools.recordConvertModel((Record)getAttr("RequestPara"), AdminUser.class);
		switch (otype) {
		case 1:
			user.set("fadminpwd", Md5Util.md5String(user.getStr("fadminpwd")));
			user.set("fguid", Tools.getGuid());
			res = AdminUserDao.insert(user);
			break;
		case 2:
			if(StringUtils.hasText(user.getStr("fadminpwd"))) user.set("fadminpwd", Md5Util.md5String(user.getStr("fadminpwd")));
			else user.remove("fadminpwd");
			res = AdminUserDao.update(user);
			break;
		case 3:
			res = AdminUserDao.delUser(getPara("ukeyStr"),DHttpUtils.getLoginUser(getRequest()).getLong("id"))>0?true:false;
			break;
		default:
			break;
		}
		renderJson(res);
	}
	
	/**
	 *用户权限操作 
	 * void
	 */
	@AnnPara("用户权限操作")
	@Before({POST.class,SaveLog.class})
	public void adminiusercompmodify(){
		int type = getParaToInt("type");
		boolean res = false;
		Long adminId = getParaToLong("adminId");
		Integer[] menuidArr = getParaValuesToInt("marr[]");
		String[] comArr = getParaValues("comarr[]");
		
		String adminGuid = AdminUserDao.getAdminUserGuid(adminId);
		switch(type){
		case 1:
			res = AdminUserDao.addAdminUserMenuGroup(adminGuid, menuidArr, comArr);
			break;
		case 2:
			if(AdminUserDao.delAdminUserMenuGroup(adminGuid))
				res = AdminUserDao.addAdminUserMenuGroup(adminGuid, menuidArr, comArr);
			break;
		}
		renderJson(res?1:0);
	}
	
	/**
	 * 当前权限列表
	 * void
	 */
	@AnnPara("权限列表")
	@Before({POST.class,SaveLog.class})
	public void adminuserhascomlist(){
		String adminUserGuid = AdminUserDao.getAdminUserGuid(getParaToLong("adminid"));
		renderJson(AdminUserDao.selectHasComList(adminUserGuid));
	}
	
	/**
	 * 
	 * 系统用户信息
	 * void
	 */
	@AnnPara("查看系统用户信息")
	@Before({POST.class,SaveLog.class})
	public void adminEntity(){
		int auid = getParaToInt("userkey");
		renderJson(AdminUserDao.selectUserEntity(auid));
	}
	
	/**
	 * 系统用户列表
	 * 分页
	 * void
	 */
	@AnnPara("查看系统用户列表")
	@Before({POST.class,SaveLog.class})
	public void adminuserlist(){
		int PageSize = getParaToInt("PageSize");
		int PageNumber = getParaToInt("PageNumber");
		PageNumber = (PageNumber + PageSize)/PageSize;
		String[] dimensionGuids = getParaValues("dimensionGuids[]");
		Page<AdminUser> page = AdminUserDao.getAdminUserList(PageNumber, PageSize, getModel(AdminUser.class),dimensionGuids);
		renderJson(page);
	}
	
	
	public void adminUsersByDimension(){
		String dimensionGuid = getPara("dimensionGuid");
		renderJson(AdminUser.adminUserDao.find("SELECT a.fguid,a.fadminname,a.fdimensionGuid,a.fdimensionname,g.fgname FROM `t_adminuser` a INNER JOIN t_admingroup g ON a.froleguid = g.fguid where a.fdimensionGuid = ?",dimensionGuid));
	}

	/**
	 * 根据分组系统用户列表
	 * void
	 * @createTime:2015年6月29日 下午11:28:28
	 * @author: chason.x
	 */
	@AnnPara("按分组查看系统用户列表")
	@Before({POST.class,SaveLog.class})
	public void adminuserlistbygroupid(){
		renderJson(AdminUserDao.selectUserListByGroupId(getParaToInt("groupid")));
	}
	/**
	 * 检测用户名
	 * void
	 * @createTime:2015年9月9日 下午3:08:53
	 * @author: chason.x
	 */
	@AnnPara("执行检测用户名操作")
	@Before(SaveLog.class)
	public void validateUserName(){
		renderJson(AdminUserDao.selectUserByLoginName(getPara("username")));
	}
}
