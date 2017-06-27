/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-7-7 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.interceptor;

//import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
//import java.util.Map;
import java.util.Set;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.dao.AdminMenuDao;
import com.chasonx.ucgs.entity.AdminMenu;
import com.chasonx.ucgs.entity.TmenuBtn;
import com.chasonx.ucgs.entity.TmenuBtnGroup;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.plugin.activerecord.Record;

/*
 * 权限拦截
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年7月7日下午3:11:56
 * @remark
 */
public class AdminUserInterceptor implements Interceptor {
	
	private static Set<String> menuUrlSet = new HashSet<String>();
	private static List<AdminMenu> menuList = null;
	
	static{
		menuList = AdminMenuDao.selectMenuList(1);
		if(!menuList.isEmpty()){
			for(int i = 0,len = menuList.size();i < len;i++){
				if(menuList.get(i).getLong("fparentid") != 0){
					menuUrlSet.add("/" + menuList.get(i).getStr("fmenurl"));
				}
			}
		}
	}

	public void intercept(Invocation ai) {
		try{
			String ackey = ai.getActionKey();
			String permission = "0";
			List<TmenuBtnGroup> groups = null;
			List<TmenuBtn> btns = null;
			if(menuUrlSet.contains(ackey)){
				ackey = ackey.substring(1);
				Record adminUser = DHttpUtils.getLoginUser(ai.getController().getRequest());
				
				Long menuid = 0l;
				for(int i = 0,len = menuList.size();i < len;i++){
					if(StringUtils.hasText(menuList.get(i).getStr("fmenurl")) && menuList.get(i).getStr("fmenurl").equals(ackey)){
						menuid = menuList.get(i).getLong("id");
						break;
					}
				}
				
				/*超级管理员   区域管理员*/
				if(adminUser.getInt("fsysroletype") == 1 || adminUser.getInt("groupadmin") == 1){
					permission = "allow";
				/*用户组冻结状态 & 用户区域状态*/
				}else if(adminUser.getInt("fstate") == 0 ){
					permission = AdminMenuDao.selectUrlPermission(menuid, adminUser.getStr("fguid"),adminUser.getStr("roleguid"));
				}
			
				if(permission.equals("allow")){
					groups = TmenuBtnGroup.group.find("select * from t_menu_btn_group where fmenuid = ?",menuid);
					btns = TmenuBtn.btn.find("select b.* from t_menu_btn b INNER JOIN t_menu_btn_group g ON b.fmbgid = g.id WHERE g.fmenuid = ? ",menuid);
				}else{
					groups = TmenuBtnGroup.group.find("select DISTINCT g.id, g.fmenubtngroup,g.fmenuid from t_menu_btn_group g INNER JOIN t_menu_btn b ON g.id = b.fmbgid where b.id in("+ permission +")");
					btns = TmenuBtn.btn.find("select * from t_menu_btn where id in("+ permission +")");
				}
			}
			ai.getController().setAttr("PagePermisstion", permission);
			ai.getController().setAttr("PermisstionBtnGroup", groups);
			ai.getController().setAttr("PermisstionBtn", btns);
			ai.invoke();
		}catch(Exception e){
			e.printStackTrace();
			Tools.writeLog(ai, e);
			
			Record ret = new Record()
			.set("result", 500)
			.set("msg", e.getMessage());
			ai.getController().renderJson(ret);
		}
	}
	
	
}
