/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.api								 
 **    Type    Name : TopicApi 							     	
 **    Create  Time : 2016年9月21日 下午3:41:38								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2016 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.api;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.Api;
import com.chasonx.ucgs.annotation.ApiRemark;
import com.chasonx.ucgs.annotation.ApiTitle;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.HttpStateEntity;
import com.chasonx.ucgs.common.PageViewConstant;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.dao.StatisticsDao;
import com.chasonx.ucgs.dao.TopicDao;
import com.chasonx.ucgs.dao.TopicOuterResourceFixed;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.tx.Tx;

/**主题注入相关API
 * @author  Chasonx
 * @email   xzc@zensvision.om
 * @create  2016年9月21日下午3:41:38
 * @version 1.0 
 */
public class TopicApi extends Controller {

	public void api(){
		String result = "";
		try {
			result = Api.getInfo(TopicApi.class, "/UCGS/api/topic", "POST/GET","UCGS主题注入接口");
		} catch (Exception e) {
			e.printStackTrace();
			result = e.getMessage();
		}
		renderHtml(result);
	}
	
	/**
	 * 注入主题数据
	 * @author chasonx
	 * @create 2016年9月21日 下午4:56:24
	 * @update
	 * @param  
	 * @return void
	 */
	@ApiTitle("UCGS主题注入接口")
	@ApiRemark("第三方接口注入主题资源")
	@Required({
		@ParaEntity(name = "topicId",xlen = 40,desc = "主题Id"),
		@ParaEntity(name = "tcolmunId",xlen = 40,desc = "栏目Guid"),
		@ParaEntity(name = "tsiteId",xlen = 40,desc = "站点Guid"),
		@ParaEntity(name = "title",xlen = 500,desc = "标题"),
		@ParaEntity(name = "tsource",xlen = 100,desc = "来源"),
		@ParaEntity(name = "tclass",xlen = 2,desc = "分类"),
		@ParaEntity(name = "tcontent",desc = "内容"),
		@ParaEntity(name = "tinjecter",xlen = 40,desc = "编辑人"),
		@ParaEntity(name = "thumbnail",xlen = 400,empty = true,desc = "缩略图路径"),
		@ParaEntity(name = "tinjectTime",xlen = 40,empty = true,desc = "注入时间"),
		@ParaEntity(name = "tlabel",xlen = 200,empty = true,desc = "标签"),
		@ParaEntity(name = "tsummary",xlen = 500,empty = true,desc = "简介"),
		@ParaEntity(name = "tpvSize",xlen = 11,empty = true,desc = "浏览量"),
		@ParaEntity(name = "titleSec",xlen = 500,empty = true,desc = "二级标题"),
		@ParaEntity(name = ApiConstant.jsonpName,desc = ApiConstant.jsonpName,empty = true)
	})
	@Before(ParamInterceptor.class)
	public void inject(){
		String fn = getPara(ApiConstant.jsonpName);
		HttpStateEntity he = new HttpStateEntity();
		long startTime = System.currentTimeMillis();
		try{
			String titleSec = getPara("titleSec");
			String fthumbnail = getPara("thumbnail");
			String fsummary = getPara("tsummary");
			String flabel = getPara("tlabel");
			String fpvsize = getPara("tpvSize");
			String topicId = getPara("topicId");
			String tcolumnId = getPara("tcolmunId");
			String tsiteId = getPara("tsiteId");
			String title = getPara("title");
			String tsource = getPara("tsource");
			int tclass = getParaToInt("tclass");
			String tcontent = getPara("tcontent");
			String tinjecter = getPara("tinjecter");
			String tinjectTime= getPara("tinjectTime");
			String auditStatus = getPara("auditStatus"); //审核状态
			
			tcontent = StringUtils.deUnicode(tcontent);
			tcontent = TopicOuterResourceFixed.filterOutResouceContent(tcontent, tsiteId, Constant.FILE_TYPE_IMAGE, tinjecter, "");
			
			if(StringUtils.hasText(fthumbnail) && fthumbnail.indexOf(SystemConstant.SYS_CODE) == -1 && fthumbnail.indexOf(Constant.IMG_CATCH_DIR) == -1)
				fthumbnail = "/" + SystemConstant.SYS_CODE + TopicOuterResourceFixed.filterOutResouceStr(fthumbnail, tsiteId, Constant.FILE_TYPE_IMAGE, StringUtils.deUnicode(tinjecter), "");
			
			if(null == Topic.infomationDao.findFirst("select * from t_topic where fguid = ?",topicId)){
				Topic t = new Topic();
				t.set("fguid", topicId).set("ftitle", StringUtils.deUnicode( title))
				.set("ftitlesec", StringUtils.hasText(titleSec)?StringUtils.deUnicode(titleSec):null).set("fsummary", StringUtils.hasText(fsummary)?StringUtils.deUnicode(fsummary):null)
				.set("fsource",StringUtils.deUnicode( tsource)).set("fclass", tclass)
				.set("freleasetime", StringUtils.hasText(tinjectTime)?tinjectTime : DateFormatUtil.formatString(null))
				.set("freleaseer", StringUtils.deUnicode(tinjecter)).set("fthumbnail", fthumbnail)
				.set("flabel", StringUtils.hasText(flabel)?StringUtils.deUnicode(flabel):null).set("fpvsize", StringUtils.hasText(fpvsize)?fpvsize:0);
				t.save();
				
				TopicContent topicCon = new TopicContent();
				topicCon.set("ftopicguid",topicId)
				.set("fcontent", tcontent)
				.save();
				
				TopicDao.addTopicRelate(tcolumnId, topicId, null, 0, tsiteId, 0);
				ColumnDao.changeCheckSize(tcolumnId, 1, 0,0);
				
				if(StringUtils.hasText(auditStatus) && auditStatus.equals("check") ){
					TopicDao.updateTopicCheck(new String[]{topicId}, Constant.TOPIC_CHECK_SUCCESS);
					TopicDao.modifyTopicForColumnAttrReSet("'" + topicId + "'", "check", false);
				}
				
				he.setCode(200);
				he.setResult("ok");
			}else{
				he.setCode(201);
				he.setResult("the topic is exist");
			}
			
			StatisticsDao.cacheStatisticsData(getRequest(), "inject", null, null, null, startTime, PageViewConstant.InterFaceType);
		}catch(Exception e){
			e.printStackTrace();
			he.setCode(500);
			he.setResult(e.getMessage());
		}
		
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(he) +")");
		else renderJson(he);
	}
	
	/**
	 * 注入主题下架
	 * @author chasonx
	 * @create 2016年9月22日 下午2:19:49
	 * @update
	 * @param  
	 * @return void
	 */
	@ApiTitle("主题下架")
	@ApiRemark("下架后可在回收站恢复")
	@Required({
		@ParaEntity(name = "topicId",desc = "主题Guid"),
		@ParaEntity(name = ApiConstant.jsonpName,desc = ApiConstant.jsonpName,empty = true)
	})
	@Before({ParamInterceptor.class,Tx.class})
	public void underFrame(){
		String fn = getPara(ApiConstant.jsonpName);
		HttpStateEntity he = new HttpStateEntity();
		long startTime = System.currentTimeMillis();
		try{
			String[] tids = getPara("topicId").split(",");
			String tidStr =  StringUtils.join(tids, ",");
			int res = Db.update(" update t_topic_relate set fdelete = 1 where ftopicguid in (" + tidStr + ")");
			if(res > 0){
				 TopicDao.modifyTopicForColumnAttrReSet(tidStr, "recyle" ,false);
			}
			he.setCode(200);
			he.setResult("ok");
			
			///
			StatisticsDao.cacheStatisticsData(getRequest(), "underFrame", null, null, null, startTime, PageViewConstant.InterFaceType);
		}catch(Exception e){
			e.printStackTrace();
			he.setCode(500);
			he.setResult("exception");
		}
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(he) +")");
		else renderJson(he);
	}
	
	/**
	 * 主题删除
	 * @author chasonx
	 * @create 2017年1月4日 上午10:42:45
	 * @update
	 * @param  
	 * @return void
	 */
	@ApiTitle("主题删除")
	@ApiRemark("主题删除后不可恢复")
	@Required({
		@ParaEntity(name = "topicId",desc = "主题Guid"),
		@ParaEntity(name = ApiConstant.jsonpName,desc = ApiConstant.jsonpName,empty = true)
	})
	@Before({ParamInterceptor.class,Tx.class})
	public void delete(){
		String fn = getPara(ApiConstant.jsonpName);
		HttpStateEntity he = new HttpStateEntity();
		long startTime = System.currentTimeMillis();
		try{
			String[] tids = getPara("topicId").split(",");
			String tidStr =  StringUtils.join(tids, ",");
			int res = Db.update(" update t_topic_relate set fdelete = 1 where ftopicguid in (" + tidStr + ")");
			if(res > 0){
				 TopicDao.modifyTopicForColumnAttrReSet(tidStr, "delete" ,false);
			}
			he.setCode(200);
			he.setResult("ok");
			
			///
			StatisticsDao.cacheStatisticsData(getRequest(), "delete", null, null, null, startTime, PageViewConstant.InterFaceType);
		}catch(Exception e){
			e.printStackTrace();
			he.setCode(500);
			he.setResult("exception");
		}
		if(StringUtils.hasText(fn)) renderJavascript(fn + "("+ JsonKit.toJson(he) +")");
		else renderJson(he);
	}
	
}
