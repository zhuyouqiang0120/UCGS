/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-10 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.List;

import com.chasonx.tools.StringUtils;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.TableMapping;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月10日上午11:49:41
 * @remark
 */
public class PublicDao {

	public static int execute(String method,Model<?> mod){
		int res = 0;
		if(method.equalsIgnoreCase("insert")){
			res = mod.save()?1:0;
		}else if(method.equalsIgnoreCase("update")){
			res = mod.update()?1:0;
		}else if(method.equalsIgnoreCase("delete")){
			res = mod.delete()?1:0;
		}
		return res;
	}
	
	public static int updateBatch(String sql){
		return Db.update(sql);
	}
	
	public static int updateBatch(String sql,Object...para){
		return Db.update(sql,para);
	}
	
	@SuppressWarnings("rawtypes")
	public static Model queryById(Class<?> model,Long id){
		try {
			return ((Model)model.newInstance()).findById(id);
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static Record query(String sql){
		return Db.findFirst(sql);
	}
	
	public static Record query(String sql,Object...para){
		return Db.findFirst(sql,para);
	}
	
	public static List<Record> queryList(String sql){
		return Db.find(sql);
	}
	
	public static List<Record> queryList(String sql,Object...para){
		return Db.find(sql,para);
	}
	
	public static Page<Record> queryListForPage(String select,String whereCase,int pageNum,int pageSize){
		return Db.paginate(pageNum, pageSize, select, whereCase);
	}
	
	public static Page<Record> queryListForPage(String select,String whereCase,int pageNum,int pageSize,Object...para){
		return Db.paginate(pageNum, pageSize, select, whereCase,para);
	}
	
	public static String getMysqlPath(){
		return Db.queryStr("select @@basedir as basepath from dual");
	}
	
	@SuppressWarnings("rawtypes")
	public static <T> String getFieldStr(String field,String whereCase,Class<? extends Model> classes){
		return Db.queryStr("select " + field + " from " + TableMapping.me().getTable(classes).getName() + " where 1 = 1 " + (StringUtils.hasText(whereCase)?whereCase:""));
	}
	
	@SuppressWarnings("rawtypes")
	public static <T> List<T> queryListModel(Class<? extends Model> classes,String where){
		return Db.query("select * from " + TableMapping.me().getTable(classes).getName() + " where 1 = 1 and " + where);
	}
	
	public static String getTableName(@SuppressWarnings("rawtypes") Class<? extends Model> classes){
		return TableMapping.me().getTable(classes).getName();
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static <T> List<T> getList(Class<? extends Model> classes,Record param){
		Model mod = null;
		try {
			mod = classes.newInstance();
			return mod.find("select * from " + getTableName(classes) + getWhereSql(param));
		} catch (InstantiationException | IllegalAccessException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public static String getWhereSql(Record rec){
		String[] columns = rec.getColumnNames();
		StringBuilder sb = new StringBuilder();
		sb.append(" where 1 = 1 ");
		for(int i = 0,ilen = columns.length;i < ilen;i++){
			sb.append(" and " + columns[i] + " = '"+ rec.get(columns[i]) +"'");
		}
		return sb.toString();
	}
	
	
}
