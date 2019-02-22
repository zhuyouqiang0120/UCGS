/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : DocController 							     	
 **    Create  Time : 2017年11月28日 上午9:34:24								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import com.alibaba.fastjson.JSONObject;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.DocDao;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Record;

/**
 * 文档/课件
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年11月28日上午9:34:24
 * @version 1.0 
 */
public class DocController extends Controller {

	public void index(){
		render(PageUtil.DOC_INDEX);
	}
	
	public void getAuthCode(){
		try {
			Record rec = DHttpUtils.getLoginUser(getRequest());
			JSONObject json = DocDao.getAuthCode();
			if(json != null){
				json.put("authCode", rec.getStr("fguid"));
				json.put("authName", rec.getStr("fadminname"));
				renderJson(json.toJSONString());
			}else{
				renderError(404);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
