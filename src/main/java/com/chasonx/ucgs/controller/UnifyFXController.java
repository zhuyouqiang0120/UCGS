/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : UnifyFXController 							     	
 **    Create  Time : 2017年2月20日 上午9:41:09								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import java.util.Map;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.interceptor.Para;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.TableMapping;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年2月20日上午9:41:09
 * @version 1.0 
 */
public class UnifyFXController extends Controller {
	
	private final String pkgName = "com.chasonx.ucgs.entity.";
	
	@SuppressWarnings("rawtypes")
	@Required({
		@ParaEntity(name = "modelName"),
		@ParaEntity(name = "id")
	})
	@Before({Para.class,ParamInterceptor.class})
	public void getEntity(){
		String modelName = getPara("modelName");
		Object id = getPara("id");
		Record record = null;
		try {
			Model model = (Model) Class.forName(pkgName + modelName).newInstance();
			record = Db.findById(TableMapping.me().getTable(model.getClass()).getName(), id);
		} catch (Exception e) {
			e.printStackTrace();
		} 
		renderJson(record);
	}
	
	@SuppressWarnings("rawtypes")
	public void getRecordList(){
		String modelName = getPara("modelName");
		Integer pageNumber = getParaToInt("PageNumber");
		Integer pageSize = getParaToInt("PageSize");
		Model model = null;
		String msg = "ok";
		String tableName = null;
		StringBuilder where = new StringBuilder(" where 1 = 1 ");
		Record result = new Record();
		try{
			model = (Model) Class.forName(pkgName + modelName).newInstance();
			Map<String, String[]> attrs = getParaMap();
			
			String[] vals = null;
			tableName = TableMapping.me().getTable(model.getClass()).getName();
			for(String key : attrs.keySet()){
				if(key.equals("modelName") || key.equals("orderBy")) continue;
				if(!attrs.get(key)[0].isEmpty()){ // fguid : &,@|=,like,in,between|1,2,3,4
					vals = attrs.get(key)[0].split("\\|");
					if(vals.length < 3) continue;
					where.append(vals[0].replaceAll("(&){1}", " and ").replaceAll("(@){1}", " or "));
					if(vals[1].equalsIgnoreCase("between")){
						String[] bet = vals[2].split("$");
						where.append(key + " " + vals[1] + bet[0] + " and " + bet[1] + " ");
					}else{
						where.append(key + " " + vals[1] + " ");
					}
					if(vals[1].equalsIgnoreCase("in")) where.append("(" + StringUtils.join(vals[2].split(","), ",")+")");
					else where.append(vals[2]);
				}
			}
			String orderBy = getPara("orderBy");
			where.append(" order by " + (StringUtils.hasText(orderBy)?orderBy:"id desc"));
		}catch(Exception e){
			e.printStackTrace();
			msg = e.getMessage();
		}
		if(null == pageNumber)	result.set("reData", model.find("select * from " + tableName + where.toString()));
		else result.set("reData", Db.paginate(pageNumber, pageSize, "select * ","from " + tableName +  where.toString()));
		result.set("msg", msg);
		renderJson(result);
	}
	
	@SuppressWarnings("rawtypes")
	@Required({
		@ParaEntity(name = "modelName")
	})
	@Before({Para.class,ParamInterceptor.class})
	public void modifyData(){
		String modelName = getPara("modelName");
		Model entity = null;
		boolean res = false;
		String msg = "success";
		try{
			entity = Tools.recordConvertToEntity((Record) getAttr("RequestPara"), (Model) Class.forName(pkgName + modelName).newInstance());
			res = entity.update();
		}catch(Exception e){
			e.printStackTrace();
			msg = e.getMessage();
		}
		renderJson(new Record().set("result", res).set("msg", msg));
	}
	
	@SuppressWarnings("rawtypes")
	@Required({
		@ParaEntity(name = "modelName")
	})
	@Before({Para.class,ParamInterceptor.class})
	public void saveData(){
		String modelName = getPara("modelName");
		Model entity = null;
		boolean res = false;
		String msg = "success";
		try{
			entity = Tools.recordConvertToEntity((Record) getAttr("RequestPara"), (Model) Class.forName(pkgName + modelName).newInstance());
			res = entity.save();
		}catch(Exception  e){
			e.printStackTrace();
			msg = e.getMessage();
		}
		renderJson(new Record().set("result", res).set("msg", msg));
	}
	
	@SuppressWarnings("rawtypes")
	@Required({
		@ParaEntity(name = "modelName")
	})
	@Before({Para.class,ParamInterceptor.class})
	public void removeOrUpdate(){
		String modelName = getPara("modelName");
		String[] ids = getParaValues("ids[]");
		String type = getPara("type");
		Model entity = null;
		boolean res = false;
		String msg = "success";
		try{
			entity = Tools.recordConvertToEntity((Record) getAttr("RequestPara"), (Model) Class.forName(pkgName + modelName).newInstance());
			String tableName = TableMapping.me().getTable(entity.getClass()).getName();
			String sql = null;
			switch(type){
			case "remove":
				sql = "delete from " + tableName  + " where id in("+ StringUtils.join(ids, ",") +")";
				break;
			case "update":
				sql = "update " + tableName + " set " + convertToSql(entity) + " where id in("+ StringUtils.join(ids, ",") +")";
				break;
			}
			res = Db.update(sql) > 0;
		}catch(Exception e){
			e.printStackTrace();
			msg = e.getMessage();
		}
		renderJson(new Record().set("result", res).set("msg", msg));
	}
	
	private String convertToSql(@SuppressWarnings("rawtypes") Model model){
		StringBuilder sb = new StringBuilder(200);
		String[] attrNames = model.getAttrNames();
		for(int i = 0,len = attrNames.length;i < len;i++){
			sb.append(attrNames[i] + "= '" + model.get(attrNames[i]) + "'") ;
			if(i < (len - 1)) sb.append(",");
		}
		return sb.toString();
	}
}
