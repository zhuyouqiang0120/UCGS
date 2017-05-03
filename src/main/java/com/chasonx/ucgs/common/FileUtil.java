/**
 * @project  : UCGS
 * @Author   : Chasonx.Xiang
 * @Date     : 2016年7月3日
 * @Email    : zuocheng911@163.com
 * @Copyright: 2016 Inc. All right reserved. 版权所有，翻版必究
 */
package com.chasonx.ucgs.common;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;

import com.chasonx.tools.StringUtils;

/**
 * @author  Chason.x <zuocheng911@163.com>
 * @createTime 2016年7月3日 下午2:03:57
 * @remark 
 */
public class FileUtil {

	/**
	 * 复制文件
	 * void
	 * @createTime:2015-5-14 下午4:23:23
	 * @author: chason.x
	 */
	public static void copyFile(File from,File to){
		InputStream in = null;
		OutputStream out = null;
		try{
			File dir = new File(to.getParent());
			if(!dir.exists())
				dir.mkdirs();
			
			in = new BufferedInputStream(new FileInputStream(from));
			out = new BufferedOutputStream(new FileOutputStream(to));
			byte[] buffer = new byte[1024];
			while( (in.read(buffer)) != -1){
				out.write(buffer);
				out.flush();
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				if(in != null)  in.close();
				if(out != null) out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * @Tag       : 文件夹拷贝
	 * @createTime: 2016年7月1日 下午5:26:13
	 * @author    : Chason.x
	 */
	public static void copyDirectory(File from,File to){
		if(from.isDirectory()){
			File[] fileList = from.listFiles();
			for(File f:fileList){
				if(f.isDirectory()) copyDirectory(f, new File(to.getAbsolutePath() + "/" + f.getName()));
				else copyFile(f, new File(to.getAbsolutePath() + "/" + f.getName()));
			}
		}else{
			copyFile(from, new File(to.getAbsolutePath() + "/" + from.getName()));
		}
	}
	
	public static String readFile(String path,String encoding){
		InputStreamReader is = null;
		BufferedReader br = null;
		StringBuffer sb = new StringBuffer(200);
		try{
			File read = new File(path);
			if(!StringUtils.hasText(encoding)) encoding = "UTF-8";
			
			is = new InputStreamReader(new FileInputStream(read),encoding);
			br = new BufferedReader(is);
			String line = "";
			while((line = br.readLine()) != null){
				sb.append(line + "\n");
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try{
				if(br != null) br.close();
				if(is != null) is.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		return sb.toString();
	}
	
	public static void writeFile(String path,String content){
		try{
			FileWriter fw = new FileWriter(path);
			fw.write(content);
			fw.close();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	public static void writeFile(String path,String content,String encoding){
		try{
			File write = new File(path);
			if(!write.exists()) write.createNewFile();
			if(!StringUtils.hasText(encoding)) encoding = "UTF-8";
			
			OutputStreamWriter out = new OutputStreamWriter(new FileOutputStream(write),encoding);
			BufferedWriter bw = new BufferedWriter(out);
			bw.write(content);
			bw.close();
			out.close();
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
