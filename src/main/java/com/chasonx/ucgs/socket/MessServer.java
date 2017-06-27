/**********************************************************************
 **********************************************************************
 **    Project Name : UCGS
 **    Package Name : com.chasonx.ucgs.socket								 
 **    Type    Name : MessServer 							     	
 **    Create  Time : 2017年5月12日 下午2:22:13								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2017 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.socket;

import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import com.chasonx.tools.StringUtils;
import com.chasonx.ucgs.config.RuntimeLog;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2017年5月12日下午2:22:13
 * @version 1.0 
 */
public class MessServer {
	
	private boolean started = false;
	private ServerSocket server;
	private int port = 6668;
	private final int poolSize = 10;
	
	private static List<String> clist = new CopyOnWriteArrayList<String>();
	private static List<Task> taskList = new CopyOnWriteArrayList<MessServer.Task>();
	private static BlockingQueue<String> msgQueue = new ArrayBlockingQueue<String>(20);
	private static ExecutorService executorService = null;
	
	public void start(){
		try{
			server = new ServerSocket(port);
			started = true;
			int processSize = Runtime.getRuntime().availableProcessors() * poolSize;
			executorService = Executors.newFixedThreadPool(processSize);
			
			System.out.println("Socket 已启动 : " + processSize);
			
			executorService.execute(new MsgQueenTask());
			
			String host;
			while(started){
				Socket socket = server.accept();
				host = socket.getInetAddress().getHostAddress();
				executorService.execute(new Task(socket, host));
			}
		}catch(Exception e){
			e.printStackTrace();
			RuntimeLog.logger.error(e.getMessage(), e);
		}finally{
			try{
				if(server != null) server.close();
			}catch(Exception e){
				e.printStackTrace();
			}
		}
	}
	
	public void stop(){
		try {
			if(server != null){
				server.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	class MsgQueenTask implements Runnable{

		/* (non-Javadoc)
		 * @see java.lang.Runnable#run()
		 */
		@Override
		public void run() {
			try{
				String msg;
				while(true){
					msg = msgQueue.take();
					if(msg != null){
						System.out.println("TaskList : " + taskList.size());
						for(Task task : taskList){
							task.sendMsg(msg);
						}
					}
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
	}

	class Task implements Runnable{
		
		Socket socket = null;
		DataOutputStream out = null;
		DataInputStream in = null;
		String host;
		boolean started = false;
		
		public Task(Socket socket,String host){
			try{
				this.socket = socket;
				this.host = host;
				started = true;
				in = new DataInputStream(socket.getInputStream());
				out = new DataOutputStream(socket.getOutputStream());
				
				clist.add(host);
				taskList.add(this);
				
				System.out.println("New Device Connected : " + host);
			}catch(Exception e){
				e.printStackTrace();
			}
		}

		/* (non-Javadoc)
		 * @see java.lang.Runnable#run()
		 */
		@Override
		public void run() {
			try{
				String msg;
				while(started){
					try{
						msg = in.readUTF();
						
						if(StringUtils.hasText(msg)){
							putMsg(msg);
							//sendMsg(msg);
						}
					}catch(Exception e){
						e.printStackTrace();
						System.out.println(host + " 断开连接 : " + socket.isConnected());
						closeSocket();
					}
				}
			}catch(Exception e){
				e.printStackTrace();
			}finally{
				System.out.println(host + " 断开连接[finally]");
				closeSocket();
			}
		}
		
		public void closeSocket(){
			try{
				started = false;
				if(out != null) out.close();
				if(in != null) in.close();
				if(socket != null) socket.close();
				
				clist.remove(host);
				taskList.remove(this);
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
		public void sendMsg(String msg){
			try{
				if(socket != null){
					out.writeUTF(msg);
					out.flush();
				}
			}catch(Exception e){
				closeSocket();
				e.printStackTrace();
			}
		}
		
		public void putMsg(String msg){
			try{
				System.out.println(socket + " mess quene : " + msg);
				msgQueue.put(msg);
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
	}

	
}
