/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-3-6 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.directory.FileListUtil;
import com.chasonx.entity.FileEntity;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminMenuDao;
import com.chasonx.ucgs.entity.AdminMenu;
import com.chasonx.ucgs.entity.TmenuBtn;
import com.chasonx.ucgs.entity.TmenuBtnGroup;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.core.JFinal;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * 系统菜单操作控制
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-3-6上午10:27:41
 * @remark
 */
public class AdminMenuController extends Controller {

	@AnnPara("系统菜单页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ADMIN_MENULIST);
	}
	
	@AnnPara("菜单编辑")
	@Before({SaveLog.class,Para.class})
	public void adminmenumodify(){
		AdminMenu menu = Tools.recordConvertModel((Record) getAttr("RequestPara"),AdminMenu.class);
		int type = getParaToInt("type");
		boolean res = false;
		switch(type){
		case 1:
			res = AdminMenuDao.add(menu);
			break;
		case 2:
			res = AdminMenuDao.update(menu);
			break;
		case 3:
			res = AdminMenuDao.del(getParaToInt("fkey"));
			break;
		}
		renderJson(res?1:0);
	}
	
    @AnnPara("访问菜单列表")
	@Before(POST.class)
	public void menulist(){
    	Integer state = getParaToInt("state");
    	
    	Record logInRecord = DHttpUtils.getLoginUser(getRequest());
    	List<AdminMenu> list = null;
    	
    	if(logInRecord.getInt("fsysroletype") == 1) list = AdminMenuDao.selectMenuList(state);
    	else list = AdminMenuDao.getAllMenuByIdList(state, logInRecord.getStr("fguid"),logInRecord.getStr("roleguid"));
    	
		List<Long> menuId = new ArrayList<Long>();
		for(int i = 0,len = list.size();i < len;i++){
			menuId.add(list.get(i).getLong("id"));
		}
		String idStr = Tools.joinForList(menuId, ",");
		List<TmenuBtnGroup> glist = TmenuBtnGroup.group.find("select * from t_menu_btn_group where fmenuid in ("+ idStr +")");
		List<TmenuBtn> blist = TmenuBtn.btn.find("select b.* from t_menu_btn b INNER JOIN t_menu_btn_group g ON b.fmbgid = g.id WHERE g.fmenuid in("+ idStr +")");
		Record data = new Record()
		.set("menuList", list)
		.set("btnList", blist)
		.set("bgroupList", glist);
		renderJson(data);
	}
    
    public void moveMenu(){
    	Long mid = getParaToLong("mid");
    	Integer msort = getParaToInt("msort");
    	Long m2id = getParaToLong("m2id");
    	Integer m2sort = getParaToInt("m2sort");
    	List<String> sql = new ArrayList<String>();
    	sql.add("update t_adminmenu set fsort = " + msort + " where id = " + mid);
    	sql.add("update t_adminmenu set fsort = " + m2sort + " where id = " + m2id);
    	renderJson(Db.batch(sql, sql.size()));
    }
	
	@Before(POST.class)
	public void iconList(){
		String path = PathKit.getWebRootPath();
		String basePath = JFinal.me().getContextPath() + "/res/skin/css/default/icon";
		List<FileEntity> list = FileListUtil.list(path + "/res/skin/css/default/icon");
		FileEntity entity;
		for(int i = 0,len = list.size();i < len;i++){
			entity = list.get(i);
			entity.setAbsuloteDirectory(basePath);
			entity.setParentDirectory(null);
			list.set(i, entity); 
		}
		renderJson(list);
	}
	/**
	 * @Tag       : 按钮组编辑
	 * @createTime: 2016年3月8日 下午9:15:05
	 * @author    : Chason.x
	 */
	@Before(Para.class)
	public void btnGroupModify(){
		TmenuBtnGroup group = Tools.recordConvertModel((Record)getAttr("RequestPara"), TmenuBtnGroup.class);
		Integer type = getParaToInt("type");
		boolean res = false;
		switch(type){
		case 1:
			res = group.save();
			break;
		case 2:
			res = group.update();
			break;
		case 3:
			res = group.delete();
			Db.update("delete from t_menu_btn where fmbgid = ?",group.getInt("id"));
			break;
		}
		renderJson(res?1:0);
	}
	@Before(Para.class)
	public void btnModify(){
		TmenuBtn btn = Tools.recordConvertModel((Record)getAttr("RequestPara"), TmenuBtn.class);
		Integer type = getParaToInt("type");
		boolean res = false;
		switch(type){
		case 1:
			res = btn.save();
			break;
		case 2:
			res = btn.update();
			break;
		case 3:
			res = btn.delete();
			break;
		}
		renderJson(res?1:0);
	}
	
	public void btnList(){
		Integer state = getParaToInt("state");
		Long mid = getParaToLong("mid");
		String where = "";
		if(null != state) where = " and fstate = " + state;
		List<TmenuBtn> btnList = TmenuBtn.btn.find("SELECT b.* FROM t_menu_btn b INNER JOIN t_menu_btn_group g ON b.fmbgid = g.id where g.fmenuid = ? "+ where +" order by b.id asc",mid);
		List<TmenuBtnGroup> groupList = TmenuBtnGroup.group.find("select * from t_menu_btn_group where fmenuid = ? order by id asc",mid);
		Record data = new Record()
		.set("BtnList", btnList).set("BtnGroupList", groupList);
		renderJson(data);
	}
}
