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
<title>标签管理</title>
<#include "../../common/head.ftl">
<link rel="stylesheet" type="text/css" href="${basePath}/res/plugs/lib/jqeasy/themes/default/easyui.css"/>
<link rel="stylesheet" type="text/css" href="${basePath }/res/plugs/lib/jqeasy/themes/icon.css"/>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jqeasy/jquery.easyui.min.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/colist.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/formatTreeData.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/topic/label.js" ></script>
</head>
<body>
<div id="mainPanel">
	<div id="topPanel">
		<@PermisstionBtnHtml />
	</div>
	<div id="leftPanel">
		<div style="text-align:center;"> <select id="siteList" class="inputText select"></select></div>
		<div class="labelColumnTree"><ul id="topicColTree" class="easyui-tree" data-options="animate:true"></ul></div>
	</div>
	<div id="rightPanel">
		<div id="labelGroupPane"  class="labelGroupPane">
		</div>
		<div id="labelPane" class="labelPane">
			<table class="tableDefault" width="99%" cellpadding="0" cellspacing="0" >
				<tr class="trDefault">
					<td width="10%"><input type="checkbox"id="_selectAll" onclick="_selectAll(this,'labelval')" /></td>
					<td width="10%">编号</td>
					<td width="20%">名称</td>
					<td width="20%">所属站点</td>
					<td width="20%">所属栏目</td>
					<td width="20%">站点</td>
				</tr>
				<tbody id="labelListData" class="tableData">
				</tbody>
			</table>
		</div>
	</div>
</div>
</body>
</html>