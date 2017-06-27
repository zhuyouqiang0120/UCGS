/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : NoticeController 							     	
 **    Create  Time : 2017年5月19日 下午2:38:14								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.entity.TMaps;
import com.chasonx.ucgs.socket.MessClient;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月19日下午2:38:14
 * @version 1.0 
 */
public class NoticeController extends Controller {

	public void index(){
		render(PageUtil.NOTICE_INDEX);
	}
	
	public void publish(){
		String content = getPara("content");
		TMaps map = new TMaps()
		.set("ftargetguid", TokenUtil.getToken())
		.set("fkey", Constant.MapsType.Notice)
		.set("fvalue", content);
		boolean res = map.save();
		new MessClient().sendMess(content);
		renderJson(res?1:0);
	}
	
	public void list(){
		Integer pageNumber = getParaToInt("pageNumber");
		Integer pageSize = getParaToInt("pageSize");
		renderJson(Db.paginate(pageNumber, pageSize, "select * ", " from t_maps where fkey = '" +  Constant.MapsType.Notice + "' order by id desc"));
	}
	
}
