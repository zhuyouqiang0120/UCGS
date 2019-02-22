/**********************************************************************
 **********************************************************************                                              
            .rrrsrssrsrrii;:.                     
           .8A&GG8898999999993S5s:                
           ;XGGGGG8889889999999999h.              
           ;XXXXXG888888889898888981              
           iXXXXXGGGG888888888889883.             
           rXXX&XXXXGGGGG88888898888;              
           1&XXX&XXGGG8G88888G898898h     ,ih3889;     天下风云出我辈，一入江湖岁月催，
           h&XXXXX&XGGG88GGGG8GG88889. ;h9X&A&&&H9     皇图霸业谈笑中，不胜人生一场醉。
  .,:;;;;:,9&AAA&X&&GGXGGGGX&GGXXGG8838&A&XXXXX&B1     提剑跨骑挥鬼雨，白骨如山鸟惊飞，
h5998888888&&AA&&&&&XXXGGXXXXXGGGGX&AA&&&X&&&&HBS      尘事如潮人如水，只叹江湖几人回。
89993933338XXXGGXGGG8898888998GXABMMMBHAAAHBBBXs    
9399333399888G888888888888GGXAM##M##MBBM#MHXS;     
9399998888G88888888888GGXXXX89GAHBBMBBA3hi,        
  9898888988899888GGXXXX&&&AG93S5S9HMH8S            
 	G8GG8GXXXXXX&AAA&88G&&&X899351s9BG95              
      33S51s8XX&&X&X33398933S55h1s3X55;           
            h8GGG8G9SS33333S5hhh1r983r            
            :39889955S533SS5h111ssGBG,            
             i39889S3333SS5h11ssi39s,             
              s999883333SS5h11si1Xs               
               h8GXXXGG8935h1srhXS1:              
                1998893S555h113XSh
                .s9999SS55hh3G855
          		 3S93S38G8S555
           		  :13;SX&XG          
                         
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.common								 
 **    Type    Name : CheckBadWords 							     	
 **    Create  Time : 2018年5月9日 下午1:46:40								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2018 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;


/**DFA (Deterministic Finite Automaton
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2018年5月9日下午1:46:40
 * @version 1.0 
 * @desc    
 */
public class CheckBadWords {

	private static Map<String, Object> sensitiveWords;
	public static final int MinMatchType = 0;
	public static final int MaxMatchType = 1;
	public static final String TEXT_REGEX = "*[]！。，？、!@#$%^&*￥、\\/,~+-()<>/&amp;&gt;&at; ";
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static void initBadWordContainer(Set<String> sensitiveWordSet){
		if(sensitiveWordSet.isEmpty()){
			return;
		}
		sensitiveWords = new HashMap<String, Object>(sensitiveWordSet.size());
		String key = null;
		Map nowMap = null;
		Map<String, String> newWordMap = null;
		
		Iterator<String> ite = sensitiveWordSet.iterator();
		int i = 0,len = 0;
		char keyChar;
		while(ite.hasNext()){
			key = ite.next();
			nowMap = sensitiveWords;
			
			for(i = 0,len = key.length();i < len;i++){
				keyChar = key.charAt(i);
				Object wordMap = nowMap.get(keyChar);
				if(wordMap != null){
					nowMap = (Map) wordMap;
				}else{
					newWordMap = new HashMap<String, String>();
					newWordMap.put("isEnd", "0");
					nowMap.put(keyChar, newWordMap);
					nowMap = newWordMap;
				}
				
				if(i == (len - 1)){
					nowMap.put("isEnd", "1");
				}
			}
		}
	}
	
	/**
	 * 是否包含敏感词
	 * @author chasonx
	 * @create 2018年5月9日 下午2:59:25
	 * @update
	 * @param text
	 * @param matchType
	 * @return
	 */
	public static boolean Contains(String text,int matchType){
		boolean flag = false;
		for(int i = 0,len = text.length();i < len;i++){
			if(checkSensitiveWord(text, i, matchType) > 0){
				flag = true;
				break;
			}
		}
		return flag;
	}
	/**
	 * 获取敏感词
	 * @author chasonx
	 * @create 2018年5月9日 下午3:01:31
	 * @update
	 * @param text
	 * @param matchType
	 * @return
	 */
	public static Set<String> getSensitiveWord(String text,int matchType){
		Set<String> sensitiveSet = new HashSet<String>();
		int length = 0;
		for(int i = 0,len = text.length();i < len;i++){
			length = checkSensitiveWord(text, i, matchType);
			if(length > 0){
				sensitiveSet.add(text.substring(i, i + length));
				i = i + length - 1;
			}
		}
		return sensitiveSet;
	}
	
	public static String replaceSensitive(String text,int matchType,String wordPrefix,String wordSuffix){
		Set<String> sensitiveSet = getSensitiveWord(text, matchType);
		if(sensitiveSet.isEmpty()){
			return text;
		}
		if(null == wordPrefix) {
			wordPrefix = "";
		}
		if(null == wordSuffix){
			wordSuffix = "";
		}
		
		Iterator<String> ite = sensitiveSet.iterator();
		String word;
		while(ite.hasNext()){
			word = ite.next();
			System.out.println(word);
			text = text.replaceAll(word, wordPrefix + word + wordSuffix);
		}
		return text;
	}
	
	public static String replaceSensitive(String text,String wordPrefix,String wordSuffix){
		return replaceSensitive(text, MaxMatchType, wordPrefix, wordSuffix);
	}

	public static String replaceSensitive(String text,String replaceStr,int matchType){
		Set<String> sensitiveSet = getSensitiveWord(text, matchType);
		if(sensitiveSet.isEmpty()){
			return text;
		}
		Iterator<String> ite = sensitiveSet.iterator();
		while(ite.hasNext()){
			text = text.replaceAll(ite.next(), replaceStr);
		}
		return text;
	}
	
	public static String replaceSensitive(String text,String replaceStr){
		return replaceSensitive(text, replaceStr, MaxMatchType);
	}
	
	
	@SuppressWarnings("rawtypes")
	private static int checkSensitiveWord(String text,int beginIdx,int matchType){
		boolean flag = false;
		int matchFlag = 0;
		char word;
		Map nowMap = sensitiveWords;
		for(int i = beginIdx; i < text.length() ;i ++){
			word = text.charAt(i);
			
			if(matchFlag > 0 && !flag && TEXT_REGEX.indexOf(word) != -1){
				matchFlag ++;
				continue;
			}
			
			nowMap = (Map) nowMap.get(word);
			if(nowMap != null){
				matchFlag ++;
				if("1".equals(nowMap.get("isEnd"))){
					flag = true;
					if(MinMatchType == matchType){
						break;
					}
				}
			}else{
				break;
			}
		}
		if(matchFlag < 2 || !flag){
			matchFlag = 0;
		}
		return matchFlag;
	}
}
