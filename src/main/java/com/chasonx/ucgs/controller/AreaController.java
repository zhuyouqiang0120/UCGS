/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-11-12 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminAuthDao;
import com.chasonx.ucgs.dao.AreaDao;
import com.chasonx.ucgs.entity.Area;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-11-12下午3:35:56
 * @remark
 */
public class AreaController extends Controller {

	@AnnPara("访问区域设置页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ADMIN_AREA);
	}
	
	@SuppressWarnings("unchecked")
	@AnnPara("区域信息编辑操作")
	@Before({Para.class,SaveLog.class})
	public void modify(){
		Area area = Tools.recordConvertModel((Record)getAttr("RequestPara"), Area.class);
		int type = getParaToInt("type");
		int result = 0;
		
		boolean permiss = true;
		String perguid = null;
		if(StringUtils.hasText(area.getStr("fguid"))) perguid =  area.getStr("fguid");
		else if(StringUtils.hasText(area.getStr("fparentguid"))) perguid = area.getStr("fparentguid");
		if(StringUtils.hasText(perguid))	permiss  = AreaDao.checkPermission((List<Record>) getSession().getAttribute("ADMIN_AREA_LIST"), perguid);
		
		if(permiss){
			switch(type){
			case 1:
				area.set("fadminguid",DHttpUtils.getLoginUser(getRequest()).getStr("fguid"))
				.set("addtime", DateFormatUtil.formatString(null)).set("fguid", Tools.getGuid());
				result = AreaDao.save(area)?1:0;
				break;
			case 2:
				result = area.update()?1:0;
				break;
			case 3:
				result = Db.update("delete from t_area where id in ("+ getIdStr(area.getLong("id"), area.getStr("fguid")) +") ");
				break;
			case 4:
				result = Db.update("update t_area set fstate = ? where id in ("+ getIdStr(area.getLong("id"), area.getStr("fguid")) +")",area.getInt("fstate"));
				break;
			}
			/*reflash areasession*/
			MainController.areaSessionList(getRequest());
		}
		renderJson(result);
	}
	
	private String getIdStr(Long id,String guid){
		List<Area> data = Area.area.find("select * from t_area");
		List<Object> ids = new ArrayList<Object>();
		ids.add(id);
		chooseChildNode(ids, data, guid);
		return Tools.joinForList(ids, ",");
	}
	
	private void chooseChildNode(List<Object> list,List<Area> data,String parentguid){
		
		for(int i = 0,len = data.size();i < len;i++){
			if(StringUtils.hasText(data.get(i).getStr("fparentguid")) && parentguid.equals(data.get(i).getStr("fparentguid"))){
				list.add(data.get(i).getLong("id"));
				if(checkHasChild(data, data.get(i).getStr("fguid")) > 0)
					chooseChildNode(list, data, data.get(i).getStr("fguid"));
			}
		}
	}
	
	private int checkHasChild(List<Area> data,String pGuid){
		int res = 0;
		for(int i = 0,len = data.size();i < len;i ++){
			if(StringUtils.hasText(data.get(i).getStr("fparentguid")) && pGuid.equals(data.get(i).getStr("fparentguid"))){
				res = 1;
				break;
			}
		}
		return res;
	}
	
	@SuppressWarnings("unchecked")
	@AnnPara("查询区域列表")
	@Before(SaveLog.class)
	public void list(){
		List<Record> list = (List<Record>) getSession().getAttribute("ADMIN_AREA_LIST");
		renderJson(JsonKit.toJson(list));
	}
	
	@AnnPara("区域权限操作")
	@Before(SaveLog.class)
	public void permission(){
		int type = getParaToInt("type");
		String roleId = getPara("roleId");
		String[] areaGuid = getParaValues("areaGuid[]");
		boolean res = false;
		switch(type){
		case 1:
			AdminAuthDao.del(roleId, Constant.AuthTypes.area.toString());
			StringBuffer sb = new StringBuffer("insert into t_admin_auth(ftargetauthguid,fuserguid,ftype) values");
			for(int i = 0,len = areaGuid.length;i < len;i++){
				sb.append("('"+ areaGuid[i] +"','"+ roleId +"','"+ Constant.AuthTypes.area.toString() +"')");
				if(i < (len - 1)) sb.append(",");
			}
			res = Db.update(sb.toString()) > 0;
			break;
		case 2:
			res = AdminAuthDao.del(roleId, Constant.AuthTypes.area.toString());
			break;
		}
		renderJson(res ? 1:0);
	}
	
	@AnnPara("查询可操作区域列表")
	@Before(SaveLog.class)
	public void permissionList(){
		String userGuid = getPara("userGuid");
		List<Record> list = AreaDao.getHadAreaList(userGuid,0);
		renderJson(list);
	}
}
