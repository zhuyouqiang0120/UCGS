/**
 * @project  : UCMS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年1月27日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.controller;

import java.util.List;

import com.chasonx.directory.FileListUtil;
import com.chasonx.directory.FileUtil;
import com.chasonx.entity.FileEntity;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.annotation.ParaEntity;
import com.chasonx.ucgs.annotation.ParamInterceptor;
import com.chasonx.ucgs.annotation.Required;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.TaskDao;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年1月27日 下午12:23:00
 * @remark 
 */
public class DatabaseController extends Controller {

	@AnnPara("数据备份页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.ADMIN_DATABACK);
	}
	
	@AnnPara("数据备份列表")
	@Before(SaveLog.class)
	public void list(){
		List<FileEntity> list = FileListUtil.list(PathKit.getWebRootPath() + "/databackup", "sql");
		if(null != list && !list.isEmpty()){
			for(int i = 0,len = list.size();i < len;i++){
				list.get(i).setAbsuloteDirectory(null);
				list.get(i).setParentDirectory(null);
			}
		}
		renderJson(list != null?list:"");
	}
	
	@AnnPara("数据备份")
	@Before(SaveLog.class)
	public void backup(){
		renderJson(TaskDao.databaseBackUp(PathKit.getWebRootPath() + "/databackup/")?1:0);
	}
	
	@AnnPara("数据还原")
	@Before(SaveLog.class)
	public void recover(){
		String dbName = getPara("dbName");
		boolean res = TaskDao.databaseRecover(PathKit.getWebRootPath() + "/databackup/" + dbName);
		renderJson(res?1:0);
	}
	
	@Required(@ParaEntity(name = "dbName"))
	@AnnPara("DB数据文件删除")
	@Before({SaveLog.class,ParamInterceptor.class})
	public void removeDbFile(){
		String dbName = getPara("dbName");
		renderJson(FileUtil.delfile(PathKit.getWebRootPath() + "/databackup/" + dbName));
	}
}
