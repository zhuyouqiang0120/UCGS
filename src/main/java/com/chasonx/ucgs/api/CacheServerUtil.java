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
 **    Package Name : com.chasonx.ucgs.api								 
 **    Type    Name : CacheServerUtil 							     	
 **    Create  Time : 2018年4月18日 下午4:12:05								
 ** 																
 **    (C) Copyright Zensvision Information Technology Co., Ltd.	 
 **            Corporation 2014-2018 All Rights Reserved.				
 **********************************************************************
 **	     注意： 本内容仅限于上海仁视信息科技有限公司内部使用，禁止转发		 **
 **********************************************************************
 */
package com.chasonx.ucgs.api;

import java.util.concurrent.CopyOnWriteArrayList;
import com.chasonx.ucgs.common.Constant;
import com.chasonx.ucgs.entity.TCacheServer;
import com.jfinal.plugin.ehcache.CacheKit;

/**
 * @author  Chasonx
 * @email   xzc@zensvision.com
 * @create  2018年4月18日下午4:12:05
 * @version 1.0 
 * @desc    
 */
public class CacheServerUtil {

	private static CopyOnWriteArrayList<TCacheServer> servers = null;
	
	public static String getCacheServerHost(String serverGuid){
		TCacheServer server = getCacheServer(serverGuid);
		return server != null ? server.getStr("server_host") : "";
	}
	
	public static TCacheServer getCacheServer(String serverGuid){
//		if(!StringUtils.hasText(serverGuid)){
//			return null;
//		}
		
		TCacheServer cacheServer = null;
		try{
			if(servers == null || servers.isEmpty()){
				servers = CacheKit.get(Constant.CACHE_DEF_NAME, Constant.Config.ResourceCacheServers.toString());
			}
			
			if(!servers.isEmpty()){
				for(TCacheServer serv : servers){
					if(serv.getStr("guid").equals(serverGuid)){
						cacheServer = serv;
						break;
					}
				}
				if(cacheServer == null){
					for(TCacheServer serv : servers){
						if("localhost".equals(serv.getStr("server_ip"))){
							cacheServer = serv;
							break;
						}
					}
				}
			}
			}catch(Exception e){
			}
		return cacheServer;
	}
	
	public static void modifyCacheServer(TCacheServer server,boolean insert){
		try{
			CopyOnWriteArrayList<TCacheServer> _servers = CacheKit.get(Constant.CACHE_DEF_NAME, Constant.Config.ResourceCacheServers.toString());
			if(null == _servers){
				_servers = new CopyOnWriteArrayList<TCacheServer>();
			}
			if(insert && server.getInt("cache_state") == Constant.CACHE_SERVER_STATE_UNFREEZE){
				_servers.add(server);
			}else if(!insert){  
				for(int i = 0,len = _servers.size();i < len;i++){
					if(_servers.get(i).getStr("guid").equals(server.getStr("guid"))){
						if(server.getInt("cache_state") == Constant.CACHE_SERVER_STATE_FREEZE){
							_servers.remove(i);
						}else{
							_servers.set(i, server);
						}
						break;
					}
				}
			}
			System.out.println(_servers);
			servers = _servers;
			CacheKit.remove(Constant.CACHE_DEF_NAME, Constant.Config.ResourceCacheServers.toString());
			CacheKit.put(Constant.CACHE_DEF_NAME, Constant.Config.ResourceCacheServers.toString(), _servers);
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
}
