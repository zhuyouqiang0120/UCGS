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
<title>UCGS-用户组管理</title>
<#include "../../common/head.ftl">
<link rel="stylesheet" type="text/css" href="${basePath}/res/plugs/lib/jqeasy/themes/default/easyui.css"/>
<link rel="stylesheet" type="text/css" href="${basePath }/res/plugs/lib/jqeasy/themes/icon.css"/>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/area.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/group.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/admin/menuDialog.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/site/siteDialog.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jqeasy/jquery.easyui.min.js" ></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/formatTreeData.js" ></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/admin/dimensionFormatData.js"></script>
<script text="javascript/text" src="${basePath}/res/plugs/mod/admin/dimensionPub.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/column/colist.js" ></script>
<style type="text/css">
#dragRight 						{overflow:hidden !important;}
</style>
<script type="text/javascript">
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
		         {id : 'dragCenter',width : '15' },
		         {id : 'dragRight',width : '70'}
		        ]
	});

	Area.list('arealistPanel',[],function(){
	},true);


	PubDimension.list('udimensionTree',function(node){
		AdminGroup.dimensionGuid = node.guid;
		AdminGroup.load('rolePanel');
		AdminGroup.loadUser('userlistPanel');
		AdminGroup.currRole = null;
	});
	
	$('.roleItem').live('click',function(){
		$("div[class='roleItem roleItemFocus']").removeClass('roleItemFocus');
		$(this).addClass('roleItemFocus');
		AdminGroup.currRole = $(this);
		
		if(AdminGroup.tabCurrIndex == 0) PermissionLoad.menu();
		else if(AdminGroup.tabCurrIndex == 1)	PermissionLoad.site();
		else if(AdminGroup.tabCurrIndex == 2) PermissionLoad.column();
		else if(AdminGroup.tabCurrIndex == 3) PermissionLoad.hadArea();
		
		if(AdminGroup.tabCurrIndex == 1) AdminGroup.comSet.site();
	});
	
	AdminGroup.comSet.menu();
	
	Chasonx.Tips.Move({id:'_tipsPanel1',text:'<br>可分别对“角色”和“账户”设置菜单权限，若同时设置了权限则系统优先查询并使用“账户”的菜单权限',height:130});
	Chasonx.Tips.Move({id:'_tipsPanel2',text:'<br>若当前登录账户为<b>管理员</b>角色，并且该管理员设置了<b>区域</b>权限，则站点列表为该管理员所有可操作区域下的站点列表，并包括单独设置站点权限的所有站点;\
											 不设置权限则查询可操作区域下的所有站点',height:175});
	Chasonx.Tips.Move({id:'_tipsPanel3',text:'<br>可为每个可操作的站点设置可操作的栏目列表，若不设置则默认查询该站点下的所有栏目列表',height:130});
	Chasonx.Tips.Move({id:'_tipsPanel4',text:'<br>区域权限设置类似站点栏目权限设置',height:100});
	
};
</script>
</head>
<body >
<div id="mainPanel">
	<div id="leftPanel"></div>
	<div id="rightPanel" >
		<div id="dragLeft">
			<p class="areaListTitle">组织架构</p>
			<!-- <div class="areaPanel" id="areaPanel"></div> -->
			<div style="overflow:auto;">
		   	 	<ul id="udimensionTree" class="easyui-tree" data-options="animate:true"></ul>
		   	</div>	
		</div>
		<div id="dragCenter">
			<P class="areaListTitle"><b>角色列表</b>
				<input type="button" class="button blue" onclick="AdminGroup.addGroup(1)" style="width:50px;height:20px;font-size:12px;" value="新建"/>
				<input type="button" class="button green" onclick="AdminGroup.addGroup(2)"  style="width:50px;height:20px;font-size:12px;" value="编辑"/>
				<input type="button" class="button red" onclick="AdminGroup.delGroup()"  style="width:50px;height:20px;font-size:12px;" value="删 除" />
			</p>
			<div id="rolePanel" class="areaPanel" style="height:40%;"></div>
			<P  class="areaListTitle"><b>账户列表</b></p>
			<div id="userlistPanel" class="areaPanel" style="height:54%;"></div>
		</div>
		<div id="dragRight">
			<ul  class="roleTabBox">
				<li class="roleTabBoxLi">
					<input type="radio" id="tabBtn1" name="permission" checked/><label id="_tipsPanel1" for="tabBtn1" onclick="menuSetting()" >菜单权限</label>
					<div id="tab-content1" class="roleTabPanel" >
						<div class="_roleBtnPanel">
							<input type="button" class="button blue" onclick="AdminGroup.comSet.saveMenu(1)" style="width:60px;height:25px;font-size:12px;" value="保存权限"/>
							<input type="button" class="button red" onclick="AdminGroup.comSet.saveMenu(2)" style="width:60px;height:25px;font-size:12px;" value="解除权限"/>
						</div>
						<div id="roleMenuPanel"></div>
					</div>
				</li>
				<li class="roleTabBoxLi">
					<input type="radio" id="tabBtn2" name="permission" /><label id="_tipsPanel2" for="tabBtn2" onclick="siteSetting()">网站权限</label>
					<div id="tab-content2" class="roleTabPanel">
						<div class="_roleBtnPanel">
							<input type="button" class="button blue" onclick="AdminGroup.comSet.saveSite(1)" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" value="保存权限"/>
							<input type="button" class="button red" onclick="AdminGroup.comSet.saveSite(2)" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" value="解除权限"/>
						</div>
						<div id="roleSitePanel" class="roleSitePanel">选择区域->角色 查看可操作网站</div>
					</div>
				</li>
				<li class="roleTabBoxLi">
					<input type="radio" id="tabBtn3" name="permission" /><label id="_tipsPanel3" for="tabBtn3" onclick="columnSetting()">栏目权限</label>
					<div id="tab-content3" class="roleTabPanel">
						<div class="_roleBtnPanel"> 
							<input type="button" class="button blue" onclick="AdminGroup.comSet.saveCol(1)" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" value="保存权限"/>
							<input type="button" class="button red" onclick="AdminGroup.comSet.saveCol(2)" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" value="解除权限"/>
						</div>
						<div class="colMainLeft" style="width:35%;top:35px;">
							<div>网站列表:<select id="hasSiteList" class="inputText select"></select></div>
							<div>栏目列表：</div>
							<div class="colMainBox" style="top:55px;">
								<ul id="columnTree" class="easyui-tree" data-options="animate:true,checkbox:true"></ul>
							</div>
						</div>
						<div class="colMainLeft" style="width:35%;left:35%;top:35px;">
							<div><br>可操作栏目列表：<br></div>
							<div class="colMainBox"  style="top:55px;">
								<ul id="hasRoleColumnTree" class="easyui-tree" data-options="animate:true"></ul>
							</div>
						</div>
					</div>
				</li>
				<li class="roleTabBoxLi">
					<input type="radio" id="tabBtn4" name="permission" /><label id="_tipsPanel4" for="tabBtn4" onclick="areaSetting()">区域权限</label>
					<div id="tab-content4" class="roleTabPanel">
						<div class="_roleBtnPanel"> 
							<input type="button" class="button blue" onclick="AdminGroup.areaSet.saveArea(1)" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" value="保存权限"/>
							<input type="button" class="button red" onclick="AdminGroup.areaSet.saveArea(2)" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" value="解除权限"/>
						</div>
						<div class="colMainLeft" style="width:35%;top:35px;">
							<div>区域列表：<input type="checkbox" style="position:relative;top:2px;" onclick="Area.checkAll(this.checked)"/> 全选</div>
							<div id="arealistPanel" style="top:55px;">
							</div>
						</div>
						<div class="colMainLeft" style="width:35%;left:35%;top:35px;">
							<div>可操区域目列表：</div>
							<div id="hadAreaListPanel" class="colMainBox" style="top:18px;">
							</div>
						</div>
					</div>
				</li>
			</ul>	
		</div>
	</div>
</div>
</body>
</html>