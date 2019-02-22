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
<title>模板列表</title>
<#include "../../common/head.ftl">
<script text="javascript/text" src="${basePath}/res/plugs/lib/jquery.form.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/fw/chasonx.tab.js"></script>
<script type="text/javascript" src="${basePath}/main/load/jsLoader?_param=
     mod/site/SitePub,mod/pdesigner/mana/templateIdx,fw/chasonx.simpleupload"></script>
</head>
<body>
<div id="mainPanel">
	<div id="topPanel"><@PermisstionBtnHtml /></div>
	<div id="centerPanel">
		<div id="templateListTab"></div>
		<div id="customTemplateList"></div>
		<div id="templateUploadTab">
			<div class="tips"></div>
			<div class="templateUpload" >
				<div class="domPanelBox">
					<domitem style="color:#bdbdbd">选择站点：</domitem>
					<domitem><select class="inputText select" id="tempSiteList" onchange="PDesTemplate.siteSelectChange(this)"></select>
					<input type="text" id="tempSiteName" class="inputText" req="true" style="position: relative; left: -51.2%;top:-1px; width: 42%; border: none;"/>
					</domitem>
				</div>
				<div class="domPanelBox">
					<domitem style="color:#bdbdbd">选择文件：</domitem>
					<domitem><input type="text" id="templateFileVal" req="true" class="inputText textBrowse" readonly="readonly"/><input type="button" class="button browse" value="浏览" id="templateBrowserFile"/></domitem>
				</div>
				<div class="domPanelBox">
					<domitem style="color:#bdbdbd">模板描述：</domitem>
					<domitem><input id="templateDesc" type="text" req="true" class="inputText" /></domitem>
				</div>
				<div class="domPanelBox">
					<domitem>&nbsp;</domitem>
					<domitem><div class="templateUploadState"></div></domitem>
				</div>
				<div class="domPanelBox">
					<domitem>&nbsp;</domitem>
					<domitem><input type="button" id="templateStartUPload" class="button blue" value="开始上传"/></domitem>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>