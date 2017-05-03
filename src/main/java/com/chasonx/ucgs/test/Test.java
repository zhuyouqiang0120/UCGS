/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-10 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.test;

import com.chasonx.tools.DateFormatUtil;
import com.chasonx.ucgs.config.Config;
import com.chasonx.ucgs.dao.PublicDao;
import com.chasonx.ucgs.entity.AdminUser;
import com.jfinal.ext.test.ControllerTestCase;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月10日上午11:03:24
 * @remark
 */
public class Test extends ControllerTestCase<Config> {
	
	@org.junit.Test
	public void exec(){
		AdminUser user = new AdminUser();
		user.set("id","123").set("fguid", "333" );
		PublicDao.execute("add", user);
	}
	
	@org.junit.Test
	public void updateMr(){
		String guid = "8df07d7e-094c-4ff6-a76e-47b6900b1133";
		String sql = "update  t_template_status set fstate=?,fextdata=?,fmodifytime=?,fmodifyer=? where fguid = ? ";
		System.out.println(PublicDao.updateBatch(sql,1,"[{\"item\":\"kkkk\",\"url\":\"/fffffff/sssss.png\"}]",DateFormatUtil.formatString(null),"text",guid));
	}
}
