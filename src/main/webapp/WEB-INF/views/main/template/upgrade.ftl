<!DOCTYPE html>
<!--
                                                  
            .rrrsrssrsrrii;:.                     
           .8A&GG8898999999993S5s:                
           ;XGGGGG8889889999999999h.              
           ;XXXXXG888888889898888981              
           iXXXXXGGGG888888888889883.             
           rXXX&XXXXGGGGG88888898888;              
           1&XXX&XXGGG8G88888G898898h     ,ih3889;
           h&XXXXX&XGGG88GGGG8GG88889. ;h9X&A&&&H9  天 一 皇 不
  .,:;;;;:,9&AAA&X&&GGXGGGGX&GGXXGG8838&A&XXXXX&B1  下 入 图 胜
h5998888888&&AA&&&&&XXXGGXXXXXGGGGX&AA&&&X&&&&HBS   风 江 霸 人
89993933338XXXGGXGGG8898888998GXABMMMBHAAAHBBBXs    云 湖 业 生
9399333399888G888888888888GGXAM##M##MBBM#MHXS;      出 岁 谈 一
9399998888G88888888888GGXXXX89GAHBBMBBA3hi,         我 月 笑 场
89898888988899888GGXXXX&&&AG93S5S9HMH8S             辈 催 中 醉
G8GG8GG8GXXXXXX&AAA&88G&&&X899351s9BG95              ，； ， 。
55399933S51s8XX&&X&X33398933S55h1s3X55;           
            h8GGG8G9SS33333S5hhh1r983r            
            :39889955S533SS5h111ssGBG,            
             i39889S3333SS5h11ssi39s,             
              s999883333SS5h11si1Xs               
               h8GXXXGG8935h1srhXS1:              
                1998893S555h113XShh1ri,.          
           r5hr..s9999SS55hh3G8555h1h3hhi   .:;irs
           3Gi,;;;s83S93S38G8S555hh1hSh3s     .,;r
           3S:;;;i:13;SX&XG35SS55hh1h55s          
           89ii;;i;;s3XXG933SSS555hhSSs           
.         .XXiii;;;;iH#X989333SSSS5S3r            
.         :&Xsii;;;i:GBX899993SSSS3S;             
.         ;AAh;iii;;:XX389933SSSSS1,              
          rHH9;ii;;;:8S;;13993SS5i                
          sHH8;iii;;:3hi::;rsrii,                 
,    .  ::5HH9,:::::,91;;.                        
          							
 -->
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="Chasonx">
<title>升级包</title>
<#include "../../common/head.ftl">
<style type="text/css">
.fileStats    	label{display:inline-block;width:80px;text-align:right;position:relative;}
.upgradeHistory		 {width: 98%; position: relative; top: 2%; left: 1%;background:#f6f6f6;}
</style>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/deviceSelector.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/devicePub.js"></script>
<script type="text/javascript">
   window.onload = function(){
   		Loader.js('mod.temp.Upload',true,null,{"fileType":"*.tar;*.bz2;*.zip;*.rar","url":DefConfig.Root + "/main/template/uploadUpgrade","limit" : 1});
   		Chasonx.Frameset({
			main   : 'mainPanel',
			window : {
				top : {id : 'topPanel',height : '0px',border:false,bgColor:false},
				right: {id : 'rightPanel',width: '100%',border:false,bgColor:false}
			}
		});
		
	/*	Chasonx.Table({
		url : DefConfig.Root + '/main/template/upgradeHistory',
		dataPanel : 'upgradeHistory',
		check : {name : 'upgradeVal',value:'id',attr:{"rid":"id","guid":"fguid"},
				css : 'position:relative;'},
		tableNames : [
		       {name : "fassetname",text:"文件名",width:'20%'},
		       {name : "fmd5code",text:"文件Hash",width:"20%"},
		       {name : "fsize",text:"资源大小",width:"10%",handler : function(v){ return fileSizeForamt(v); }},
		       {name : "fuploadtime",text:"上传时间",width:"10%"},
		       {name : "fuploader",text:"上传人",width:"10%" },
		       {name : "fpath",text:"资源名",width:"30%",handler : function(v){ return v.substring(v.lastIndexOf("/") + 1,v.length); } }
		        ]
	}).init();*/
	
	     Chasonx.Table({
			url : DefConfig.Root + '/main/template/publishCheckDataList',
			dataPanel : 'upgradeHistory',
			data:{type : 2},
			tableNames : [
			       {name : "fpublishTitle",text:"标题",width:'8%'},
			       {name : "fpublishMode",text:"发布方式",width:"5%",handler : function(v){ 
			    	   if(v == 1) return "广播";
			    	   else return "互联网";
			    	  }},
			       {name : "fpublishType",text:"发布范围",width:"5%",handler : function(v){
			    	   var str = '';
			    	   switch(~~v){
			    	   case 0: str = "所有";break;
			    	   case 1: str = "设备";break;
			    	   case 2: str = "组";  break;
			    	   case 3: str = "节点";break;
			    	   case 4: str = "渠道";break;
			    	   }
			    	   return str;
			       }},
			       {name : "fpublishDeviceNames",text:"设备",width:"15%",handler : function(v){ 
			    	   var dev = v.split(","),ht = '<div class="tdOverHide">';
			    	   for(var i = 0;i < dev.length;i++){
			    		   ht += '<span class="badge badge_blue">'+ dev[i] +'</span>';
			    	   }
			    	   return ht + '</div>'; 
			       }},
			       {name : "ftype",text : "类型",width:"5%",handler : function(v){ 
			    	   if(~~v == 1) return "广告资源";
			    	   else if(v == 2) return "升级文件";
			       }},
			       {name : "fstatus",text:"状态",width:"5%" ,handler : function(v){ 
			    	   if(v == 0) return '<span class="badge badge_blue">未审核</span>';
			    	   else if(v == 1) return '<span class="badge badge_gray">审核不通过</span>';
			    	   else if(v == 2) return '<span class="badge badge_upd">已审核</span>';
			       }},
			       {name : "fcreateTime",text:"申请时间",width:"9%",handler : function(v){ return getString(v); }},
			       {name : "fpanPublishTime",text:"发布时间",width:"9%",handler : function(v){ return getString(v); }},
			       {name : "fmodifyTime",text:"审核时间",width:"9%",handler : function(v){ return getString(v);}},
			       {name : "fcheckname",text:"审核人",width:"10%",handler : function(v){ return getString(v); }},
			       {name : "fremark" ,text : "备注",width:"10%",handler : function(v){ return '<div class="tdOverHide">' + getString(v) + '</div>'; }}
			              ]
		}).init();
	
   };
   
</script>  
</head>
<body>
<input type="hidden" id="_LOGINUSERGUID" value="${(LOGINUSER_GUID)!}" />
<div id="mainPanel">
	<div id="topPanel"></div>
	<div id="rightPanel">
		<div class="swfuploadPanel">
			<@PermisstionBtnHtml />	
			<br><br>
			<table bgColor="#f6f6f6" width="100%" height="100%" cellpadding="0" cellspacing="0">
			<tr>
						<td class="etopicTd" width="10%">升级范围：</td>
						<td><select id="upgradeType" class="inputText select"><option value="Update" >指定设备</option><option value="Updateall">全部设备</option></select></td>
			</tr>	
			<tr>
						<td class="etopicTd" width="10%">升级类型：</td>
						<td><select id="upgradeRcType" class="inputText select">
							<option value="upgrade" >升级</option>
							<option value="app" >应用</option>
							<option value="playlist" >播单</option>
							<option value="vod" >点播</option>
							<option value="programlist" >节目单</option>
							<option value="channelmap" >频道信息</option>
							<option value="file" >文件</option>
						</select></td>
			</tr>	
			<tr>
						<td class="etopicTd" width="10%">备注：</td>
						<td><textarea id="fremark" class="inputText" style="height:18px;" maxlength="50"></textarea></td>
			</tr>	
			<tr>
						<td class="etopicTd" width="10%">状态：</td>
						<td><div class="fileStats">待上传文件:<font>0</font>   上传成功:<font>0</font>   上传失败:<font>0</font><span id="uploadErrMsg"></span></div></td>
			</tr>						
			<tr>
						<td class="etopicTd" width="10%">列表：</td>
						<td>
							<div class="fileAttr"><span>文件名</span><span>文件大小</span><span>更新时间</span><span>备注</span><span>上传进度</span></div>
						 	<div id="filePanel" class="filePanel"></div>
						 	<br>
						</td>
			</tr>			
			</table>
		</div>
		<div class="upgradeHistory">
			<p>&nbsp;&nbsp;&nbsp;&nbsp;升级历史文件列表：</p><br>
			<div id="upgradeHistory"></div>
		</div>
	</div>
</div>
</body>
</html>