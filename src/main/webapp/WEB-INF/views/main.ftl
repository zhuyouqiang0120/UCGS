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
<meta name="author" content="chasonx">
<title>欢迎使用UCGS统一内容生产软件 </title>
<#include "common/head.ftl">
<script type="text/javascript" src="${basePath}/res/plugs/mod/main/main.js"></script>
</head>
<body >
<div id="ucgs_progress"></div>
<div id="ucgs_main_panel">
	<div id="ucgs_main_top">
		<span class="ucgslogo"  title="统一内容生产系统"></span>
		<ul id="ucgs_main_setting">
			<li id="ucgs_main_btn_changeskin"><i class="icon-palette" ></i> 换肤</li>
			<li onclick="UCGS.updpwd()"><i class="icon-lock_outline" ></i>修改密码</li>
			<li id="ucgs_main_btn_setting"><i class="icon-cog" ></i> 设置</li>
			<li onclick="window.location.href = '${basePath}/logout';"><i class="icon-exit" ></i> 退出系统</li>
		</ul>
		<div id="ucgs_main_upanel">
			<div id="ucgs_main_userinfo">欢迎回来：${(LOGINUSER.username)!}</div>
			<div id="ucgs_main_btnbox">
				<span id="ucgs_btn_reflash"><i class="icon-spinner9"></i>刷新</span>
				<span id="ucgs_btn_message"><i class="icon-notifications_active"></i>消息</span>
				<span id="ucgs_btn_todo"><i class="icon-assignment_turned_in" ></i>任务</span>
			</div>
		</div>
		<div id="ucgs_main_desc">上次登录时间：${(LOGINUSER.lastLoginTime)!}<b>|</b>登录总次数：${(LOGINUSER.logcount)!}<b>|</b>当前在线人数：${(OnlineSize)!}<b>|</b>您的请求IP：${(ReqeustAddr)!}</div>
	</div>
	<div id="ucgs_main_left">
		<div class="ucgs_index">首&nbsp;&nbsp;&nbsp;页</div>
		<div class="ucgs_menu_items"></div>
	</div>
	<div id="ucgs_main_right"><iframe id="ucgs_view_panel_0" src="main/desc" style="border:0px;" width="100%" height="100%" ></iframe></div>
	<div id="ucgs_main_bottom">Copyright© 2014-${(DateYear)!} Zensvision Information Technology Co., Ltd.  All Rights Reserved.</div>
</div>
</body>
</html>

