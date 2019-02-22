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
<title>UCGS 栏目管理</title>
<#include "../../common/head.ftl">
<link rel="stylesheet" type="text/css" href="${basePath}/res/plugs/lib/jqeasy/themes/default/easyui.css"/>
<link rel="stylesheet" type="text/css" href="${basePath }/res/plugs/lib/jqeasy/themes/icon.css"/>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jqeasy/jquery.easyui.min.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/datepicker/WdatePicker.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/formatTreeData.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/scolumn.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/colist.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/files/list.js" ></script>

<style type="text/css">
.ke-icon-imgsource { background-image: url(${basePath}/res/js/ke/themes/default/default.png); background-position: 0px -1232px; width: 16px; height: 16px;}
.gennerBth 		   {width:50px;height:32px;border:1px solid #ccc;float:right;position:relative;top:8px;background:#f6f6f6;border-radius: 3px;-webkit-border-radius: 3px;-moz-border-radius: 3px;
					cursor:pointer;text-align:center;z-index:300;}
.gennerBth:hover   {background:#e0dede;}
.btnItemBox  	   {display:none;background:#f6f6f6;width:150px;height:auto !important;min-height:30px;border:1px solid #ccc;float:right;position:absolute;z-index:260;border-radius: 3px;-webkit-border-radius: 3px;-moz-border-radius: 3px;}
.btnItemBox .item  {height:30px;vertical-align:middle;line-height:30px;text-align:center;cursor:pointer;color:#808080;}
.btnItemBox .item:hover {background:#e5e3e3;}
</style>
</head>
<body >
<div id="mainPanel">
	<div id="topPanel">
		<@PermisstionBtnHtml />
	</div>
	<div id="leftPanel"></div>
	<div id="rightPanel">
		<div id="dragLeft">
			<p class="areaListTitle"><b>区域列表</b></p>
			<div id="colAreaPanel" class="colMainBox" >
			</div>
		</div>
		<div id="dragCenter">
			<div  class="colMainLeft" style="width:99%;left:0px;right:0px;top:0px;bottom:0px;">
				<div>选择网站：<select id="siteItems" class="inputText select" onchange="Serv.load(this)"></select></div>
				<div>栏目列表：</div>
				<div>
					<ul id="columnTree" class="easyui-tree" data-options="animate:true,dnd:true"></ul>
				</div>
			</div>
		</div>
		<div id="dragRight">
		<div  class="colMainRight" style="width:100%;left:0px;right:0px;top:0px;bottom:0px;">
			<ul class="buttonTabBox" >
				<li ><input type="radio" id="tabBtn2200" name="tabBtn2200" checked /><label style="padding: 5px 10px; font-size: 16px;" for="tabBtn2200">基本信息</label>
				<div id="tab-content2200" class="tabItems">
		
					<table class="tableTemp" width="100%" height="100%" cellpadding="0" cellspacing="0" id="columnPanel">
						<tr>
							<td width="20%" class="tdTitle">&nbsp;</td>
							<td id="relationMess"></td>
						</tr>
						<tr>
							<td class="tdTitle">栏目标识：</td>
							<td><input type="text" id="fguid" class="inputText textReadyOnly" readonly="readonly"/>
								<input type="hidden" id="fid" />
							</td>
						</tr>
						<tr>
							<td class="tdTitle">栏目级数：</td>
							<td><input type="text" id="fclevel" class="inputText textReadyOnly" readonly="readonly"/></td>
						</tr>
						<tr>
							<td class="tdTitle">父ID：</td>
							<td><input type="text" id="fcpid" class="inputText textReadyOnly" readonly="readonly"/></td>
						</tr>
						<tr>
							<td class="tdTitle">栏目名称：</td>
							<td><input type="text" id="fcname" class="inputText" maxlength="25" /></td>
						</tr>
						<tr>
							<td class="tdTitle">图标：</td>
							<td>
								<input type="text" class="inputText textBrowse" id="ficon" style="width:50%;" cdata="" maxlength="150" />
								<input type="button" class="button browse"  value="浏览" onclick="Serv.icon.show()"/>
								<input type="button" class="button browseCancel" value="撤销" onclick="Serv.icon.cancel()"/>
							</td>
						</tr>
						<tr>
							<td class="tdTitle">&nbsp;</td>
							<td><img id="ficonImg" src="${basePath}/res/skin/images/prewimg.png" def="${basePath}/res/skin/images/prewimg.png" width="100" height="100"/></td>
						</tr>
						<#-- <tr>
							<td class="tdTitle">栏目类型：</td>
							<td>
								<select id="columnType" class="inputText select">
									<option value="Column">常规</option>
									<option value="Image">图片</option>
									<option value="Link">超链接</option>
								</select>
							</td>
						</tr> -->
						<tr class="colType Link" >
							<td class="tdTitle">输入链接地址：</td>
							<td><input id="LinkText" type="text" class="inputText" /></td>
						</tr>
						<tr style="height:12px;"><td colspan="2"><hr class="ucgs_column_hr"></td></tr>
						<tr class="colType Image">
							<td class="tdTitle">绑定图片：</td>
							<td><input type="text" class="inputText textBrowse" id="bindImage" style="width:50%;" cdata=""  />
								<input type="button" class="button browse"  value="浏览" onclick="Serv.image.show()"/><input type="button" class="button browseOk"  value="确定" onclick="Serv.image.ok()"/><br>
								<input id="imageLink" type="text" class="inputText" placeholder="链接地址"/>
							</td>
						</tr>
						<tr class="colType Image">
							<td class="tdTitle">&nbsp;</td>
							<td><p>图片列表:</p>
								<div id="bindImagePanel"></div>
							</td>
						</tr>
						<tr style="height:12px;"><td colspan="2"><hr class="ucgs_column_hr"></td></tr>
						<tr>
							<td class="tdTitle">(可添加多条)短语：</td>
							<td>
								<input id="shortMess" type="text" class="inputText" /><input id="addShortMess" type="button" value="+" class="button blue btnround" style="width:25px !important;height:25px !important;"/><Br>
							</td>
						</tr>
						<tr>
							<td class="tdTitle">&nbsp;</td>
							<td>
								<p>短语列表:</p>
								<div id="columnMess"></div>
							</td>
						</tr>
						<tr style="height:12px;"><td colspan="2"><hr class="ucgs_column_hr"></td></tr>
					<#--	<tr>
							<td class="tdTitle">广告策略：</td>
							<td><select id="fadtactics" class="inputText select">
									<option value="0">不确定</option>
									<option value="10">标准流程服务</option>
									<option value="20">非标准流程服务</option>
									<option value="30">完全线下服务</option>
							</select></td>
						</tr> -->
						<tr>
							<td class="tdTitle">状态：</td>
							<td><select id="fstate" class="inputText select"><option value="1">发布</option><option value="0">冻结</option></select></td>
						</tr>
						<tr>
							<td class="tdTitle">备注：</td>
							<td><textarea id="fremark" class="inputText"></textarea></td>
						</tr>
					</table>
				 </div>
				</li>
				
				<li ><input type="radio" id="tabBtn2300" name="tabBtn2200" /><label style="padding: 5px 10px;font-size: 16px;" for="tabBtn2300">扩展数据</label>
					<div id="tab-content2300" class="tabItems">
					   <table class="tableTemp" width="100%" height="100%" cellpadding="0" cellspacing="0" >
						   <tr>
								<td width="20%" class="tdTitle">参数集合：</td>
								<td><div id="uparaMaps"></div></td>
							</tr>
							<tr style="height:48%">
								<td class="tdTitle">&nbsp;</td><td></td>
							</tr>
					   </table>
					</div>
				</li>
			</ul>
		</div>
		</div>
		<div style="clear:both;"></div>
	</div>
</div>	
</body>
</html>