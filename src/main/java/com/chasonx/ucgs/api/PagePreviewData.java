/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年8月2日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.api;

import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.config.PageUtil;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年8月2日 下午2:59:10
 * @remark 
 */
public class PagePreviewData extends Controller{
	
	/**
	 * @Tag       : 
	 * @createTime: 2016年8月2日 下午3:02:29
	 * @author    : Chason.x
	 */
	public void index(){
		String guid = getPara();
		String tempStr = "";
		if(StringUtils.hasText(guid)){
			tempStr = Db.queryStr("select fhtmldata from t_pagedesigner where fguid = ?",guid);
		}
		setAttr("resData", tempStr);
		render("/WEB-INF/views/preview/" + PageUtil.TOPIC_PREVIEW);
	}

	/**
	 * @Tag       : 页面预览
	 * @createTime: 2016年8月2日 下午3:02:17
	 * @author    : Chason.x
	 */
	public void pdesignerPreview(){
		setAttr("resData", CacheKit.get("UCMSDATACHCACHE", "htmlData"));
		render("/WEB-INF/views/preview/" + PageUtil.TOPIC_PREVIEW);
	}
}
