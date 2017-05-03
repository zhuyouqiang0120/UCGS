/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-5-4 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.dao;

import java.util.ArrayList;
import java.util.List;







import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.entity.Column;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;

/**
 * 业务列表modal处理
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-5-4上午9:47:54
 * @remark
 */
public class ColumnDao {

	public static boolean addColumn(Model<Column> col){
		Integer sort = getMaxSort(col.getInt("flevel"), col.getStr("fparentuid"));
		col.set("fsortnumber", sort != null? sort + 1:1);
		return col.save();
	}
	
	public static Integer getMaxSort(Integer level,String pid){
		return Db.queryInt("select max(fsortnumber) FROM `t_column` where flevel = ? and fparentuid = ?",level,pid);
	}
	
	public static boolean updateColumn(Model<Column> col){
		return col.update();
	}
	
	public static boolean delColumn(String[] idArray){
		String sql = "delete from t_column where id in(";
		if(idArray.length > 0){
			for(int i = 0,len = idArray.length;i < len;i++){
				sql += idArray[i];
				if(i < (len - 1))
					sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ")";
		return Db.update(sql) > 0?true:false;
	}
	
	public static boolean updateStateBatch(String[] idArray,Integer state){
		String sql = "update t_column set fstate = "+ state + " where id in(";
		if(idArray.length > 0){
			for(int i = 0,len = idArray.length;i < len;i++){
				sql += idArray[i];
				if(i < (len - 1))
					sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ")";
		return Db.update(sql) > 0?true:false;
	}
	
	public static List<Column> selectNodeList(String pid,Integer level,String sign){
		return Column.columnDao.find("select * from t_column where flevel = ? and fparentuid = ? and id "+ sign +" order by fsortnumber asc ",level,pid);
	}
	
	public static boolean updateLevel(List<Long> taridList,Integer temp){
		String sql =  "update t_column set flevel = flevel + "+ temp +" where id in(";
		if(taridList.size() > 0){
			for(int i = 0,len = taridList.size();i < len;i ++ ){
				sql += taridList.get(i) + "";
				if(i < (len - 1))
					sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ")";
		return Db.update(sql) > 0?true:false;
	}
	
	public static boolean updateSort(List<Long> idArr){
		String sql =  "update t_column set fsortnumber = fsortnumber + 1 where id in(";
		if(idArr.size() > 0){
			for(int i = 0,len = idArr.size();i < len;i ++ ){
				sql += idArr.get(i) + "";
				if(i < (len - 1))
					sql += ",";
			}
		}else{
			sql += "0";
		}
		sql += ")";
		return Db.update(sql) > 0?true:false;
	}
	
	public static List<Column> selectList(String siteGuid,Integer state,Record loginRec){
		String sql = "select * from t_column where fsiteguid = ? "+ (null != state?"and fstate = " + state : "");
		if(null != loginRec && loginRec.getInt("fsysroletype") == 0){
			String condition = " and fsiteguid = '"+ siteGuid +"'";
			List<String> colGuid = AdminAuthDao.getAuthFieldList("ftargetauthguid", loginRec.getStr("fguid"), Constant.AuthTypes.colmun.toString(),condition);
			if(colGuid.isEmpty()) colGuid = AdminAuthDao.getAuthFieldList("ftargetauthguid", loginRec.getStr("roleguid"), Constant.AuthTypes.colmun.toString(),condition);
			if(!colGuid.isEmpty())
				sql += " and fguid in ("+ StringUtils.joinForList(colGuid, ",") +")";
		}
		sql += " order by fsortnumber,flevel asc";
		return Column.columnDao.find(sql,siteGuid);
	}
	
	public static List<Column> selectAllColumnList(String siteGuid,Integer state,Record loginRec){
		List<Column> colList = ColumnDao.selectList(siteGuid,state,loginRec);
		Boolean suadmin = loginRec.getInt("fsysroletype") == 1;
		colList.addAll(getRelationColumn(colList, suadmin));
		return colList;
	}
	
	public static List<Column> getRelationColumn(List<Column> colList,Boolean suadmin){
		List<Integer> idxList = new ArrayList<Integer>();
		List<String> relationSiteGuid = new ArrayList<String>();
		List<Integer> relationIsChild = new ArrayList<Integer>();
		List<Integer> removeIdx = new ArrayList<Integer>();
		
		for(int i = 0,len = colList.size();i < len;i++){
			if(StringUtils.hasText(colList.get(i).getStr("frelationsiteguid"))){
				idxList.add(i);
				relationSiteGuid.add(colList.get(i).getStr("frelationsiteguid"));
				relationIsChild.add(colList.get(i).getInt("frelatitonischid"));
				
				if(colList.get(i).getInt("frelatitonischid") == 0) removeIdx.add(i);
			}
		}
		if(relationSiteGuid.size() == 0) relationSiteGuid.add("0");
		
		List<Column> relationCol = Column.columnDao.find("select * from t_column where fsiteguid in ("+ Tools.joinForList(relationSiteGuid, ",") +") order by fsortnumber,flevel asc");
		List<Column> relaChildNode = new ArrayList<Column>();
		
		int i;
		int j;
		int len;
		int jlen;
		for( j = 0,jlen = relationSiteGuid.size();j < jlen;j++){
			for( i = 0,len = relationCol.size();i < len;i++){
				if(relationSiteGuid.get(j).equals(relationCol.get(i).getStr("fsiteguid"))){
					
					if(StringUtils.hasText(colList.get(idxList.get(j)).getStr("frelationcolguid"))){
						if(relationCol.get(i).getStr("fguid").equals(colList.get(idxList.get(j)).getStr("frelationcolguid"))){
							Column column = new Column();
							Tools.copyProperties(column, relationCol.get(i));
							
							if(relationIsChild.get(j) == 0){ //设置为同级栏目
								column.set("flevel", colList.get(idxList.get(j)).getInt("flevel"));
								column.set("fguid", colList.get(idxList.get(j)).getStr("fguid"));
							}else{ //设置为子级栏目
								column.set("flevel", colList.get(idxList.get(j)).getInt("flevel") + column.getInt("flevel"));
								column.set("fparentuid", colList.get(idxList.get(j)).getStr("fguid"));
							}
							
							column.set("ftype", suadmin.toString());
							column.set("fsiteguid", colList.get(idxList.get(j)).getStr("fsiteguid"));
							relaChildNode.add(column);
							
							//if(relationIsChild.get(j) == 0) colList.get(idxList.get(j)).clear();
							
							chooseRelationNode(relationCol, relationCol.get(i).getStr("fguid"), relaChildNode,column.getInt("flevel"),suadmin.toString(),column.getStr("fsiteguid"),relationIsChild.get(j), colList.get(idxList.get(j)).getStr("fguid"));
						}
					}else{
						Column column = new Column();
						Tools.copyProperties(column, relationCol.get(i));
						
						if(relationIsChild.get(j) == 0){ //设置为同级栏目
//							if(column.getInt("flevel") == 1)  column.set("fguid", colList.get(idxList.get(j)).getStr("fguid"));
							column.set("flevel", colList.get(idxList.get(j)).getInt("flevel") );
						}else{ //设为子级栏目
							if(column.getInt("flevel") == 1)  column.set("fparentuid", colList.get(idxList.get(j)).getStr("fguid"));
							column.set("flevel", colList.get(idxList.get(j)).getInt("flevel") + column.getInt("flevel"));
						}
						
						column.set("ftype", suadmin.toString());
						column.set("fsiteguid", colList.get(idxList.get(j)).getStr("fsiteguid"));
						relaChildNode.add(column);
						
					}
				}
			}
		}
		
		if(!removeIdx.isEmpty()){
			for(int n = 0,nlen = removeIdx.size();n < nlen; n++){
				colList.remove(colList.get(removeIdx.get(n)));
			}
		}
		return relaChildNode;
	}
	
	private static void chooseRelationNode(List<Column> data,String pguid,List<Column> container,int levelFlag,String admin,String siteGuid,
			int isChild,String isChildPguid){
		for(int i = 0,len = data.size();i < len;i++){
			if(StringUtils.hasText(data.get(i).getStr("fparentuid")) && data.get(i).getStr("fparentuid").equals(pguid)){
				Column column = new Column();
				Tools.copyProperties(column, data.get(i));
				column.set("flevel", data.get(i).getInt("flevel") + levelFlag);
				column.set("ftype", admin);
				column.set("fsiteguid", siteGuid);
				if(isChild == 0) column.set("fparentuid", isChildPguid);
				container.add(column);
				chooseRelationNode(data, column.getStr("fguid"), container,levelFlag,admin,siteGuid,isChild,isChildPguid);
			}
		}
	}
	
	public static Column columnEntity(Long id){
		return Column.columnDao.findById(id);
	}
	
	
	public static boolean columnTopicSizeAdd(String colGuid,int flag){
		return Db.update("update t_column set ftopicsize = ftopicsize + ? where fguid = ? ",flag,colGuid) > 0;
	}
	
	public static boolean columnTopicSizeMin(String colGuid,int flag){
		return Db.update("update t_column set ftopicsize = ftopicsize - ? where fguid = ? and ftopicsize >= 0 ",flag,colGuid) > 0;
	}
	/**
	 * 审核主题
	 * boolean
	 * @createTime:2015-10-26 下午4:04:36
	 * @author: chason.x
	 */
	public static boolean changeCheckSize(String colGuid,Integer flag,int check,int oldCheck){
		
		List<String> sql = new ArrayList<String>();
		if(check == 0){
			sql.add("update t_column set ftopicchecksize = ftopicchecksize + " + flag + " where  fguid = '"+ colGuid +"'");
		}else if(check == 1){
			sql.add("update t_column set ftopicchecksize = ftopicchecksize - " + flag + " where  ftopicchecksize > 0 and fguid = '"+ colGuid +"'");
			sql.add("update t_column set ftopicsize = ftopicsize + " + flag + " where fguid = '"+ colGuid +"'");
		}else if(check == 2){
			//sql.add("update t_column set ftopicchecksize = ftopicchecksize + " + flag + " where  fguid = '"+ colGuid +"'");
			if(oldCheck == 1)
				sql.add("update t_column set ftopicsize = ftopicsize - " + flag + ",ftopicchecksize = ftopicchecksize + "+ flag +" where ftopicsize > 0 and fguid = '"+ colGuid +"'");
		}
		return Db.batch(sql, sql.size()).length > 0;
	}
	/**
	 * 删除主题 
	 * boolean
	 * @createTime:2015-10-26 下午4:04:17
	 * @author: chason.x
	 */
	public static boolean changeRecyleSize(String exp,String colGuid,Integer flag,boolean del){
		if(exp.length() > 1 && !exp.equals("+") && !exp.equals("-")) throw new RuntimeException("表达式错误");
		List<String> sql = new ArrayList<String>();
		String s1 = "update t_column set ftopicrecyclesize = ftopicrecyclesize "+ exp + flag + " where  1 = 1  ";
		if(exp.equals("+") && del){
			sql.add("update t_column set ftopicsize = ftopicsize - " + flag + " where ftopicsize > 0 and fguid = '"+ colGuid +"'");
		}else if(exp.equals("-")){
			s1 += " and ftopicrecyclesize > 0 ";
			if(!del)
				sql.add("update t_column set ftopicsize = ftopicsize + " + flag + " where  fguid = '"+ colGuid +"'");
		}
		s1 += " and fguid = '"+ colGuid +"'";
		sql.add(s1);
		return Db.batch(sql, sql.size()).length > 0;
	}
	
	public static int savePermission(String[] colGuid,String siteguid,Long roleid){
		StringBuffer sb = new StringBuffer("insert into t_admingroup_column(fcolguid,fadmingroupid,fsiteguid,ftype) values");
		for(int i = 0,len = colGuid.length;i < len;i++){
			sb.append("('"+ colGuid[i] +"',"+ roleid +",'"+ siteguid +"',"+ Constant.ADMINGROUP_ROLE_TYPE +")");
			if(i < (len - 1)) sb.append(",");
		}
		return Db.update(sb.toString());
	}
	
	public static int delPermission(Long roleid,String siteGuid){
		return Db.update("delete from t_admingroup_column where fadmingroupid = ? and fsiteguid = ?",roleid,siteGuid);
	}
	
	public static Long selectColumnId(String guid){
		return Db.queryLong("select id from t_column where fguid = ?",guid);
	}
	
	public static int deleteAllColumnBySiteGuid(String siteGuid){
		return Db.update("delete from t_column where fsiteguid = ?",siteGuid);
	}
	
	public static int deleteColumnByGuidList(List<String> list){
		return Db.update("delete from t_column where fguid in ("+ StringUtils.joinForList(list, ",") +")");
	}
}
