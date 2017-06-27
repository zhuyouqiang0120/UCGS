/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.api								 
 **    Type    Name : ColumnRequestData 							     	
 **    Create  Time : 2017年5月31日 上午10:20:18								
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
import com.chasonx.ucgs.controller.ColumnController;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.Column;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月31日上午10:20:18
 * @version 1.0 
 */
public class ColumnRequestData extends Controller {
	
	public void api(){
		String result = "";
		try {
			result = Api.getInfo(ColumnRequestData.class, "/UCGS/data/column/", "POST/GET","UCGS栏目数据操作相关接口");
		} catch (Exception e) {
			e.printStackTrace();
			result = e.getMessage();
		}
		renderHtml(result);
	}

	@ApiTitle("添加栏目信息")
	@ApiRemark("根据站点GUID添加栏目信息，添加成功返回栏目Guid，为避免出现乱码情况，中文请转换为Unicode码")
	@Required({
		@ParaEntity(name = "columname",xlen = 100,mlen = 1,desc = "栏目名称"),
		@ParaEntity(name = "cicon",desc = "栏目图标地址",xlen = 300,mlen = 1,empty = true),
		@ParaEntity(name = "clevel" ,desc = "栏目级数",empty = true),
		@ParaEntity(name = "cparentuid", desc = "父栏目Guid",empty = true,xlen = 40,mlen = 1),
		@ParaEntity(name = "csiteguid",desc = "站点Guid",mlen = 1,xlen = 40),
		@ParaEntity(name = "cremark",desc = "备注",empty = true),
		@ParaEntity(name = ApiConstant.jsonpName,desc = ApiConstant.jsonpDesc,empty = true)
	})
	@Before(ParamInterceptor.class)
	public void add(){
		long st = System.currentTimeMillis();
		String fn = getPara(ApiConstant.jsonpName);
		String guid = TokenUtil.getUUID();
		
		Ret ret = new Ret();
		int result = 0;
		String msg = "oK";
		try{
			Integer level = getParaToInt("clevel");
			level = level != null?level:1;
			String parentGuid = getPara("cparentuid");
			parentGuid = StringUtils.hasText(parentGuid)?parentGuid:0 + "";
			String remark = StringUtils.deUnicode(getPara("cremark"));
			remark = StringUtils.hasText(remark)?remark:"";
			
			Column col = new Column()
			.set("fguid", guid)
			.set("fservicename",StringUtils.deUnicode( getPara("columname") ))
			.set("ficon", getPara("cicon"))
			.set("flevel", level)
			.set("fparentuid", parentGuid)
			.set("fsiteguid", getPara("csiteguid"))
			.set("fremark", remark);
			
			result = ColumnDao.addColumn(col)?1:0;
		}catch(Exception e){
			result = 500;
			msg = e.getMessage();
			e.printStackTrace();
		}
		if(result > 0) ret.setData(guid);
		ret.setResult(result);
		ret.setMsg(msg);;
		ret.setElapsed((System.currentTimeMillis() - st) );
		
		if(StringUtils.hasText(fn))
			renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else
			renderJson(ret);
	}
	
	@ApiTitle("更新栏目信息")
	@ApiRemark("更新单条栏目信息")
	@Required({
		@ParaEntity(name = "guid",desc = "栏目Guid",xlen = 40,mlen = 1),
		@ParaEntity(name = "columname",xlen = 50,mlen = 1,desc = "栏目名称"),
		@ParaEntity(name = "cicon",desc = "栏目图标地址",xlen = 300,mlen = 1,empty = true),
		@ParaEntity(name = "clevel" ,desc = "栏目级数",empty = true),
		@ParaEntity(name = "cparentuid", desc = "父栏目Guid",empty = true,xlen = 40,mlen = 1),
		@ParaEntity(name = "csiteguid",desc = "站点Guid",mlen = 1,xlen = 40),
		@ParaEntity(name = "cremark",desc = "备注",empty = true),
		@ParaEntity(name = ApiConstant.jsonpName,desc = ApiConstant.jsonpDesc,empty = true)
	})
	@Before(ParamInterceptor.class)
	public void update(){
		long st = System.currentTimeMillis();
		String fn = getPara(ApiConstant.jsonpName);
		int result = 0;
		String mess = "ok";
		Ret ret = new Ret();
		try{
			Record rec = new Record()
			.set("fservicename", StringUtils.deUnicode( getPara("columname")) )
			.set("ficon", getPara("cicon"))
			.set("flevel", getPara("clevel"))
			.set("fparentuid", getPara("cparentuid"))
			.set("fsiteguid", getPara("csiteguid"))
			.set("fremark", StringUtils.deUnicode( getPara("cremark") ));
			result = Db.update( PublicDao.convertUpdateSql(Column.class, rec, new Record().set("fguid", getPara("guid"))));
		}catch(Exception e){
			result = 500;
			mess = e.getMessage();
		}
		ret.setElapsed( (System.currentTimeMillis() - st) );
		ret.setMsg(mess);
		ret.setResult(result);
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) + ")");
		else renderJson(ret);
	}
	
	@ApiTitle("删除栏目")
	@ApiRemark("根据栏目Guid删除栏目，若该栏目有子栏目则会一同删除")
	@Required({
		@ParaEntity(name = "guid",xlen = 40,mlen = 1,desc = "栏目GUID"),
		@ParaEntity(name = ApiConstant.jsonpName,empty = true,desc = ApiConstant.jsonpDesc)
	})
	@Before(ParamInterceptor.class)
	public void delete(){
		long st = System.currentTimeMillis();
		String fn = getPara(ApiConstant.jsonpName);
		int result = 0;
		String mess = "ok";
		try{
			String guid = getPara("guid");
			Column columnEntity = PublicDao.getModel(Column.class, new Record().set("fguid", guid));
			ColumnController colCtrl = new ColumnController();
			List<Column> columns = PublicDao.getList(Column.class, new Record().set("fsiteguid", columnEntity.get("fsiteguid")).set("fstate", 1));
			List<Column> container = new ArrayList<Column>();
			colCtrl.choseColumn(columns, container, guid);
			
			String[] idStr = new String[container.size() + 1];
		    for(int i = 0,len = container.size();i < len;i++){
		    	idStr[i] = container.get(i).getLong("id") + "";
		    }
		    idStr[container.size()] = columnEntity.getLong("id") + "";
		    
		    result = ColumnDao.delColumn(idStr) ? 1:0; 
			
		}catch(Exception e){
			result = 500;
			mess = e.getMessage();
		}
		Ret ret = new Ret();
		ret.setResult(result);
		ret.setMsg(mess);
		ret.setElapsed( (System.currentTimeMillis() - st) );
		
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(ret) +")");
		else renderJson(ret);
	}
	
}
