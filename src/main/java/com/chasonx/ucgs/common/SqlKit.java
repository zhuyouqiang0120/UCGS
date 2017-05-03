/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-8-7 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.common;



import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.jfinal.plugin.activerecord.Record;

/**
 * 动态查询xml节点 SQL 数据
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年8月7日下午4:29:47
 * @remark
 */
public class SqlKit {

	/*xml*/
	private static String baseXmlPath;
	private String xmlName = null;
	
	private static DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
	
	public SqlKit(){}
	
	public SqlKit(String _xmlName){
		this.xmlName = _xmlName;
	}
	
	public String loadSqlData(String id){
		return loadSqlData(this.xmlName, id, null);
	}
	
	public String loadSqlData(String id,Record paraRecord){
		return loadSqlData(this.xmlName, id, paraRecord);
	}
	/**
	 * 查询Sql
	 * String  
	 * @createTime:2015年8月7日 下午5:27:53
	 * @author: chason.x
	 */
	public  String loadSqlData(String xmlName,String id,Record paraRecord){
		String result = "";
		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
			Document doc = builder.parse(baseXmlPath + "/" + xmlName);
			NodeList nlist = doc.getElementsByTagName("SqlDataItem");
			
			if(nlist.getLength() == 0) throw new Exception("Con't find this nodeItem : 'SqlDataItem'!");
			
			Node node;
			NodeList cList;
			for(int i = 0,len = nlist.getLength();i < len; i++){
				node = nlist.item(i);
				if(node.getAttributes().getNamedItem("id").getTextContent().equalsIgnoreCase(id)){
					if(node.getChildNodes().getLength() > 1){
						cList = node.getChildNodes();
						
						Node cnode;
						String[] test;
						for(int j = 0;j < cList.getLength();j ++){
							cnode = cList.item(j);
							if(null != cnode.getNodeName() ){
								if(cnode.getNodeName().equals("#text") && cnode.getNodeValue().trim().length() > 0){
									result += " " + cnode.getNodeValue().trim();
								}else if(cnode.getNodeName().equals("if")){
									
									if(null == paraRecord) throw new Exception("para is null");
									
									test = cnode.getAttributes().getNamedItem("test").getTextContent().split(" ");
									if(null == test || test.length == 0) throw new Exception("The test content format is not correct");
									try{
										if(test[1].equals("==")){
											if("null".equals(test[2])?paraRecord.get(test[0]) == null:paraRecord.get(test[0]).toString().equals(test[2])) result += " " + cnode.getTextContent().trim();
										}else if(test[1].equals("!=")){
											if("null".equals(test[2])?paraRecord.get(test[0]) != null:!paraRecord.get(test[0]).toString().equals(test[2]))  result += " " + cnode.getTextContent().trim();
										}else if(test[1].equals(">")){
											if(paraRecord.getInt(test[0]) > Integer.parseInt(test[2]))	result += " " + cnode.getTextContent().trim();
										}else if(test[1].equals("<")){
											if(paraRecord.getInt(test[0]) < Integer.parseInt(test[2]))	result += " " + cnode.getTextContent().trim();
										}
										
										result = setParaValue(result, paraRecord);
									}catch(Exception e){
										e.printStackTrace();
									}
								}
							}
						}
					}else{
						result = setParaValue(node.getTextContent(), paraRecord);
					}
					break;
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		} 
		return result.trim();
	}
	
	public String setParaValue(String result,Record paraRecord){
		if(result.indexOf("{") == -1) return result;
		
		List<String> para = new ArrayList<String>();
		Matcher pattern = Pattern.compile("(\\{[^\\}]+})").matcher(result);
		while(pattern.find()){
			para.add(pattern.group(1));
		}
		String attr;
		for(int n= 0,nlen = para.size();n < nlen;n++){
			attr = para.get(n);
			result = result.replace(attr, paraRecord.get(attr.replace("{", "").replace("}", "")) + "");
		}
		return result;
	}

	public static String getBaseXmlPath() {
		return baseXmlPath;
	}

	public static void setBaseXmlPath(String baseXmlPath) {
		SqlKit.baseXmlPath = baseXmlPath;
	}
	
//	public static void main(String[] a){
//		long start = System.currentTimeMillis();
//		XmlKit.baseXmlPath = "H:/izoe/code/projects/Zens_QiyeWeb/project_/src/main/java/com/zens/sql";
//		XmlKit kit = new XmlKit("order.xml");
//		Record para = new Record().set("admingroup", null);
//		System.out.println(kit.loadSqlData("queryAdminUserResult",para));
//		System.out.println(System.currentTimeMillis() - start);
//	}
}
