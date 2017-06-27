/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.api								 
 **    Type    Name : DesignerTemplateData 							     	
 **    Create  Time : 2017年4月17日 下午4:06:21								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.api;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.annotation.Api;
import com.chasonx.ucgs.annotation.ApiRemark;
import com.chasonx.ucgs.annotation.ApiTitle;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.PageResource;
import com.chasonx.ucgs.entity.PageResourceRelate;
import com.chasonx.ucgs.entity.TConfig;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年4月17日下午4:06:21
 * @version 1.0 
 */
public class DesignerTemplateData extends Controller {

	static SqlKit kit = new SqlKit("PageDesigner.xml");
	
	public void api(){
		String result = "";
		try {
			result = Api.getInfo(DesignerTemplateData.class, "/UCGS/data/tscaler/", "POST/GET","UCGS模板关联数据操作相关接口");
		} catch (Exception e) {
			e.printStackTrace();
			result = e.getMessage();
		}
		renderHtml(result);
	}
	
	/**
	 * 模板列表
	 * @author chasonx
	 * @create 2017年4月17日 下午4:09:51
	 * @update
	 * @param  
	 * @return void
	 */
	@ApiRemark("所有模板列表，按照站点进行分级")
	@Required(@ParaEntity(name = ApiConstant.jsonpName,desc = "jsonp参数名",empty = true))
	@ApiTitle("模板列表")
	public void list(){
		long st = System.currentTimeMillis();
		String fn = getPara(ApiConstant.jsonpName);
		Ret ret = new Ret();
		
		List<Record> data = new ArrayList<Record>();
		int result = 0;
		String msg = "ok";
		try{
			Record param = new Record().set("delete", 0).set("checked", 2);
			String sql = kit.loadSqlData("selectPageTemplateListField") + " ";
			List<Record> tList = Db.find(sql + kit.loadSqlData("selectPageTemplateList",param));
			List<Record> siteList = Db.find(sql + kit.loadSqlData("selectPageTemplateList",param.set("groupby", "GROUP BY p.fsiteguid")));
			String localHost = PublicDao.getFieldStr("remotehost", " and filetype = '"+ Constant.Config.TopicPreview.toString() +"'", TConfig.class);
			
			Record _rd;
			for(int i = 0,len = siteList.size();i < len;i++){
				_rd = new Record()
				.set("guid", siteList.get(i).get("fsiteguid"))
				.set("title", siteList.get(i).get("sitename"))
				.set("templates", getChildTempList(siteList.get(i).getStr("fsiteguid"), tList, localHost));
				data.add(_rd);
			}
			result = 1;
		}catch(Exception e){
			result = 500;
			msg = e.getMessage();
		}
		ret.setElapsed((System.currentTimeMillis() - st));
		ret.setData(data);
		ret.setMsg(msg);
		ret.setResult(result);
		
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else renderJson(ret);
	}
	/**
	 * 模板资源数据
	 * @author chasonx
	 * @create 2017年5月4日 下午5:55:59
	 * @update
	 * @param  
	 * @return void
	 */
	@ApiTitle("模板资源数据添加/编辑")
	@Required({
		@ParaEntity(name = "data",desc = "需要保存的数据",type = "String"),
		@ParaEntity(name = "dataType" , empty = true ,desc = "类型标识 1：普通类型、2：库类型",type = "int",mlen = 1,xlen = 2),
		@ParaEntity(name = "position",type = "String",mlen = 1,xlen = 40 ,desc = "位置标识",empty = true),
		@ParaEntity(name = "templateGuid" , desc = "模板GUID",mlen = 1,xlen = 40,empty = true),
		@ParaEntity(name = "key", empty = true,desc = "资源唯一Key",mlen = 1,xlen = 40),
		@ParaEntity(name = "resguidList",desc = "资源Guid，以“,”好分隔"),
		@ParaEntity(name = "uncheckedCount",desc = "未审核资源数量",type = "int",mlen = 1,xlen = 2),
		@ParaEntity(name = ApiConstant.jsonpName,desc = "jsonp参数名",empty = true)
	})
	@ApiRemark("用于编辑与模板广告位资源信息，dataType默认保存为库类型，只传必要的参数时则将数据保存为库类型，传递相关的参数可进行关联/更新")
	@Before(ParamInterceptor.class)
	public void modify(){
		long st = System.currentTimeMillis();
		Ret ret = new Ret();
		int result = 0;
		String msg = "";
		
		String data = getPara("data");
		Integer dataType = getParaToInt("dataType");
		String mediaData = getPara("mediaData");
		String position = getPara("position");
		String templateGuid = getPara("templateGuid");
		String resGuid = getPara("key");
		String key = getPara("key");
		String fn = getPara(ApiConstant.jsonpName);
		try{
			PageResource resource = PublicDao.getModel(PageResource.class, new Record().set("fguid", key));
			if(resource == null){
				String guid = StringUtils.hasText(key)?key:TokenUtil.getUUID();
				resource = new PageResource()
				.set("fguid", guid)
				.set("fdata", data)
				.set("fposition", position)
				.set("fmediadata", mediaData)
				.set("ftype", dataType == null?2:dataType);
				if( (result = resource.save()?1:0) > 0){
					if(StringUtils.hasText(templateGuid)){
						PageResourceRelate  resouceRelate = new PageResourceRelate()
						.set("ftemplateguid", templateGuid)
						.set("ftemplateresguid", guid);
						result = resouceRelate.save()?1:0;
						msg = result > 0?"ok":"save data relate faild";
					}
					msg = "ok";
				}else{
					msg = "save data faild";
				}
			}else if(StringUtils.hasText(resGuid)){
				resource = PublicDao.getModel(PageResource.class, new Record().set("fguid", resGuid));
				resource.set("fdata", data)
				.set("fmediadata", mediaData);
				
				result = resource.update()?1:0;
				msg = result > 0?"ok":"update data faild";
			}
		}catch(Exception e){
			msg = e.getMessage();
			result = 500;
		}
		ret.setElapsed((System.currentTimeMillis() - st));
		ret.setMsg(msg);
		ret.setResult(result);
		
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else renderJson(ret);
	}
	/**
	 * 模板资源库
	 * @author chasonx
	 * @create 2017年5月5日 下午5:35:27
	 * @update
	 * @param  
	 * @return void
	 */
	@ApiTitle("模板资源库列表")
	@Required({
		@ParaEntity(name = "dataType",empty = true,desc = "资源类型",type = "int"),
		@ParaEntity(name = "templateGuid",desc = "模板Guid",empty = true,mlen = 1,xlen = 40),
		@ParaEntity(name = "position" , empty = true,desc = "位置标识",mlen = 1,xlen = 40),
		@ParaEntity(name = "key" , empty = true , desc = "资源唯一key值",mlen = 1,xlen = 40),
		@ParaEntity(name = ApiConstant.jsonpName,desc = "jsonp参数名",empty = true)
	})
	@ApiRemark("默认列出所有资源，传递相应参数可进行筛选资源列表")
	@Before(ParamInterceptor.class)
	public void resourceLib(){
		long st = System.currentTimeMillis();
		Ret ret = new Ret();
		int result = 0;
		String msg = "ok";
		String dataType = getPara("dataType");
		String key = getPara("key");
		String templateGuid = getPara("templateGuid");
		String position = getPara("position");
		String fn = getPara(ApiConstant.jsonpName);
		List<String> data = new ArrayList<String>();
		try{
			Record param = new Record().set("templateGuid", templateGuid).set("dataType", dataType).set("position", position).set("key", key);
			List<Record> list = Db.find(kit.loadSqlData("selectPageTemplateResouceLibList", param));
			
			for(int i = 0,len = list.size();i < len;i ++)
				data.add(list.get(i).getStr("data"));
			
			result = 1;
		}catch(Exception e){
			msg = e.getMessage();
			result = 500;
		}
		
		ret.setElapsed((System.currentTimeMillis() - st));
		ret.setMsg(msg);
		ret.setResult(result);
		ret.setData(data);
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else renderJson(JsonKit.toJson(ret));
	}
	
	@ApiTitle("获取唯一Key值")
	@Required({
		@ParaEntity(name = ApiConstant.jsonpName,desc = "jsonp参数名",empty = true)
	})
	public void getKey(){
		long st = System.currentTimeMillis();
		String fn = getPara(ApiConstant.jsonpName);
		Ret ret = new Ret();
		ret.setData(TokenUtil.getUUID());
		ret.setMsg("ok");
		ret.setResult(1);
		ret.setElapsed((System.currentTimeMillis() - st));
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else renderJson(JsonKit.toJson(ret));
	}
	
	private List<Record> getChildTempList(String siteGuid,List<Record> dataSource,String host){
		List<Record> list = new ArrayList<Record>();
		for(int i = 0,len = dataSource.size();i < len;i++){
			if(dataSource.get(i).getStr("fsiteguid").equals(siteGuid))
				list.add(formatRecord(dataSource.get(i),host));
		}
		return list;
	}
	
	private Record formatRecord(Record red,String host){
		String[] attrs = red.getColumnNames();
		for(int i = 0,len = attrs.length;i < len;i++){
			if(attrs[i].startsWith("f")){
				red.set(attrs[i].replace("f", ""), red.get(attrs[i]));
				red.remove(attrs[i]);
			}
		}
		red.set("previewUrl",host + ApiConstant.tscalerPreviewUrl + red.getStr("guid"));
		red.remove("url","checked","state","adminguid");
		return red;
	}
}
