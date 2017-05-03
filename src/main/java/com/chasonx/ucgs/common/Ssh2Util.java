/** 
*@Project  : UCMS 
*@Author   : Chason.Xiang 
*@Date     : 2015-7-3 
*@Email    : zuocheng911@163.com
*@Copyright: 2015  Inc. All rights reserved. 版权所有，翻版必究
*/ 
package com.chasonx.ucgs.common;

import java.io.File;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.SCPClient;
import ch.ethz.ssh2.SFTPv3Client;
import ch.ethz.ssh2.Session;

/**
 * @author Chason.x <zuocheng911@163.com>
 * @createTime 2015年7月3日下午4:34:49
 * @remark
 */
public class Ssh2Util {

	/**
	 * 保存远程服务器
	 * boolean
	 * @createTime:2015年7月6日 上午10:35:48
	 * @author: chason.x
	 */
	public static boolean putFile(String host,String user,String pwd,String filepath,String remoteDir){
		boolean isAuthed = false;
		
		Connection conn = new Connection(host);
		try {
			conn.connect();
			isAuthed = conn.authenticateWithPassword(user, pwd);
			
			if(isAuthed){
				SCPClient client = conn.createSCPClient();
				client.put(filepath , remoteDir);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}finally{
			conn.close();
		}
		
		return isAuthed;
	}
	/**
	 * 保存文件夹到远程服务器
	 * boolean
	 * @createTime:2015年9月16日 下午4:38:15
	 * @author: chason.x
	 */
	public static boolean putDirectory(String host,String user,String pwd,String localDir,String romateDir){
		boolean result = false;
		Connection conn = new Connection(host);
		
		try{
			conn.connect();
			conn.authenticateWithPassword(user, pwd);
			
			SCPClient client = new SCPClient(conn);
			SFTPv3Client client3 = new SFTPv3Client(conn);
			File files = new File(localDir);
			
			boolean auth = false;
			if(romateDir.length() > 1){
				auth = true;
				Session session = conn.openSession();
				session.execCommand(" rm -rf " + romateDir + '/' + files.getName());
				session.close();
			}
			
			if(files.isDirectory()){
//				client3.mkdir(romateDir, 750);
				client3.mkdir(romateDir + "/" + files.getName(), 750);
				sshPutFile(files.listFiles(), client, client3, romateDir + "/" + files.getName());
			}
			
			if(auth){
				Session session = conn.openSession();
				session.execCommand("chmod -R a+rx " + romateDir);
				session.close();
			}
			
			client3.close();
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			conn.close();
		}
		return result;
	}
	
	private static void sshPutFile(File[] files,SCPClient client,SFTPv3Client client3,String path){
		if(files.length == 0) return;
		
		try{
			for(int i = 0,len = files.length;i < len; i++){
				if(files[i].isDirectory()){
					client3.mkdir(path + "/" + files[i].getName(), 750);
					sshPutFile(files[i].listFiles(), client, client3, path + "/" + files[i].getName());
				}else{
					client.put(files[i].getAbsolutePath(), path);
				}
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
