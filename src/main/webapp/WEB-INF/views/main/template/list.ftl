<!DOCTYPE html >
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
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>模版列表</title>
<#include "../../common/head.ftl">
<style type="text/css">
#tempFileList 			{position:absolute;width:15%;top:0px;left:0px;bottom:0px;color:#b9b9b9;}
#tempFileList div		{position:absolute;left:0px;top:40px;bottom:10px;right:8px;border:1px solid #ccc;border-left:none;border-radius:0px 4px 4px 0px;
						-moz-border-radius:0px 4px 4px 0px;-webkit-border-radius:0px 4px 4px 0px;overflow:auto;background: #ccc;}
#tempFileList div p 	{height:28px;display:block;vertical-align:middle;line-height:28px;width:90%;overflow:hidden;white-space:nowrap; text-overflow:ellipsis;padding-left:20px;color:#0A81CA;cursor:pointer;}					
#tempFileList div p:hover,.tfilesPfocus{font-weight:bold;color:#077BD0;}
#tempSatePanel 			{position:absolute !important;width:82%;right:0px;top:0px;bottom:10px;}
.tempStateBtn 			{position:absolute;height:50px;z-index:10;text-align:center;width:auto !important;min-width:100px;left:20%;top:22px;min-width:450px;}
.TempGroupItem 			{position:absolute;left:0px;right:10px;top:40px;bottom:10px;border:1px solid #ccc;min-width:900px;overflow:auto;
						display:none;}
.TempGroupItem .mrItemsBox{width:90%;height:auto;overflow:hidden;border:1px solid #ccc;background:#fff;margin:0px auto;margin-top:10px;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;}						
.TempGroupItem .mrItemsBox .head{height:40px;width:100%;}
.TempGroupItem .mrItemsBox .head span{display:inline-block;width:20%;height:40px;vertical-align:middle;line-height:40px;}
.TempGroupItem .mrItemsBox .body{height:auto !important;min-height:100px;}
.TempGroupItem .mrItemsBox .body .box{width:48%;height:auto !important;min-height:40px;margin-top:5px;float:left;position:relative;}
.TempGroupItem .mrItemsBox .body .box input[type='checkbox']{width:25px;height:25px;position:absolute;top:30%;left:5%;}
.TempGroupItem .mrItemsBox .body .box p{width:70%;    margin: 0px auto; margin-top: 5px;margin-bottom:5px;font-weight: bold;color: #7D7A7A;}
.TempGroupItem .mrItemsBox .body .box video {border: 1px solid #A09E9E;border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px;width: 280px;height:140px;}
.TempGroupItem .mrItemsBox .body .box .imgBox{width:280px;height:80px;border:1px solid #ccc;margin:0px auto;}
.TempGroupItem .mrItemsBox .body .box .link {width:76%;height:34px;margin:0px auto;vertical-align:middle;line-height:30px;text-align:left;}
.TempGroupItem .mrItemsBox .body .box .link label{display:inline-block;width:80px;text-align:right;}
.TempGroupItem .mrItemsBox .body .box .link span {display: inline-block; width: 30px; height: 28px; position:relative;top:-2px; text-align: center; vertical-align: middle;line-height: 26px; border-radius: 4px; background: #176f9a;  color: #fff; font-weight: bold;cursor: pointer;}
.TempGroupItem .mrItemsBox .body .box .smallBtn{height:25px;width:280px;overflow:auto;margin:0px auto;}
.TempGroupItem .mrItemsBox .body .box .smallBtn span{display:inline-block;width:20px;height:20px;border-radius:20px;-webkit-border-radius:20px;-moz-border-radius:20px;
													background:#969696;cursor:pointer;margin: 2px 5px;text-align: center;color: #fff;vertical-align: middle;line-height: 20px;}
.ResouceBox				 {width:48%;margin-top:5px;float:left;position:relative;border-bottom: 1px #ccc dotted;}
.ResouceBox .imgBox 	 {width:280px;height: 150px;border:1px solid #ccc;margin:0px auto;} 	
.ResouceBox .imgBox input{position: absolute;  right: 10%; top: 1%;}	
.ResouceBox video		 {border: 1px solid #A09E9E;border-radius: 5px;-moz-border-radius: 5px;-webkit-border-radius: 5px;width: 280px;height:140px;}
.ResouceBox span 		 {position: absolute;  top: 30%; left: 8%; background: #ddd; width: 30px; height: 30px; text-align: center; vertical-align: middle; 
						 color:#ada8a8;font-size:15px;line-height: 30px;border-radius: 15px;}
.LinkLocation{}

.TempGroupItem .editMrFrame{width:100%;height:100%;border:none;}						
.TempGroupItem .mr_Tips {width:50%;text-align:center;position:absolute;top:20%;font-size:25px;color:#a9a8a8;left:20%;}						
.TempGroupItem .buttons {width:90%;margin:0px auto;margin-top:10px;}						
.tempAttrPanel			{border:1px solid #ccc;width:90%;margin:0px auto;margin-top:20px;height:200px;position:relative;}
.tempAttrPanel img 		{position:absolute;right:2%;top:22%;}

.tempAttrPanel .attr 	{width:60%;height:100%;}
.tempAttrPanel .attr input{position:absolute;left: 8px; top: 41%;width: 30px; height: 30px;}
.tempAttrPanel .attr p 	{margin:10px 0px 5px;font-weight:bold;}
.tempAttrPanel .attr p label{display:inline-block;width:40%;text-align:right;}
.tempItemTitle 			{width:22px;height:100px;border:1px solid #ccc;text-align:center;right:-14px;top:43%;color: #696767;
						vertical-align:middle;position: absolute;background:#ccc;border-left:none;z-index:100;border-radius:0px 5px 5px 0px;
						-moz-border-radius:0px 5px 5px 0px;-webkit-border-radius:0px 5px 5px 0px;word-wrap: break-word; word-break: normal;}
.historyTempList 		{width:90%;height:0%;border:1px solid #ddd;margin:0px auto;background:#F1F1F1;position:relative;z-index:200;transition: 0.5s;  -moz-transition:  0.5s;-webkit-transition: 0.5s;
						border-radius:0px 0px 8px 8px;-moz-border-radius:0px 0px 8px 8px;-webkit-border-radius:0px 0px 8px 8px;top:-2px;display:none;}	
.historyTempList .content{width:100%;height:100%;overflow:hidden;}
.historyTempList .title {width:10%;height:20px;text-align:center;vertical-align:middle;line-height:20px;position:absolute;bottom:-20px;left:45%;cursor:pointer;color:#f6f6f6;
						background:#8A8A8A;border-radius:0px 0px 5px 5px;transition: 0.2s;  -moz-transition:  0.2s;-webkit-transition: 0.2s;}	
.historyTempList .title:hover {height:32px;bottom:-32px;vertical-align:middle;line-height:32px;font-weight:bold;}		
._colorTips 			{display:inline-block;width:20px;height:20px;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;position: relative;}							

.publishState 			{border: 1px solid #108017; height: 25px; width: 168px;  vertical-align: middle;  line-height: 25px; margin-top: 15px;position:relative;border-radius: 10px;
						-moz-border-radius: 10px;-webkit-border-radius: 10px;}
.publishState .font 	{position:absolute;width:100%;height:25px;color:#F10000;z-index:10;}
.publishState .state 	{position:absolute;height:25px;left:0px;top:0px;background:#21A512;border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px;}

.addItemPanel 			{width: 100%;float: right; text-align: center;}
.addItemPanel input 	{width:25px !important;height:25px !important;}
#romateResItems .item   {width:190px;height:200px;border:1px solid #ccc;display:inline-block;overflow:hidden;position:relative;text-align: center;}
#romateResItems .item img{ position: relative;}
#romateResItems .item input{position:absolute;right:0px;bottom:0px;}
#ResourceUploadPanel	{width:100%;height:100%;}
#ResUploadItems2  p		{text-align:center;}
#UCGS_Inject_ImgBox     { height: 180px; margin: 0px auto;position:relative;
						 color:#277fdc;overflow:hidden;}
.InjectTitle			{position: absolute; left: -20px; top: 11px; display: inline-block; width: 80px;
   						 background: #e2e2e2;text-align: center;color: #949392;z-index:99;
    					 transform: rotate(-45deg);-moz-transform: rotate(-45deg);-webkit-transform: rotate(-45deg);
    					}
#UCGS_Inject_ImgItemBox {border: 1px solid #cccaca;margin-top: 8px;position: relative; overflow: hidden;}
#UCGS_Inject_ImgItems   {width:100%;height:400px;overflow:auto;overflow-x:hidden;}
#UCGS_Inject_ImgItems span{display: inline-block; width: 25%; vertical-align: middle;line-height: 30px;overflow: hidden;text-align:center; margin-left: -3px;
						   }
#UCGS_Inject_ImgItems div{border-bottom: 1px solid #dcdada;height:100px;position:relative;}						  
#UCGS_Inject_ImgItems div:hover{background:#e8e8e8;}
#UCGS_Inject_ImgItems div:hover label{display:block;}
#UCGS_Inject_ImgItems div label{position: absolute; right: 0px; top: 40%; width: 18px; height: 18px; display: inline-block; background: #ec1414;
    							text-align: center; vertical-align: middle;line-height: 18px;color: #fff; cursor: pointer;
    							border-radius: 9px;-moz-border-radius: 9px;-webkit-border-radius: 9px; display:none;}
#UCGS_Inject_ImgItems span:first-child img{margin-top:12%;}
</style>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jquery.form.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/fw/chasonx.tab.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/list.js?v=161213"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/site/SitePub.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/state.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/deviceSelector.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/devicePub.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/inject.js"></script>
<script type="text/javascript">
</script>
</head>
<body >
<input type="hidden" id="_LOGINUSERGUID" value="${(LOGINUSER_GUID)!}" />
<input type="hidden" id="_LOGINUSERTYPE" value="${(LOGINUSER_TYPE)!}" />
<div id="mainPanel">
	<div id="topPanel" >
		<@PermisstionBtnHtml />	
	</div>
	<div id="leftPanel"></div>
	<div id="rightPanel">
	 <!--	<div id="dragLeft"  >
			<p>
				<input type="button" class="button blue" onclick="SitePub.list('fileListSite','')" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;"  value="全部网站"/>
				<b>区域列表</b> 
			</p>
			<div id="areaList" class="colMainBox" style="top:27px;"></div>
		</div>
		<div id="dragCenter" >
			<div id="fileListSite" class="fileListSite"></div>
		</div>
	 -->	
		<div id="dragRight" style="overflow:auto;">
			<div id="tempFileList">
				选择模板文件包：<select class="inputText select" id="templateResoucePkg"></select>
				<p class="tempItemTitle">模<br>板<br>文<br>件<br>列<br>表</p>
				<div id="tempItems"></div>
			</div>
			<div id="tempSatePanel" >
			
			
			<#-- <div class="tempStateBtn">
					<input type="button" onclick="panelCtrl(0,this)" class="button group gleft groupFocus"  value="添加广告位占位符"/>
					<input type="button" onclick="panelCtrl(1,this)" class="button group gcen"  value="编辑广告资源" style="display:none;"/> 
					<input type="button" onclick="panelCtrl(1,this)" class="button group gcen"  value="广告资源预览"/>
					<input type="button" onclick="panelCtrl(2,this)" class="button group gright"  value="我的申请列表"/>
					<input type="button" onclick="panelCtrl(4,this)" class="button group gright"  value="发布历史"/> 
				</div> -->
				<div id="tempGroupItem1" class="TempGroupItem"><div class="mr_Tips">点击模板预览资源占位符详情！</div></div>
				<#--<div class="TempGroupItem" style="display:none;"><iframe class="editMrFrame"></iframe></div> -->
				<div id="tempGroupItem2" class="TempGroupItem"><div class="mr_Tips">点击查看所有资源编辑情况！</div></div>
				<div  class="TempGroupItem" id="applyHisPanel">
				</div>
				
			<#--	<div class="TempGroupItem">
					<table class="tableDefault" width="100%" cellpadding="0" cellspacing="0" >
						<tr class="trDefault">
							<td width="5%" >
								<input id="_selectAll" type="checkbox" title="反选/全选" onclick="_selectAll(this,'publishval')"/></td>
							<td width="10%" >编号</td>
							<td width="20%">站点名</td>
							<td width="10%">发布人</td>
							<td width="10%">发布时间</td>
							<td width="15%">包名</td>
							<td width="10%">包大小</td>
							<td width="20%">目标</td>
						</tr>
						<tbody id="publishHistoryData" class="tableData"></tbody>
					</table>
					<div  id="pagePanel"></div>
				</div>-->
			</div>	
<#--			
			<div class="historyTempList">
				<p class="title" onclick="TempPreview.historyShow()">历史模板列表</p>
				<div class="content">
					<div style="overflow:auto;height:100%;width:100%;">
					<table class="tableDefault" width="100%" cellpadding="0" cellspacing="0">
						 <tr class="trDefault">
							<td width="5%"><input id="_selectAll" type="checkbox" title="反选/全选" onclick="_selectAll(this,'temp')"/></td>
							<td width="5%" >编号</td>
							<td width="10%">模版名称</td>
							<td width="15%">MD5</td>
							<td width="10%">所属网站</td>
							<td width="10%">模版大小</td>
							<td width="25">路径</td>
							<td width="10%">上传人</td>
							<td width="10%">上传时间</td>
						</tr>
						<tbody id="tempData" class="tableData" ></tbody>
					</table>
					</div>
				</div>
			</div>
-->
			
		</div>
	</div>
</div>
</body>
</html>
