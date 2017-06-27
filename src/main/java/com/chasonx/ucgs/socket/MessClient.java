/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.socket								 
 **    Type    Name : MessClient 							     	
 **    Create  Time : 2017年5月19日 下午5:54:46								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.socket;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月19日下午5:54:46
 * @version 1.0 
 */
public class MessClient {

	private Socket socket;
	private DataOutputStream out;
	
	public MessClient(){
		try{
			socket = new Socket();
			socket.connect(new InetSocketAddress("127.0.0.1", 6668));
			out = new DataOutputStream(socket.getOutputStream());
		}catch(Exception e){
		}
	}
	
	public void sendMess(String mess){
		try {
			out.writeUTF(mess);
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			try{
				if(out != null) out.close();
				if(socket != null) socket.close();
			}catch(Exception e){
				
			}
		}
	}
}
