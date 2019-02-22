<#macro btnpanel>
 <#if TOPICALINFO?exists >
    <span  onclick="EtopicSet.save(2)" >保存</span>
 <#else>
 	<span onclick="EtopicSet.save(1)" >保存</span>
 </#if>
 <span onclick="EtopicSet.badWordCheck()">敏感词检索</span><span onclick="EtopicSet.clear(true)">清空输入</span><span style="color:#FF2222;" onclick="EtopicSet.close()">关闭</span>
 <font color="#848181">(系统将对内容进行敏感词检索并提示，其他敏感词将直接替换)</font>
</#macro>

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
<title>主题编辑</title>
<#include "../../common/head.ftl">
<link rel="stylesheet" type="text/css" href="${basePath}/res/plugs/lib/jqeasy/themes/default/easyui.css"/>
<link rel="stylesheet" type="text/css" href="${basePath }/res/plugs/lib/jqeasy/themes/icon.css"/>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jqeasy/jquery.easyui.min.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/ke/kindeditor-min.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/ke/plugins/autoheight/autoheight.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/ke/zh_CN.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/colist.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/formatTreeData.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/topic/attr.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/doc/doc.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/topic/edit.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/topic/resource.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/topic/areaPanel.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/files/list.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/topic/down.js" ></script>
<style type="text/css">
body 			   {overflow:hidden;}
.ke-icon-imgsource { background-image: url(${basePath}/res/plugs/ke/themes/default/default.png); background-position: 0px -1232px; width: 16px; height: 16px;}
#artColVal:hover   {background:#e0dbdb;border:1px solid #918e8e;}
#labelBox	  	   {width:50%;height:auto !important;padding:5px;border:1px solid #918e8e;position:absolute;background:#f6f6f6;overflow:auto;display:none; 
					word-wrap:break-word;white-space:normal;z-index:10;}
#labelBox span 	   {margin:5px;}
#labelBox .btn	   {color: #545252; padding: 4px; text-align: right;}
#labelBox .btn input{position: relative;top: 3px;}
#labelBox .btn i   {color: #23364f; font-size: 15px; font-weight: bold;  margin-left: 10px;  cursor: pointer;}
#labelBox .labeLeft{width: 20%; height: 220px; position: relative; display: inline-block;overflow:auto;overflow-x:hidden;}
#labelBox .labeLeft p{color:  #35394e;  padding-left: 20px; font-size: 20px; cursor: pointer;}
#labelBox .labeLeft p:hover,.labelGroupFocus{color: #3f92de !important;}
#labelBox .labeRight{width: 79%; display: inline-block;  height: 220px;background: #ddd;position: absolute;overflow:auto;overflow-x:hidden;}
.classFastAddLab	{display: inline-block;}
.classFastAddLab input{border: none; background: #fff; width: 100px; padding: 2px; border-radius: 10px;}
.classFastAddLab i  {color: #565454; font-size: 15px; cursor: pointer;}
</style>
</head>
<body>
<input type="hidden" value="${UCGSFORMDATAFILTER}" id="UCGSFORMDATAFILTER"/>
<input type="hidden" value="${(TOPICALINFO.id)!}" id="_uepk"/>
<input type="hidden" value="${(TOPICALINFO.finfocolid)!}" id="_uecolid"/>
<input type="hidden" value="${(TOPICALINFO.fguid)!}" id="_topicguid"/>
<input type="hidden" value="${(TOPICALINFO.fclass)!}" id="_topicClass" />
<input type="hidden" value="${(TOPICALINFO.ftemplateid)!}" id="_topicTemplate" />
<input type="hidden" value="${(TOPICALINFO.fsiteguid)!}" id="_topicSiteGuid" />
<div id="mainPanel" class="mainBox etopicMaiBg" >
    <div id="topPanel">
		<div class="etopicHead" >
			<@btnpanel />
		</div>
	</div>
	<div id="rightPanel">
			<div class="linkImages"><span class="slideBtn" _open="false">展开资源</span>
				<div class="items">
				   <p>外部资源：<input type="button" id="_downall" class="button blue btnsmall" value="全部开始"/><input id="_clearall" type="button" class="button red btnsmall" value="全部清除"/></p>
				   <div id="linkImagePanel"></div>
				</div>
			</div>
		<div id="DragLeftPanel">
			<div class="editTopicShade"></div>
			<div  style="position:absolute;top:0px;bottom:0px;left:0px;right:0px;overflow:auto;">
				<p class="areaListTitle"><b>区域列表</b></p>
				<div id="topicAreaPanel"></div>
			</div>
		</div>
		<div class="colMainLeft" id="DragCenterPanel">	
			<div class="editTopicShade"></div>
			<div>
				<div>选择网站：<select id="siteItems" class="inputText select"></select></div>
				<div  style="overflow:auto;"><ul id="topicColTree" class="easyui-tree" data-options="animate:true"></ul></div>
			</div>
		 </div>
		 <div id="DragRightPanel">	
			<div class="etopicTableRight">
				<div class="etopicClass">
					<span class="topicClassBtn topic_def" id="topic_def" for="topicBoxDef"></span>
					<span class="topicClassBtn topic_video" id="topic_video" for="topicBoxVideo"></span>
					<span class="topicClassBtn topic_img" id="topic_img" for="topicBoxImg"></span>
					<span class="topicClassBtn topic_link" id="topic_link" for="topicBoxLink"></span>
					<span class="topicClassBtn topic_doc" id="topic_doc" for="topicDocPanel" ></span>
					<!-- <span class="topic_more" ></span> -->
				</div>
				<div class="etopicTableBox">
					<table id="contentTable" width="100%" cellpadding="0" cellspacing="0" align="center">
						<tr>
							<td class="etopicTd" width="10%">标题：</td>
							<td><input type="text" id="ftitle" req="true"  class="inputText topicEditBgSec" style="font-size:22px;" maxlength="50" value="${(TOPICALINFO.ftitle)!}"/></td>
						</tr>
						<tr>
							<td class="etopicTd" width="10%">副标题：</td>
							<td><input type="text" id="ftitlesec"  class="inputText topicEditBg" style="width:40%;"  maxlength="30" value="${(TOPICALINFO.ftitlesec)!}"/></td>
						</tr>
						<tr>
							<td class="etopicTd">来源：</td>
							<td><input type="text" id="fsource" req="true" class="inputText" style="width:40%;" maxlength="50" value="${(TOPICALINFO.fsource)!}"/></td>
						</tr>
						<tr>
							<td class="etopicTd">标签：</td>
							<td><input type="text" id="flabel" style="width:0px;border:none;"  value="${(TOPICALINFO.flabel)!}" />
								<input type="text" id="flabelcode" style="width:0px;border:none;" value="${(TOPICALINFO.flabelcode)!}"/>
								<div id="labelPanel"></div>
								<span class="labelMore"  onclick="EtopicSet.showLabel(this)" >更多</span><font color="#ddd">点击标签可删除</font>
								<div id="labelBox">
									<div class="btn"><input type="checkbox" id="getColumnLabel" value="1"/><label for="getColumnLabel">精确到栏目</label></div>
									<div id="_editLabeLeft" class="labeLeft"></div>
									<div id="_editLabeRight"class="labeRight"></div>
								</div>
							</td>
						</tr>
						<tr>
							<td class="etopicTd">置顶：</td>
							<td><select  id="fartTop"  class="inputText select" ><option value="0" <#if TOPICALINFO?exists && TOPICALINFO.ftop == 0>selected="selected"</#if>>否</option><option value="1" <#if TOPICALINFO?exists && TOPICALINFO.ftop == 1>selected="selected"</#if> >是</option></select></td>
						</tr>
						<tr>
							<td class="etopicTd">简介：</td>
							<td><textarea   id="fsummary" class="inputText" rows="4" maxlength="200">${(TOPICALINFO.fsummary)!}</textarea></td>
						</tr>
						<tr>
							<td class="etopicTd">缩略图：</td>
							<td><input type="text" class="inputText textBrowse" id="fthumbnail" style="width:50%;" cdata="" value="${(TOPICALINFO.fthumbnail)!}"/>
								<input type="button" class="button browse"  value="浏览" style="border-radius:0px;-webkit-border-radius:0px;-moz-border-radius:0px;" onclick="EtopicSet.selectMallimg();"/>
								<input type="button" class="button browseCancel" value="撤销" style="margin-left:-4px;" onclick="EtopicSet.cancelImg()"/>
							</td>
						</tr>
						<tr>
							<td ></td>
							<td>
								<div class="prewImg"><img id="fthumbnailPrewImg" src="<#if TOPICALINFO?exists>${(TOPICALINFO.fthumbnail)!}<#else>${basePath}/res/skin/images/prewimg.png</#if>" onerror="this.src='${basePath}/res/skin/images/prewimg.png';" width="128px" height="128px"/></div>
							</td>
						</tr>
					</table>
					<!--topic def item-->
					<table id="topicBoxDef" class="topicBoxItem" width="100%" cellpadding="0" cellspacing="0" align="center">
						<tr>
							<td class="etopicTd" width="10%">页面设置：</td>
							<td>
								<select id="pageSetting" class="inputText select" style="width:150px;"></select>
								<select id="pageScaling" class="inputText select" style="width:150px;">
									<option value="1">缩放比例</option>
									<option value="0.1">10%</option>
									<option value="0.2">20%</option>
									<option value="0.3">30%</option>
									<option value="0.4">40%</option>
									<option value="0.5">50%</option>
									<option value="0.6">60%</option>
									<option value="0.7">70%</option>
									<option value="0.8">80%</option>
									<option value="0.9">90%</option>
									<option value="1">100%</option>
								</select>
							</td>
						</tr>
						<tr>
							<td  class="etopicTd">主题模版：</td>
							<td><select id="templateList" class="inputText select"></select></td>
						</tr>
						<tr>
							<td class="etopicTd" width="10%">正文：<br>
								<input type="button" class="button green" value="分页" onclick="EtopicSet.addPage()"/>
							</td>
							<td id="editContentPanel">
								<div id="etopicContent"></div>
							</td>
						</tr>
						<tr>
							<td class="etopicTd">正文分页：</td>
							<td id="mainpagepanel">
								<div class="pageItem" id="pageCurr" onclick="EtopicSet.setPageContent(0)" style="display: inline-block;margin-top:-123px;">未输入</div>
								<div class="pagePanelBox"></div>
								<div style="clear: both;"></div>
							</td>
						</tr>
						<tr>
							<td>&nbsp;</td>
							<td></td>
						</tr>
					</table>
					<!--topic video item-->
					<table id="topicBoxVideo" class="topicBoxItem" style="height:auto !important;" width="100%" cellpadding="0" cellspacing="0" align="center">
						<tr>
							<td class="etopicTd" width="10%">影片详情：<br><input type="button" class="button blue"  value="影片列表" onclick="ResDialog.list()" /></td>
							<td style="height:auto !important;">
								<div class="videoDetailBox">
									<div class="btnBox"><font></font></div>
									<div class="poster"><img src=""  onerror="this.src='${basePath}/res/skin/images/posterDef.png';" /></div>
									<div class="mess"></div>
									<div class="ctrl">
										<input type="button" class="button blue" value="更 新" onclick="ResDialog.update('${(TOPICALINFO.fguid)!}')"/><input type="button" class="button green" value="播  放" onclick="moveToDoPlay()"/>
									</div>
									<div class="grade"></div>
									<div class="video"><video controls="controls">您的浏览器不支持video标签</video></div>
								</div>
								<input type="hidden" id="videoMessUrl" />
								<input type="hidden" id="videoRegion" /><input type="hidden" id="videoYears" />
								<input type="hidden" id="videoGuid" /><input type="hidden" id="videoGrade" />
								<textarea id="videoDetailJson" style="display:none;">${(TOPICALINFO.fextdata)!}</textarea>
								<Br>
							</td>
						</tr>
					</table>
					<!-- topic img item -->
					<table id="topicBoxImg" class="topicBoxItem" width="100%" cellpadding="0" cellspacing="0" align="center">
						<tr>
							<td class="etopicTd" width="10%">图片集：</td>
							<td>
								<div class="etopicImgBox">Loading...</div>
							</td>
						</tr>
						<tr>
							<td class="etopicTd" width="10%">&nbsp;</td>
							<td>
								&nbsp;
							</td>
						</tr>
					</table>
					
					<!-- topic link item -->
					<table id="topicBoxLink" class="topicBoxItem" width="100%" cellpadding="0" cellspacing="0" align="center">
						<tr>
							<td class="etopicTd" width="10%">链接地址：</td>
							<td>
								<input type="text" req="true" id="_topicLink" value="${(TOPICALINFO.fextdata)!}" class="inputText" style="width:90%;font-size:20px;" onblur="EtopicSet.linkContentCheck(this)"/>
							</td>
						</tr>
						<tr>
							<td class="etopicTd" width="10%">&nbsp;</td>
							<td>
								链接类型的主题访问时将进行重定向.
							</td>
						</tr>
					</table>
					
					<!-- topic doc  -->
					<table id="topicDocPanel" class="topicBoxItem" width="100%" cellpadding="0" cellspacing="0" align="center">
						<tr>
							<td class="etopicTd" width="10%">选择文档：</td>
							<td>
								<div class="topic_docPanel">
									<div class="_docPanel_left"><i class="icon-note_add" onclick="DocList.show()" title="选择文档"></i></div>	
									<div class="_docPanel_right">
									</div>
									<div style="clear:both;"></div>	
								</div>
							</td>
						</tr>
						<tr>
							<td class="etopicTd" width="10%">&nbsp;</td>
							<td>
								提示：一篇主题只能选择一个文档，按ctrl+Q 可打开搜索框进行文档搜索.
							</td>
						</tr>
					</table>
				</div>
				<br>
				<br>
			</div>
		  </div>	
	 </div>	
</div>
<#if TOPICALINFO?exists>
	<script type="text/javascript">
	
		function editDataInit(){
			var _clas = '${(TOPICALINFO.fclass)!}';
			switch(~~_clas){
				case 0: break;
				case 1:
					ResDialog.mediaMessDraw(${(TOPICALINFO.fextdata)!});
				 break;
				case 2: break;
				case 3:
					$("#_topicLink").val('${(TOPICALINFO.fextdata)!}');
				 break;
				case 4:
					DocList.init(${(TOPICALINFO.fextdata)!}).drawDetail();
				 break;
			}
			EtopicSet.labelInit();	
					
			var tempid = $("#_topicTemplate").val();
			if(tempid != ""){
				getAjaxData(DefConfig.Root + '/main/topic/topicTemplateList',{'siteGuid':$("#_topicSiteGuid").val()},function(d){
					var op = '<option value="0">---选择模版---</option>';
					$.each(d,function(i,u){
						op += '<option value="'+ u.id +'" '+ (u.id == tempid?'selected="selected"':'') +'>'+ u.ftname +'</option>';
					});
					
					$("#templateList").html(op);
				});
			}
		}	
		editDataInit();	
		
		
	</script>
</#if>
</body>
</html>