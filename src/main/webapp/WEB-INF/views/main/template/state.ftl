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
<title>模版状态列表</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/state.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/site/SitePub.js"></script>
<style type="text/css">
#deviceList 			{border:1px solid #ccc;height:300px;overflow:auto;background:#fff;}
#deviceList div 		{height:25px;vertical-align:center;line-height:25px;margin:2px 0px 2px 0px;border:1px solid #ccc;background:#EFEFEF;}
.publishState 			{border: 1px solid #108017; height: 25px; width: 168px;  vertical-align: middle;  line-height: 25px; margin-top: 15px;position:relative;border-radius: 10px;
						-moz-border-radius: 10px;-webkit-border-radius: 10px;}
.publishState .font 	{position:absolute;width:100%;height:25px;color:#F10000;z-index:10;}
.publishState .state 	{position:absolute;height:25px;left:0px;top:0px;background:#21A512;border-radius: 10px;-moz-border-radius: 10px;-webkit-border-radius: 10px;}
</style>
</head>
<body >
<div id="mainPanel">
	<div id="topPanel">
		<@PermisstionBtnHtml />	
	</div>
	<div id="leftPanel">
		<div  style="position:absolute;top:0px;bottom:0px;left:0px;width:50%;">
			<p style="text-align:center;padding:5px 0px 5px 0px;"><b>区域列表</b></p>
			<div id="areaList"></div>
		</div>
		<div id="fileListSite" class="fileListSite"></div>
	</div>
	<div id="rightPanel">
		 <div class="boxPanelCenter"></div>
	  	 <div class="boxPanelRight">
			<table class="tableDefault" width="100%" cellpadding="0" cellspacing="0">
			 <tr class="trDefault">
				<td width="5%"><input id="_selectAll" type="checkbox" title="反选/全选" onclick="_selectAll(this,'media')"/></td>
				<td width="5%" >编号</td>
				<td width="10%">名称</td>
				<td width="10%">类型</td>
				<td width="10%">状态</td>
				<td width="10%">尺寸</td>
				<td width="10%">页面标识ID</td>
				<td width="10">页面标识NAME</td>
				<td width="15%">操作人</td>
				<td width="15%">操作时间</td>
			</tr>
			<tbody id="mediaData" class="tableData">
				<tr class="dataGridTr"><td colspan="10">暂无数据</td></tr>
			</tbody>
		    </table>
	    	<div id="pagePanel" style="padding: 0px 10px;"></div>
	 	</div>
	</div>
</div>	

</body>
</html>
