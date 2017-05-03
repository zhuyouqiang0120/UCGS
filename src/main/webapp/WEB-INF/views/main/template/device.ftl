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
<title>设备管理</title>
<#include "../../common/head.ftl">
<style type="text/css">
.LiveCount 						{height:25px;vertical-align:middle;line-height:25px;padding-left:8px;color:#848484;}
</style>
<script type="text/javascript" src="${basePath}/res/plugs/mod/temp/device.js"></script>
<script type="text/javascript">
window.onload = function(){
	Chasonx.Frameset({
		  main : 'LEMON_DEVICE',
	      window : {
	          top : { id : 'LEMON_DEVICE_TOP', height : '68px',border:false,bgColor:false},
	          left: { id:'LEMON_DEVICE_LEFT' , width : '0%',border:false,bgColor:false},
	          right:{ id:'LEMON_DEVICE_RIGHT',border:false,bgColor:false},
	      }
	    });
	
	Device.list();
	
	$("#ChooseList > select").live('change',function(){
		Device.list();
	});
};
</script>
</head>
<body>
<div id="LEMON_DEVICE">
	<div id="LEMON_DEVICE_TOP" class="LEMON_BTNBOX">
		<@PermisstionBtnHtml />	
	</div>
	<div id="LEMON_DEVICE_LEFT"></div>
	<div id="LEMON_DEVICE_RIGHT">
		<div id="ChooseList">
			&nbsp;&nbsp;按组：<select id="groups" class="inputText select" style="width:120px;"></select>
			按地点：<select id="locations" class="inputText select" style="width:120px;"></select>
			按省/市：<select id="province" class="inputText select" style="width:120px;"></select>
			按城市：<select id="citiys" class="inputText select" style="width:120px;"></select>
			按县：<select id="contrys" class="inputText select" style="width:120px;"></select>
			按频道：<select id="channels" class="inputText select" style="width:120px;"></select>
		</div>
		<table class="tableDefault" width="100%" cellpadding="0" cellspacing="0" >
			<tr class="trDefault">
				<td width="5%" >编号</td>
				<td width="10%">名称</td>
				<td width="10%">SSID</td>
				<td width="10%">组名</td>
				<td width="10%">地点</td>
				<td width="10%">省/市</td>
				<td width="10%">城市</td>
				<td width="10%">县</td>
				<td width="10%">频道</td>
				<td width="10%">MAC地址</td>
				<td width="5%">存储空间</td>
			</tr>
			<tbody id="deviceData" class="tableData">
			</tbody>
		</table>
		<div class="LiveCount"></div>
	</div>
</div>
</body>
</html>