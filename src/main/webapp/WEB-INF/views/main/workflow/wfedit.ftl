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
<title>UCMS 工作流编辑</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/fw/chasonx.workflow.js"></script>
<style type="text/css">
body 			{background:#f6f6f6;}
.wfcenter  		{width:1000px;height:800px;border:2px solid #ddd;margin:0px auto;margin-top:8px;background-color:#fff;display: grid;
				background-image:url('${basePath}/res/skin/images/grid_line.png');box-shadow:0px 0px 5px #000;}
.wfcenter canvas{width:700px;height:800px;border:1px solid #ccc;position: relative;float:left;}
.wfcenter .attrPanel{width:298px;height:800px;background:#E6E5E5;float:left;}
.wfcenter .attrPanel p{margin:5px 0px 5px 0px;}
.wfcenter .attrPanel p label{display:inline-block;width:90px;text-align:right;}
</style>
<script type="text/javascript">
    window.onload = function(){
        Chasonx.WorkFlow.init('workflowCanvas');
      };
</script>
</head>
<body >
<div class="mainBox" style="width:100%;height:10%;">
	<div class="buttonBox">
		<@PermisstionBtnHtml />
	</div>
	<div class="wfcenter">
		<canvas id="workflowCanvas" width="700" height="800"></canvas>
		<div class="attrPanel">
			<p>属性面板</p>
			<p><label>流程名称：</label><input type="text" class="inputText" /></p>
			<p><label>流程类型：</label><select  class="inputText select" ></select></p>
			<p><hr></p>
		    <p><label>节点类型：</label><input id="wf_type" type="text" class="inputText textReadyOnly" readonly="readonly" /></p>
		    <p><label>节点名称：</label><input id="wf_name" type="text" class="inputText" onblur="Chasonx.WorkFlow.updateItem()"/></p>
		    <p><label>设置操作人：</label></p>
		    <p><label>X坐标：</label><input id="wf_x" type="text" class="inputText textReadyOnly" readonly="readonly"/></p>
		    <p><label>Y坐标：</label><input id="wf_y" type="text" class="inputText textReadyOnly" readonly="readonly"/></p>
		    <p><label>大小：</label><input id="wf_size" type="text" class="inputText textReadyOnly" readonly="readonly"/></p>
		    <p><label>描述：</label><textarea id="wf_remark" cols="15" class="inputText" rows="5"></textarea></p>
		</div>
	</div>	
</div>
</body>
</html>