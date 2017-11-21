/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-09-12
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.common;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月12日下午8:53:11
 * @remark
 */
public class Constant {
	
	/**主题资源*/
	public static final int FILE_TYPE_IMAGE = 0;
	/**模版资源*/
	public static final int FILE_TYPE_VIDEO = 1;
	/**模版文件*/
	public static final int FILE_TYPE_TEMPLATE = 2;
	/**升级文件*/
	public static final int FILE_TYPE_UPGRADE = 3;
	
	public static final String FILE_FILETER_SUFFIX = "html";
	
	public static final String DATA_JSON_VERSION = "2.0.0";
	public static final String DATA_JSON_DESC = "UCGS SITE DATA FOR ";
	public static final String DATA_JSON_DESC_TOPIC = "UCGS TOPIC DATA FOR ";
	
	public static final String MEDIA_CTRL_PATH = "ucgsAssets";
	public static final String MEDIA_CTRL_JSONNAME = "ZENS_TEMPLATE_AD";
	public static final String MEDIA_CTRL_JSNAME = "ZENS_TEMPLATE_AD_CTRL.js";
	public static final String MEDIA_CTRL_JSNAME_V2 = "activePageAD.plugin.js";
	public static final String TEMPLATE_CTRL_JSNAME = "/res/plugs/media/TOPIC_CTRL.js";
	public static final String TEMPLATE_CTRL_JSNAME_V2 = "/res/plugs/media/activePageAD.plugin.js";
	
	public static final String MEDIA_CTRL_JSPATH = "/res/plugs/media/" + MEDIA_CTRL_JSNAME;
	public static final String MEDIA_CTRL_VERSION = "1.0";
	public static final String MEDIA_CTRL_DESC = "ZENS-UCGS TEMPLATE MANAGER";
	
	public static final String FORMDATA_TOKEN_NAME = "UCGSFORMDATAFILTER";
	
	public static final Integer TOPIC_CHECK_SUCCESS = 1;
	public static final Integer TOPIC_CHECK_FAILD = 2;
	public static final int TOPIC_TYPE_PUBLIC = 1;
	public static final int TOPIC_TYPE_STATIC = 0;
	
	/**主题类型：常规*/
	public static final int TOPIC_TYPE_NORMAL = 0;
	/**主题类型：视频*/
	public static final int TOPIC_TYPE_VIDEO = 1;
	/**主题类型：图片*/
	public static final int TOPIC_TYPE_IMAGE = 2;
	/**主题类型：链接*/
	public static final int TOPIC_TYPE_LINK = 3;
	
	public static final int ADMIN_ROLE_TYPE = 1;
	public static final int ADMINGROUP_ROLE_TYPE = 2;
	
	public static final String CACHE_DEF_NAME = "UCMSDATACHCACHE";
	public static final String CACHE_LOG_NAME = "UOPERATIONLOGCACHE";
	public static final String CACHE_QUARTZ_NAME = "UCGSQUARTZS";
	public static final String CACHE_PAGE_STATISTICS = "UCGSPAGEACCESSHISTORY";
	
	public static final String TOPCI_CONTENT_REGEX = "\\s*[!@#$%^&*￥、\\/,~+-]*";
	
	public static final String IMG_SRC_REGEX = "<img[^>]+src\\s*=\\s*['\"]([^'\"]+)['\"][^>]*>";
	public static final String BACKGROUND_IMAGE = "[background-image:url(][^(]+[)]";
	
	public static final String IMG_CATCH_DIR = "/media/imgcache";
	
	public static final String SITE_TYPE_PUBLIC = "public";
	
	public static final int POST_FILE_MAX_SIZE =  3*1024*1024;
	
	public static enum Config{
		GetDevice,
		PublisSite,
		WriteLogs,
		TopicPreview,
		Template,
		DataBackUp,
		GoUams,
		Upgrade,
		UDimension,
		TopicExtendView,
		AuditResouce,
		PublishTemplate,
		DataCacheTime
	};
	/**
	 * 权限 类型
	 * @author  Chasonx
	 * @email   xzc@zensvision.om
	 * @create  2016年10月26日下午3:58:34
	 * @version 1.0
	 */
	public static enum AuthTypes{
		/*用户*/
		user, 
		/*角色*/
		role,
		/*区域*/
		area,
		/*栏目*/
		colmun,
		/*网站*/
		site,
		/*菜单*/
		menu
	}
	
	/**
	 * 机构类型
	 */
	public static final int ADMIN_DIMENSION_TYPE = 1; 
	public static final String UCGS_ClientGuid = "ucgs_b33e1c9a3265c14b";
	
	public static interface SiteBindType{
		public static final int BIND = 2;
		public static final int RELATION = 1;
	}
	
	@SuppressWarnings("serial")
	public static Map<Integer, Integer> YEARS = new HashMap<Integer, Integer>(){{
		put(9, 90);
		put(8, 80);
		put(7, 70);
		put(6, 60);
		put(5, 0);
	}};
	/**
	 * 模板类型
	 * @author  Chasonx
	 * @email   xzc@zensvision.com
	 * @create  2017年5月17日下午10:05:07
	 * @version 1.0
	 */
	public static interface TemplateType{
		public static final int TSCaler = 0;
		public static final int Custom = 1;
	}
	
	public static interface MapsType{
		public static final String Notice = "Notice";
	}
}
