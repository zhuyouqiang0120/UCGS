/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-9-24 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPFileFilter;
import org.apache.commons.net.ftp.FTPReply;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年9月24日下午2:03:04
 * @remark
 */
public class FtpUtil {
	
	private  FTPClient client = null;
	private  String host = null;
	private  int port = 0;
	private  String user = null;
	private  String pwd = null;
	
	public FtpUtil(){}
	
	public FtpUtil(String host,int port,String user,String pwd){
		this.host = host;
		this.port = port;
		this.user = user;
		this.pwd = pwd;
	}
	
	public FtpUtil connect(){
		return connect(host, port, user, pwd);
	}

	public  FtpUtil connect(String host,int port,String user,String pwd){
		client = new FTPClient();
		try{
			client.connect(host,port);
			client.login(user, pwd);
			
			int reply = client.getReplyCode();
			boolean success = FTPReply.isPositiveCompletion(reply);
			System.out.println("--> FTP LOGIN STATE : " + success);
			if(success){
				client.setFileType(FTPClient.BINARY_FILE_TYPE);
				client.setDataTimeout(3000);
				client.setConnectTimeout(30000);
				client.setBufferSize(1024 * 2);
				client.setControlEncoding("UTF-8");
				//client.enterLocalActiveMode();
				client.enterLocalPassiveMode();
			}else{
				client.disconnect();
				client = null;
				
				new RuntimeException("FTP:" + host + " CONNECT FAILD.");
			}
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return this;
	}
	
	public FtpUtil downloadFile(String romateDir,final String fileName,String localPath){
		FTPFileFilter filter = new FTPFileFilter() {
			
			public boolean accept(FTPFile file) {
				return file.getName().equals(fileName);
			}
		};
		return download(romateDir, filter, localPath);
	}
	
	public FtpUtil downloadFileBySuffix(String romateDir,final String suffix,String localPath){
		FTPFileFilter filter = new FTPFileFilter() {
			
			public boolean accept(FTPFile file) {
				return file.getName().substring(file.getName().lastIndexOf(".") + 1).equals(suffix);
			}
		};
		return download(romateDir, filter, localPath);
	}
	
	private FtpUtil download(String romateDir,FTPFileFilter filter,String localPath){
		if(client == null) return this;
		
		try{
			client.changeWorkingDirectory(romateDir);
			FTPFile[] files;
			if(null != filter){
				files = client.listFiles(romateDir, filter);
			}else{
				files = client.listFiles();
			}
			getFile(files, localPath , romateDir);
		}catch(Exception e){
			e.printStackTrace();
		}
		return this;
	}
	
	public FtpUtil downloadAll(String romateDir,String localPath){
		return download(romateDir, null, localPath);
	}
	
	public FtpUtil upload(String fileName,String romateDir){
		if(client == null) return this;
		
		File file = new File(fileName);
		try {
			
			if(romateDir != null){
				client.makeDirectory(romateDir);
				client.changeWorkingDirectory(romateDir);
			}
			
			if(file.isDirectory()){
				String _dir = new String(file.getName().getBytes("UTF-8"),"iso-8859-1");
				client.makeDirectory(_dir);
				client.changeWorkingDirectory(_dir);
				
				File[] files = file.listFiles();
				for(int i = 0,len = files.length;i < len;i++){
					if(files[i].isDirectory()){
						upload(file.getPath() + "/" + files[i].getName(), null);
						client.changeToParentDirectory();
					}else{
						putFile(files[i]);
					}
				}
			}else{
				putFile(file);
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return this;
	}
	
	private void putFile(File file){
		try{
			FileInputStream is = new FileInputStream(file);
			client.storeFile(new String(file.getName().getBytes("UTF-8"),"iso-8859-1"), is);
			is.close();
			
			System.out.println("-->" + file.getName() + "  -- upload success");
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	private void getFile(FTPFile[] files,String localPath,String romateDir){
		OutputStream os = null; 
		try{
			if(files.length > 0){
				File outFile;
				File dir;
				for(int i = 0,len = files.length;i < len;i ++){
					if(files[i].isDirectory()){
						System.out.println(" dir --> " + files[i].getName());
						dir = new File(localPath + "/" + files[i].getName());
						dir.mkdir();
						client.changeWorkingDirectory(new String(files[i].getName().getBytes("UTF-8"),"iso-8859-1"));
						getFile( client.listFiles(), localPath + "/" + files[i].getName(), romateDir + "/" + files[i].getName());
						client.changeToParentDirectory();
					}else{
						System.out.println("-->" + files[i].getName() + " -- Downloading ....");
						outFile = new File(localPath + "/" + files[i].getName());
						os = new FileOutputStream(outFile);
						client.retrieveFile(new String(files[i].getName().getBytes("UTF-8"),"iso-8859-1"), os);
					}
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			try {
				if(null != os) os.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	public FtpUtil logout(){
		if(client == null) return this;
		
		try{
			client.logout();
			client.disconnect();
			System.out.println("-------------> Ftp logout.");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return this;
	}
	
	public static void main(String[] a){
		
		FtpUtil fu = new FtpUtil("192.168.0.51",21, "c4ftp", "c4ftp").connect();
		fu.downloadFile("/", "2017年春节放假通知1.pdf", "C:/Users/Administrator/Desktop/").logout();
		fu.downloadAll("/uploadTest", "C:/Users/Administrator/Desktop/111").logout();
		//fu.upload("C:/Users/Administrator/Desktop/手册", "").logout();
		
//		String putUrl = "http://192.168.2.235/Wibox/ws/uploadPublishResource.do";
//		String para = "publishName=网站测试ing&publishMode=1&publishFilePath=updatedir_8888.tar&rangeType=1&rangeValue=Wibox-3203";
//		String resultStr = HttpUtil.UrlPostResponse(putUrl, "POST", para);
//		System.out.println(resultStr);
		
		
//		fu.downloadAll("up_test_007/site data", "H:/iUSER/zoe/desktop/5566").logout();
//		fu.downloadFileBySuffix("/", "zip",  "H:/iUSER/zoe/desktop/5566").logout();
		
		/*获取数据*/
//		long start = System.currentTimeMillis();
//		String url = "http://192.168.2.236/Wibox/ws/getDeviceListByConditions.do";
//		String result = HttpUtil.UrlGetResponse(url);
//		System.out.println(result);
//		System.out.println("time : " + (System.currentTimeMillis() - start));
	}
}
