/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-31 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.controller;


import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.List;

import javax.imageio.ImageIO;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.FtpUtil;
import com.chasonx.tools.Md5Util;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.annotation.AnnPara;
import com.chasonx.ucgs.api.CacheServerUtil;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.config.DHttpUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.chasonx.ucgs.dao.ResourceDao;
import com.chasonx.ucgs.dao.SiteDao;
import com.chasonx.ucgs.entity.ResourceEntity;
import com.chasonx.ucgs.entity.Site;
import com.chasonx.ucgs.entity.TCacheServer;
import com.chasonx.ucgs.interceptor.SaveLog;
import com.chasonx.upload.UploadFileUtil;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;

/**资源管理
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月31日上午11:15:16
 * @remark
 */
public class ResourceController extends Controller {
	
	@AnnPara("访问资源上传页面")
	@Before(SaveLog.class)
	public void index(){
		render(PageUtil.FILES_UPLOAD);
	}
	
	@AnnPara("访问资源列表页面")
	@Before(SaveLog.class)
	public void list(){
		setAttr("PAGETYPE", 1);
		render(PageUtil.FILES_LIST);
	}
	
	@AnnPara("访问资源回收站页面")
	@Before(SaveLog.class)
	public void recycle(){
		setAttr("PAGETYPE", 2);
		render(PageUtil.FILES_LIST);
	}
	
	@AnnPara("资源上传")
	@Before(SaveLog.class)
	public void upload(){
		int res = 0;
		UploadFileUtil item = UploadFileUtil.getAbsoluteFile(getRequest());
		try {
			String md5Code = Md5Util.md5InputStream(item.getFileItem().getInputStream());
			
			if(ResourceDao.checkExist(md5Code) <= 0L){
				String siteGuid = getPara("fileSite");
				String type = getPara("ftype");
				String webrootPath = PathKit.getWebRootPath();
				String fileDir =  "/files/upload/" + siteGuid + "/" + DateFormatUtil.formatString("yyyyMMdd") + "/";
				
				Integer useOldName = getParaToInt("useFileName");
				int fileSize =  getParaToInt("fileSize");
				String assetName = URLDecoder.decode(getPara("fileName"),"UTF-8");
				if(fileSize <= Constant.POST_FILE_MAX_SIZE){
					String fname = "";
					if(useOldName > 0){
						item.saveFile(webrootPath + fileDir);
						fname = assetName;
					}else{
						item.saveFile(webrootPath + fileDir, md5Code);
						fname = md5Code + getPara("fileType");
					}
					
					String remark = URLDecoder.decode(getPara("remark"),"UTF-8");
					int width = 0,height = 0;
					try{
						BufferedImage image = ImageIO.read(new File(webrootPath + fileDir + fname));
						width = image.getWidth();
						height = image.getHeight();
					}catch(IOException e){
						e.printStackTrace();
					}
					
					ResourceEntity entity = new ResourceEntity();
					entity.set("fguid", Tools.getGuid());
					entity.set("fassetname", assetName);
					entity.set("fmd5code", md5Code);
					entity.set("fname", fname);
					entity.set("fsize", fileSize);
					entity.set("ftype", type);
					entity.set("fsiteguid", siteGuid);
					entity.set("fpath", fileDir + fname);
					entity.set("fwidth", width);
					entity.set("fheight", height);
					entity.set("fuploadtime", DateFormatUtil.formatString(null));
					entity.set("fuploader", DHttpUtils.getLoginUser(getRequest()).getStr("fadminname"));
					entity.set("fadminguid",DHttpUtils.getLoginUser(getRequest()).getStr("fguid"));
					entity.set("fremark", remark);
					res = ResourceDao.saveRes(entity);
					
					if(res > 0){
						Site _site = SiteDao.querySiteByGuid(siteGuid);
						TCacheServer cacheServer = CacheServerUtil.getCacheServer(_site.getStr("fcache_server_guid"));
						if(null != cacheServer && !"localhost".equals(cacheServer.getStr("server_ip")) && !"127.0.0.1".equals(cacheServer.getStr("server_ip"))){
							FtpUtil ftp = new FtpUtil(cacheServer.getStr("server_ip"), cacheServer.getInt("server_ftp_port"), cacheServer.getStr("server_ftp_name"), cacheServer.getStr("server_ftp_pwd"))
							.connect().upload(webrootPath + fileDir + fname, cacheServer.getStr("cache_path"));
							ftp.logout();
						}
					}
				}else{
					res = 4;
				}
			}else{
				res = 2;
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			res = 3;
		}
		renderJson(res);
	}
	
	@AnnPara("资源删除")
	@Before(SaveLog.class)
	public void del(){
		String id = getPara("id");
		int delete = getParaToInt("delete");
		String ids = Tools.join(id.split(";"),",");
		if(!StringUtils.hasText(ids)) ids = "0";
		
		renderJson(Db.update("update t_resource set fdelete = ? where id in ("+ ids +")",delete));
	}
	
	@AnnPara("查询资源列表")
	@Before(SaveLog.class)
	public void listData(){
		String siteGuid = getPara("siteGuid");
		Integer sourceType = getParaToInt("sType");
		Integer pageNum = getParaToInt("PageNumber");
		Integer pageSize = getParaToInt("PageSize");
		Integer del = getParaToInt("del");
		String startTime = getPara("startTime");
		String endTime = getPara("endTime");
		
		pageNum = (pageNum + pageSize)/pageSize;
		String where = "";
		if(StringUtils.hasText(startTime)) startTime += " 00:00:00";
		if(StringUtils.hasText(endTime)) endTime += " 23:59:59";
		if(StringUtils.hasText(startTime) && !StringUtils.hasText(endTime)) where = " and TO_DAYS(fuploadtime) >= TO_DAYS('"+ startTime +"')";
		else if(StringUtils.hasText(endTime) && !StringUtils.hasText(startTime)) where = " and TO_DAYS(fuploadtime) <= TO_DAYS('"+ endTime + "')";
		else if(StringUtils.hasText(startTime) && StringUtils.hasText(endTime)) where = " and TO_DAYS(fuploadtime) between TO_DAYS('"+ startTime +"') and TO_DAYS('"+ endTime + "')";
		where += " order by id desc";
		
		Page<Record> list = Db.paginate(pageNum, pageSize,"select * ", " from t_resource where fdelete = ? and fsiteguid = ? and ftype = ? " + where, del,siteGuid,sourceType);
		renderJson(list);
	}
	
	public void imageAttributeInit(){
		long st = System.currentTimeMillis();
		List<ResourceEntity> resList = ResourceEntity.res.find("select id,fpath from t_resource where ftype = 0 or ftype = 1 and fdelete = 0 ");
		if(!resList.isEmpty()){
			BufferedImage img;
			String bpath = PathKit.getWebRootPath();
			for(int i = 0,len = resList.size();i < len;i ++){
				try{
					img = ImageIO.read(new File(bpath + resList.get(i).getStr("fpath")));
					resList.get(i).set("fwidth", img.getWidth()).set("fheight", img.getHeight()).update();
				}catch(IOException e){
					e.printStackTrace();
				}
			}
		}
		renderJson(System.currentTimeMillis() - st);
	}
}
	