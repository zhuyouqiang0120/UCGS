
/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-4-2 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;


import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.chasonx.directory.FileUtil;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.tools.TokenUtil;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.BadWordDao;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.dao.TopicDao;
import com.chasonx.ucgs.dao.TopicOuterResourceFixed;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.entity.Template;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.chasonx.ucgs.entity.TopicRelate;
import com.chasonx.ucgs.interceptor.Form;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

/**
 * 资讯模块
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-4-2下午4:26:01
 * @remark
 */
public class TopicController extends Controller {

	@AnnPara("访问主题列表页面")
	@Before(SaveLog.class)
	public void index(){
		setAttr("PAGETYPE", 1);
		render(PageUtil.TOPIC_LIST);
	}
	
	/**
	 * 回收站
	 * void
	 */
	@AnnPara("访问主题回收站页面")
	@Before(SaveLog.class)
	public void recyclebin(){
		setAttr("PAGETYPE", 2);
		render(PageUtil.TOPIC_LIST);
	}
	/**
	 *审核 
	 * void
	 */
	@AnnPara("访问主题审核页面")
	@Before(SaveLog.class)
	public void check(){
		setAttr("PAGETYPE", 3);
		render(PageUtil.TOPIC_LIST);
	}
	
	/**
	 * 专题编辑
	 * void
	 */
	@AnnPara("访问主题编辑页面")
	@Before(SaveLog.class)
	public void edittopic(){
		Long id = getParaToLong(0);
		Record info = null;
		if(null != id){
			info = TopicDao.selectTopicEntity(id);
		}
		createToken(Constant.FORMDATA_TOKEN_NAME, 300);
		setAttr("TOPICALINFO",info);
		render(PageUtil.TOPIC_EDIT);
	}
	
	/**
	 * 设置置顶
	 * void
	 */
	@AnnPara("设置主题置顶")
	@Before({POST.class,SaveLog.class})
	public void topicsettop(){
		String idString = getPara("idStr");
		Integer top = getParaToInt("top");
		renderJson(TopicDao.updateNewsForTop(idString.split(";"), top)?1:0);
	}
	/**
	 * 文章内容列表
	 * void
	 */
	@AnnPara("查询主题内容列表")
	@Before({POST.class,SaveLog.class})
	public void topiccontents(){
		renderJson(TopicDao.selectNewsContent(getParaToLong("pk")));
	}
	
	/**
	 *审核 / 删除到回收站 / 删除 
	 * void
	 */
	@AnnPara("审核/删除到回收站/删除主题")
	@Before({Tx.class,SaveLog.class})
	public void topicdelete(){
		int type = getParaToInt("type");
		String idStr = getPara("idStr");
		String colGuid = getPara("colGuid");
		String[] idList = idStr.split(";");
	
		boolean res = false;
		switch(type){
		case 1:
			Integer check   = getParaToInt("check");
			Integer oldCheck = getParaToInt("oldCheck");
			res = TopicDao.updateTopicCheck(idList, check);
			//ColumnDao.changeCheckSize(colGuid, idList.length, check,oldCheck);
			TopicDao.modifyTopicForColumnAttrReSet(StringUtils.join(idList, ","), check == 2?"nocheck":"check",oldCheck == 1);
			break;
		case 2:
			Integer del = getParaToInt("fdelete");
			res = TopicDao.updateDelete(idList,colGuid,del);
			String idStrs = StringUtils.join(idList, ",");
			if(del == 0)  TopicDao.modifyTopicForColumnAttrReSet(idStrs, "recovery",false);//ColumnDao.changeRecyleSize("-", colGuid,idList.length, false);
			else TopicDao.modifyTopicForColumnAttrReSet(idStrs, "recyle",false);  //ColumnDao.changeRecyleSize("+", colGuid,idList.length, true);
			break;
		case 3:
			TopicDao.modifyTopicForColumnAttrReSet(StringUtils.join(idList, ","), "delete",false);
			res = TopicDao.deleteTopic(idList);
			//ColumnDao.changeRecyleSize("-", colGuid, idList.length, true);
			break;
		}
		renderJson(res?1:0);
	}
	
	/**
	 * 主题操作
	 * void
	 */
	@AnnPara("视频主题操作")
	@Before({Para.class,Form.class,SaveLog.class})
	public void videoTopicOperation(){
		Topic info = Tools.recordConvertModel((Record)getAttr("RequestPara"), Topic.class);
		int type = getParaToInt("type");
		
		info = topicAttrFilter(info);
		boolean res = false;
		switch(type){
		case 1:
			String colGuid = getPara("colguid");
			int topicType = getParaToInt("topicType");
			String siteGuid = getPara("siteGuid");
			
			Record logRec = DHttpUtils.getLoginUser(getRequest());
			
			info.set("freleaseer", logRec.get("fadminname"));
			info.set("freleasetime", DateFormatUtil.formatString(null));
			if(!StringUtils.hasText(info.getStr("fguid")))	 info.set("fguid", Tools.getGuid());
			Long id = TopicDao.addTopic(info);
			
			if(id != null){
				res = TopicDao.addTopicRelate(colGuid, info.getStr("fguid"),logRec.getStr("fguid"),topicType,siteGuid,0);
				ColumnDao.changeCheckSize(colGuid, 1, 0,0); 
			}
			break;
		case 2:
			res = info.update();
			break;
		case 3:
			res = Topic.infomationDao.deleteById(getParaToLong("topicid"));
			break;
		}
		createToken(Constant.FORMDATA_TOKEN_NAME, 300);
		renderJson(res?getAttr(Constant.FORMDATA_TOKEN_NAME):0);
	}
	
	/**
	 * 
	 */
	@AnnPara("常规主题操作")
	@Before({Para.class,Form.class,Tx.class,SaveLog.class})
	public void textTopicOperation(){
		Topic topic = Tools.recordConvertModel((Record)getAttr("RequestPara"), Topic.class);
		String colGuid = getPara("colguid");
		String siteGuid = getPara("siteGuid");
		Record logRec = DHttpUtils.getLoginUser(getRequest());
		
		Integer tempId = getParaToInt("templateId");
		int type = getParaToInt("type");
		String[] contents = getParaValues("contents[]");
		
		boolean res = false;
		if(contents != null && contents.length > 0){
			contents = TopicOuterResourceFixed.filterOutResouceContent(contents, siteGuid, Constant.FILE_TYPE_IMAGE, logRec.getStr("fadminname"), logRec.getStr("fguid"));
			contents = badWordReplace(contents,false);
		}
		topic = topicAttrFilter(topic);
		
		switch (type) {
		case 1:
			String guid = Tools.getGuid();
			int topicType = getParaToInt("topicType");
			topic.set("fguid", guid);
			topic.set("freleaseer", logRec.get("fadminname"));
			topic.set("freleasetime", DateFormatUtil.formatString(null));
			res = topic.save();
			if(res){
				
				TopicDao.addTopicContent(contents, guid);
				
				if(topic.getLong("id") != null){
					res = TopicDao.addTopicRelate(colGuid, guid,logRec.getStr("fguid"),topicType,siteGuid,tempId);
					ColumnDao.changeCheckSize(colGuid, 1, 0,0);
				}
			}else{
				 throw new RuntimeException();
			}
			break;
		case 2:
			TopicDao.deleteContent(topic.getStr("fguid"));
			res = topic.update();
			TopicDao.updateTemplate(topic.getStr("fguid"), colGuid, tempId == null?0:tempId);
			if(res){
				TopicDao.addTopicContent(contents, topic.getStr("fguid"));
			}else{
				throw new RuntimeException();
			}
			break;
		default:
			break;
		}
		createToken(Constant.FORMDATA_TOKEN_NAME, 300);
		renderJson(res?getAttr(Constant.FORMDATA_TOKEN_NAME):0);
	}
	
	private Topic topicAttrFilter(Topic t){
		String[] titleString = new String[4];
		try{
			titleString[0] = t.getStr("ftitle");
			titleString[1] = t.getStr("ftitlesec");
			titleString[2] = t.getStr("fsource");
			titleString[3] = t.getStr("fsummary");
			titleString = badWordReplace(titleString, false);
			
			if(StringUtils.hasText(titleString[0])) t.set("ftitle", titleString[0]);
			if(StringUtils.hasText(titleString[1])) t.set("ftitlesec", titleString[1]);
			if(StringUtils.hasText(titleString[2])) t.set("fsource",titleString[2]);
			if(StringUtils.hasText(titleString[3])) t.set("fsummary", titleString[3]);
		}catch(Exception e){
			e.printStackTrace();
		}
		return t;
	}
	
	@AnnPara("敏感词检测")
	@Before({Para.class,SaveLog.class})
	public void badwordCheck(){
		Topic topic = Tools.recordConvertModel((Record)getAttr("RequestPara"), Topic.class);
		String[] contents = getParaValues("contents[]");
		contents = badWordReplace(contents, true);
		topic = topicAttrFilter(topic);
		
		Record ret = new Record().set("contentData", contents).set("topicData", topic);
		renderJson(ret);
	}
	
	private String[] badWordReplace(String[] content,boolean ret){
		
		List<Record> badWord = BadWordDao.getBadWordList(0);
		Map<Integer, String> idxMap;
		int start = 0;
		String word;
		for(int s = 0,slen = content.length;s < slen;s++){
			if(content[s] != null){
				idxMap = new HashMap<Integer, String>();
				
				for(int i = 0,len = badWord.size();i < len;i++){
					
					word = badWord.get(i).getStr("fword");
					start = content[s].indexOf(word);
					if(start >= 0){
						idxMap.put(start,ret?word:changePattenForStr(word));
					}
				}
				
				String badword;
				for(Iterator<Integer> ite = idxMap.keySet().iterator();ite.hasNext();){
					badword = idxMap.get(ite.next().intValue()).toString();
					if(ret){
						content[s] = content[s].replaceAll(badword, "<span style='background:#f09;color:#ffffff;'>" + badword + "</span>");
					}else{
						content[s] = content[s].replaceAll(badword, "***");
					}
				}
			}
		}
		return content;
	}
	
	private String changePattenForStr(String str){
		String patten = "";
		for(int i = 0,len = str.toCharArray().length;i < len;i++){
			patten += "[" + str.charAt(i) + "]";
			if(i < (len - 1)) patten += Constant.TOPCI_CONTENT_REGEX;
		}
		return patten;
	}
	
	@AnnPara("查询主题内容列表")
	@Before(SaveLog.class)
	public void textContentList(){
		renderJson(Topic.infomationDao.find("select * from t_topic_content where ftopicguid = ?",getPara("guid")));
	}
	
	/**
	 * 主题列表
	 * void
	 */
	@AnnPara("查询主题列表")
	@Before({POST.class,SaveLog.class})
	public void topiclist(){
		int start = getParaToInt("PageNumber");
		int limit = getParaToInt("PageSize");
		start = (start + limit)/limit;
		
		String siteGuid = getPara("siteGuid");
		renderJson(TopicDao.selectTopicList(start, limit, getPara("colGuid")  , getParaToInt("delete"),getParaToInt("check"),DHttpUtils.getLoginUser(getRequest()),siteGuid));
	}
	/**
	 * 主题查询
	 * void
	 * @createTime:2015-12-1 上午10:52:22
	 * @author: chason.x
	 */
	@AnnPara("主题筛选")
	@Before(SaveLog.class)
	public void topicQuery(){
		int pageNum = getParaToInt("PageNumber");
		int pageSize = getParaToInt("PageSize");
		pageNum = (pageNum + pageSize)/pageSize;
		String start = getPara("startTime");
		String end = getPara("endTime");
		String title = getPara("title");
		renderJson(TopicDao.selectTopicListForQuery(pageNum, pageSize, title, start, end, DHttpUtils.getLoginUser(getRequest())));
	}
	
	/**
	 * 主题详细信息
	 * void
	 * @createTime:2015-10-28 下午4:21:58
	 * @author: chason.x
	 */
	@AnnPara("查询主题详细信息")
	@Before(SaveLog.class)
	public void topicDetail(){
		renderJson(Topic.infomationDao.findById(getParaToLong("id")));
	}
	/**
	 * 下载远程图片
	 * void
	 * @createTime:2015-12-23 下午1:34:18
	 * @author: chason.x
	 */
	@AnnPara("下载远程图片")
	@Before(SaveLog.class)
	public void downLinkImage(){
		String imgUrl = getPara("imgUrl");
		String siteGuid = getPara("siteGuid");
		Record loginUser = DHttpUtils.getLoginUser(getRequest());
		
		int res = 0;
		try{
			imgUrl = TopicOuterResourceFixed.filterOutResouceStr(imgUrl, siteGuid, Constant.FILE_TYPE_IMAGE, loginUser.getStr("fadminname"), loginUser.getStr("fguid"));
			res = 1;
		}catch(Exception e){
			res = 0;
		}
		renderJson("{\"local\":\"" + imgUrl + "\",\"result\":\""+ res +"\"}");
	}
	
	@AnnPara("查询主题模板列表")
	@Before(SaveLog.class)
	public void topicTemplateList(){
		String siteGuid = getPara("siteGuid");
		List<Record> tempList = null;
		if(StringUtils.hasText(siteGuid)){
			tempList = Db.find("SELECT id,ftname,frawdata FROM `t_template` where fsiteguid = ? and not ISNULL(fhtmldata)",siteGuid);
		}
		renderJson(tempList == null?"":tempList);
	}
	
	@AnnPara("主题移动/复制")
	@Before(SaveLog.class)
	public void mover(){
		String type = getPara("type"); 
		String targetColGuid = getPara("targetColGuid");
		String sourceColGuid = getPara("sourceColGuid");
		String targetSiteGuid = getPara("targetSiteGuid");
		String[] topicGuidArray = getParaValues("topicGuid[]");
		Integer templateId = getParaToInt("templateId");
		
		Record adminGuid = DHttpUtils.getLoginUser(getRequest());
		int res = 0;
		
		try{
		int batchSize = 0;
		String topicGuidStr = "";
		
		if(type.equals("copy")){
			List<Topic> list = null;
			List<TopicContent> conList = null;
			List<TopicRelate> rList = null;
			String where = " select ftopicguid from t_topic_relate where fcolguid = ?";
			if(null == topicGuidArray || topicGuidArray.length == 0){
				list =  Topic.infomationDao.find("select * from t_topic where fguid in (" + where + ") ",sourceColGuid); 
				rList = TopicRelate.infomationRelateDao.find("select * from t_topic_relate where fcolguid = ?",sourceColGuid);
				conList = TopicContent.contentDao.find("select * from t_topic_content where ftopicguid in ( select ftopicguid from t_topic_relate where  fcolguid = ? )",sourceColGuid);
			}else{
				topicGuidStr = Tools.join(topicGuidArray, ",");
				list = Topic.infomationDao.find("select * from t_topic where fguid in ("+ topicGuidStr +")");
				rList = TopicRelate.infomationRelateDao.find(" select * from t_topic_relate where ftopicguid in ("+ topicGuidStr +") ");
				conList = TopicContent.contentDao.find("select * from t_topic_content where ftopicguid in ("+ topicGuidStr +")");
			}
			
			if(!list.isEmpty()){
				batchSize = list.size();
				String topicGuid = null;
				int i = 0;
				int r = 0;
				int c = 0;
				int len = 0;
				int rlen = 0;
				int clen = 0;
				int addSize = 0;
				String oldTopicGuid = null;
				for( i = 0,len = list.size();i < len;i++){
					oldTopicGuid = list.get(i).getStr("fguid");
					Topic topic = list.get(i);
						topicGuid = Tools.getGuid();
						topic.remove("id")
						.set("fguid", topicGuid)
						.set("freleaseer", adminGuid.getStr("fadminname"))
						.save();
						//relate
						for(r = 0,rlen = rList.size();r < rlen;r++){
							if(rList.get(i).getStr("ftopicguid").equals(oldTopicGuid)){
								TopicRelate relate = rList.get(r);
								relate.remove("id")
								.set("ftopicguid", topicGuid)
								.set("fcolguid", targetColGuid)
								.set("fsiteguid", targetSiteGuid)
								.set("fadminuserguid", adminGuid.getStr("fguid"))
								.set("ftemplateid", templateId != null?templateId:relate.getInt("ftemplateid"))
								.save();
								addSize ++;
								break;
							}
						}
						//content
						for(c = 0,clen = conList.size();c < clen;c++){
							if(conList.get(c).getStr("ftopicguid").equals(oldTopicGuid)){
								TopicContent content = conList.get(c);
								content.remove("id")
								.set("ftopicguid", topicGuid)
								.save();
							}
						}
				}
				res = (len == addSize)?1:0;
			}
		}else if(type.equals("move")){
			List<TopicRelate>  list = null;
			
			if(null == topicGuidArray || topicGuidArray.length == 0){
				list = TopicRelate.infomationRelateDao.find("select * from t_topic_relate where fcolguid = ?",sourceColGuid);
				batchSize = list.size();
				for(int r = 0,rlen = list.size();r < rlen;r++){
					topicGuidStr += "'" + list.get(r).getStr("ftopicguid") + "'";
					if(r < (rlen - 1)) topicGuidStr += ",";
				}
			}else{
				topicGuidStr = Tools.join(topicGuidArray, ",");
				list = TopicRelate.infomationRelateDao.find("select * from t_topic_relate where fcolguid = ? and ftopicguid in ("+ topicGuidStr +")",sourceColGuid);
				batchSize = topicGuidArray.length;
			}
			
			String where = "";
			if(templateId != null) where = ",ftemplateid=" + templateId;
			String sql = "update t_topic_relate set fcolguid = ?,fadminuserguid = ?,fsiteguid = ?"+ where +" where ftopicguid in ("+ topicGuidStr +")";
			res = Db.update(sql,targetColGuid,adminGuid.getStr("fguid"),targetSiteGuid);
			
			if(res > 0) Db.update("update t_column set ftopicsize = ftopicsize - " + batchSize + " where ftopicsize > 0 and fguid = ?",sourceColGuid);
		}
		if(res > 0) Db.update("update t_column set ftopicsize = ftopicsize + " + batchSize + " where fguid = ?",targetColGuid);
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(res);
	}
	/**
	 * @Tag       : 主题排序
	 * @createTime: 2016年2月1日 下午1:35:44
	 * @author    : Chason.x
	 */
	public void sort(){
		String type = getPara("type");
		String target = getPara("target");
		String source = getPara("source");
		
		TopicRelate rTar = TopicRelate.infomationRelateDao.findById(target);
		int res = 0;
		if(type.equals("top")){
			rTar.set("fsortnum", (TopicDao.getTopicRelateSortNum(rTar.getStr("fcolguid")) + 1));
			res = rTar.update()?1:0;
		}else if(type.equals("bottom")){
			rTar.set("fsortnum",  (TopicDao.getTopicRelateMinSortNum(rTar.getStr("fcolguid")) - 1));
			res = rTar.update()?1:0;
		}else if(type.equals("prev") || type.equals("next")){
			TopicRelate rSou = TopicRelate.infomationRelateDao.findById(source);
			Integer tarTemp = rSou.getInt("fsortnum");
			Integer sorTemp = rTar.getInt("fsortnum");
			res = rTar.set("fsortnum", tarTemp).update()?1:0;
			res = rSou.set("fsortnum", sorTemp).update()?1:0;
		}
		renderJson(res);
		
	}
	/**
	 * @Tag       : 未排序的主题排序
	 * @createTime: 2016年2月1日 下午1:31:13
	 * @author    : Chason.x
	 */
	public void quietlySort(){
		long startTime = System.currentTimeMillis();
		List<String> colList = Db.query("SELECT fcolguid FROM `t_topic_relate`  GROUP BY fcolguid ORDER BY id ASC ");
		List<TopicRelate> list = null;
		int jlen = 0;
		int j = 0;
		int count = 0;
		for(int i = 0,len = colList.size();i < len;i++){
			list = TopicRelate.infomationRelateDao.find("select * from t_topic_relate where fcolguid = ? and fsortnum = 0 order by id asc",colList.get(i));
			if(!list.isEmpty()){
				jlen = list.size();
				count += jlen;
				for(j = 0;j < jlen;j++){
					list.get(j).set("fsortnum", 10000 + j).update();
				}
			}
		}
		Record rec = new Record().set("Response Count : ", count).set("Response Time : ", (System.currentTimeMillis() - startTime));
		renderJson(rec);
	}
	/**
	 * @Tag       : 栏目主题计数重置
	 * @createTime: 2016年2月1日 下午3:50:21
	 * @author    : Chason.x
	 */
	public void quietlyColumnAttr(){
		long startTime = System.currentTimeMillis();
		List<Column> list = Column.columnDao.find("select * from t_column");
		
		Long topicSize = 0l;
		Long checkSize = 0l;
		Long recyleSize = 0l;
		for(int i = 0,len = list.size();i < len;i++){
			topicSize = Db.queryLong("SELECT count(r.id) FROM t_topic_relate r INNER JOIN t_topic t on  t.fguid = r.ftopicguid  where t.fcheck = 1 and r.fdelete = 0 and r.fcolguid = ?",list.get(i).getStr("fguid"));
			checkSize = Db.queryLong("SELECT count(r.id) FROM t_topic_relate r INNER JOIN t_topic t on  t.fguid = r.ftopicguid  where t.fcheck = 0 and r.fdelete = 0 and r.fcolguid = ?",list.get(i).getStr("fguid"));
			recyleSize = Db.queryLong("SELECT count(r.id) FROM t_topic_relate r INNER JOIN t_topic t on  t.fguid = r.ftopicguid where t.fcheck = 1 and r.fdelete = 1 and r.fcolguid = ?",list.get(i).getStr("fguid"));
			
			list.get(i).set("ftopicsize", (topicSize != null?topicSize:0))
			.set("ftopicchecksize", (checkSize != null?checkSize:0))
			.set("ftopicrecyclesize", (recyleSize != null?recyleSize:0)).update();
		}
		
		Record rec = new Record().set("Response Count : ", list.size()).set("Response Time : ", (System.currentTimeMillis() - startTime));
		renderJson(rec);
	}
	
	
	/**
	 * @Tag       : 文章页模板设置 - 临时
	 * @createTime: 2016年8月4日 上午11:42:22
	 * @author    : Chason.x
	 */
	public void pagetemp(){
		render(PageUtil.PAGE_CONTENT_TEMP);
	}
	/**
	 * 
	 * @Tag       : 文章页预览 - 临时
	 * @createTime: 2016年8月4日 下午4:05:39
	 * @author    : Chason.x
	 */
	public void pageContentPreview(){
		String tempGuid = getPara("tempGuid");
		String resData = "";
		if(StringUtils.hasText(tempGuid)){
			resData = Db.queryStr("SELECT fhtmldata FROM `t_template` where id = ? ",tempGuid);
		}else{
			resData = FileUtil.readFile(PathKit.getWebRootPath() + "/res/desc/pagetemp.txt", null);
		}
		String topicCtrJsStr = "<script type=\"text/javascript\"> var $CMS_Content_PageNum = 0; " + FileUtil.readFile(PathKit.getWebRootPath() + Constant.TEMPLATE_CTRL_JSNAME,null) + "</script>";
		setAttr("resData", resData + topicCtrJsStr);
		render("/WEB-INF/views/preview/" + PageUtil.TOPIC_PREVIEW);
	}
	/**
	 * 
	 * @Tag       : 保存文章页面模板 - 临时
	 * @createTime: 2016年8月4日 下午6:29:39
	 * @author    : Chason.x
	 */
	@Required({
		@ParaEntity(name = "title"),
		@ParaEntity(name = "siteGuid")
	})
	@Before(ParamInterceptor.class)
	public void savePageTemp(){
		
		int res = 0;
		try{
			String title = getPara("title");
			String siteGuid = getPara("siteGuid");
			String bgImg = getPara("bgimage");
			String banner = getPara("banner");
			Long tempGuid = getParaToLong("tempGuid");
			String rawData = getPara("rawData");
			String resData = FileUtil.readFile(PathKit.getWebRootPath() + "/res/desc/pagetemp.txt", null);
			if(StringUtils.hasText(bgImg)) resData = resData.replace("default_pagetemp.jpg", bgImg);
			if(StringUtils.hasText(banner)) resData = resData.replace("default_banner.jpg", banner);
			
			Template temp = new Template()
			.set("ftname", title)
			.set("fsiteguid", siteGuid)
			.set("fhtmldata", resData)
			.set("frawdata", rawData)
			.set("fcreateguid", DHttpUtils.getLoginUser(getRequest()).getStr("fguid"))
			.set("fcreatetime", DateFormatUtil.formatString(null));
			if(tempGuid != null){
				temp.set("id", tempGuid);
				res = temp.update()?1:0;
			}else{
				temp.set("fguid", TokenUtil.getUUID());
				res = temp.save()?1:0;
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		renderJson(res);
	}
	/**
	 * 
	 * @Tag       : 删除文章页面模板 - 临时
	 * @createTime: 2016年8月4日 下午9:48:35
	 * @author    : Chason.x
	 */
	public void delPageTemp(){
		Long tid = getParaToLong("tid");
		if(tid == null) renderJson(0);
		renderJson(Template.temp.deleteById(tid)?1:0);
	}
}
