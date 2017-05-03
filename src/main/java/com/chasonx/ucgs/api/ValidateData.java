/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年3月27日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.api;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.entity.AdminUser;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年3月27日 下午2:44:14
 * @remark 
 */
public class ValidateData extends Controller {

	/**
	 * @Tag       : 
	 * @createTime: 2016年3月27日 下午2:45:45
	 * @author    : Chason.x
	 */
	public void loginAuth(){
		String cb = getPara(ApiConstant.jsonpName);
		String uname = getPara("uName");
		String usession = getPara("uSession");
		if(!StringUtils.hasText(uname)) uname = "";
		if(!StringUtils.hasText(usession)) usession = "";
		
		AdminUser au = AdminUser.adminUserDao.findFirst("select * from t_adminuser where fadminuser = ? and floginSessionId = ?",uname,usession);
		Record res = new Record()
		.set("result", (au != null?1:0));
		renderJavascript(cb + "("+ JsonKit.toJson(res) +")");
	}
}
