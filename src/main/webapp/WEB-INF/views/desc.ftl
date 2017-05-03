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
<title>系统描述</title>
<#include "common/head.ftl">
<script type="text/javascript">
var Desc ={
		 desc : function(){
			  getAjaxData(DefConfig.Root + '/res/desc/list.json',null,function(d){
					 var html = '';
					 $.each(d,function(i,u){
						 html += '<div class="item" src="'+ u.src +'" size="'+ u.size +'">' + u.title +'</div>';
					 });
					 $("#descList").html(html);
			  });
			  
			  $("#descList > div").live('click',function(){
				  Desc.show($(this).attr('src'),$(this).html(),$(this).attr('size'));
			  });
			  return this;
		  },
		  show : function(src,title,size){
			  if(src == '') return;
			  var _w = 500,_h = 400;
			  if(size > 0){
				  var _ss = ChasonTools.getWindowSize();
				  _w = _ss[2]*0.6;
				  _h = _ss[3]*0.6;
			  }
			  $.ajax({
				 url :  DefConfig.Root + '/res/desc/' + src,
				 type:'get',
				 dataType : 'text',
				 success : function(d){
					 new Chasonx({
						  title : title,
						  html : d,
						  width:_w,height:_h,
						  modal : true
					  });
				 },
				 error : function(e){
				 }
			  });
		  },
		  downloadHelp : function(obj){
			  window.open(DefConfig.Root + '/res/desc/' + obj.getAttribute('title'));
		  }
};

window.onload = function(){
	Desc.desc();
};
</script>
</head>
<body style="height:auto !important;">
<div class="myTodoList">
	<div class="leftP" >
		<font class="title">&nbsp;&nbsp;系统信息</font>
		<div class="listBox">
			<p><label>系统代码:</label><span>${(Systems.sysCode)!}<span></p>
			<p><label>系统名称:</label><span>${(Systems.sysName)!}</span></p>
			<p><label>版本:</label><span>${(Systems.sysVersion)!}</span></p>
			<p><label>机构:</label><span>${(Systems.sysComName)!}</span></p>
			<p><label>机构英文名:</label><span>${(Systems.sysComenName)!}</span></p>
			<p><label>网址:</label><span>${(Systems.sysComSite)!}</span></p>
		</div>
	</div>
	<div style="clear:both;"></div>
</div>
<div class="myTodoList">
	<div class="leftP" >
		<font class="title">&nbsp;&nbsp;软件信息</font>
		<div class="listBox">
			<p><label>操作系统:</label><span>${(Systems.os)!}<span></p>
			<p><label>JDK版本:</label><span>${(Systems.jdkv)!}</span></p>
			<p><label>WEB容器:</label><span>Tomcat</span></p>
			<p><label>数据库:</label><span>MariaDB</span></p>
			<p><label>文件编码:</label><span>UTF-8</span></p>
		</div>
	</div>
	<div style="clear:both;"></div>
</div>
<div class="myTodoList">
	<div class="leftP">
		<font class="title">&nbsp;&nbsp;操作指南</font>
		<div id="descList" class="listBox"></div>
	</div>
	<div style="clear:both;"></div>
</div>
</body>
</html>