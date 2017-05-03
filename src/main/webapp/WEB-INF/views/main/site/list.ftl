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
<title>网站列表</title>
<#include "../../common/head.ftl">
<link rel="stylesheet" type="text/css" href="${basePath}/res/plugs/lib/jqeasy/themes/default/easyui.css"/>
<link rel="stylesheet" type="text/css" href="${basePath }/res/plugs/lib/jqeasy/themes/icon.css"/>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jquery.form.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jqeasy/jquery.easyui.min.js" ></script>
<script type="text/javascript" src="${basePath}/main/load/jsLoader?_param=
     mod/admin/area,
     mod/column/colist,
     mod/column/formatTreeData,
     mod/site/SiteList,
     mod/site/SiteExport,
     mod/temp/dialog,
     mod/site/SiteBind"></script>

</head>
<body >
<div id="mainPanel">
	<div id="topPanel">
		<@PermisstionBtnHtml />
		<ul class="buttonTabBox buttonTabBoxExt" >
			<li>	
				状态:<select id="queryState" class="inputText select" style="width:120px;"><option value="1">发布</option><option value="0">待发布</option></select>
				类型:<select id="queryType" class="inputText select" style="width:120px;"><option value="normal">常规</option><option value="public">公共</option></select>
				<input id="queryTitle" type="text" class="inputText" placeholder="输入网站名称" maxlength="20" style="width:120px;"/><input type="button" class="button blue" onclick="SiteList.getList(true)"  value="查询"/>
			</li>
		</ul>
	</div>
	<div id="leftPanel"></div>
	<div id="rightPanel">
		<div id="dragPanelLeft">
			<p class="areaListTitle">区域列表</p>
		    <div  id="areaPanel" class="colMainBox"></div>
		</div>
		<div id="dragPanelRight"></div>	
	</div>
</div>
</body>
</html>
