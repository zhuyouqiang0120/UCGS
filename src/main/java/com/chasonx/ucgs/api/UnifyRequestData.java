/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年2月23日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.api;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
import com.chasonx.ucgs.annotation.Api;
import com.chasonx.ucgs.annotation.ApiRemark;
import com.chasonx.ucgs.annotation.ApiTitle;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Constant.SiteBindType;
import com.chasonx.ucgs.common.PageViewConstant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.common.TopicConstant;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.config.RuntimeLog;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.dao.StatisticsDao;
import com.chasonx.ucgs.dao.TMapDao;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.entity.Site;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年2月23日 下午3:32:36
 * @remark  统一数据接口 v2.0 合并栏目主题数据
 * @update 20160926 修改查询单个栏目时无法返回主题列表的bug
 * 		   20161108 修改分页数据不全bug
 * 		   20170213 分页时获取数据为空的SQL问题更新
 */
public class UnifyRequestData extends Controller {

	private static final String TOPITC_PREVIEW_TEMPLATE = "/UCGS/data/uRequest/topicPreview";
	private static final String TOPITC_PREVIEW_DATA = "/UCGS/data/uRequest/topicData";
	private static final String ATTR_COLUMN = "Columns";
	private static final String ATTR_TOPIC = "Topics";
	private static final String TotalRow = "TotalRow";
	private static final String TotalPage = "TotalPage";
	
	
	public void api(){
		String result = "";
		try {
			result = Api.getInfo(UnifyRequestData.class, "/UCGS/data/uRequest/", "POST/GET","UCGS数据接口");
		} catch (Exception e) {
			e.printStackTrace();
			result = e.getMessage();
		}
		renderHtml(result);
	}
	

	/**
	 * 统一JSON数据格式
	 * void
	 * @createTime:2015-11-30 上午11:00:26 
	 * @author: chason.x
	 */
	@ApiTitle("统一数据获取接口")
	@ApiRemark("获取站点/栏目/主题数据")
	@Required({
		@ParaEntity(name = "aliasName",desc = "站点别名",mlen = 1,xlen = 100,type = "String"),
		@ParaEntity(name = "markCode",desc = "站点标识",empty = true, type = "String"),
		@ParaEntity(name = "colGuid",desc = "栏目Guid",empty = true,type = "String"),
		@ParaEntity(name = "level",desc = "需要返回的栏目级数，以“ , ”号隔开如: 1,2,3 返回一、二三级栏目数据",empty = true,type = "String"),
		@ParaEntity(name = "getTopic",desc = "是否获取主题数据",empty = true,type = "bool"),
		@ParaEntity(name = "getPreview",desc = "主题数据是否包含预览地址",empty = true,type = "bool"),
		@ParaEntity(name = "getPreviewType",desc = "预览类型 template/data",empty = true,type = "String"),
		@ParaEntity(name = "tpageSize",desc = "主题数量",empty = true,type = "int"),
		@ParaEntity(name = "tpageNumber",desc = "主题页码",empty = true,type = "int"),
		@ParaEntity(name = ApiConstant.jsonpName,desc = ApiConstant.jsonpDesc,empty = true,type = "String")
	})
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
				Set<String> bindSiteSet = binderFilter(siteList);
				dataChoose(siteList,level,getTopic,columnId,data,previewHost,tpageSize,tpageNumber,getPreviewType,cb,bindSiteSet);
				
				//
				for(Site s : siteList)
					StatisticsDao.cacheStatisticsData(getRequest(), "", s.getStr("fguid"), columnId, "", startTime, PageViewConstant.PageViewType);
			}
			
			//
			StatisticsDao.cacheStatisticsData(getRequest(), "unifyJson", null, null, null, startTime, PageViewConstant.InterFaceType);
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
	 * 关联/绑定 站点处理
	 * @author chasonx
	 * @create 2017年2月24日 下午2:44:19
	 * @update
	 * @param  
	 * @return void
	 */
	private Set<String> binderFilter(List<Site> siteList){
		Set<String> binderGuid = new HashSet<String>();
		for(Site site : siteList){
			if(site.getInt("fbindsitetype") == SiteBindType.BIND){
				site.set("fguid", site.getStr("fbindsiteguid"));
			}else if(site.getInt("fbindsitetype") == SiteBindType.RELATION){
				binderGuid.addAll(Arrays.asList(site.getStr("fbindsiteguid").split(",")));
			}
		}
		return binderGuid;
	}
	/**
	 * 所有栏目
	 * List<Column>
	 * @createTime:2015-11-30 下午3:39:04
	 * @author: chason.x
	 */
	private void dataChoose(List<Site> list,String[] level,boolean getTopic,String columnGuid,Record container,String previewHost,
			Integer tpageSize,Integer tpageNumber,String getPreviewType,String callback,Set<String> bindSitesSet){
		if(list.isEmpty()) return;
		
		Integer levelFlag = 1;
		
		List<String> siteGuidList = new ArrayList<String>();
		List<String> siteNames = new ArrayList<String>();
		for(int i = 0,len = list.size();i < len;i++){
			siteGuidList.add(list.get(i).getStr("fguid"));
			siteNames.add(list.get(i).getStr("fsitename"));
		}
		container.set("Node", siteGuidList);
		container.set("NodeNames", siteNames);
		
		List<Column> allColList = Column.columnDao.find("select * from t_column where fsiteguid in ("+ Tools.joinForList(siteGuidList, ",") + (bindSitesSet.isEmpty()?"":"," + Tools.join(bindSitesSet.toArray(), ",")) +") and fstate = 1 order by fsortnumber,flevel asc");
		Column currColumn = null;
		
		if(StringUtils.hasText(columnGuid)){
			levelFlag = getCurrLevelFlag(allColList,columnGuid);
			List<Column> allChildList = new ArrayList<Column>();
			currColumn = getAllChildList(allColList, columnGuid, allChildList);
			allColList.clear();
			allColList.addAll(allChildList);
		}
		
		/*筛选所有栏目*/
		allColList.addAll(ColumnDao.getRelationColumn(allColList, false));
		
		/*筛选所有主题*/
		List<Record> topicList = new ArrayList<Record>();
		if(getTopic)
			topicChoose(allColList, topicList, tpageSize, tpageNumber, columnGuid);
		
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
		Record attrRec;
		boolean hasChild = false;
		for(i = 0,ilen = list.size();i < ilen;i++){
			firstChild =  new ArrayList<Record>();
			
			for(j = 0,jlen = allColList.size();j < jlen;j ++){
//				if(siteGuidList.get(i).equals(allColList.get(j).getStr("fsiteguid"))){
				if(checkCurrentColumnSiteId(list.get(i),allColList.get(j).getStr("fsiteguid"))){
					
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
					
					childRecList = new ArrayList<Record>();
					if(hasChild){
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
					}
					if(addChild){
						if(!topicList.isEmpty() || hasChild){
							attrRec = new Record()
							.set(ATTR_COLUMN, childRecList).set(ATTR_TOPIC, topicFilter(topicList, allColList.get(j).getStr("fguid"), previewHost, getPreviewType, callback))
							.set(TotalRow,  allColList.get(j).getInt("ftopicsize"))
							.set(TotalPage, getTotalPage(tpageSize, tpageNumber, allColList.get(j).getInt("ftopicsize")));
							
							container.set(allColList.get(j).getStr("fguid"), attrRec);
						}
					}
				}
			}
			Record frisrtNode = new Record();
			frisrtNode.set(ATTR_COLUMN, firstChild);
			
			if(StringUtils.hasText(columnGuid)) {
				frisrtNode.set(ATTR_TOPIC, topicFilter(topicList, columnGuid, previewHost, getPreviewType, callback));
				
				if(null != currColumn){
					frisrtNode.set(TotalRow, currColumn.getInt("ftopicsize"))
					.set(TotalPage, getTotalPage(tpageSize,tpageNumber,currColumn.getInt("ftopicsize")));
				}
			}else{
				frisrtNode.set(ATTR_TOPIC,new ArrayList<Record>());
				frisrtNode.set(TotalRow, 0).set(TotalPage, 0);
			}
			
			container.set(siteGuidList.get(i), frisrtNode);
		}
	}
	
	private boolean checkCurrentColumnSiteId(Site site,String siteGuid){
		return site.getStr("fguid").equals(siteGuid) || 
				(site.getInt("fbindsitetype") == Constant.SiteBindType.RELATION && !site.getStr("fbindsiteguid").isEmpty()
				 && site.getStr("fbindsiteguid").indexOf(siteGuid) != -1);
	}
	
	@SuppressWarnings("unused")
	private int getTotalPage(Integer pageSize,Integer pageNumber,int topicSize){
		int totalPage = 0;
		if(null != pageNumber && null != pageSize){
			if(null == pageNumber) pageNumber = 1;
			if(null == pageSize) pageSize = 20;
			totalPage = topicSize > 0? (int) Math.ceil(topicSize/(double)pageSize):0;
		}
		return totalPage;
	}
	
	/**
	 * 选择所有主题
	 * void
	 * @createTime:2015-11-30 下午3:58:50
	 * @author: chason.x
	 */
	private void topicChoose(List<Column> list,List<Record> topicList,Integer tpageSize,Integer tpageNumber,String colGuidPara){
		Set<String> colGuid = new HashSet<String>();
		for(int i = 0,len = list.size();i < len;i++){
			//if(checkHasChildNode(list,list.get(i).getStr("fguid")) == 0) //取最末尾栏目的文章
				colGuid.add(list.get(i).getStr("fguid"));
		}
		
		if(StringUtils.hasText(colGuidPara)) colGuid.add(colGuidPara);
		
		List<String> coListList = new ArrayList<String>();
		coListList.addAll(colGuid);
		
		//List<Record> topicList = null;
		String sql = "select t.fguid as Id,t.ftitle as Name,t.fsummary as Summary,t.freleasetime as Releasetime," +
					"CASE WHEN LOCATE('"+ Constant.IMG_CATCH_DIR +"' ,t.fthumbnail) > 0 THEN t.fthumbnail WHEN t.fthumbnail IS NOT NULL AND t.fthumbnail != '' AND LOCATE('"+ Constant.IMG_CATCH_DIR +"' ,t.fthumbnail) = 0 THEN  CONCAT('"+ Constant.IMG_CATCH_DIR +"' ,t.fthumbnail) ELSE '' END as Thumbnail,t.fpvsize as Pvsize,t.ftopsize as Topsize,t.fcollectsize as Collectsize,r.fcolguid as Colguid, " +
			    "t.fclass as Class,t.fextdata as Extdata from t_topic_relate r INNER JOIN t_topic t on r.ftopicguid = t.fguid ";
		
		String whereCase = " and r.fdelete = 0 and t.fcheck = 1 ORDER BY t.ftop desc,r.fsortnum desc,t.id desc"; // t.fpvsize desc,t.fgrade desc,
		//查询栏目下所有主题
		if(null == tpageNumber && null == tpageSize){
			String where = " where r.fcolguid in ("+ Tools.joinForList(coListList, ",") +") " + whereCase;
			topicList.addAll(Db.find(sql + where));
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
				.append("and t.id <= (select t2.id from t_topic_relate r2 INNER JOIN t_topic t2 on r2.ftopicguid = t2.fguid where r2.fcolguid = '"+ coListList.get(p) 
						+"' and t2.fdelete = 0 and t2.fcheck = 1 ORDER BY t2.ftop desc,r2.fsortnum desc,t2.id desc limit "+ 
						((tpageNumber - 1)*tpageSize) +",1) and r.fcolguid = '"+ coListList.get(p) +
						"' and r.fdelete = 0 and t.fcheck = 1 ORDER BY t.ftop desc,r.fsortnum desc,t.id desc  limit "+ tpageSize + ") as tempt");
				if(p < (plen - 1)) sbSql.append(" UNION ");
			}
			sbSql.append(") ");
			topicList.addAll( Db.find(sbSql.toString()) );
		}

	}
	/**
	 * @Tag       : 过滤主题数据
	 * @createTime: 2016年2月23日 下午5:05:18
	 * @author    : Chason.x
	 */
	private List<Record> topicFilter(List<Record> topicList,String colGuid,String previewHost,String getPreviewType,String callback){
		int j;
		int jlen;
		List<Record> tList = new ArrayList<Record>();
		for(j = 0,jlen = topicList.size();j < jlen; j++){
			if(colGuid.equals(topicList.get(j).getStr("Colguid"))){
				if(previewHost != null){
					if(topicList.get(j).getInt("Class") == Constant.TOPIC_TYPE_LINK){
						topicList.get(j).set("PreviewUrl", topicList.get(j).getStr("Extdata"));
					}else{
						if(getPreviewType.equals("template"))
							topicList.get(j).set("PreviewUrl", previewHost + TOPITC_PREVIEW_TEMPLATE + "?id=" + topicList.get(j).getStr("Id"));
						else if(getPreviewType.equals("data"))
							topicList.get(j).set("PreviewUrl", previewHost + TOPITC_PREVIEW_DATA + "?id=" + topicList.get(j).getStr("Id") + (StringUtils.hasText(callback)?("&jsoncallback=" + callback):"") );
					}
				}
				//topicList.get(j).remove("Extdata");
				tList.add(topicList.get(j));
			}
		}
		return tList;
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
	 * 查找子栏目 
	 * void
	 * @createTime:2015-12-25 下午6:52:11
	 * @author: chason.x
	 */
	private Column getAllChildList(List<Column> data,String parentGuid,List<Column> contaniner){
		Column currColumn = null;
		for(int i = 0,len = data.size();i < len;i++){
			if(parentGuid.equals(data.get(i).getStr("fparentuid"))){
				contaniner.add(data.get(i));
				getAllChildList(data, data.get(i).getStr("fguid"), contaniner);
			}
			if(data.get(i).getStr("fguid").equals(parentGuid)) currColumn = data.get(i);
		}
		return currColumn;
	}
	
	private Integer getCurrLevelFlag(List<Column> data,String parentGuid){
		Integer lvFlag = 1;
		for(int i = 0,len = data.size();i < len;i++){
			if(data.get(i).getStr("fguid").equals(parentGuid)){
				lvFlag = data.get(i).getInt("flevel") + 1;
				break;
			}
		}
		return lvFlag;
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
	@ApiTitle("主题数据：json格式")
	@ApiRemark("该接口以主题纯文本数据形式返回")
	@Required(@ParaEntity(name = "id",desc = "主题Guid"))
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
											"freleasetime as Releasetime,freleaseer as Releaseer," + 
											"CASE WHEN LOCATE('"+ Constant.IMG_CATCH_DIR +"', fthumbnail) > 0 THEN fthumbnail WHEN  fthumbnail IS NOT NULL AND fthumbnail != '' AND LOCATE('"+ Constant.IMG_CATCH_DIR +"', fthumbnail) = 0 THEN  CONCAT('"+ Constant.IMG_CATCH_DIR +"' , fthumbnail) ELSE '' END  as Thumbnail,flable as Label, " +
											"fpvsize as Pvsize,ftopsize as Topsize,fcollectsize as Collectsize,fclass as Class,fextdata as extdata from t_topic where fguid = ?",guid);
				List<Record> contents = Db.find("SELECT fcontent as Content FROM `t_topic_content` where ftopicguid = ?",guid);
				//Db.queryStr("select remotehost from t_config where filetype = ?",Constant.Config.TopicPreview.toString());
				
				List<Column> col = Column.columnDao.findByCache(Constant.CACHE_DEF_NAME, "previewcoldata", "select * from t_column where fsiteguid = (  select fsiteguid from t_topic_relate where ftopicguid = ?)",guid);
				Column currCol = Column.columnDao.findFirst("select c.fguid,c.fparentuid,c.fservicename from t_column c INNER JOIN t_topic_relate r ON r.fcolguid = c.fguid where r.ftopicguid = ?",guid);
				List<String> parentCol = new ArrayList<String>();
				checkParentColName(col, currCol.getStr("fparentuid"), parentCol);
				String parColStr = "";
				if(!parentCol.isEmpty()){
					for(int i = parentCol.size() - 1;i >= 0;i--){
						parColStr += parentCol.get(i);
						if(i > 0) parColStr += " > ";
					}
				}
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
				
				topic.set("ColumnName", currCol.getStr("fservicename"));
				topic.set("ParentColumnName", parColStr);
				topic.set("contents", cont);
				topic.remove("aid");
				topic.remove("extdata");
				data.set("Data", topic);
				
				///
				StatisticsDao.cacheStatisticsData(getRequest(), guid, currCol.getStr("fsiteguid") , currCol.getStr("fguid"), "", startTime, PageViewConstant.PageViewType);
			}else{
				data.set("Data", null);
			}
			
			///
			StatisticsDao.cacheStatisticsData(getRequest(), "topicData", null, null, null, startTime, PageViewConstant.InterFaceType);
		}catch(Exception e){
			RuntimeLog.logger.error(e.getMessage(),e);
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
	@ApiTitle("主题预览")
	@ApiRemark("该接口以主题预览的形式返回")
	@Required(@ParaEntity(name = "id",desc = "主题Guid"))
	public void topicPreview(){
		String topicGuid = getPara("id");
		StringBuffer sb = new StringBuffer(300);
		long startTime = System.currentTimeMillis();
		try{
			if(StringUtils.hasText(topicGuid)){
				Topic topic = Topic.infomationDao.findFirst("select * from t_topic where fguid = ?",topicGuid);
				
				/*检测视频类型文章*/
				String topicExtView = CacheKit.get(Constant.CACHE_DEF_NAME, Constant.Config.TopicExtendView.toString());
				if(StringUtils.hasText(topicExtView) && topicExtView.equals("START")){
					String playUrl = PublicDao.getFieldStr("localdir", " and filetype = '"+ Constant.Config.TopicExtendView.toString() + topic.getInt("fclass") +"'" , TConfig.class);
					if(StringUtils.hasText(playUrl)){
					  	redirect(playUrl + "?id=" + topic.getStr("fguid") + "&extend=" + Tools.escape(topic.getStr("fextdata")));
					  	return;
					}
				}
				
				String tempateHtml = null;
				Integer templateId = Db.queryInt("select ftemplateid from t_topic_relate where ftopicguid = ?",topicGuid);
				if(templateId != null)
					tempateHtml = Db.queryStr("select fhtmldata from t_template where id = ?",templateId);
				List<Column> col = Column.columnDao.findByCache(Constant.CACHE_DEF_NAME, "previewcoldata", "select * from t_column where fsiteguid = (  select fsiteguid from t_topic_relate where ftopicguid = ?)",topicGuid);
				Column currCol = Column.columnDao.findFirst("select c.fguid,c.fparentuid,c.fservicename,c.fsiteguid from t_column c INNER JOIN t_topic_relate r ON r.fcolguid = c.fguid where r.ftopicguid = ?",topicGuid);
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
					.replace(TopicConstant.TOPIC_PARENT_COLUMN, parColStr)
					.replace(TopicConstant.TOPIC_SOURCE, topic.getStr("fsource"))
					.replace(TopicConstant.TOPIC_EDIT_TIME, topic.getStr("freleasetime").substring(0, topic.getStr("freleasetime").indexOf(" ")));
					
					String topicCtrJsStr = CacheKit.get(Constant.CACHE_DEF_NAME, "topicPreviewCtrlJs");
					if(!StringUtils.hasText(topicCtrJsStr)){
						topicCtrJsStr = FileUtil.readFile(PathKit.getWebRootPath() + Constant.TEMPLATE_CTRL_JSNAME);
						CacheKit.put(Constant.CACHE_DEF_NAME, "topicPreviewCtrlJs", topicCtrJsStr);
					}
					
					/*图片处理*/
					Matcher mac = null;
					Pattern pat = Pattern.compile(Constant.BACKGROUND_IMAGE);
//					mac = pat.matcher(tempateHtml);
//					String bgImg = "";
//					/*背景图地址*/
//					while (mac.find()) {
//						bgImg = mac.group();
//						if(StringUtils.hasText(bgImg)){
//							bgImg = bgImg.replace("(", "").replace(")", "");
//							tempateHtml = tempateHtml.replace(bgImg, Constant.IMG_CATCH_DIR + bgImg);
//						}
//					}
					
					/*广告图地址*/		
					pat = Pattern.compile(Constant.IMG_SRC_REGEX);
					mac = pat.matcher(tempateHtml);
					while(mac.find()){
						if(StringUtils.hasText(mac.group(1))) tempateHtml = tempateHtml.replace(mac.group(1), Constant.IMG_CATCH_DIR + mac.group(1));
					}
					/*内容图片地址*/
					StringBuffer conSb = new StringBuffer(300);
					if(!contents.isEmpty()){
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
				
				//PageView 
				StatisticsDao.cacheStatisticsData(getRequest(), topicGuid, currCol.getStr("fsiteguid") , currCol.getStr("fguid"), "", startTime, PageViewConstant.PageViewType);
			}
			
			///
			StatisticsDao.cacheStatisticsData(getRequest(), "topicPreview", null, null, null, startTime, PageViewConstant.InterFaceType);
		}catch(Exception e){
			RuntimeLog.logger.error(e.getMessage(), e);
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
	
	/**
	 * @Tag       : 获取自定义参数
	 * @createTime: 2016年4月26日 下午3:58:30
	 * @author    : Chason.x
	 */
	@ApiTitle("获取自定义参数")
	@ApiRemark("该接口主要对自定义数据获取")
	@Required({
		@ParaEntity(name = "guid",desc = "自定义参数绑定对象的guid"),
		@ParaEntity(name = "key",desc = "自定义key值")
	})
	public void getCustomerMaps(){
		String guid = getPara("guid");
		String key = getPara("key");
		String cb = getPara(ApiConstant.jsonpName);
		
		long startTime = System.currentTimeMillis();
		Record data = new Record();
		data.set("Version", Constant.DATA_JSON_VERSION);
		data.set("Desc", Constant.DATA_JSON_DESC_TOPIC + (StringUtils.hasText(cb)?"JSONP":"JSON"));
		try{
			if(!StringUtils.hasText(guid)){
				data.set("Mess", "The guid is not null");
			}else{
				data.set("Data", TMapDao.getMaps(guid, key));
				data.set("Mess", "Ok");
			}
			
			///
			StatisticsDao.cacheStatisticsData(getRequest(), "getCustomerMaps", null, null, null, startTime, PageViewConstant.InterFaceType);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		data.set("Response time", System.currentTimeMillis() - startTime);
		if(StringUtils.hasText(cb)){
			renderJavascript(cb + "("+ JsonKit.toJson(data) +")");
		}else{
			renderJson(data);
		}
	}
	/**
	 * @Tag       : 设置参数
	 * @createTime: 2016年4月27日 上午11:02:36
	 * @author    : Chason.x
	 */
	@ApiTitle("设置自定义参数")
	@ApiRemark("可将自定义数据绑定到任意对象上")
	@Required({
		@ParaEntity(name = "guid",desc = "绑定目标guid"),
		@ParaEntity(name = "key",desc = "自定义key值"),
		@ParaEntity(name = "value",desc = "自定义值"),
		@ParaEntity(name = "id",desc = "更新时必传",type = "long"),
		@ParaEntity(name = "type",desc = "操作类型(1:新增，2:更新",type = "int")
	})
	public void setCustomerMapsVaule(){
		String cb = getPara(ApiConstant.jsonpName);
		String guid = getPara("guid");
		String key = getPara("key");
		String value = getPara("value");
		Integer type = getParaToInt("type");
		Long id = getParaToLong("id");
		long startTime = System.currentTimeMillis();
		boolean res = false;
		Record data = new Record();
		data.set("Version", Constant.DATA_JSON_VERSION);
		data.set("Desc", Constant.DATA_JSON_DESC_TOPIC + (StringUtils.hasText(cb)?"JSONP":"JSON"));
		String mess = "Ok";
		if(!StringUtils.hasText(guid)) mess = "The guid is not null";
		else if(!StringUtils.hasText(key)) mess = "The key is not null";
		else if(!StringUtils.hasText(value)) mess = "The value is not null";
		else if(type == 2 && id == null) mess = "The id is not null";
		
		int _r = TMapDao.setValue(guid, key, value, id, type);
		switch (_r) {
		case 0:
			mess = "The save is faild";
			break;
		case 1:
			res = true;
			break;
		case 2:
			mess = "The key is exists";
			break;
		default:
			break;
		}
		data.set("Mess", mess);
		data.set("Data", res?1:0);
		data.set("Response time", System.currentTimeMillis() - startTime);
		
		///
		try {
			StatisticsDao.cacheStatisticsData(getRequest(), "setCustomerMapsVaule", null, null, null, startTime, PageViewConstant.InterFaceType);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		if(StringUtils.hasText(cb)){
			renderJavascript(cb + "("+ JsonKit.toJson(data) +")");
		}else{
			renderJson(data);
		}
	}
}
