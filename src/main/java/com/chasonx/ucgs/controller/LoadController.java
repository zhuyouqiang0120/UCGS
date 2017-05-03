/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.controller								 
 **    Type    Name : LoadController 							     	
 **    Create  Time : 2017年2月20日 下午2:50:41								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.controller;

import java.io.File;

import org.apache.shiro.util.StringUtils;

import com.chasonx.directory.FileUtil;
import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;

/**静态文件加载
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年2月20日下午2:50:41
 * @version 1.0 
 */
public class LoadController extends Controller {
	
	final String basePath = PathKit.getWebRootPath() + "/res/plugs/";
	final String suffix = ".js";

	public void jsLoader(){
		String _param = getPara("_param");
		StringBuilder sb = null;
		if(StringUtils.hasText(_param)){
			try{
				sb = new StringBuilder();
				String[] jsNames = _param.split(",");
				for(int i = 0,len = jsNames.length;i < len;i++){
					sb.append(FileUtil.readFile(new File(basePath + jsNames[i].trim() + suffix), null));
					sb.append("\n");
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		renderText(sb == null?"":sb.toString());
	}
}
