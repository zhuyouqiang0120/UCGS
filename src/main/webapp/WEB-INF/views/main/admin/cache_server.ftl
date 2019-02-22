<!DOCTYPE html>
<!--
                                                  
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
 -->
<html>
<head>
<meta charset="UTF-8">
<meta name="author" content="Chasonx">
<meta name="mail" content="zuocheng911@163.com">
<title>缓存服务器设置</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/cache_server.js" ></script>
</head>
<body>
<div class="mainBox">
<@PermisstionBtnHtml />	
	<div style="clear:both;"></div>			
	<table class="tableDefault" width="99%" cellpadding="0" cellspacing="0" >
		<tr class="trDefault">
			<td width="5%"></td>
			<td width="10%">ID</td>
			<td width="15%">服务器名称</td>
			<td width="10%">IP</td>
			<td width="10%">资源访问路径</td>
			<td width="10%">FTP用户名</td>
			<td width="10%">FTP密码</td>
			<td width="10%">FTP端口</td>
			<td width="10%">FTP缓存目录</td>
			<td width="10%">状态</td>
		</tr>
		<tbody id="cacheServerData" class="tableData">
		</tbody>
	</table>
</div>
</body>
</html>