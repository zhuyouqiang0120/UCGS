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
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>UCGS2.0统一内容管理系统 ZensVison </title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/mod/files/list.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/site/SitePub.js"></script>
<script type="text/javascript" >

window.onload = function(){
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			left : {id : 'leftPanel',width : '0%',border:false,bgColor:false},
			right: {id : 'rightPanel',border:false,bgColor:false}
			}
	});
	
	Chasonx.DragBox({
		target : 'rightPanel',
		lineColor : _GetBoxLineColor(),
		items : [
		         {id : 'dragLeft',width : '15' },
		         {id : 'dragCenter',width : '10' },
		         {id : 'dragRight',width : '75' }
		        ]
	});
	
	SitePub.list('fileListSite','');
	SitePub.handler('fileListSite',function(siteguid){
		FileList.siteGuid = siteguid;
		FileList.getFileList();
	});
	Area.list('areaList',[],function(){
		SitePub.list('fileListSite',Area.currArea.fguid);
	});
};

</script>
</head>
<body>
<input type="hidden" id="resourceDel" value="<#if PAGETYPE == 1>0<#else>1</#if>" />
<div id="mainPanel">
	<div id="leftPanel"></div>
	<div id="rightPanel">
		<div class="colMainLeft" id="dragLeft">
			<div >
				<p class="areaListTitle"><b>区域列表</b></p>
				<div id="areaList"></div>
			</div>
		</div>
		<div id="dragCenter">
			<div id="fileListSite" class="fileListSite"></div>
		</div>
		<div id="dragRight">
			<div class="buttonBox" style="height:auto;">
				<select id="resourceType" class="inputText select" style="width:10%;" onchange="FileList.getFileList();" ><option value="0">主题资源</option><option value="1">模版资源</option></select>
				<input id="startTime"  type="text" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',realFullFmt:'%Date'})" class="inputText Wdate" style="width:120px;"/>至
				<input id="endTime" type="text" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',realFullFmt:'%Date'})" class="inputText Wdate" style="width:120px;"/>
				<input type="button" class="button blue" onclick="FileList.getFileList()" value="查询"/>
				<#if PAGETYPE == 1>
					<input type="button" class="button red" onclick="FileList.del(1)" value="删除"/>
				</#if>
				<#if PAGETYPE == 2>
					<input id="recBtn"   type="button" class="button green" onclick="FileList.del(0)" value="恢复"/>
					<input id="delBtn"   type="button" class="button red" onclick="FileList.del(2)" value="彻底删除"/>
				</#if>
			</div>
			<div class="fileItemsPanel">
				<div style="padding:8px;text-align:center;">暂无数据</div>
			</div>
			<div  id="pagePanel"></div>
		</div>	
	</div>
</div>
</body>
</html>