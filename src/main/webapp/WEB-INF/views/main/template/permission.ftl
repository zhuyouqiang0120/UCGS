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
<title>区域权限设置</title>
<#include "../../common/head.ftl">
<style type="text/css">
#ChooseList        {position:fixed;background: #f5f5f5; width: 100%;}
#Perm_Left 	div	   {cursor: pointer; transition:.5s;-webkit-transition:.5s;-moz-transition:.5s;background: #ececec;
    				height: 22px; vertical-align: middle; line-height: 22px;}
#Perm_Left 	div:hover,.UserFocus{font-weight:bold;color:#cc3410;font-size:15px;}
.Right_Panel 	   {height:50%;position:relative;overflow:auto;}
.Right_Panel .Title{height: 25px; vertical-align: middle; line-height: 25px; font-size: 13px; overflow: hidden;background-color: #DCDBDB;color: #848080;}
.Right_Panel .Content{position:absolute;top:25px;bottom:0px;left:0px;right:0px;overflow:auto;}
</style>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/device.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/permission.js"></script>
</head>
<body>
<div id="PermMain">
	<div id="Perm_Left"></div>
	<div id="Perm_Right">
		<div class="Right_Panel">
		<div id="ChooseList">
			&nbsp;&nbsp;按组：<select id="groups" class="inputText select" style="width:120px;"></select>
			按地点：<select id="locations" class="inputText select" style="width:120px;"></select>
			按省/市：<select id="province" class="inputText select" style="width:120px;"></select>
			按城市：<select id="citiys" class="inputText select" style="width:120px;"></select>
			按县：<select id="contrys" class="inputText select" style="width:120px;"></select>
			按频道：<select id="channels" class="inputText select" style="width:120px;"></select>
			<input type="button" class="button green" value="同步设备" onclick="Device.syncRun(true)"/>
		</div>
		<table class="tableDefault"  cellpadding="0" cellspacing="0" style="margin-top:34px;position:fixed;width:79.4% !important;">
			<tr class="trDefault">
				<td width="5%" >编号</td>
				<td width="10%">名称</td>
				<td width="9%">SSID</td>
				<td width="9%">组名</td>
				<td width="9%">地点</td>
				<td width="9%">省/市</td>
				<td width="9%">城市</td>
				<td width="10%">县</td>
				<td width="10%">频道</td>
				<td width="10%">MAC地址</td>
				<td width="5%">存储空间</td>
				<td width="5%">设置</td>
			</tr>
		</table>	
		<table class="tableDefault" width="100%" cellpadding="0" cellspacing="0" style="margin-top:34px;">
			<tr class="trDefault">
				<td width="5%" >编号</td>
				<td width="10%">名称</td>
				<td width="9%">SSID</td>
				<td width="9%">组名</td>
				<td width="9%">地点</td>
				<td width="9%">省/市</td>
				<td width="9%">城市</td>
				<td width="10%">县</td>
				<td width="10%">频道</td>
				<td width="10%">MAC地址</td>
				<td width="5%">存储空间</td>
				<td width="5%">设置</td>
			</tr>
			<tbody id="deviceData" class="tableData" style="margin-top:66px;">
			</tbody>
		</table>
		</div>
		<div class="Right_Panel">
			<div class="Title">可操作设备列表</div>
			<div class="Content">
				<table class="tableDefault" width="100%" cellpadding="0" cellspacing="0">
			<tr class="trDefault">
				<td width="5%" >编号</td>
				<td width="10%">名称</td>
				<td width="9%">SSID</td>
				<td width="9%">组名</td>
				<td width="9%">地点</td>
				<td width="9%">省/市</td>
				<td width="9%">城市</td>
				<td width="10%">县</td>
				<td width="10%">频道</td>
				<td width="10%">MAC地址</td>
				<td width="5%">存储空间</td>
				<td width="5%">设置<td>
			</tr>
			<tbody id="hasDeviceData" class="tableData" >
			</tbody>
		</table>
			</div>
		</div>
	</div>
</div>
</body>
</html>