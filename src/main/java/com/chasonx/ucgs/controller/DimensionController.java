/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : DimensionController 							     	
 **    Create  Time : 2016年10月18日 下午3:39:30								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2016 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import java.net.MalformedURLException;
import java.util.List;

import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.HessianFactory;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminUserDao;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.zens.udimension.entity.TDimension;
import com.zens.udimension.service.UDimensionService;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.om
 * @create  2016年10月18日下午3:39:30
 * @version 1.0 
 */
public class DimensionController extends Controller {
	
	private static String baseUrl = null;
	private static  UDimensionService service = null;
	
	static{
		try {
			baseUrl = Db.queryStr("SELECT localdir FROM `t_config` where filetype = ?",Constant.Config.UDimension.toString());
			service = HessianFactory.create(UDimensionService.class,baseUrl);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		}
	}

	public void index(){
		render(PageUtil.ADMIN_DIMENSION);
	}
	 
	
	/**
	 * 维度信息操作
	 * @author chasonx
	 * @create 2016年10月14日 下午4:06:29
	 * @update 
	 * @param  type value envalue parentGuid level icon remark state extdata clientGuid
	 * @return void 
	 */
	public void modifyDimension(){
		boolean result  = false;
		try{
			int type = Constant.ADMIN_DIMENSION_TYPE;
			String value = getPara("value");
			String envalue = getPara("envalue");
			String parentGuid = getPara("parentGuid");
			Integer level = getParaToInt("level");
			String icon = getPara("icon");
			String remark = getPara("remark");
			Integer state = getParaToInt("state");
			String extdata = getPara("extdata");
			int execType = getParaToInt("execType");
			String guid = getPara("guid");
			
			switch (execType) {
			case 1:
				result = service.saveDimension(type, value, envalue, parentGuid, level, icon, remark, state, extdata, Constant.UCGS_ClientGuid);
				break;
			case 2:
				result = service.updateDimension(guid, type, value, envalue, icon, remark, state, extdata);
				break;
			case 3:
				result = service.deleteDimensionGlobal(guid);
				break;
			case 4:
				result = service.setDimensionFrozenGlobal(state, guid);
				AdminUserDao.updateDimensionState(guid, state);
				break;
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(result?1:0);
	}
	/**
	 * 获取所有机构列表
	 * @author chasonx
	 * @create 2016年10月18日 下午5:29:55
	 * @update
	 * @param  
	 * @return void
	 */
	public void getAllDimensions(){
		int type = Constant.ADMIN_DIMENSION_TYPE;
		Integer state = getParaToInt("state");
		List<TDimension> allList = null;
		try {
			allList = service.getAllDimensions(state, type,null,null, Constant.UCGS_ClientGuid);
		} catch (Exception e) {
			e.printStackTrace();
		}
		renderJson(allList);
	}
	/**
	 * 移动
	 * @author chasonx
	 * @create 2016年10月21日 下午2:18:24
	 * @update
	 * @param  
	 * @return void
	 */
	public void moveDimension(){
		boolean result = false;
		try{
			String derection = getPara("derection");
			String sourceGuid = getPara("sourceGuid");
			String targetGuid = getPara("targetGuid");
			result = service.move(derection, sourceGuid, targetGuid);
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(result?1:0);
	}
}
