/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-14 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.api;

import java.util.List;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.dao.AdminUserDao;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.dao.TemplateDao;
import com.chasonx.ucgs.entity.AdminUser;
import com.chasonx.ucgs.entity.TemplateStatus;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月14日下午3:19:18
 * @remark
 */
public class MediaRequestData extends Controller {
	
	private static SqlKit kit = new SqlKit("MediaRequestData.xml");

	/**
	 * @Tag       :	
	 * @createTime: 2016年3月18日 下午1:28:44
	 * @author    : Chason.x
	 */
	public void getSiteList(){
		String cb = getPara(ApiConstant.jsonpName);
		String sql = kit.loadSqlData("getSiteList");
		List<Record> records = PublicDao.queryList(sql);
		renderJavascript(cb + "(" + JsonKit.toJson(getReturnJson(records,1,"ok")) + ")");
	}
	/**
	 * @Tag       : 弃用
	 * @createTime: 2016年3月18日 下午1:28:54
	 * @author    : Chason.x
	 */
	public void getMediaList(){
		String guid = getPara("guid");
		String cb = getPara(ApiConstant.jsonpName);
		if(StringUtils.hasText(guid)){
			String sql = kit.loadSqlData("getMediaList");
			renderJavascript(cb + "(" + JsonKit.toJson(getReturnJson(PublicDao.queryList(sql + "and ftempguid = ?",guid), 1, "ok").set("parentguid", guid)) + ")");
		}else{
			renderJavascript(cb + "(" + JsonKit.toJson(getReturnJson(null,0, "guid is null.")) + ")");
		}
	}
	
	/**
	 * @Tag       : 更新
	 * @createTime: 2016年3月18日 下午1:29:03
	 * @author    : Chason.x
	 */
	public void getTemplateList(){
		String guid = getPara("siteGuid");
		String cb = getPara(ApiConstant.jsonpName);
		if(StringUtils.hasText(guid)){
			renderJavascript(cb + "(" + JsonKit.toJson(getReturnJson( TemplateDao.getTempMediaRequestInfoList(guid,null) ,1, "ok")) + ")");
		}else{
			renderJavascript(cb + "(" + JsonKit.toJson(getReturnJson(null,0, "guid is null.")) + ")");
		}
	}
	
	public void mediaModify(){
		String guid = getPara("guid");
		String cb = getPara(ApiConstant.jsonpName);
		if(StringUtils.hasText(guid)){
			Integer state = getParaToInt("state");
			String modifyer = getPara("modifyer");
			String modifyTime = DateFormatUtil.formatString(null);
			String medialist = getPara("medialist");
			
			String sql = "select * from t_template_status where fguid = ?";
			
			TemplateStatus media = TemplateStatus.status.findFirst(sql,guid);
			media.set("fstate", state);
			media.set("fmodifytime", modifyTime);
			media.set("fmodifyer", modifyer);
			media.set("fextdata", medialist);
			media.set("fupload", 0);
			
			int res = media.update()?1:0;
			
			TemplateDao.updateTemplatePublisState(media.getStr("ftempguid"), state, true);
			
			renderJavascript(cb + "(" +JsonKit.toJson(getReturnJson(null, res, "ok")) + ")");
		}else{
			renderJavascript(cb + "(" + JsonKit.toJson(getReturnJson(null, 0, "guid is null.")) + ")");
		}
	}
	
	private Record getReturnJson(List<Record> data,int res,String mess){
		Record result = new Record();
		result.set("version", Constant.DATA_JSON_VERSION);
		result.set("desc", Constant.DATA_JSON_DESC);
		result.set("result", res);
		result.set("message", mess);
		if(data != null) result.set("data", data);
		return result;
	}
	/**
	 * 登录验证
	 * @author chasonx
	 * @create 2016年11月25日 下午1:20:06
	 * @update
	 * @param  
	 * @return void
	 */
	public void loginAuth(){
		String authName = getPara("authName");
		String authCode = getPara("authCode");
		Record result = new Record();
		boolean res = false;
		String userName = "";
		String userGuid = "";
		if(StringUtils.hasText(authName)){
			AdminUser user = AdminUserDao.selectUserEntity(authName);
			if(null != user && user.get("fadminpwd").equals(authCode)){
				userName = user.getStr("fadminname");
				userGuid = user.getStr("fguid");
				res = true;
			}
		}
		result.set("result", res);
		result.set("userName", userName);
		result.set("userGuid", userGuid);
		renderJson(result);
	}
}
