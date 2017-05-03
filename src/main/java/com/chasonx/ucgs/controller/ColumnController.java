/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-5-4 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;

import java.util.ArrayList;
import java.util.List;

import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.AdminAuthDao;
import com.chasonx.ucgs.dao.ColumnDao;
import com.chasonx.ucgs.dao.TMapDao;
import com.chasonx.ucgs.entity.Column;
import com.chasonx.ucgs.interceptor.Para;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * 业务列表逻辑控制
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015-5-4上午9:46:34
 * @remark
 */
public class ColumnController extends Controller {

	@AnnPara("访问栏目设置页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.COLUMN_LIST);
	}
	/***
	 * 业务操作
	 * void
	 */
	@AnnPara("栏目编辑操作")
	@Before({Para.class,SaveLog.class})
	public void servoperaton(){
		Column column = Tools.recordConvertModel((Record)getAttr("RequestPara"),Column.class);
		int type = getParaToInt("type");
		Long res = 0L;
		switch(type){
		case 1:
			column.set("fguid", Tools.getGuid());
			ColumnDao.addColumn(column);
			if(column.getLong("id") != null) res = column.getLong("id");
		break;
		case 2:
			ColumnDao.updateColumn(column); 
			res = column.getLong("id");
			break;
		}
		renderJson(res);
	}
	
	/**
	 * 更新/删除
	 * void
	 */
	@AnnPara("栏目更新/删除操作")
	@Before({POST.class,SaveLog.class})
	public void servmodify(){
		boolean res = false;
		Long pid = getParaToLong("ckey");
		String guid = getPara("guid");
		Integer state = getParaToInt("state");
		String siteGuid = getPara("siteGuid");
		Integer type = getParaToInt("type");
		List<Column> columns = ColumnDao.selectList(siteGuid,null,DHttpUtils.getLoginUser(getRequest()));
	    List<Column> graid = new ArrayList<Column>();
	    choseColumn(columns, graid, guid);
	    
	    String[] idStr = new String[graid.size() + 1];
	    for(int i = 0,len = graid.size();i < len;i++){
	    	idStr[i] = graid.get(i).getLong("id") + "";
	    }
	    idStr[graid.size()] = pid + "";
	    
	    switch(type){
	    case 1: res = ColumnDao.updateStateBatch(idStr, state); break;
	    case 2: res = ColumnDao.delColumn(idStr); break;
	    }
	    
	    renderJson(res?pid:0);
	}
	
	/**
	 * 业务移动
	 * void
	 */
	@AnnPara("栏目移动操作")
	@Before({POST.class,SaveLog.class})
	public void servmove(){
		boolean res = false;
		Long sourceid = getParaToLong("sourceid");
		Long targetid = getParaToLong("targetid");
		String siteGuid = getPara("siteGuid");
		String point = getPara("point");
		Column sourceEntity = ColumnDao.columnEntity(sourceid);
		Column targetEntity  = ColumnDao.columnEntity(targetid);
		/*sourceid 移动栏目是否有子栏目*/
		List<Column> columns = ColumnDao.selectList(siteGuid,null,DHttpUtils.getLoginUser(getRequest()));
	    List<Column> graid = new ArrayList<Column>();
	    choseColumn(columns, graid, sourceEntity.getStr("fguid"));
		
	    
    	Integer temp = 0;
    	if(point.equals("append")){ //作为子级栏目时 级数在目标栏目上加1
    		temp = (targetEntity.getInt("flevel") + 1) - sourceEntity.getInt("flevel");
    		sourceEntity.set("fparentuid", targetEntity.getStr("fguid"));
    		sourceEntity.set("flevel", sourceEntity.getInt("flevel") + temp);
    	}else if(point.equals("top") || point.equals("bottom")){
    		temp = targetEntity.getInt("flevel") - sourceEntity.getInt("flevel");
	    	String _sign = "";
	    	sourceEntity.set("flevel", targetEntity.getInt("flevel"));
	    	sourceEntity.set("fparentuid", targetEntity.get("fparentuid"));
	    	if(point.equals("top")){
	    		_sign = ">=";
	    		sourceEntity.set("fsortnumber", targetEntity.get("fsortnumber"));
	    	}else 	if(point.equals("bottom")){
	    		_sign = ">";
	    		sourceEntity.set("fsortnumber", targetEntity.getInt("fsortnumber") + 1);
	    	}
	    	_sign += targetEntity.get("id");
	    	/*target 同级栏目*/
		    List<Column> targetList = ColumnDao.selectNodeList(targetEntity.getStr("fparentuid"), targetEntity.getInt("flevel"),_sign);
		    List<Long> sidList = new ArrayList<Long>();
		    for(int i = 0,len = targetList.size();i < len;i++){
		    	if(!targetList.get(i).getLong("id").equals(sourceid))
		    		sidList.add(targetList.get(i).getLong("id"));
		    }
		    //更新排序
		    ColumnDao.updateSort(sidList);
    	}
    	
    	if(graid.size() > 0){//有子栏目时
	    	List<Long> sourceidList = new ArrayList<Long>();
	    	for(int i = 0,len = graid.size();i < len;i++){
	    		sourceidList.add(graid.get(i).getLong("id"));
	    	}
	    	//更新子栏目级别
	    	ColumnDao.updateLevel(sourceidList,temp);
	    }
    	
	    res = sourceEntity.update();
	    renderJson(res?1:0);
	}
	
	/**
	 * 业务列表
	 * void
	 */
	@AnnPara("查询栏目列表")
	@Before(SaveLog.class)
	public void servlist(){
		renderJson(ColumnDao.selectList(getPara("siteGuid"),getParaToInt("state"),DHttpUtils.getLoginUser(getRequest())));
	}	
	
	/**
	 * 包含关联栏目
	 * void
	 * @createTime:2015-11-29 下午7:47:44
	 * @author: chason.x
	 */
	@AnnPara("查询栏目/包含栏目列表")
	@Before(SaveLog.class)
	public void columnall(){
		renderJson(ColumnDao.selectAllColumnList(getPara("siteGuid"), 1, DHttpUtils.getLoginUser(getRequest())));
	}
	
	@AnnPara("栏目权限操作")
	@Before(SaveLog.class)
	public void permission(){
		int type = getParaToInt("type");
		String roleId = getPara("roleId");
		String siteGuid = getPara("siteGuid");
		String[] colGuid = getParaValues("colGuid[]");
		int res = 0;
		switch(type){
		case 1:
			//ColumnDao.delPermission(roleId,siteGuid);
			AdminAuthDao.del(roleId, Constant.AuthTypes.colmun.toString());
			//res = ColumnDao.savePermission(colGuid,siteGuid, roleId);
			StringBuffer sb = new StringBuffer("insert into t_admin_auth(ftargetauthguid,fuserguid,fsiteguid,ftype) values");
			for(int i = 0,len = colGuid.length;i < len;i++){
				sb.append("('"+ colGuid[i] +"','"+ roleId +"','"+ siteGuid +"','"+ Constant.AuthTypes.colmun.toString() +"')");
				if(i < (len - 1)) sb.append(",");
			}
			res = Db.update(sb.toString());
			break;
		case 2:
			//res = ColumnDao.delPermission(roleId,siteGuid);
			res = AdminAuthDao.del(roleId, Constant.AuthTypes.colmun.toString()) ? 1:0;
			break;
		}
		renderJson(res);
	}
	
	@AnnPara("查询可操作栏目列表")
	@Before(SaveLog.class)
	public void permissionList(){
		String userGuid = getPara("roleId");
		String siteGuid = getPara("siteGuid");
		renderJson(Db.find("SELECT c.* FROM t_column c INNER JOIN t_admin_auth ac on ac.ftargetauthguid = c.fguid where ac.fsiteguid = ? and ac.fuserguid = ? and ac.ftype = ?",siteGuid,userGuid,Constant.AuthTypes.colmun.toString()));
	}
	
	public void choseColumn(List<Column> data,List<Column> graid,String pid){
		 for(int i = 0,len = data.size();i < len;i++){
			 if(null != data.get(i).getStr("fparentuid") && data.get(i).getStr("fparentuid").equals(pid)){
				 graid.add(data.get(i));
				 if(getSiblingColumn(data, data.get(i).getStr("fguid")) > 0)
					 choseColumn(data, graid, data.get(i).getStr("fguid"));
			 }
		 }
	}	
	
	public int getSiblingColumn(List<Column> data,String pid){
		int result = 0;
		for(int i = 0,len = data.size();i < len;i++){
			if(null != data.get(i).getStr("fparentuid") && data.get(i).getStr("fparentuid").equals(pid)) result ++;
		}
		return result;
	}
	
	public void getParaMaps(){
		renderJson(TMapDao.getMaps(getPara("targetGuid"), null));
	}
	
	public void setParaValue(){
		renderJson(TMapDao.setValue(getPara("targetGuid"), getPara("key"), getPara("value"),getParaToLong("id"), getParaToInt("type")));
	}
	
	public void removeValue(){
		renderJson(TMapDao.removeValue(getParaToLong("id")));
	}
	
}
