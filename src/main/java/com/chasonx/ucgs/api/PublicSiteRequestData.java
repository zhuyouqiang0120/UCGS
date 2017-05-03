/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-11-30 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.api;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.chasonx.directory.FileUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.common.TopicConstant;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.entity.Site;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-11-30上午10:57:28
 * @remark
 */
public class PublicSiteRequestData extends Controller {
	
	private static final String TOPITC_PREVIEW_TEMPLATE = "/UCMS/data/public/topicPreview";
	private static final String TOPITC_PREVIEW_DATA = "/UCMS/data/public/topicData";

	/**
	 * 统一JSON数据格式
	 * void
	 * @createTime:2015-11-30 上午11:00:26
	 * @author: chason.x
	 */
	public void unifyJson(){
		String cb = getPara(ApiConstant.jsonpName);   //回调函数 
		String alias = getPara("aliasName"); //网站别名
		String markcode = getPara("markCode"); //网站标识
		String columnId = getPara("colGuid"); //栏目Id
		String levelStr = getPara("level"); //获取栏目级数
		String topic = getPara("getTopic"); //是否获取主题数据
		String topicPreview = getPara("getPreview"); //是否返回预览地址
		String getPreviewType = getPara("getPreviewType"); //预览页的数据格式
		Integer tpageSize = getParaToInt("tpageSize"); //主题分页数量
		Integer tpageNumber = getParaToInt("tpageNumber"); //主题页码
		
		if(!StringUtils.hasText(levelStr)) levelStr = "";
		if(!StringUtils.hasText(getPreviewType)) getPreviewType = "template";
		
		String[] level = levelStr.split(",");
		
		boolean getTopic = false;
		String previewHost = null;
		String whereCase = "";
		Record data = new Record();
		data.set("Version", Constant.DATA_JSON_VERSION);
		data.set("Desc", Constant.DATA_JSON_DESC +( StringUtils.hasText(cb)?"JSONP":"JSON"));
		long startTime = System.currentTimeMillis();
		try{
			if(StringUtils.hasText(topic) && topic.equalsIgnoreCase("true")) getTopic = true;
			if(StringUtils.hasText(topicPreview) && topicPreview.equalsIgnoreCase("true")){
				previewHost = Db.queryStr("select remotehost from t_config where filetype = ?",Constant.Config.TopicPreview.toString());
			}
			if(StringUtils.hasText(alias)){
				String[] aliasss = alias.split(",");
				whereCase = " and  fsitealias in ("+ Tools.join(aliasss, ",") +")";
			}
			if(StringUtils.hasText(markcode)){
				String[] marksss = markcode.split(",");
				whereCase = " and fmark in ("+ Tools.join(marksss, ",") +")";
			}
			if(StringUtils.hasText(whereCase)){
				List<Site> siteList = Site.siteDao.find("select * from t_site where 1 = 1 " + whereCase + " and fstate = 1");
				
				dataChoose(siteList,level,getTopic,columnId,data,previewHost,tpageSize,tpageNumber,getPreviewType,cb);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		data.set("Response time", System.currentTimeMillis() - startTime);
		if(StringUtils.hasText(cb))
			renderJavascript(cb + "("+ JsonKit.toJson(data) +")");
		else
			renderJson(data);
	}
	/**
	 * 所有栏目
	 * List<Column>
	 * @createTime:2015-11-30 下午3:39:04
	 * @author: chason.x
	 */
	private void dataChoose(List<Site> list,String[] level,boolean getTopic,String columnGuid,Record container,String previewHost,
			Integer tpageSize,Integer tpageNumber,String getPreviewType,String callback){
		if(list.isEmpty()) return;
		
		Integer levelFlag = 1;
		
		List<String> siteGuidList = new ArrayList<String>();
		for(int i = 0,len = list.size();i < len;i++){
			siteGuidList.add(list.get(i).getStr("fguid"));
		}
		container.set("Node", siteGuidList);
		
		List<Column> allColList = Column.columnDao.find("select * from t_column where fsiteguid in ("+ Tools.joinForList(siteGuidList, ",") +") and fstate = 1 order by fsortnumber,flevel asc");
		
		if(StringUtils.hasText(columnGuid)){
			List<Column> allChildList = new ArrayList<Column>();
			List<Integer> currLevelFlag = new ArrayList<Integer>();
			getAllChildList(allColList, columnGuid, allChildList,currLevelFlag);
			allColList.clear();
			allColList.addAll(allChildList);
			
			if(!currLevelFlag.isEmpty()) levelFlag = currLevelFlag.get(0);
		}
		
		allColList.addAll(ColumnDao.getRelationColumn(allColList, false));
		
		int i;
		int ilen;
		int j;
		int jlen;
		int c;
		int clen;
		boolean addChild = true;
		List<Record> firstChild;
		List<Record> childRecList;
		List<Column> childList = new ArrayList<Column>();
		Record first;
		Record child;
		boolean hasChild = false;
		for(i = 0,ilen = siteGuidList.size();i < ilen;i++){
			firstChild =  new ArrayList<Record>();
			
			for(j = 0,jlen = allColList.size();j < jlen;j ++){
				if(siteGuidList.get(i).equals(allColList.get(j).getStr("fsiteguid"))){
					
					if(level.length > 0 && !checkInLevels(level, allColList.get(j).getInt("flevel")))	continue;
					
					addChild = true;
					
					childList.clear();
					hasChild = false;
					getChildList(allColList, allColList.get(j).getStr("fguid"), childList);
					
					if(!childList.isEmpty()) hasChild = true;
					
					if(allColList.get(j).getInt("flevel") == levelFlag){
						first = new Record();
						
						first.set("Id", allColList.get(j).getStr("fguid"));
						first.set("Name", allColList.get(j).getStr("fservicename"));
						first.set("Parentid", siteGuidList.get(i));
						first.set("Icon", allColList.get(j).getStr("ficon"));
						extDataToRecord(allColList.get(j).getStr("fextdata"),first);
						first.set("HasChild", hasChild);
						first.set("TopicSize", allColList.get(j).getInt("ftopicsize"));
						first.set("TopicCount", getCurrColumnTopicCount(allColList, allColList.get(j).getStr("fguid"), allColList.get(j).getInt("ftopicsize")));
						first.set("Remark", allColList.get(j).getStr("fremark"));
						firstChild.add(first);
					}
					
					if(hasChild){
						childRecList = new ArrayList<Record>();
						for(c = 0,clen = childList.size();c < clen;c++){
							if(level.length > 0 && !checkInLevels(level, childList.get(c).getInt("flevel"))){
								addChild = false;
								break;
							}
							
							child = new Record();
							child.set("Id", childList.get(c).getStr("fguid"));
							child.set("Name", childList.get(c).getStr("fservicename"));
							child.set("Parentid", allColList.get(j).getStr("fguid"));
							child.set("HasChild", checkHasChildNode(allColList,childList.get(c).getStr("fguid")) > 0);
							child.set("TopicSize", childList.get(c).getInt("ftopicsize"));
							child.set("TopicCount", getCurrColumnTopicCount(allColList, childList.get(c).getStr("fguid"), childList.get(c).getInt("ftopicsize")));
							child.set("Icon", childList.get(c).getStr("ficon"));
							extDataToRecord(childList.get(c).getStr("fextdata"),child);
							child.set("Remark", childList.get(c).getStr("fremark"));
							childRecList.add(child);
						}
						if(addChild) container.set( allColList.get(j).getStr("fguid"), childRecList);
					}
				}
			}
			
			container.set(siteGuidList.get(i), firstChild);
			
		}
		if(getTopic) topicChoose(allColList,container,previewHost,tpageSize,tpageNumber,getPreviewType,callback,columnGuid);
	}
	/**
	 * 选择所有主题
	 * void
	 * @createTime:2015-11-30 下午3:58:50
	 * @author: chason.x
	 */
	private void topicChoose(List<Column> list,Record container,String previewHost,Integer tpageSize,Integer tpageNumber,String getPreviewType,String callback,String colGuidPara){
		Set<String> colGuid = new HashSet<String>();
		for(int i = 0,len = list.size();i < len;i++){
			if(checkHasChildNode(list,list.get(i).getStr("fguid")) == 0) //取最末尾栏目的文章
				colGuid.add(list.get(i).getStr("fguid"));
		}
		
		if(StringUtils.hasText(colGuidPara)) colGuid.add(colGuidPara);
		
		List<String> coListList = new ArrayList<String>();
		coListList.addAll(colGuid);
		
		List<Record> topicList = null;
		String sql = "select t.fguid as Id,t.ftitle as Name,t.fsummary as Summary,t.freleasetime as Releasetime,t.fthumbnail as Thumbnail,t.fpvsize as Pvsize,t.ftopsize as Topsize,t.fcollectsize as Collectsize,r.fcolguid as Colguid, " +
			    "t.fclass as Class,t.fextdata as Extdata from t_topic_relate r INNER JOIN t_topic t on r.ftopicguid = t.fguid ";
		
		String whereCase = " and r.fdelete = 0 and t.fcheck = 1 ORDER BY t.ftop desc,r.fsortnum desc,t.fpvsize desc,t.fgrade desc,t.id desc";
		//查询栏目下所有主题
		if(null == tpageNumber && null == tpageSize){
			String where = " where r.fcolguid in ("+ Tools.joinForList(coListList, ",") +") " + whereCase;
			topicList = Db.find(sql + where);
		}else{
			if(null == tpageNumber) tpageNumber = 1;
			if(null == tpageSize) tpageSize = 20;
			
			StringBuffer sbSql = new StringBuffer(200);
			sbSql.append(sql + " where t.fguid in (");
			//String limitSql = "select t.id from t_topic_relate r2 INNER JOIN t_topic t2 on r2.ftopicguid = t2.fguid where r2.fcolguid = ? order by t2.id desc limit "+ ((tpageNumber - 1)*tpageSize) +",1";
			for(int p = 0,plen = coListList.size();p < plen;p++){
				//topicList.addAll(Db.find(sql + " where r.fcolguid = ? and r.fdelete = 0 and t.fcheck = 1 and t.id <= ( "+ limitSql +" ) order by t.id desc limit ?",coListList.get(p),coListList.get(p),tpageSize));
				/*inner join */
//				sbSql.append(" select fguid from ( select t.fguid from t_topic_relate r INNER JOIN t_topic t on r.ftopicguid = t.fguid INNER JOIN ")
//				.append(" (select t.fguid from t_topic_relate r INNER JOIN t_topic t on r.ftopicguid = t.fguid where r.fcolguid = '"+ coListList.get(p) +"' order by t.id desc limit "+ (tpageNumber - 1) +","+ tpageSize +") as ts on ts.fguid = t.fguid")
//				.append(" ) as tempt");
				/*child select*/
				sbSql.append("select fguid from ( select t.fguid from t_topic_relate r INNER JOIN t_topic t on r.ftopicguid = t.fguid ")
				.append("and t.id <= (select t2.id from t_topic_relate r2 INNER JOIN t_topic t2 on r2.ftopicguid = t2.fguid where r2.fcolguid = '"+ coListList.get(p) +"' order by t2.id desc limit "+ ((tpageNumber - 1)*tpageSize) +",1) ORDER BY t.id DESC limit "+ tpageSize + ") as tempt");
				if(p < (plen - 1)) sbSql.append(" UNION ");
			}
			sbSql.append(") " + whereCase);
			topicList = Db.find(sbSql.toString());
		}
		
		if(!topicList.isEmpty()){
			int i;
			int j;
			int ilen;
			int jlen;
			List<Record> tList;
			for(i = 0,ilen = coListList.size();i < ilen;i++){
				tList = new ArrayList<Record>();
				for(j = 0,jlen = topicList.size();j < jlen; j++){
					if(coListList.get(i).equals(topicList.get(j).getStr("Colguid"))){
						if(previewHost != null){
							if(topicList.get(j).getInt("Class") == Constant.TOPIC_TYPE_LINK){
								topicList.get(j).set("PreviewUrl", topicList.get(j).getStr("Extdata"));
							}else{
								if(getPreviewType.equals("template"))
									topicList.get(j).set("PreviewUrl", previewHost + TOPITC_PREVIEW_TEMPLATE + "?id=" + topicList.get(j).getStr("Id"));
								else if(getPreviewType.equals("data"))
									topicList.get(j).set("PreviewUrl", previewHost + TOPITC_PREVIEW_DATA + "?id=" + topicList.get(j).getStr("Id") + "&jsoncallback=" + callback );
							}
						}
						topicList.get(j).remove("Class").remove("Extdata");
						tList.add(topicList.get(j));
					}
				}
				container.set(coListList.get(i), tList);
			}
		}
	}
	
	
	private boolean checkInLevels(String[] level,Integer lv){
		boolean res = false;
		for(int i = 0;i < level.length;i++){
			if(!org.apache.commons.lang3.StringUtils.isNumeric(level[i])){
				res = true;
				continue;
			}
			if(lv.toString().equals(level[i])){
				res = true;
				break;
			}
		}
		return res;
	}
	
	private int checkHasChildNode(List<Column> data,String parentGuid){
		int res = 0;
		for(int i = 0,len = data.size();i < len;i++){
			if(parentGuid.equals(data.get(i).getStr("fparentuid"))){
				res= 1;
				break;
			}
		}
		return res;
	}
	
	private List<Column> getChildList(List<Column> data,String parentGuid,List<Column> contaniner){
		for(int i = 0,len = data.size();i < len;i++){
			if(parentGuid.equals(data.get(i).getStr("fparentuid"))){
				contaniner.add(data.get(i));
			}
		}
		return contaniner;
	}
	/**
	 * @Tag       : 获取栏目主题总数
	 * @createTime: 2016年1月21日 下午1:57:36
	 * @author    : Chason.x
	 */
	private Integer getCurrColumnTopicCount(List<Column> data,String parentGuid,Integer count){
		for(int i = 0,len = data.size();i < len;i++){
			if(parentGuid.equals(data.get(i).getStr("fparentuid"))){
				count += data.get(i).getInt("ftopicsize");
				getCurrColumnTopicCount(data, data.get(i).getStr("fguid"), count);
			}
		}
		return count;
	}
	
	/**
	 * 查找子栏目  级数要加1
	 * void
	 * @createTime:2015-12-25 下午6:52:11
	 * @author: chason.x
	 */
	private void getAllChildList(List<Column> data,String parentGuid,List<Column> contaniner,List<Integer> currLevelFlag){
		for(int i = 0,len = data.size();i < len;i++){
			if(parentGuid.equals(data.get(i).getStr("fguid")) && currLevelFlag.isEmpty()){
				currLevelFlag.add(data.get(i).getInt("flevel") + 1); 
			}
			if(parentGuid.equals(data.get(i).getStr("fparentuid"))){
				contaniner.add(data.get(i));
				getAllChildList(data, data.get(i).getStr("fguid"), contaniner,currLevelFlag);
			}
		}
	}
	
	private void extDataToRecord(String json,Record ext){
		if(!StringUtils.hasText(json)){
			json = "{\"Message\":[],\"Image\":[],\"Link\":\"\"}";
		}
		try {
			JSONObject obj = new JSONObject(json);
			JSONArray mess = obj.getJSONArray("Message");
			List<String> messList = new ArrayList<String>();
			if(mess.length() > 0){
				for(int i = 0;i < mess.length();i++)
					messList.add(mess.get(i).toString());
			}
			
			List<Record> imgList = new ArrayList<Record>();
			JSONArray img = obj.getJSONArray("Image");
			if(img.length() > 0){
				
				for(int i = 0;i < img.length();i++){
					imgList.add(new Record().set("src", img.getJSONObject(i).get("src"))
							.set("link", img.getJSONObject(i).get("link")));
				}
			}
			
			ext.set("Message",messList);
			ext.set("Image", imgList);
			ext.set("Link", obj.get("Link"));
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
	}
	
	/**
	 * 主题数据 JSONP格式
	 * void
	 * @createTime:2015-11-30 下午5:23:40
	 * @author: chason.x
	 */
	public void topicData(){
		String cb = getPara(ApiConstant.jsonpName); 
		String guid = getPara("id");
		
		long startTime = System.currentTimeMillis();
		Record data = new Record();
		data.set("Version", Constant.DATA_JSON_VERSION);
		data.set("Desc", Constant.DATA_JSON_DESC_TOPIC + (StringUtils.hasText(cb)?"JSONP":"JSON"));
		try{
			if(StringUtils.hasText(guid)){
				Record topic = Db.findFirst("select id as aid,fguid as Id,ftitle as Title,ftitlesec as Titlesec,fsummary as Summary,fsource as Source," +
											"freleasetime as Releasetime,freleaseer as Releaseer,fthumbnail as Thumbnail,flable as Label, " +
											"fpvsize as Pvsize,ftopsize as Topsize,fcollectsize as Collectsize from t_topic where fguid = ?",guid);
				List<Record> contents = Db.find("SELECT fcontent as Content FROM `t_topic_content` where ftopicguid = ?",guid);
				//Db.queryStr("select remotehost from t_config where filetype = ?",Constant.Config.TopicPreview.toString());
				
				List<String> cont = new ArrayList<String>();
				
				Pattern pat = Pattern.compile(Constant.IMG_SRC_REGEX);
				Matcher mac = null;
				
				if(!contents.isEmpty()){
					for(int i = 0,len = contents.size();i < len;i++){
						mac = pat.matcher(contents.get(i).getStr("Content"));
						while (mac.find()) {
							if(StringUtils.hasText(mac.group(1))){
								contents.get(i).set("Content", contents.get(i).getStr("Content").replaceAll(mac.group(1), Constant.IMG_CATCH_DIR + mac.group(1)));
							}
						}
						cont.add(contents.get(i).getStr("Content"));
					}
				}
				/*更新浏览量*/
				Topic tp = new Topic();
				tp.set("id", topic.getLong("aid"));
				tp.set("fpvsize", topic.getInt("Pvsize") + 1);
				tp.update();
				
				topic.set("contents", cont);
				topic.remove("aid");
				data.set("Data", topic);
			}else{
				data.set("Data", null);
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		data.set("Response time", System.currentTimeMillis() - startTime);
		if(StringUtils.hasText(cb))
			renderJavascript(cb + "("+ JsonKit.toJson(data) +")");
		else 
			renderJson(data);
	}
	/**
	 * 主题预览
	 * void
	 * @createTime:2015-12-25 上午11:20:47
	 * @author: chason.x
	 */
	public void topicPreview(){
		String topicGuid = getPara("id");
		StringBuffer sb = new StringBuffer(300);
		if(StringUtils.hasText(topicGuid)){
			Topic topic = Topic.infomationDao.findFirst("select * from t_topic where fguid = ?",topicGuid);
			String tempateHtml = Db.queryStr("select fhtmldata from t_template where id = (select ftemplateid from t_topic_relate where ftopicguid = ?)",topicGuid);
			List<Column> col = Column.columnDao.findByCache(Constant.CACHE_DEF_NAME, "previewcoldata", "select * from t_column where fsiteguid = (  select fsiteguid from t_topic_relate where ftopicguid = ?)",topicGuid);
			Column currCol = Column.columnDao.findFirst("select * from t_column where fguid = ( select fcolguid from t_topic_relate where ftopicguid = ?)",topicGuid);
			List<TopicContent> contents = TopicContent.contentDao.find("select * from t_topic_content where ftopicguid = ?",topicGuid);
			
			List<String> parentCol = new ArrayList<String>();
			checkParentColName(col, currCol.getStr("fparentuid"), parentCol);
			String parColStr = "";
			if(!parentCol.isEmpty()){
				for(int i = parentCol.size() - 1;i >= 0;i--){
					parColStr += parentCol.get(i);
					if(i > 0) parColStr += " > ";
				}
			}
			if(tempateHtml != null){
				tempateHtml = tempateHtml.replaceAll(TopicConstant.TOPIC_TITLE, topic.getStr("ftitle"))
				.replace(TopicConstant.TOPIC_CHARTSET, "UTF-8")
				.replace(TopicConstant.TOPIC_CURRENT_COLUMN, currCol.getStr("fservicename"))
				.replace(TopicConstant.TOPIC_PARENT_COLUMN, parColStr);
				
				String topicCtrJsStr = CacheKit.get(Constant.CACHE_DEF_NAME, "topicPreviewCtrlJs");
				if(!StringUtils.hasText(topicCtrJsStr)){
					topicCtrJsStr = FileUtil.readFile(PathKit.getWebRootPath() + Constant.TEMPLATE_CTRL_JSNAME);
					CacheKit.put(Constant.CACHE_DEF_NAME, "topicPreviewCtrlJs", topicCtrJsStr);
				}
				
				StringBuffer conSb = new StringBuffer(300);
				if(!contents.isEmpty()){
					Pattern pat = Pattern.compile(Constant.IMG_SRC_REGEX);
					Matcher mac = null;
					for(int i = 0,len = contents.size();i < len;i++){
						mac = pat.matcher(contents.get(i).getStr("fcontent"));
						while (mac.find()) {
							if(StringUtils.hasText(mac.group(1))){
								contents.get(i).set("fcontent", contents.get(i).getStr("fcontent").replaceAll(mac.group(1), Constant.IMG_CATCH_DIR + mac.group(1)));
							}
						}
						conSb.append("<div id=\"CMS_Content_"+ i +"\" "+ (i > 0?"style=\"display:none;\"":"") +">"+ contents.get(i).getStr("fcontent") +"</div>");
					}
				}
				tempateHtml = tempateHtml.replace(TopicConstant.TOPIC_CONTENT, conSb.toString());
				sb.append(tempateHtml)
				.append("<script type=\"text/javascript\"> var $CMS_Content_PageNum = "+ contents.size() +";"+ topicCtrJsStr +"</script>");
			}else{
				sb.append("<div style=\"height:200px;vertical-align:middle;line-height:200px;text-align:center;font-size:25px;\">无法显示内容.(┬＿┬)</div>");
			}
			
			topic.set("fpvsize", topic.getInt("fpvsize") + 1);
			topic.update();
		}
		
		setAttr("resData", sb.toString());
		render(PageUtil.TOPIC_PREVIEW);
	}
	
	private void checkParentColName(List<Column> data,String pGuid,List<String> container){
		for(int i = 0,len = data.size();i < len;i++){
			if(data.get(i).getStr("fguid").equals(pGuid)){
				container.add(data.get(i).getStr("fservicename"));
				checkParentColName(data, data.get(i).getStr("fparentuid"), container);
			}
		}
	}
	
}
