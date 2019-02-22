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
<title>UCGS 登录  ${ucmsVersion}</title>
<#include "common/head.ftl">
<style type="text/css">
body  {
			moz-user-select: -moz-none;
			-moz-user-select: none;
			-o-user-select:none;
			-khtml-user-select:none;
			-webkit-user-select:none;
			-ms-user-select:none;
			user-select:none;
			background-repeat:no-repeat;
			background-size:cover;
			}
#returnmess {
	display:inline-block;
    height: 30px;
    top: 75%;
    position:absolute;
    left:0px;
    width:100%;
}

</style>
<script type="text/javascript" src="${basePath}/res/plugs/lib/jquery.md5.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/lib/canvas-particle.js"></script>
<script type="text/javascript" src="${basePath}/res/plugs/mod/login/index.js"></script>
</head>
<body class="global_bg_c">
<div class="ucgs_loginPanel" >
	<div class="logBox logBoxShake">
		<div class="logTop"><i></i></div>
		<div class="logInputBox">
						<input id="loginname" name="logname" type="text" class="inputText loginInput loginInputTop" placeholder="请输入用户名"/>
						<input id="loginpwd" name="logpwd" type="password" class="inputText loginInput loginInputCen" placeholder="请输入密码"/>
						<input id="captcha" name="captcha" type="text" class="inputText loginInputCap" maxlength="4" placeholder="请输入验证码"/>
						<img class="captcha" src="" align="middle" title="点击刷新"/>
						<span onclick="login()" type="button" class="loginInputSubmit"  >登 录</span>
		</div>
		<div class="logFoot" ><span class="remem"><input type="checkbox" id="remember" name="remember"/><label for="remember">记住我的登录帐号</label></span>
		<span  id="returnmess"></span></div>
	</div>
</div>

</body>
</html>
<script  type="text/javascript" >
$(document).ready(function(){
	if(window.parent.document.getElementById('ucgs_main_panel') != null){
		window.parent.location.href = DefConfig.Root;
	}

	var skin_type =  ChasonTools.getCookie("UCGS_DEF_SKIN_TYPE");
	var srcs = '';
	if(!isBlankString(skin_type)) skin_type = 'dark';
	
	if(skin_type == 'dark'){
		 srcs = 'getCaptcha?type=1';
	}else if(skin_type == 'lightblue'){
		 srcs = 'getCaptcha?type=2';
		 $('body').css('background-color','#3A5898');
	}else if(skin_type == 'frostedGlass'){
		 srcs = 'getCaptcha?type=3';
	}
	
	$(".captcha").attr('src',srcs).bind('click',function(){
		this.src = srcs + '&r=' + Math.random();
	});
	
	var config = {
				vx: 4,
				vy:  4,
				height: 2,
				width: 2,
				count: 100,
				color: "79, 247, 233",
				stroke: "100,200,180",
				dist: 6000,
				e_dist: 20000,
				max_conn: 10
			}
	CanvasParticle(config);
});
</script>