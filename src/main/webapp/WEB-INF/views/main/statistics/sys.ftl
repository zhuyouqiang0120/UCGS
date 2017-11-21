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
<title>系统概览</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/lib/echarts.js"></script>
<script type="text/javascript" src="${basePath}/main/load/jsLoader?_param=
     mod/statistics/system,mod/statistics/sys"></script>
     
<style type="text/css">
.sCheckbox		{ display: inline-block; width: 80px; height: 20px;background: #dddddd; position: relative;box-shadow: 0px 0px 5px #939090;
   				  top: 5px; overflow: hidden; padding: 1px;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;}
.sCheckbox label{ display: inline-block;   width: 100%; height: 20px;  text-align: right;  vertical-align: middle; line-height: 20px; position: relative; top: -6px;border-radius:10px;overflow:hidden;}
.sCheckbox label i{display: inline-block; width: 20px; height: 20px; background: #e7eceb; border-radius: 10px;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;
				  position:absolute;left : 0px;top:0px; box-shadow: 0px 0px 4px #504e4e;}
.sCheckbox label em{display:inline-block;background: #3eb842; height: 20px; width: 0%;transition:.5s;-moz-transition:.5s;-webkit-transition:.5s;position:absolute;left:0px;top:0px;border-radius:10px;
					box-shadow: 0px 0px 10px #0e6b19 inset;}				  
.sCheckbox input{position:absolute;display:none;}
.sCheckbox input[type="checkbox"]:checked + label i{left : 60px; }
.sCheckbox input[type="checkbox"]:checked + label em{width : 100%; }
</style>
</head>
<body>
<div id="statisticsMain">
	<div id="statisticsLeft">
		<div class="statisticsMenuItem"><span class="icon-desktop_windows"></span> 概览 </div>
		<div class="statisticsMenuItem"><span class="icon-multiline_chart"></span> CUP</div>
		<div class="statisticsMenuItem"><span class="icon-sim_card_alert"></span> 内存</div>
		<div class="statisticsMenuItem"><span class="icon-developer_board"></span> 交换区</div>
		<div class="statisticsMenuItem"><span class="icon-dvr"></span> 进程</div>
	</div>
	<div id="statisticsRight">
		<div class="statisticsShadowPanel"></div>
		<div class="statisticsChartsPanel">
			<div class="items" >
				<div class="title"># 服务器信息概览( <span title="开启自动刷新" class="sCheckbox"><input type="checkbox" id="autoRefresh"/><label for="autoRefresh"><em></em><i></i></label></span>  刷新间隔 1s)：</div>
				<div class="statistics" id="serverOverview" style="height:500px;width:80%;margin:0px auto;">访问情况</div>
			</div>
			<div class="items" >
				<div class="title"># CPU</div>
				<div class="statistics cpuDetail" id="cpuDetail"> </div>
				<div class="statistics" id="cpuStatisitcs" style="height:400px;"></div>
			</div>
			<div class="items" >
				<div class="title"># 内存</div>
				<div class="statistics cpuDetail" id="memDetail"> </div>
				<div class="statistics" id="memStatisitcs" style="height:400px;"></div>
			</div>
			<div class="items" >
				<div class="title"># 交换区</div>
				<div class="statistics cpuDetail" id="swapDetail"> </div>
				<div class="statistics" id="swapStatisitcs" style="height:400px;"></div>
			</div>
			<div class="items" >
				<div class="title"># 进程</div>
				<div class="statistics cpuDetail" id="taskDetail"> </div>
			</div>
			<br>
		</div>	
	</div>
</div>
</body>
</html>