/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-31 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.common;

import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;
import com.chasonx.tools.DateFormatUtil;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.interceptor.MyExceptionInterceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.log.Logger;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.Table;
import com.jfinal.plugin.activerecord.TableMapping;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月31日下午6:05:13
 * @remark
 */
public class Tools {

	private static final Logger log = Logger.getLogger(MyExceptionInterceptor.class);
	
	/**
	 * 获取GUID
	 * String
	 * @createTime:2015年8月31日 下午6:05:59
	 * @author: chason.x
	 */
	public static String getGuid(){
		return UUID.randomUUID().toString().replaceAll("-", "");
	}
	
	/**默认系统用户密码*/
	public static String defaultAdminPwd = "123456";
	/**
	 * 实体Record与实体 转换
	 * Model<?>
	 * @createTime:2015年9月12日 上午11:31:14
	 * @author: chason.x
	 * @param <T>
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static <T> T recordConvertModel(Record rec,Class<T> clazz){
		Object model = null;
		try {
			model = clazz.newInstance();
		} catch (Exception e) {
			e.printStackTrace();
		} 
		if(model instanceof Model){
			setModelVal((Model)model, rec);
		}
		return (T)model;
	}
	
	/**
	 * Record 转换为实体
	 * @author chasonx
	 * @create 2017年2月20日 上午10:09:15
	 * @update
	 * @param  
	 * @return T
	 */
	@SuppressWarnings("unchecked")
	public static <T> T recordConvertToEntity(Record rec,@SuppressWarnings("rawtypes") Model model){
		setModelVal(model, rec);
		return (T) model;
	}
	
	private static void setModelVal(Model<?> model,Record rec){
		Table table = TableMapping.me().getTable(model.getClass());
		Class<?> otype;
		Map<String, Object> map = rec.getColumns();
		for(String key : map.keySet()){
			try{
				otype = table.getColumnType(key);
				if(otype != null){
					model.set(key,TypeConverter.convert(otype, map.get(key).toString()));
				}
			}catch(Exception e){
			}
		}
	}
	
	public static String join(Object[] obj,String flag){
		String result = "";
		for(int i = 0,len = obj.length;i < len;i++){
			if(StringUtils.hasText(obj[i].toString())){
				result += "'" + obj[i] + "'";
				if(i < (len - 1)) result += flag;
			}
		}
		return result;
	}
	
	public static <T> String joinForList(List<T> list,String flag){
		String res = "";
		for(int i = 0,len = list.size();i < len;i++){
			if(StringUtils.hasText(list.get(i).toString())){
				res += "'" + list.get(i) + "'";
				if(i < (len - 1)) res += flag;
			}
		}
		return res;
	}
	
	public static <T> String joinSimple(Object[] obj,String flag){
		String result = "";
		for(int i = 0,len = obj.length;i < len;i++){
			if(StringUtils.hasText(obj[i].toString())){
				result += obj[i];
				if(i < (len - 1)) result += flag;
			}
		}
		return result;
	}
	
	public static void copyProperties(Model<?> desc,Model<?> orig){
		if(orig == null || desc == null) return;
		
		Set<Entry<String,Object>> attr = orig.getAttrsEntrySet();
		Iterator<Entry<String,Object>> ite = attr.iterator();
		Entry<String, Object> entry;
		while(ite.hasNext()){
			entry = ite.next();
			desc.set(entry.getKey(), entry.getValue());
		}
	}
	
	public static String escape(String src) {  
        int i;  
        char j;  
        StringBuffer tmp = new StringBuffer();  
        tmp.ensureCapacity(src.length() * 6);  
        for (i = 0; i < src.length(); i++) {  
            j = src.charAt(i);  
            if (Character.isDigit(j) || Character.isLowerCase(j)  
                    || Character.isUpperCase(j))  
                tmp.append(j);  
            else if (j < 256) {  
                tmp.append("%");  
                if (j < 16)  
                    tmp.append("0");  
                tmp.append(Integer.toString(j, 16));  
            } else {  
                tmp.append("%u");  
                tmp.append(Integer.toString(j, 16));  
            }  
        }  
        return tmp.toString();  
    }
	
	public static String unescape(String src) {  
        StringBuffer tmp = new StringBuffer();  
        tmp.ensureCapacity(src.length());  
        int lastPos = 0, pos = 0;  
        char ch;  
        while (lastPos < src.length()) {  
            pos = src.indexOf("%", lastPos);  
            if (pos == lastPos) {  
                if (src.charAt(pos + 1) == 'u') {  
                    ch = (char) Integer.parseInt(src  
                            .substring(pos + 2, pos + 6), 16);  
                    tmp.append(ch);  
                    lastPos = pos + 6;  
                } else {  
                    ch = (char) Integer.parseInt(src  
                            .substring(pos + 1, pos + 3), 16);  
                    tmp.append(ch);  
                    lastPos = pos + 3;  
                }  
            } else {  
                if (pos == -1) {  
                    tmp.append(src.substring(lastPos));  
                    lastPos = src.length();  
                } else {  
                    tmp.append(src.substring(lastPos, pos));  
                    lastPos = pos;  
                }  
            }  
        }  
        return tmp.toString();  
    } 
	
	public static void writeLog(Invocation v,Exception e){
		StringBuilder sb = new StringBuilder("\n ---------- UCGS Log "+ DateFormatUtil.formatString(null) +"  ----------- \n");
		sb.append("Controller 	   : " + v.getController().getClass().getName() + "\n")
		  .append("Method 		   : " + v.getMethodName() + "\n")
		  .append("UrlPara         : " + v.getController().getPara() + "\n")
		  .append("Exception Type  : " + e.getClass().getName() + "\n")
		  .append("Exception Detail: " + e.getMessage());
		log.error(sb.toString(),e);
	}
}
