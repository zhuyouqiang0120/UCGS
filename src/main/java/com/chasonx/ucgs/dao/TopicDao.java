/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-4-3 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.entity.Template;
import com.chasonx.ucgs.entity.Topic;
import com.chasonx.ucgs.entity.TopicContent;
import com.chasonx.ucgs.entity.TopicRelate;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**
 * 
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-4-3下午1:54:46
 * @remark
 */
public class TopicDao {
	
	private static SqlKit kit = new SqlKit("Topic.xml");
	
	public static boolean deleteTopic(String[] idStr){
		String sql = "";
		if(idStr.length > 0){
			for(int i = 0,len = idStr.length;i < len;i++){
				sql += "'" + idStr[i] + "'";
				if(i < (len - 1)) sql += ",";
			}
		}else{
			sql += "0";
		}
		List<String> sqList = new ArrayList<String>();
		sqList.add("delete from t_topic where fguid in(" + sql + ")");
		sqList.add("delete from t_topic_content where ftopicguid in(" + sql +")");
		sqList.add("delete from t_topic_relate where ftopicguid in ("+ sql +")");
		return Db.batch(sqList, sqList.size()).length > 0?true:false;
	}
	
	public static Long addTopic(Model<Topic> info){
		info.save();
		return info.getLong("id");
	}
	
	public static boolean updateTopic(Model<Topic> info){
		return info.update();
	}
	
	public static boolean addTopicContent(String[] content,String topicGuid){
		if(content == null || content.length == 0) return false;
		List<String> bitchSql = new ArrayList<String>();
		for(int i = 0,len = content.length;i < len;i++){
			if(StringUtils.hasText(content[i]))
				bitchSql.add("insert into t_topic_content(ftopicguid,fcontent) values('"+ topicGuid +"','"+ content[i].replaceAll("'", "\\\\\'").replaceAll("\"", "\\\\\"") +"')");
		}
		return Db.batch(bitchSql, bitchSql.size()).length > 0?true:false;
	}
	
	public static boolean deleteContent(String topicGuid){
		return Db.update("delete from t_topic_content where ftopicguid = ?",topicGuid) > 0 ?true:false;
	}
	
	public static Page<Record> selectTopicList(Integer start,Integer limit,String colGuid,Integer delete,Integer check,Record loginUser,String siteGuid){
		String where = "";
		if(loginUser.getInt("fsysroletype") != 1 && loginUser.getInt("groupadmin") != 1){
			where = " and r.fadminuserguid = '"+ loginUser.getStr("fguid") +"' and r.fsiteguid = '"+ siteGuid +"'";
		} 
		
		String select = "SELECT t.id,t.fguid,t.ftitle,t.fsummary,t.fsource,t.fclass,t.freleasetime,t.freleaseer,t.fthumbnail," +
						"t.flable,t.fpvsize,t.ftopsize,t.fcollectsize,t.fregion,t.fyears,t.fgrade,t.ftop,r.id as rid ";
		
		String sql = " FROM `t_topic_relate` r INNER JOIN t_topic t on r.ftopicguid = t.fguid where r.fcolguid = ? and r.fdelete = ? ";
		if(check != null) sql += " and t.fcheck = " + check;
			   sql += where;
	    
			   sql += " order by t.ftop desc,r.fsortnum desc,id desc "; //t.fpvsize desc,t.fgrade desc,
			   
		return Db.paginate(start, limit, select, sql,colGuid,delete);
	}
	
	public static Page<Record> selectTopicListForQuery(int start,int limit,String title,String startTime,String endTime,Record login){
		int adminRoleType = login.getInt("fadmingroup");
		
		/// 权限
		String where = "";
		String where2 = "";
		
		if(login.getInt("fsysroletype") == 1){
			where2 = " select fguid from t_site ";
		}else if(login.getInt("groupadmin") == 1){
			List<String> areaGuidList = AreaDao.getHasAreaGuidList(login.getStr("roleareaguid"), login.getInt("fsysroletype"));
			where2 = " select fguid from t_site where fareaguid in("+ Tools.joinForList(areaGuidList, ",") +")";
		}else{
			where = " and   r.fadminuserguid = '"+ login.getStr("fguid") +"'";
			where2 = "select fsiteguid from t_admingroup_site where fadmingroupid ="+ adminRoleType;
		}
		/// 权限
		
		String sql = " from t_topic t " +
					"	INNER JOIN t_topic_relate r on t.fguid = r.ftopicguid " +
					"	where r.fcolguid in ( " +
					"		select fguid from t_column where fsiteguid in ( " + where2 +
					"		) " + where +
					"	)";
		if(StringUtils.hasText(startTime) && !StringUtils.hasText(endTime)){
			startTime += " 00:00:00";
			sql += " and TO_DAYS(t.freleasetime) >= TO_DAYS('"+ startTime +"')";
		}else if(!StringUtils.hasText(startTime) && StringUtils.hasText(endTime)){
			endTime += " 23:59:59";
			sql += " and TO_DAYS(t.freleasetime) <= TO_DAYS('"+ endTime +"')";
		}else if(StringUtils.hasText(startTime) && StringUtils.hasText(endTime)){
			startTime += " 00:00:00";
			endTime += " 23:59:59";
			sql += " and TO_DAYS(t.freleasetime) between TO_DAYS('"+ startTime +"') and TO_DAYS('"+ endTime +"')";
		}
		if(StringUtils.hasText(title)) sql += " and t.ftitle like '%"+ title +"%'";
		sql += " order by t.ftop desc,r.fsortnum desc,t.id desc"; //fpvsize desc,fgrade
		return Db.paginate(start, limit, "select t.* ", sql);
	}
	
	public static boolean addTopicRelate(String colGuid,String topicGuid,String adminUserGuid,int topicType,String siteGuid,Integer tempId){
		TopicRelate relate = new TopicRelate();
		Integer sorNum = getTopicRelateSortNum(colGuid);
		relate.set("fcolguid", colGuid);
		relate.set("ftopicguid", topicGuid);
		relate.set("fsortnum", sorNum != null?sorNum+1:10000);
		relate.set("fadminuserguid", adminUserGuid);
		relate.set("ftopictype", topicType);
		relate.set("fsiteguid", siteGuid);
		relate.set("ftemplateid", tempId);
		return relate.save();
	}
	
	public static Integer getTopicRelateSortNum(String colGuid){
		return Db.queryInt("select max(fsortnum) from t_topic_relate where fcolguid = ? ",colGuid);
	}
	
	public static Integer getTopicRelateMinSortNum(String colGuid){
		return Db.queryInt("select min(fsortnum) from t_topic_relate where fcolguid = ? ",colGuid);
	}
	
	public static boolean updateNewsForTop(String[] idStr,Integer top){
		String sql = "update t_topic set ftop = ? where id in(";
		if(idStr.length > 0){
			for(int i = 0,len = idStr.length;i < len;i++){
				sql += "'" + idStr[i] + "'";
				if(i < (len - 1)) sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ") ";
		return Db.update(sql,top) > 0?true:false;
	}
	
	public static boolean updateTopicCheck(String[] idStr,Integer check){
		String sql = "update t_topic set fcheck = " + check + " where fguid in(";
		if(idStr.length > 0){
			for(int i = 0,len = idStr.length;i < len;i++){
				sql += "'" + idStr[i] + "'";
				if(i < (len - 1)) sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ")";
		return Db.update(sql) > 0?true:false;
	}
	
	public static boolean updateDelete(String[] idStr,String colGuid,Integer fdelete){
		String sql = "update t_topic_relate set fdelete = " + fdelete + " where ftopicguid in(";
		if(idStr.length > 0){
			for(int i = 0,len = idStr.length;i < len;i++){
				sql += "'" + idStr[i] + "'";
				if(i < (len - 1)) sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ") and fcolguid = ?";
		return Db.update(sql,colGuid) > 0;
	}
	
	public static boolean updateTemplate(String topicGuid,String colGuid,int tempid){
		String sql = "update t_topic_relate set ftemplateid = ? where fcolguid = ? and ftopicguid = ?";
		return Db.update(sql,tempid,colGuid,topicGuid) > 0;
	}
	
	public static Record selectTopicEntity(Long id){
		String sql = "select m.*,r.fcolguid,r.ftop,r.ftemplateid,r.fsiteguid,t.id AS finfocolid from t_topic m INNER JOIN t_topic_relate r on m.fguid = r.ftopicguid "
					+ " INNER JOIN t_column t on t.fguid = r.fcolguid "
					+" where m.id = ? ";
		return Db.findFirst(sql,id);
	}
	
	public static List<Record> selectNewsContent(Long id){
		return Db.find("select * from t_topic_content where infomationid = " + id);
	}
	
	
	public static List<Record> selectTopicListBySiteGuid(String siteGuid){
		String sql = "select id,fguid,ftitle,fthumbnail,fpvsize,ftopsize,fcollectsize,fregion,fyears from t_topic where fguid in ( " +
					 "	 select ftopicguid from t_topic_relate where fcolguid in ( " +
					 "		   select fguid from t_column where fsiteguid = ? 	 )	)";
		return Db.find(sql,siteGuid);
	}
	
	public static String selectTopicSiteGuidByTopicId(Long topicId){
		return Db.queryStr("select fsiteguid from t_column c INNER JOIN t_topic_relate r ON c.fguid = r.fcolguid where r.ftopicguid = (select fguid from t_topic where id = ?)",topicId);
	}
	
	public static boolean validateModify(String topicGuid,String colGuid,String adminGuid){
		return TopicRelate.infomationRelateDao.findFirst("select * from t_topic_relate where fcolguid = ? and ftopicguid = ? and fadminuserguid = ?",colGuid,topicGuid,adminGuid) != null?true:false;
	}
	
	/**
	 * 
	 * @author chasonx
	 * @create 2016年9月23日 上午11:17:43
	 * @update
	 * @param  tidStrs 主题ID字符串
	 * @param  type 操作类型 delete check nocheck recyle recovery
	 * @return int
	 */
	public static int modifyTopicForColumnAttrReSet(String tidStrs,String type,boolean beforeCheck){
		List<Record> tcolIdList = Db.find("select r.fcolguid,r.ftopicguid,t.fcheck,t.fdelete from t_topic_relate r INNER JOIN t_topic t ON r.ftopicguid = t.fguid where t.fguid in ("+ tidStrs +")");
		List<String> cidList = Db.query("select DISTINCT fcolguid from t_topic_relate where ftopicguid in ("+ tidStrs +")");
		
		int checkSize = 0;
		int topicSize = 0;
		
		int clen = 0;
		int cc = 0;
		
		List<String> batchSql = new ArrayList<String>();
		String sql;
		for(int i = 0,len = cidList.size();i < len;i++){
			topicSize = 0;
			checkSize = 0;
			
			sql = "update t_column set ";
			for(cc = 0,clen = tcolIdList.size();cc < clen;cc ++){
				if(tcolIdList.get(cc).getStr("fcolguid").equals(cidList.get(i))){
					if(tcolIdList.get(cc).getInt("fcheck") == 1) checkSize ++;
					topicSize ++;
				}
			}
			
			if(type.equals("check")){
				sql += " ftopicsize=ftopicsize + " + topicSize + ",ftopicchecksize=ftopicchecksize - " + topicSize + " where ftopicchecksize - " + topicSize + " >= 0";
			}else if(type.equals("nocheck")){
				sql += (beforeCheck?" ftopicsize=ftopicsize - " + topicSize + ",ftopicchecksize=ftopicchecksize + " + topicSize + " where ftopicsize - " + topicSize + " >= 0":" ftopicchecksize = ftopicchecksize where 1 = 1 ");
			}else if(type.equals("delete")){
				sql += " ftopicrecyclesize = ftopicrecyclesize - " + topicSize + " where ftopicrecyclesize - " + topicSize + " >= 0";
			}else if(type.equals("recyle")){
				sql += (checkSize > 0?" ftopicsize=ftopicsize - " + topicSize:" ftopicchecksize=ftopicchecksize - " + topicSize) + 
						",ftopicrecyclesize = ftopicrecyclesize + " + topicSize + " where (ftopicsize - " + topicSize + " >= 0 or " +
						"ftopicchecksize - " + topicSize + " >= 0 ) ";
			}else if(type.equals("recovery")){
				sql += (checkSize > 0?" ftopicsize=ftopicsize + " + topicSize:" ftopicchecksize=ftopicchecksize + " + topicSize) +
						",ftopicrecyclesize = ftopicrecyclesize - "+ topicSize +"  where ftopicrecyclesize - "+ topicSize + " >= 0 ";
			}
			sql += " and fguid = '"+ cidList.get(i) +"' ";
			batchSql.add(sql);
		}
		return Db.batch(batchSql, batchSql.size()).length;
	}
	
	public static List<TopicRelate> getAllTopicRelateBySiteGuid(String siteGuid){
		return TopicRelate.infomationRelateDao.find(kit.loadSqlData("selectTopicRelateBySiteGuid"),siteGuid);
	}
	
	public static List<TopicRelate> getAllTopicRelateByColumnGuidList(List<String> list){
		String sql = kit.loadSqlData("selectTopicRelateByColumnGuidList");
		sql = sql.replace("?",  StringUtils.joinForList(list, ","));
		System.out.println("---->" + sql);
		return TopicRelate.infomationRelateDao.find(sql);
	}
	
	public static List<Topic> getAllTopicBySiteGuid(String siteGuid){
		return Topic.infomationDao.find(kit.loadSqlData("selectTopicBySiteGuid"),siteGuid);
	}
	
	public static List<Topic> getAllTopicByColumnGuidList(List<String> list){
		String sql = kit.loadSqlData("selectTopicByColumnGuidList");
		sql = sql.replace("?", StringUtils.joinForList(list, ","));
		return Topic.infomationDao.find(sql);
	}
	
	public static List<TopicContent> getAllTopicContentBySiteGuid(String siteGuid){
		return TopicContent.contentDao.find(kit.loadSqlData("selectTopicContentBySiteGuid"),siteGuid);
	}
	
	public static List<TopicContent> getAllTopicContentByColumnGuidList(List<String> list){
		String sql = kit.loadSqlData("selectTopicContentByColumnGuidList");
		sql = sql.replace("?", StringUtils.joinForList(list, ","));
		return TopicContent.contentDao.find(sql);
	}
	
	public static int delAllTopicRelativeBySiteGuid(String siteGuid){
		return Db.update(kit.loadSqlData("deleteTopicRelativeBySiteGuid"),siteGuid);
	}
	
	public static int delAllTopicBySiteGuid(String siteGuid){
		return Db.update(kit.loadSqlData("deleteTopicBySiteGuid"),siteGuid);
	}
	
	public static int delAllTopicContentBySiteGuid(String siteGuid){
		return Db.update(kit.loadSqlData("deleteTopicContentBySiteGuid"),siteGuid);
	}
	
	public static int delTopicByGuidList(List<String> list){
		return Db.update("delete from t_topic where fguid in ("+ StringUtils.joinForList(list, ",") +") ");
	}
	
	public static int delTopicRelateByTopicGuidList(List<String> list){
		return Db.update("delete from t_topic_relate where ftopicguid in ("+ StringUtils.joinForList(list, ",") +")");
	}
	
	public static int delTopicContentByTopicGuidList(List<String> list){
		return Db.update("delete from t_topic_content where ftopicguid in ("+ StringUtils.joinForList(list, ",") +")");
	}
	
	public static List<Template> getTemplateListBySiteGuid(String siteGuid){
		String sql = "select * from t_template where id in ( " +
					 "select DISTINCT ftemplateid from t_topic_relate where fcolguid in ( select fguid from t_column where fsiteguid = ?) )";
		return Template.temp.find(sql,siteGuid);
	}
	
	public static List<Template> getTemplateListByColumnGuidList(List<String> list){
		String sql = "select * from t_template where id in ( " +
				 "select DISTINCT ftemplateid from t_topic_relate where fcolguid in ("+ StringUtils.joinForList(list, ",") +") )";
		return Template.temp.find(sql);
	}
	
	public static int delTemplateByIdList(List<Integer> list){
		return Db.update("delete from t_template where id in ("+ StringUtils.joinForList(list, ",") +")");
	}
}
