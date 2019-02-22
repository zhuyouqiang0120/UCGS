/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : LabelController 							     	
 **    Create  Time : 2017年12月7日 下午12:17:06								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import com.chasonx.tools.StringUtils;
import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.common.Bean;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.TLabel;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年12月7日下午12:17:06
 * @version 1.0 
 */
public class LabelController extends Controller {

	public void index(){
		render(PageUtil.LABEL_INDX);
	}
	
	public void list(){
		String siteGuid = getPara("siteGuid");
		String columnGuid = getPara("columnGuid");
		String pid = getPara("pid");
		
		Record param = new Record();
		if(StringUtils.hasText(siteGuid)) param.set("l.fsiteGuid", siteGuid);
		if(StringUtils.hasText(columnGuid)) param.set("l.fcolumnGuid", columnGuid);
		if(pid != null) param.set("l.fparentId", pid);
		
		String sql = "SELECT l.*,s.fsitename as siteName,c.fservicename as colName FROM `t_label` l	INNER JOIN t_site s on l.fsiteGuid = s.fguid "
				+ "left JOIN t_column c ON l.fcolumnGuid = c.fguid";
		sql += PublicDao.getWhereSql(param) + " order by l.id desc";
		
		renderJson( Db.find(sql));
	}
	
	public void modify(){
		TLabel lab = Bean.getModel(getRequest(), TLabel.class);
		if(lab.get("id") == null){
			lab.set("fguid", TokenUtil.getUUID());
			renderJson(lab.save()? 1:0);
		}else{
			renderJson(lab.update()?1:0);
		}
	}
	
	public void delete(){
		int type = getParaToInt("type");
		String[] ids = getParaValues("ids[]");
		String sql = "";
		String idStr = StringUtils.joinSimple(ids, ",");
		if(type == 1) sql += " or fparentId in (" + idStr + ")";
		renderJson(Db.update("delete from " + PublicDao.getTableName(TLabel.class) + " where id in ("+ idStr +") " + sql));
	}
	
}
