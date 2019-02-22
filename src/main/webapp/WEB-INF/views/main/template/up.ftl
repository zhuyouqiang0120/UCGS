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
<title>模版上传</title>
<#include "../../common/head.ftl">
<style type="text/css">
.upgradeHistory		 {width: 98%; position: relative; top: 2%;margin:0px auto;}
.upgradeHistory .folder{display:inline-block;border:1px solid #f7b353;padding:12px 8px;margin:2px;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;
					   background:#f5d988;overflow:hidden;position:relative;cursor:pointer;}
.upgradeHistory .folder input{position:absolute;right:0px;bottom:0px;}					   
.upgradeHistory .folderFocus{border:4px solid #fb9a28}		
.upgradeHistory .folderFocus span{transform:rotate(45deg);-moz-transform:rotate(45deg);-webkit-transform:rotate(45deg); position: absolute;
								top: 12px; right: -34px;  background: #a4e2ec;  width: 63%; text-align: center;}	
#previewTemplateFrame{width:400px;height:750px;position: absolute;left: -800px;border:0px;}		
#templateHistory {padding: 8px;}
#templateHistory .templateItem{display:inline-block;width:200px;height:300px;border:1px solid #ddd;text-align:center;padding:5px;position:relative;float:left;margin:5px;
							  box-shadow: 0px 0px 4px #4a4a4a;-moz-box-shadow: 0px 0px 4px #4a4a4a;-webkit-box-shadow: 0px 0px 4px #4a4a4a;}
#templateHistory .templateItem div{position: absolute;  top: 0px; left: 0px; width: 100%;height: 100%; background: rgba(0, 0, 0, 0.3);color:#d4d4d4;text-align:left;
								  transition:0.5s;-moz-transition:0.5s;-webkit-transition:0.5s;}	
#templateHistory .templateItem div:hover{color:#fff;background: rgba(0, 0, 0, 0.8);}	
#templateHistory .templateItem div input{position:absolute;right:0px;bottom:0px;width:20px;height:20px;}	
#templateHistory .templateItem div p {margin:5px;}			  
</style>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/site/SitePub.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/html2canvas.js"></script>
<script type="text/javascript">
   window.onload = function(){
   		Loader.js('mod.files.Upload',true,null,{"fileType":"*.zip;*.rar","url":DefConfig.Root + "/main/template/upload"});
   		Chasonx.Frameset({
			main   : 'mainPanel',
			window : {
				left : {id : 'leftPanel',width : '0%',border:false,bgColor:false},
				right: {id : 'rightPanel',border:false,bgColor:false}
			}
		});
		
		loadTemplateList();
		
/*		Chasonx.DragBox({
			target : 'rightPanel',
			lineColor : '#ADADAD',
			items : [
			         {id : 'dragLeft',width : '15' },
			         {id : 'dragRight',width : '85' }
			        ]
		});
		
		_siteList();
		
		Area.list('areaList',[],function(){
			SitePub.list('',Area.currArea.fguid,function(d){
				_drawSite(d);
			});
		});
*/		

     $("#templateHistory > div").live('click',function(){
     	$("input[name='TempVal'][type='checkbox']:checked").attr('checked',false);
     	$(this).find("input[name='TempVal'][type='checkbox']").attr('checked',true);
     });
     
       
   };
function _siteList(){
	SitePub.list('',null,function(d){
		_drawSite(d);
	});
}

function loadTemplateList(){
		getAjaxData(DefConfig.Root + '/main/template/templatePackageList',null,function(d){
			previewTemplate(d,0);
		});
}

function previewTemplate(data,idx){
	if(data.length == idx) return;
	var u = data[idx];
	var iframeEle = $("#previewTemplateFrame")[0];
		iframeEle.setAttribute('src', DefConfig.Root + u.fpath + '/home.html');
		iframeEle.onload = function(){
			html2canvas(iframeEle.contentWindow.document.body, {
                allowTaint: true,
                taintTest: false,
                urlSuffix : DefConfig.Root + u.fpath + '/', //自定义图片、css前缀
                onrendered: function(canvas) {
                    //生成base64图片数据
                    var dataUrl = canvas.toDataURL();
                    var img = new Image();
                    img.src = dataUrl;
                    var zoom = (Math.min(Math.min(200/img.width,1),Math.min(300/img.height,1))).toFixed(3);
                    $("#templateHistory").append('<div class="templateItem"><img src="'+ dataUrl +'" width="'+ (img.width*zoom) +'px" height="'+ (img.height*zoom) +'px"/>\
                    		<div><p>名称：'+ u.fassetname +'</p>\
							<p>备注：'+ getString(u.fremark) +'</p>\
							<p>上传人：'+ u.fuploader +'</p>\
							<p>时间：'+ u.fuploadtime +'</p>\
							<p>大小：'+ fileSizeForamt(u.fsize) +'</p>\
							<input type="checkbox" name="TempVal" value="'+ u.fguid +'" /></div>');
				     previewTemplate(data,idx + 1);			
                }
            });
		};
}

function dTemplate(){
	var ck = $("input[name='TempVal'][type='checkbox']:checked");
	if(ck.size() == 0) return Chasonx.Hint.Faild('请选择模板文件');
	Chasonx.Alert({
		alertType : 'warning',
		html : '确定删除当前选中的模板文件吗？',
		modal : true,
		success : function(){
			getAjaxData(DefConfig.Root + '/main/template/delTemplate',{guid:ck.val()},function(d){
				if(~~d > 0) loadTemplateList();
			});
			return true;
		}
	});
}

function changeTemplagePkg(obj){
	if(obj.getAttribute('state') == 1) return;
	Chasonx.Alert({
		alertType : 'warning',
		html : '确定使用当前选中的模板文件吗？',
		modal : true,
		success : function(){
			getAjaxData(DefConfig.Root + '/main/template/changeTemplatePkg',{id:obj.getAttribute('data')},function(d){
				if(~~d > 0) loadTemplateList();
			});
			return true;
		}
	});
}

function _drawSite(d){
	var op = '<option value="">---请选择站点---</option>';
	$.each(d.list,function(i,u){
		op += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
	});
	$("#fileSite").html(op);
}
</script>
</head>
<body >
<div id="mainPanel">
	<div id="leftPanel"></div>
	<div id="rightPanel">
		<div id="dragLeft" style="display:none;">
			<p style="padding:5px 0px 5px 0px;">
				<input type="button" class="button blue" onclick="_siteList();" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;"  value="全部网站"/>
				<b>区域列表</b></p>
			<div id="areaList"></div>
		</div>
		<div id="dragRight">
			<div class="swfuploadPanel">
				<@PermisstionBtnHtml />	
				<br><br>
				<table class="global_bg_c" width="100%" height="100%" cellpadding="0" cellspacing="0">
				<!-- <div class="fileStats" style="height:40px;vertical-align:middle;line-height:50px;">选择网站：<select id="fileSite" class="inputText select" style="width:30%;"></select></div> -->
					<tr>
						<td class="etopicTd" width="10%">模版描述：</td>
						<td><textarea id="fremark" class="inputText" maxlength="50"></textarea></td>
					</tr>
					<tr>
						<td  class="etopicTd">状态：</td>
						<td><div class="fileStats">待上传文件:<font>0</font>   上传成功:<font>0</font>   上传失败:<font>0</font><span id="uploadErrMsg"></span></div></td>
					</tr>
					<tr>
						<td  class="etopicTd">列表：</td>
						<td>
							<div class="fileAttr"><span>文件名</span><span>文件大小</span><span>更新时间</span><span>备注</span><span>上传进度</span></div>
							<div id="filePanel" class="filePanel"></div>
							<br>
						</td>
					</tr>
				</table>			
			</div>
		</div>	
		<div class="upgradeHistory global_bg_c">
			<p>&nbsp;&nbsp;&nbsp;&nbsp;<b>模板文件列表：</b></p><br>
			<div id="templateHistory"></div>
			<div style="clear:both;"></div>
		</div>
		<iframe id="previewTemplateFrame" ></iframe>
	</div>
</div>
</body>
</html>
