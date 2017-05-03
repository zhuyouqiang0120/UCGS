/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-10-18 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.api;


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.ApiConstant;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.entity.Topic;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-10-18下午4:57:18
 * @remark
 */
public class TopicRequestData extends Controller {
	
	private SqlKit kit = new SqlKit("TopicRequestData.xml");
	
	/**
	 * 点播详情
	 * void
	 * @createTime:2015-10-18 下午5:35:39
	 * @author: chason.x
	 */
	public void playMovie(){
		String topicGuid = getPara("guid");
		String callback = getPara(ApiConstant.jsonpName);
		String result = "";
		if(StringUtils.hasText(topicGuid)){
			Topic topic = Topic.infomationDao.findFirst("select id,fpvsize,fextdata from t_topic where fguid = ? ",topicGuid);
			result= topic.getStr("fextdata");
			
			topic.set("fpvsize", topic.getInt("fpvsize") + 1);
			topic.update();
		}
		renderJavascript(callback + "(" + result + ")");
	}

	/**
	 * 分类列表
	 * void
	 * @createTime:2015-10-18 下午5:35:28
	 * @author: chason.x
	 */
	public void classList(){
		String siteGuid = getPara("siteGuid");
		String callback = getPara(ApiConstant.jsonpName);
		List<Record> result = new ArrayList<Record>();
		if(StringUtils.hasText(siteGuid)){
			List<Column> colList = ColumnDao.selectList(siteGuid, 1,null);
			
			List<Record> labList = Db.find(kit.loadSqlData("queryYearAndRegion"),siteGuid);
			Set<String> region = new HashSet<String>();
			Set<Integer> years = new HashSet<Integer>();
			
			String[] r;
			Integer _year;
			Integer _yearGroup;
			for(int i = 0,len = labList.size();i < len;i++){
				r = labList.get(i).getStr("fregion") != null?labList.get(i).getStr("fregion").split(","):new String[0];
				for(int ri = 0;ri < r.length;ri++) region.add(r[ri]);
				
				_year = Integer.valueOf(labList.get(i).getStr("fyears"));
				if(_year>= 2000)
					years.add(_year);
				else{
					_yearGroup = Integer.valueOf(_year.toString().substring(2, 3)); ;
					years.add(_yearGroup >= 6?Constant.YEARS.get(_yearGroup):Constant.YEARS.get(5));
				}
			}
			
			List<Record> typeList = new ArrayList<Record>();
			List<Record> regionList = new ArrayList<Record>();
			List<Record> yearsList = new ArrayList<Record>();
			
			Record def = new Record().set("id", "").set("text", "全部");
			
			typeList.add(def);
			regionList.add(def);
			yearsList.add(def);
			
			for(int i = 0,len = colList.size();i < len;i++){
				typeList.add(new Record().set("id", colList.get(i).get("fservicename")).set("text", colList.get(i).get("fservicename")));
			}
			
			List<Integer> yearSet = new ArrayList<Integer>();
			yearSet.addAll(years);
			Collections.sort(yearSet,new Comparator<Integer>() {

				public int compare(Integer o1, Integer o2) {
					return o2.compareTo(o1);
				}
				
			});
			
			for(String str : region){
				regionList.add(new Record().set("id", str).set("text", str));
			}
			
			for(Integer str : yearSet){
				yearsList.add(new Record().set("id", str).set("text", str  < 100? (str != 0?str : "更早" ) + "年代":str));
			}
			
			Record type = new Record();
			type.set("type", "type").set("text", "分类").set("group", typeList);
			Record area = new Record();
			area.set("type", "area").set("text", "地区").set("group", regionList);
			Record date = new Record();
			date.set("type", "date").set("text", "年代").set("group", yearsList);
			
			result.add(type);
			result.add(area);
			result.add(date);
		}
		
		renderJavascript(callback + "(" + JsonKit.toJson(result) + ")");
	}
	
	/**
	 * 主题列表
	 * void
	 * @createTime:2015-10-18 下午5:36:03
	 * @author: chason.x
	 */
	public void movieList(){
		String siteGuid = getPara("siteGuid");
		String type = getPara("type");
		String area = getPara("area");
		Integer years = getParaToInt("date");
		Integer pageNumber = getParaToInt("pageNumber");
		Integer pageSize = getParaToInt("pageSize");
		String callback = getPara(ApiConstant.jsonpName);
		
		pageNumber = (pageNumber == null?1:pageNumber);
		pageSize = (pageSize == null?21:pageSize);
		
		List<Record> resultList = new ArrayList<Record>();
		int totalPage = 0;
		int totalSize = 0;
		
		if(StringUtils.hasText(siteGuid)){
			
			String select= "SELECT id,fguid,ftitle,fthumbnail,fpvsize,ftopsize,fcollectsize,fregion,LEFT(fyears,4) as fyears,fgrade ";
			String sql = " from t_topic where fdelete = 0 ";
			
			if(StringUtils.hasText(area)) sql += " and FIND_IN_SET('"+ area +"',fregion)";
			if(years != null){
				if(years < 100 && years > 0){
					sql += " and fyears BETWEEN '19"+ years +"' AND '19"+ (years + 9) +"'";
				}else if(years < 100 && years == 0){
					sql += " and fyears <= '1959'";
				}else{
					sql += " and LEFT(fyears,4) =  '"+ years + "' ";
				}
			}
			if(StringUtils.hasText(type)){
				sql += " and FIND_IN_SET('"+ type +"',flable) "; // " and fguid in ( select ftopicguid from t_topic_relate where fcolguid = '"+ type +"' )";
			}
			sql += " and fguid in ( select ftopicguid from t_topic_relate where fcolguid in ( " +
				  "	   select fguid from t_column where fsiteguid = '" + siteGuid + "'  " +
				  " )  ) ";
			
			
			sql += " ORDER BY ftop desc,fpvsize desc,fgrade desc";
			
			Page<Record> topicList = Db.paginate(pageNumber, pageSize, select, sql);
			Record item;
			for(int i = 0,len = topicList.getList().size();i < len; i ++){
				item = new Record();
				item.set("id", topicList.getList().get(i).get("fguid"));
				item.set("name", topicList.getList().get(i).get("ftitle"));
				item.set("poster", topicList.getList().get(i).get("fthumbnail"));
				item.set("pvsite", topicList.getList().get(i).get("fpvsize"));
				item.set("grade", topicList.getList().get(i).get("fgrade"));
				
				resultList.add(item);
			}
			totalPage = topicList.getTotalPage();
			totalSize = topicList.getTotalRow();
		}
		Record result = new Record();
		result.set("version", "1.0.0").set("desc", "ucms2.0").set("data", resultList).set("totalRow", totalSize).set("totalPage", totalPage)
		.set("pageNumber", pageNumber).set("pageSize", pageSize);
		
		
		renderJavascript(callback + "(" +JsonKit.toJson(result) + ")");
	}
}
