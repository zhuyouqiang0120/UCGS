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
<meta name="author" content="chasonx">
<title>UCGS-统一页面设计工具</title>
<link rel="stylesheet" href="${basePath}/res/skin/css/colorpicker/colorpicker.css"/>
<link rel="stylesheet" href="${basePath}/res/skin/css/colorpicker/layout.css"/>
<link rel="stylesheet" href="${basePath}/res/skin/css/pdesigner.css"/>
<link rel="stylesheet" href="${basePath}/res/plugs/mod/pdesigner/code/css/codemirror.css"/>
<link rel="stylesheet" href="${basePath}/res/plugs/mod/pdesigner/code/css/base16-dark.css"/>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/main/load/jsLoader?_param=
     mod/admin/icon"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/config.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/files/list.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/lib/jquery.mousewheel.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/colorpicker/colorpicker.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/colorpicker/eye.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/colorpicker/layout.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/colorpicker/utils.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/code/codemirror.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/code/mode/javascript.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/chasonx.move.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/index.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/genner.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/htmlFormat.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/TScalerTools.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/pdesigner/dev.js"></script>
</head>
<body>
<div id="LoadingFadeTop"></div>
<div id="LoadingFadeBottom"></div>
<div id="LoadingLogoBox"><div id="loadingText">0 %</div><div id="logo"></div><div id="logo2"></div></div>
<div id="PD_Top">
	<img src="${basePath}/res/skin/css/default/pdesigner.png" title="UCGS统一页面模板制作工具"/>
	<div class="PD_ButtonBox">
		<input type="button" class="button blue" value="新建模板" onclick="PDesigner.newPage()"/>
		<input type="button" class="button green" value="保存为新模板" onclick="PDesigner.saveTemplate(1)"/>
		<input type="button" class="button green" value="更新当前模板" onclick="PDesigner.saveTemplate(2)"/>
		<input type="button" class="button green" value="保存为文章模板" onclick="PDesigner.modifyTopicTemplate(1)"/>
		<input type="button" class="button green" value="预览效果" onclick="PDesigner.previewTemplate()"/>
	</div>
	<div id="PD_DataSorce" class="PD_DataSorce" onclick="PDesigner.loadDataSource()"><i class="icon-database"></i>主数据源：<b>未设置</b></div>
	<div class="ChasonxSite"><font color="#f6f6f6">当前选中站点：</font><div class="siteDataItems"><span class="left">未选择</span><span class="right">▼</span></div></div>
</div>
<div id="PD_Left"></div>
<div id="PD_Rigth">
 <div id="codeViewerPanel"></div>
 <div id="PD_Designer"></div>
 <div id="PD_ATTR">
 		<ul class="buttonTabBox" style="height:61px;">
 			<li >
 				<input type="radio" id="tabBtn11" name="tabs20" checked=""><label for="tabBtn11">样式</label>
 				<div id="tab-content11" class="tabItems">
	 				<p class="labelP"><b>宽度:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-width"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>高度:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-height"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>左边距:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-left" /><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>上边距:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-top" /><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<hr>
				 	<p class="labelP"><b style="top:0px;">背景图:</b><input type="text" class="ChasonxP_browserText" id="_ChasonxAttr-bgImg"/><input type="button" value="‥" id="ChasonxP_browserBtn_bgImg" class="ChasonxP_browserBtn"/></p>
				 	<p class="labelP"><b style="top:0px;">背景方式:</b><select class="ChasonxP_select" id="_ChasonxAttr-bgmRepeat"><option value="no-repeat">原始图像</option><option value="full">拉伸</option><option value="repeat">默认</option><option value="repeat-x">水平平铺</option><option value="repeat-y">垂直平铺</option></select></p>
				 	<p class="labelP"><b>背景位置-X:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-bgmPos_x"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>背景位置-Y:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-bgmPos_y"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>背景色:</b><span class="ChasonxP_color"><input type="text" id="_ChasonxAttr-bgColor" /><span class="color"></span></span></p>
				 	<hr>
				 	<p class="labelP"><b>边框宽度:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-borderWidth"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>边框颜色:</b><span class="ChasonxP_color"><input type="text" id="_ChasonxAttr-borderColor" /><span class="color"></span></span></p>
				 	<hr>
				 	<p class="labelP"><b>字体大小:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-fontSize"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>字体间距:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxAttr-fontLHeight"/><font>PX</font><span class="ChasonxP_slideBase mult">-</span><span class="ChasonxP_slideBase add">+</span></span></p>
				 	<p class="labelP"><b>字体颜色:</b><span class="ChasonxP_color"><input type="text" id="_ChasonxAttr-fontColor" /><span class="color"></span></span></p>
				 	<p class="labelP"><b style="top:0px;">对齐方式:</b><span class="ChasonxP_bg"><span class="ChasonxP_fontAlign ChasonxP_fontAlignL">居左</span><span class="ChasonxP_fontAlign">居中</span><span class="ChasonxP_fontAlign ChasonxP_fontAlignR">居右</span></span></p>
 					<hr>
 					<p class="labelP"><b style="top:0px;">图片资源:</b><input type="text" class="ChasonxP_browserText" id="_ChasonxAttr-img"/><input type="button" value="‥" id="ChasonxP_browserBtn_img" class="ChasonxP_browserBtn"/></p>
 					<hr>
 					<p class="labelP"><b style="top:0px;">焦点背景图:</b><input type="text" class="ChasonxP_browserText" id="_ChasonxAttr-focusImg"/><input type="button" value="‥" id="ChasonxP_browserBtn_Focusimg" class="ChasonxP_browserBtn"/></p>
 					<p class="labelP"><b>焦点背景色:</b><span class="ChasonxP_color"><input type="text" id="_ChasonxAttr-focusColor" /><span class="color"></span></span></p>
 					<hr>
 			 		<#--
 					<p class="labelP" style="text-align: center;background: #313131;padding: 2px 0px;">自定义属性</p>
 					<div id="customerAttr"></div>
 					-->
 				</div>
 			</li>
 			<li>
 				<input type="radio" id="tabBtn12" name="tabs20" ><label for="tabBtn12">属性</label>
 				<div id="tab-content12" class="tabItems">
 					<p class="labelP"><b>id:</b><span class="ChasonxP_slideInput"><input type="text" id="_ChasonxCustomerAttr-id"/></span></p>
 					<div id="ChasonxCustomAttrPanel"></div>
 				</div>
 			</li>	
 			<li>
 				<input type="radio" id="tabBtn13" name="tabs20" ><label for="tabBtn13">事件</label>
 				<div id="tab-content13" class="tabItems">
 				    <p class="labelP"><b style="top:0px;">超链接:</b><input type="text" class="ChasonxP_browserText" id="_ChasonxAttr-href"/><input type="button" value="‥" id="ChasonxP_browserBtn_href" class="ChasonxP_browserBtn"/></p>
 					<p class="labelP"><span class="summary">设置超链接后控件执行onClick事件将跳转至该地址.</span></p>
 					<p class="labelP"><b>设置主渲染控件:</b><span class="algin"><select id="_ChasonxAttr-mainDraw" class="ChasonxP_browserText"><option value="false">否</option><option value="true">是</option></select></span></p>
 					<p class="labelP"><span class="summary">设置主渲染控件后页面在渲染数据时将优先渲染该控件，如果设置多个或不设置则根据数据控件拖放顺序进行渲染.</span></p>
 				</div>
 			</li>
 			<li>
 				<input type="radio" id="tabBtn14" name="tabs20" ><label for="tabBtn14">数据源</label>
 				<div id="tab-content14" class="tabItems">
 				</div>
 			</li>
 			<li>
 				<input type="radio" id="tabBtn15" name="tabs20" ><label for="tabBtn15">关联</label>
 				<div id="tab-content14" class="tabItems">
 				&nbsp;
 				</div>
 			</li>
 		</ul>		
 </div>
</div>
<div id="PD_Bottom">TemplateScaler version:1.0.0 build2016</div>
<div class="ChasonxP_SiteItem_Panel"></div>
<div class="ChasonxP_TemplateList"></div>
<input type="hidden" value="${UCGSFORMDATAFILTER}" id="_UCGSFORMDATAFILTER"/>
</body>
</html>