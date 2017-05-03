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
<title>访问统计</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/lib/echarts.js"></script>
<script type="text/javascript" src="${basePath}/main/load/jsLoader?_param=
     mod/statistics/index"></script>
</head>
<body>
<div id="statisticsMain">
	<div id="statisticsTop"><@PermisstionBtnHtml /></div>
	<div id="statisticsLeft">
		<div class="statisticsMenuItem statisticsItemFocus"><span class="icon-stats-bars2"></span> 概览</div>
		<div class="statisticsMenuItem"><span class="icon-file-text"></span> 主题</div>
		<div class="statisticsMenuItem"><span class="icon-list-numbered"></span> 栏目</div>
		<div class="statisticsMenuItem"><span class="icon-sphere"></span> 站点</div>
		<div class="statisticsMenuItem"><span class="icon-embed2"></span> 接口</div>
	</div>
	<div id="statisticsRight" >
		<div class="statisticsChartsPanel">
			<div class="items">
				<div id="statisticsWeek" class="statistics" style="height:500px;"></div>
			</div>
			<div class="items">
				<div id="statisticsDevice" class="statistics" style="height:300px;width:50%;display:inline-block;"></div>
				<div id="statisticsOsName" class="statistics" style="height:300px;width:50%;display:inline-block;"></div>
			</div>
			<div class="items">
				<div id="statisticsBrowser" class="statistics" style="height:400px;"></div>
			</div>
		</div>
		<div class="statisticsChartsPanel">
			<div class="items">
				<div class="title">
					当前点击总量：<select id="topicListLimit" class="inputText select" onchange="STopic.list(this.value)"><option value="10">前10条</option>
					<option value="20">前20条</option><option value="30">前30条</option></select>
				</div><br>
				<div id="topicListPanel" class="topicListPanel"></div>
			</div>
			<div class="items">
				<div id="statisticsTopicData" class="statistics" style="height:600px;"></div>
			</div>
			<div class="items">
				<div class="statistics" id="topicAttr">访问情况</div>
				<div class="topicListPanel" id="topicTopList">访问量前10条文章</div>
				<div class="statistics" id="statisticsTopicDevice" style="height:300px;width:33%;display:inline-block;">设备分布图</div>
				<div class="statistics" id="statisticsTopicOSname" style="height:300px;width:33%;display:inline-block;">系统分布</div>
				<div class="statistics" id="statisticsTopicBrowser" style="height:300px;width:33%;display:inline-block;">浏览器分布</div>
				<div class="statistics" id="statisticsTopicTime" style="height:500px">时间段访问统计</div>
			</div>
		</div>
		<div class="statisticsChartsPanel">
			<div class="items">
				<div class="title">栏目访问前30统计结果(按访问量倒序排序)：</div>
				<div class="statistics" id="columnLimit" style="height:500px;"></div>
			</div>
			<div class="items">
				<div class="title">栏目访问详情：</div>
				<div class="statistics" id="columnDetails" style="height:500px;"></div>
			</div>
			<div class="items">
				<div class="topicListPanel" id="topicTopListForColumn">访问量前10条文章</div>
			</div>
			<br>
		</div>
		<div class="statisticsChartsPanel">
			<div class="items">
				<div class="title">站点访问统计</div>
				<div class="statistics" id="siteStatistics" style="height:500px;"></div>
			</div>
			<div class="items">
				<div class="title">站点访问详情：</div>
				<div class="statistics" id="siteDataDetails" style="height:500px;"></div>
			</div>
			<div class="items">
				<div class="topicListPanel" id="topicTopListForSite">访问量前10条文章</div>
			</div>
			<br>
		</div>
		<div class="statisticsChartsPanel">
			<div class="items">
				<div class="title">接口访问概览</div>
				<div class="statistics" id="interStatistics" style="height:500px;"></div>
			</div>
			<div class="items">
				<div class="title">接口访问详情：</div>
				<div class="statistics" id="interDataDetails" style="height:500px;"></div>
			</div>
			<div class="items">
				<div class="title">Caller列表：</div>
				<div class="topicListPanel" id="callerDataDetails" style="height:auto;"></div>
			</div>
			<br>
		</div>
	</div>
</div>
</body>
</html>