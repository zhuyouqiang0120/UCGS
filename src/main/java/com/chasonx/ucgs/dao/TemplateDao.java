/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-14 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.SqlKit;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.entity.Template;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月14日下午10:24:13
 * @remark
 */
public class TemplateDao {

	private static SqlKit kit = new SqlKit("MediaRequestData.xml");
	
	/**
	 * 网站模版列表
	 * List<Record>
	 * @createTime:2015年9月14日 下午10:25:47
	 * @author: chason.x
	 */
	public static List<Record> getTemplateList(String siteGuid){
		String sql = "select t.ftname as tempname,t.fguid as guid,t.fcreatetime as createtime,t.fstate as state, " +
					"	t.fpreviewpath as previewpath,t.fpublish as publish from t_template t " +
					"	INNER JOIN t_site s on s.ftempguid = t.ftempsourceguid " +
					"	 where s.fguid = ? and t.fdelete = 0";
		return Db.find(sql, siteGuid);
	}
	
	public static List<Record> getAdMediaList(String tempguid){
		String sql = "select * from t_template_status  where ftempguid = ? and fdelete = 0";
		return Db.find(sql,tempguid);
	}
	
	public static int updateTemplatePublisState(String tempGuid,int state,boolean autoUpdate){
		if(autoUpdate){
			String sql = "update t_template set fstate = ? where fguid = ? and  " +
						 " (select count(id) as items from t_template_status where ftempguid = ?) = (select count(id) as fixedItems from t_template_status where ftempguid = ? and fstate = 1)";
			
			return Db.update(sql,state,tempGuid,tempGuid,tempGuid);
		}else{
			return Db.update("update t_template set fstate = ? where fguid = ?",state,tempGuid);
		}
	}
	
	public static List<Record> getTempMediaRequestInfoList(String siteGuid,String statuStr){
		String[] guids = siteGuid.split("@");
		List<Record> tempList = Db.find(kit.loadSqlData("getTempMrList"),guids[0],guids[1]);
		if(!tempList.isEmpty()){
			List<String> tempGuid = new ArrayList<String>();
			for(int i = 0,len = tempList.size();i < len;i++){
				tempGuid.add(tempList.get(i).getStr("guid"));
			}
			
			String statuSql = kit.loadSqlData("getMediaList") + " and ftempguid in("+ Tools.joinForList(tempGuid, ",") +")";
			if(StringUtils.hasText(statuStr)) statuSql += " and fguid in("+ Tools.join(statuStr.split(","), ",") +") ";
				
			List<Record> mrList = Db.find(statuSql);
			List<Record> _mrList;
			Set<String> tempSet = new HashSet<String>();
			for(int i = 0,len = tempList.size();i < len;i++){
				_mrList = new ArrayList<Record>();
				for(int j = 0,jlen = mrList.size();j < jlen;j++){
					if(mrList.get(j).getStr("templateGuid").equals(tempList.get(i).getStr("guid")))
						_mrList.add(mrList.get(j));
						tempSet.add(mrList.get(j).getStr("templateGuid"));
				}
				tempList.get(i).set("items", _mrList);
			}
			if(StringUtils.hasText(statuStr)){
				List<Record> _tempList = new ArrayList<Record>();
				for(int i = 0;i < tempList.size();i++){
					for(Iterator<String> ite = tempSet.iterator();ite.hasNext();){
						if(tempList.get(i).get("guid").equals(ite.next()))
							_tempList.add(tempList.get(i));
					}
				}
				
				tempList = _tempList;
			}
		}
		return tempList;
	}
	
	public static Template getTemplateEntity(String whereCase){
		return Template.temp.findFirst("select * from t_template where 1 = 1 " + (StringUtils.hasText(whereCase)?whereCase:""));
	}
}
