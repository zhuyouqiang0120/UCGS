/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.dao								 
 **    Type    Name : TopicOuterResourceFixed 							     	
 **    Create  Time : 2017年5月31日 下午1:58:06								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.dao;

import java.io.File;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.Md5Util;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.common.SystemConstant;
import com.chasonx.ucgs.common.Tools;
import com.chasonx.ucgs.entity.ResourceEntity;
import com.chasonx.upload.DownLoadFileUtil;
import com.jfinal.kit.PathKit;

/**
 * 主题外部资源下载
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月31日下午1:58:06
 * @version 1.0 
 */
public class TopicOuterResourceFixed {

	/**
	 * 过滤外部图片资源，若有外部图片资源则下载到本地
	 * @author chasonx
	 * @create 2017年5月31日 下午3:29:48
	 * @update
	 * @param  
	 * @return String
	 */
	public static String filterOutResouceContent(String content,String siteGuid,int type,String admin,String adminGuid){
		if(!StringUtils.hasText(content)) return content;
				
		Pattern pat = Pattern.compile(Constant.IMG_SRC_REGEX);
		Matcher mac = null;
		mac = pat.matcher(content);
		
		Set<String> outerSet = new HashSet<String>();
		String macImgUri;
		while (mac.find()) {
			if(StringUtils.hasText(mac.group(1))){
				macImgUri = mac.group(1);
				if(macImgUri.indexOf(SystemConstant.SYS_CODE) == -1){
					outerSet.add(macImgUri);
				}
			}
		}
		
		if(outerSet.isEmpty()) return content;

		String basePath = PathKit.getWebRootPath();
		String localPath = "/files/upload/" + siteGuid + "/" + DateFormatUtil.formatString("yyyyMMdd") + "/";
		String filePath = "";
		try{
			String imgUri = "",fileName;
			for(Iterator<String> ite = outerSet.iterator();ite.hasNext();){
				imgUri = ite.next();
				fileName = System.currentTimeMillis() + imgUri.substring(imgUri.lastIndexOf("/") + 1, imgUri.length());
				filePath =  localPath + fileName;
				
				DownLoadFileUtil.getRemoteFile(imgUri, basePath + localPath , fileName);
				File file = new File(basePath + filePath);
				if(file.exists() && file.length() <= Constant.POST_FILE_MAX_SIZE){
					ResourceEntity entity = new ResourceEntity();
					entity.set("fguid", Tools.getGuid());
					entity.set("fassetname", fileName);
					entity.set("fmd5code", Md5Util.md5File(file));
					entity.set("fname", fileName);
					entity.set("fsize", file.length());
					entity.set("ftype",type);
					entity.set("fsiteguid", siteGuid);
					entity.set("fpath", filePath);
					entity.set("fuploadtime", DateFormatUtil.formatString(null));
					entity.set("fuploader", admin);
					entity.set("fadminguid", adminGuid );
					entity.save();
					content = content.replaceAll(imgUri,"/" + SystemConstant.SYS_CODE + filePath);
				}else{
					file.deleteOnExit();
					//错误图片
					//content = content.replaceAll(imgUri, errorPath);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return content;
		
		
	}
	
	/**
	 * 过滤外部图片资源，若有外部图片资源则下载到本地
	 * @author chasonx
	 * @create 2017年5月31日 下午3:29:48
	 * @update
	 * @param  
	 * @return String
	 */
	public static String[] filterOutResouceContent(String[] content,String siteGuid,int type,String admin,String adminGuid){
		for(int i = 0,len = content.length;i < len;i++){
			content[i] = filterOutResouceContent(content[i], siteGuid, type, admin, adminGuid);
		}
		return content;
	}
	
	public static String filterOutResouceStr(String imgUrl,String siteGuid,int type,String admin,String adminGuid){
		String fileName = System.currentTimeMillis() + imgUrl.substring(imgUrl.lastIndexOf("/") + 1, imgUrl.length());
		try{
			String basePath = PathKit.getWebRootPath();
			String localPath = "/files/upload/" + siteGuid + "/" + DateFormatUtil.formatString("yyyyMMdd") + "/";
			DownLoadFileUtil.getRemoteFile(imgUrl,basePath + localPath , fileName);
			File file = new File(basePath + localPath + fileName);
			if(file.exists() && file.length() <= Constant.POST_FILE_MAX_SIZE){
				ResourceEntity entity = new ResourceEntity();
				entity.set("fguid", Tools.getGuid());
				entity.set("fassetname", fileName);
				entity.set("fmd5code", Md5Util.md5File(file));
				entity.set("fname", fileName);
				entity.set("fsize", file.length());
				entity.set("ftype",type);
				entity.set("fsiteguid", siteGuid);
				entity.set("fpath", localPath + fileName);
				entity.set("fuploadtime", DateFormatUtil.formatString(null));
				entity.set("fuploader", admin);
				entity.set("fadminguid",adminGuid);
				entity.save();
				
				imgUrl = localPath + fileName;
			}else{
				file.deleteOnExit();
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		return imgUrl;
	}
	
}
