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
<title>UCGS2.0统一内容管理系统 ZensVison </title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript">
   window.onload = function(){
   		Loader.js('mod.files.Upload',true,null,{"fileType":"*.jpg;*.png;*.gif;","url" : DefConfig.Root + "/main/resource/upload"});
   			
   		Chasonx.Frameset({
			main   : 'mainPanel',
			window : {
				left : {id : 'leftPanel',width : '0%',bgColor:false,border:false},
				right: {id : 'rightPanel',bgColor:false,border:false}
			}
		});
		
		Chasonx.DragBox({
			target : 'rightPanel',
			lineColor : '#ADADAD',
			items : [
			         {id : 'dragLeft',width : '15' },
			         {id : 'dragRight',width : '85' }
			        ]
		});
		
		_siteList();
		Area.list('areaList',[],function(){
		 _siteList(Area.currArea.fguid);
	});
};

function _siteList(areaguid){
	Chasonx.Wait.Show();
	getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':100,'del':0,'areaguid':areaguid},function(d){
		var op = '<option value="">---选择网站---</option>';
		$.each(d.list,function(i,u){
			op += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
		});
		$("#fileSite").html(op);
		Chasonx.Wait.Hide();
	});
}

</script>
</head>
<body >
<div id="mainPanel">
	<div id="leftPanel">
	</div>
	<div id="rightPanel">
		<div class="colMainLeft" id="dragLeft">
			<p class="areaListTitle"><b>区域列表</b></p>
			<div  id="areaList"></div>
		</div>
		<div id="dragRight">
			<div class="swfuploadPanel">
				<span id="swfUploadButton">上传控件</span><input type="button" class="button blue" value="开始上传" onclick="startSwfUpload()"/>
				<input type="button" class="button red" value="取消上传" onclick="stopSwfUpload()"/>（文件大小不超过3MB，支持格式：PNG,GIF,JPG）
				<div class="setting">
					<p><label>资源类型：</label><select id="ftype" class="inputText select"><option value="0">主题资源</option><option value="1">模版资源</option></select></p>
					<p><label>所属网站：</label><select id="fileSite" class="inputText select"></select></p>
					<p><label>资源描述：</label><textarea id="fremark" class="inputText" maxlength="50"></textarea></p>
					<p><label>文件名称：</label><input type="checkbox" id="_newfilename"/>使用原文件名 <font size="2" color="red">(使用原文件名可能会覆盖相同文件名的文件)</font></p><Br>
				</div>
				<div class="fileStats">待上传文件:<font>0</font>   上传成功:<font>0</font>   上传失败:<font>0</font><span id="uploadErrMsg"></span></div>
				<div class="fileAttr"><span>文件名</span><span>文件大小</span><span>更新时间</span><span>备注</span><span>上传进度</span></div>
				<div id="filePanel" class="filePanel"></div>
			</div>
		</div>	
	</div>
</div>
</body>
</html>
