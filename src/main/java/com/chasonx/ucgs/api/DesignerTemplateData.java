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
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.TConfig;
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
	
	/**
	 * 模板列表
	 * @author chasonx
	 * @create 2017年4月17日 下午4:09:51
	 * @update
	 * @param  
	 * @return void
	 */
	public void list(){
		long st = System.currentTimeMillis();
		String fn = getPara(ApiConstant.jsonpName);
		Record ret = new Record();
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
		ret.set("elapsed", (System.currentTimeMillis() - st));
		ret.set("msg", msg);
		ret.set("data", data);
		ret.set("result", result);
		
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else renderJson(ret);
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
