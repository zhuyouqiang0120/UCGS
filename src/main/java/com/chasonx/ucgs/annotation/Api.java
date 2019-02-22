/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.annotation								 
 **    Type    Name : Api 							     	
 **    Create  Time : 2017年5月8日 下午2:40:22								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.annotation;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月8日下午2:40:22
 * @version 1.0 
 */
public class Api {

	/**
	 * API描述信息读取
	 * @author chasonx
	 * @create 2016年10月18日 下午2:01:00
	 * @update
	 * @param  
	 * @return List<Record>
	 */
	public static <T> String getInfo(Class<T> className,String baseUrl,String requestMethod,String apiTitie) throws Exception{
		StringBuilder sb = new StringBuilder(200);
		sb.append("<h2>"+ (hasText(apiTitie)?apiTitie:"ApiInfo") +"</h2>");
		Method[] method = className.getDeclaredMethods();
		Annotation[] anns;
		
		ApiTitle title;
		ApiRemark remark;
		Required req;
		ParaEntity para;
		
		String postEx;
		String postExHref;
		int size = 0;
		for(int i = 0;i < method.length;i ++){
			if(method[i].getParameterTypes().length == 0 && !method[i].getName().equalsIgnoreCase("api")){
				title = method[i].getAnnotation(ApiTitle.class);
				req = method[i].getAnnotation(Required.class);
				remark = method[i].getAnnotation(ApiRemark.class);
				
				postEx = "";
				sb.append("<div class=\"apiItem\">");
				sb.append("<h3>"+ ( ++ size) + "," + title.value() +"</h3>");
				sb.append("<p><b>请求地址 ：</b>" + baseUrl + method[i].getName() + "</p>");
				sb.append("<p><b>参数列表 : </b></p>");
				if(req == null){
					sb.append("<p>无</p>");
				}else{
					sb.append("<table class=\"thead\" cellspacing=\"0\" cellspadding=\"0\"><tr class=\"tbody\" style=\"background: #f7f7f7;\"><td>字段名</td>")
					.append("<td>描述</td>")
					.append("<td>类型</td>")
					.append("<td>最小长度</td>")
					.append("<td>最大长度</td>")
					.append("<td>是否必填</td></tr>");
					anns = req.value();
					for(Annotation p : anns){
						para = (ParaEntity) p;
						
						sb.append("<tr class=\"tbody\"><td>" + para.name() + "</td>")
						.append("<td>" + para.desc() + "</td>")
						.append("<td>" + para.type()+ "</td>")
						.append("<td>" + para.mlen()+ "</td>")
						.append("<td>" + para.xlen()+ "</td>")
						.append("<td>" + (para.empty()?"否":"是") + "</td>")
						.append("</tr>");
						
						postEx += (!para.empty()?hasText(postEx)?"&" + para.name() + "=xxx":"" + para.name() + "=xxx":"");
					}
					sb.append("</table>");
				}
				postExHref = baseUrl + method[i].getName() + "?" + postEx;
				sb.append("<p><b>请求示例：</b></p>");
				sb.append("<div class=\"postEx\"><a target=\"_blank\" href=\""+postExHref  +"\">"+ postExHref +"</a></div>");
				
				if(remark != null){
					sb.append("<p><b>备注：</b></p>");
					sb.append("<div class=\"postEx\">"+ remark.value() +"</div>");
				}
				sb.append("</div>");
			}
		}
		return getStyle() + sb.toString();
	}
	
	private static String getStyle(){
		StringBuilder sb = new StringBuilder()
		.append("<style type=\"text/css\">")
		.append("body{backgrund:#f6f6f6;}")
		.append(".postEx{width: 95%; margin: 0px auto; border-left: 8px solid #e8e8e8; padding: 8px;}")
		.append(".postEx a{color: #149dd4; font-weight: bold;text-decoration: none;}")
		.append(".apiItem{background: #fff; box-shadow: 0px 0px 15px #d8d8d8;padding:15px;margin:20px;}")
		.append(".thead{width:95%;margin:0px auto;}")
		.append(".thead td{padding:4px;}")
		.append(".tbody td{border: 1px solid #ccc;}")
		.append("</style>");
		return sb.toString();
	}
	
	public static boolean hasText(String val){
		return (null != val && !"".equals(val) && !val.trim().equals(""));
	}
	
	public static String enUnicode(String string){
		StringBuffer sb  = new StringBuffer();
		for(int i = 0,len = string.length();i < len;i++){
			sb.append("\\u" + Integer.toHexString(string.charAt(i)));
		}
		return sb.toString();
	}
	
	public static String deUnicode(String unicodeStr){
		 char aChar;
        int len = unicodeStr.length();
        StringBuffer outBuffer = new StringBuffer(len);
        for (int x = 0; x < len;) {
            aChar = unicodeStr.charAt(x++);
            if (aChar == '\\') {
                aChar = unicodeStr.charAt(x++);
                if (aChar == 'u') {
                    // Read the xxxx
                    int value = 0;
                    for (int i = 0; i < 4; i++) {
                        aChar = unicodeStr.charAt(x++);
                        switch (aChar) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            value = (value << 4) + aChar - '0';
                            break;
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                            value = (value << 4) + 10 + aChar - 'a';
                            break;
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                            value = (value << 4) + 10 + aChar - 'A';
                            break;
                        default:
                            throw new IllegalArgumentException("Malformed   \\uxxxx   encoding.");
                        }
                    }
                    outBuffer.append((char) value);
                } else {
                    if (aChar == 't')
                        aChar = '\t';
                    else if (aChar == 'r')
                        aChar = '\r';
                    else if (aChar == 'n')
                        aChar = '\n';
                    else if (aChar == 'f')
                        aChar = '\f';
                    outBuffer.append(aChar);
                }
            } else
                outBuffer.append(aChar);
 
        }
        return outBuffer.toString();
	}
	
}
