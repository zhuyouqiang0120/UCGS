/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.common								 
 **    Type    Name : SystemStatistics 							     	
 **    Create  Time : 2017年3月14日 上午10:56:56								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import com.chasonx.ucgs.config.RuntimeLog;
import com.jfinal.plugin.activerecord.Record;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年3月14日上午10:56:56
 * @version 1.0 
 */
public class SystemStatistics {

	public static Record getTopData(){
		Runtime run = Runtime.getRuntime();
		InputStream in = null;
		InputStreamReader reader = null;
		BufferedReader br = null;
		Record res = new Record();
		try {
			Process process =  run.exec("top -b -n 1");
			in = process.getInputStream();
			reader = new InputStreamReader(in, "UTF-8");
			br = new BufferedReader(reader);
			
			String[] topName = {"Tasks","Cpu(s)","Mem","Swap"};
			String line = null;
			String[] item = null;
			String[] ic = null;
			int i = 0;
			int idx = 0;
			int ilen = 0;
			Record itemRec;
			while((line = br.readLine()) != null && idx < topName.length){
				RuntimeLog.logger.error(line);
				if(line.indexOf(topName[idx]) != -1){
					line = line.replace(topName[idx] + ":", "");
					item = line.split(",");
					itemRec = new Record();
					for(i = 0,ilen = item.length;i < ilen;i ++){
						item[i] = item[i].trim();
						if(topName[idx].equals("Cpu(s)")) ic = item[i].split("%");
						else ic = item[i].split(" ");
						itemRec.set(ic[1], ic[0]);
					}
					res.set(topName[idx], itemRec);
					idx++;
				}
			}
		} catch (IOException e) {
			RuntimeLog.logger.error(e.getMessage(), e);
		}finally{
			try{
				if(br != null) br.close();
				if(reader != null) reader.close();
				if(in != null) in.close();
			}catch(Exception e){
				RuntimeLog.logger.error(e.getMessage(),e);
			}
		}
		return res;
	}
}
