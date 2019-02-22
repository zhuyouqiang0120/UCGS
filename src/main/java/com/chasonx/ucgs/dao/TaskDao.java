/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月27日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.dao;

import com.alibaba.fastjson.JSONArray;
import com.chasonx.tools.DataBaseUtil;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.Des3;
import com.chasonx.tools.HttpUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.config.SqlFixter;
import com.chasonx.ucgs.entity.TConfig;
import com.chasonx.ucgs.entity.TQuartz;
import com.jfinal.plugin.activerecord.Db;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月27日 上午11:39:43
 * @remark 
 */
public class TaskDao {

	
	public static boolean databaseBackUp(String path){
		boolean res = false;
		try{
			TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.DataBackUp.toString());
			if(config == null) return false;
			
			long startTime = System.currentTimeMillis();
			
			String user = config.getStr("remoteuser");
			String pwd = config.getStr("remotepwd");
			String host = config.getStr("remotehost");
			String dbName = config.getStr("localdir");
			String mysqlBinPath = PublicDao.getMysqlPath() + "/bin/";
			String fileName = path + "UCGS_Data_BackUp_" + DateFormatUtil.formatString("yyyy_MM_dd_HH_mm_ss") + ".sql";
			res = DataBaseUtil.mysqlBackUp(host, user, pwd, dbName, fileName,mysqlBinPath);
			
			SqlFixter sql = new SqlFixter().setModel(TQuartz.class)
					.addParam("ftype", "&|=|" + Constant.Config.DataBackUp.toString());
			TQuartz quartz = TQuartz.quartz.findFirst(sql.toString());
			if(null != quartz){
				quartz.set("fresponsetime", System.currentTimeMillis() - startTime)
				.set("fmodifytime", DateFormatUtil.formatString(null))
				.update();
			}
			/* 删除30天前的备份数据
			if(res){
				List<FileEntity> sqlList = FileListUtil.list(path);
				if(!sqlList.isEmpty() && sqlList.size() > 30){
					for(int i = 0;i < sqlList.size();i ++){
						if(i > 29){
							FileUtil.delfile(sqlList.get(i).getAbsuloteDirectory());
						}
					}
				}
			}*/
		
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return res;
	}
	
	public static boolean databaseRecover(String sqlFilePath){
		TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.DataBackUp.toString());
		if(config == null) return false;
		String user = config.getStr("remoteuser");
		String pwd = config.getStr("remotepwd");
		String host = config.getStr("remotehost");
		String dbName = config.getStr("localdir");
		String mysqlBinPath = PublicDao.getMysqlPath() + "/bin/";
		return DataBaseUtil.mysqlRecover(host, user, pwd, dbName, sqlFilePath, mysqlBinPath);
	}
	
	public static boolean syncDeviceList() throws Exception{
		
		long start = System.currentTimeMillis();
		TConfig config = TConfig.config.findFirst("select * from t_config where filetype = ?",Constant.Config.GetDevice.toString());
		if(config == null) return false;
		
		String url = config.getStr("remotedir");
		String key = config.getStr("remotehost");
		long timeStamp = System.currentTimeMillis();
		String authCode = Des3.generateAuthenticator(timeStamp + "", key);
		
		
		String result = HttpUtil.UrlPostResponse(url, null, "Authenticator=" + authCode + "&TimeStamp=" + timeStamp);
		if(StringUtils.hasText(result)){
			com.alibaba.fastjson.JSONObject json = com.alibaba.fastjson.JSONObject.parseObject(result);
			if(json.containsKey("result") && json.getString("result").equals("1")){
				String data = Des3.decrypt(json.getString("data"), key, null);
				json.put("data", JSONArray.parseArray(data));
				Db.update("update t_quartz set fdata = ?,fresponsetime = ?,fmodifytime = ? where ftype = ?", json.toString() ,(System.currentTimeMillis() - start),DateFormatUtil.formatString(null),Constant.Config.GetDevice.toString());
				return true;
			}
		}
		return false;
	}

}
