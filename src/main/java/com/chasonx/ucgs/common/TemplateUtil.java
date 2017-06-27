/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.common								 
 **    Type    Name : TemplateUtil 							     	
 **    Create  Time : 2017年6月7日 下午2:02:53								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.chasonx.tools.HttpUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.entity.PageResource;
import com.chasonx.upload.DownLoadFileUtil;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年6月7日下午2:02:53
 * @version 1.0 
 */
public class TemplateUtil {

	/**
	 * 检测模板中关联的资源审核状态
	 * 数据来源：UAMS
	 * @author chasonx
	 * @create 2017年6月12日 下午4:04:07
	 * @update
	 * @param  
	 * @return PageResource
	 */
	public static PageResource checkResouceState(PageResource res,String uamsCheckUrl){
		String resIds = res.getStr("fresguidlist");
		if(StringUtils.hasText(resIds)){
			String result = HttpUtil.UrlGetResponse(uamsCheckUrl + "?ids=" + resIds);
			if(StringUtils.hasText(result)){
				int unCheckCount = 0;
				JSONObject jsonObj = JSONObject.parseObject(result);
				if(jsonObj.containsKey("list")){
					JSONArray array = jsonObj.getJSONArray("list");
					JSONObject node;
					for(int i = 0,len = array.size();i < len;i ++){
						node = array.getJSONObject(i);
						if(node.getInteger("auditStatus") != 2) unCheckCount ++;
					}
				}
				res.set("funcheckedcount", unCheckCount);
			}
		}
		return res;
	}
	
	/**
	 * 下载模板中远程图片
	 * 数据来源：UAMS
	 * @author chasonx
	 * @create 2017年6月12日 下午12:03:33
	 * @update
	 * @param  
	 * @return void
	 */
	public static PageResource downloadResouce(PageResource resource,String uamsCheckUrl,String dir,String absoluteDir){
		String resIds = resource.getStr("fresguidlist");
		if(StringUtils.hasText(resIds)){
			String result = HttpUtil.UrlGetResponse(uamsCheckUrl + "?ids=" + resIds);
			if(StringUtils.hasText(result)){
				JSONObject jsonObj = JSONObject.parseObject(result);
				if(jsonObj.containsKey("list")){
					JSONArray array = jsonObj.getJSONArray("list");
					String data = resource.getStr("fdata");
					String url;
					String fileName;
					String ip = uamsCheckUrl.substring(0, uamsCheckUrl.indexOf("/UAMS"));
					for(int i = 0,len = array.size();i < len;i++){
						url = array.getJSONObject(i).getString("Url");
						fileName = url.substring(url.lastIndexOf("/") + 1, url.length());
						
						DownLoadFileUtil.getRemoteFile(ip + url, dir);
						
						data = data.replaceAll(url, absoluteDir + fileName);
						
					}
					resource.set("fmediadata", data);
				}
			}
		}
		
		return resource;
	}
}
