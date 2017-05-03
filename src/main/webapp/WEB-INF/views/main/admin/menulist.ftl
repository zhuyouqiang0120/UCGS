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
<title>UCGS-用户组管理</title>
<#include "../../common/head.ftl">
<script type="text/javascript" src="${basePath}/main/load/jsLoader?_param=
     mod/admin/icon"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/menu.js"></script>
<style type="text/css">
.menuPanel     				{min-height:200px;width:auto !important;display: inline-block;}
.menuPanel .menuItem		{height:28px;line-height:28px;vertical-align:middle;position:relative;border:1px solid #F5F5F5;}
.menuPanel .menuItem:hover,.menuItemFocus	{border:1px solid #d6972a;background:#3CA5F2;color:#fff;width:100%;}
.menuPanel .menuItem span	{height:28px;border:2px solid #99C1CC;}
.topPanel 					{border:1px solid #ccc;height:40%;}
.centerPanel 				{border:1px solid #ccc;height:35%;padding-top:5%;}
#tabItem 					{height:30%;}
#btnItem 					{height:70%;overflow-x:auto;}
.btnItems 					{width:100px;display:inline-block;height:45px;padding-top:10px;vertical-align:middle;text-align:center;text-align: center;border: 1px solid #ccc;
							cursor:pointer;}
.btnItems:hover,.btnItemFocus{border:1px solid #f09;}
.addBtn 					{display:inline-block;min-width:200px;width:auto !important;height:75px;}
</style>
</head>
<body >
<div id="mainPanel" class="mainBox">
	<div id="topPanel">
		<div class="mainHead">
			<div class="buttonBox" >
				<input type="button" class="button green" onclick="AdminMenu.addGroup(1)"  value="新建菜单"/>
				<input type="button" class="button green" onclick="AdminMenu.addGroup(2,this)"  value="编   辑"/>
				<input type="button" class="button red" onclick="AdminMenu.del()"  value="删   除" />
				<input type="button" class="button blue" onclick="AdminMenu.moveMenu(1)"  value="上移" />
				<input type="button" class="button blue" onclick="AdminMenu.moveMenu(0)"  value="下移" />
				<input type="button" class="button blue" onclick="AdminMenu.menuAbel(1)"  value="启用√" />
				<input type="button" class="button blue" onclick="AdminMenu.menuAbel(0)"  value="禁用×" />
			</div>
	   </div>	
	<div id="leftPanel">   
		<div class="menuPanel"></div>
	</div>
	<div id="rightPanel">
		<div class="topPanel">
			<div id="tabItem">
				<br>
				<ul class="buttonTabBox" style="height:61px;">
					<li>
						<input type="radio" id="tabBtn100" name="tabsffff" checked/><label for="tabBtn100">常规</label>
						<div id="tab-content100" class="tabItems">
							输入Tab名称：<input id="_addTabName" type="text" class="inputText" /><input onclick="CtrlTools.addTab()" type="button" class="button blue" value="添加Tab选项卡"/>
						</div>
					 </li>	
				</ul>
			</div>
			<br>
			<div id="btnItem">
				<div class="btnItems"><input type="button" class="button blue" value="测试" /></div>
				<div class="btnItems"><input type="button" class="button green" value="测试" /></div>
				<div class="btnItems"><input type="button" class="button red" value="测试" /></div>
				<div class="btnItems"><input type="button" class="button gray" value="测试" /></div>
				<Br>
				<div class="addBtn">
					名称：<input id="_btnName" type="text" class="inputText"  style="width:100px;"/>
					ID：<input id="_btnId" type="text" class="inputText"  style="width:100px;"/>
					方法：<input id="_btnMethod" type="text" class="inputText"  style="width:100px;"/>
					<input type="button" class="button blue" onclick="CtrlTools.addBtn()" value="添加按钮" />
					自定义Html:<textarea id="_btnHtml" class="inputText" style="position:relative;top:18px;width:180px;" ></textarea>
					<input type="button" onclick="CtrlTools.addHtml()" class="button blue" value="添加Html" />
				</div>
			</div>
		</div>
		<br>
		<p>
		<input type="button" class="button blue" onclick="CtrlTools.state(1)" value="设置使用" />
		<input type="button" class="button blue" onclick="CtrlTools.state(0)" value="设置禁用" />
		<input type="button" class="button blue" onclick="CtrlTools.update(2)" value="更新按钮名称" />
		<input type="button" class="button blue" onclick="CtrlTools.update(1)" value="更新组名称" />
		<input type="button" class="button red" onclick="CtrlTools.del(2)" value="删除按钮" />
		<input type="button" class="button red" onclick="CtrlTools.del(1)" value="删除组" />
		</p>
		<br>
		<div class="centerPanel"></div>
	</div>	
</div>
</body>
</html>