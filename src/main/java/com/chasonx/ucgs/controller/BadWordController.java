/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-11-25 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.BadWordDao;
import com.chasonx.ucgs.entity.BadWord;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-11-25上午11:20:42
 * @remark
 */
public class BadWordController extends Controller {
	
	@AnnPara("访问敏感词设置页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.TOPIC_BADWORD);
	}
	
	@AnnPara("敏感词编辑操作")
	@Before(SaveLog.class)
	public void modify(){
		int type = getParaToInt("type");
		boolean res = false;
		switch(type){
		case 1:
			BadWord bw = new BadWord();
			bw.set("fword", getPara("word"));
			bw.set("fstate", getParaToInt("fstate"));
			res = bw.save();
			break;
		case 2:
			String idStr = getPara("idStr");
			String sql = "update t_badword set fstate = ? where id in ("+ Tools.join(idStr.split(";"), ",") +")";
			res = Db.update(sql,getParaToInt("state")) > 0;
			break;
		case 3:
			String del = "delete from t_badword where id in ("+ Tools.join(getPara("idStr").split(";"), ",") +")";
			res = Db.update(del) > 0;
			break;
		}
		
		CacheKit.remove(Constant.CACHE_DEF_NAME, "badword");
		BadWordDao.getBadWordList(null);
		renderJson(res?1:0);
	}

	@AnnPara("查询敏感词列表")
	@Before(SaveLog.class)
	public void list(){
		int start = getParaToInt("PageNumber");
		int limit = getParaToInt("PageSize");
		start = (start + limit)/limit;
		Integer state = getParaToInt("state");
		String sql = " from t_badword where 1 = 1 ";
		if(null != state) sql += " and fstate = " + state;
		sql += " order by id desc";
		renderJson(Db.paginate(start, limit, "select * ", sql));
	}
	
	
}
