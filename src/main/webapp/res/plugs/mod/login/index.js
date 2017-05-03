;(function(window){
	
	function validate(){
		var uname = $("#loginname").val(),upwd = $("#loginpwd").val(),captcha = $("#captcha").val();
		if(uname.trim() == '' || upwd.trim() == '' || captcha.trim() == ''){
			Chasonx.Hint.Faild('登录信息不能为空');
			return false;
		}
		return true;
	}
	
	function login(){
		if(validate()){
			rememberMe($("#loginname").val());
			var _PWD = $.md5($("#loginpwd").val());
			Chasonx.Wait.Show('正在努力登录中...');
			$.ajax({
				url:'userlogin',
				type:'post',
				dataType:'json',
				data:{'logname':$("#loginname").val(),'logpwd':_PWD,'captcha':$("#captcha").val()},
				success:function(d){
					if(~~d.result === 0){
						$("#returnmess").html('<span class="badge badge_del">&nbsp;'+ d.mess +'&nbsp;</span>');
					}else{
						window.location.href = "main";
					}
					Chasonx.Wait.Hide();
				},
				error:function(e){
					Chasonx.Hint.Faild(e.responseText);
					Chasonx.Wait.Hide();
				}
			});
		}
	}
	
	function rememberMe(uname){
		if($("#remember").attr('checked') == 'checked'){
			ChasonTools.setCookie('ucms_admin_user',uname);
			//ChasonTools.setCookie('ucms_admin_bgidx',DEFBGIDX);
		}
	}
	
	window.onload = function(){
		browserCheck();
		var logname = ChasonTools.getCookie('ucms_admin_user');
		if(logname != null) $("#loginname").val(logname);
	};
	
	window.login = login;
	
	window.onkeydown = function(e){
		e = e || window.event;
		if(e.keyCode == 13){
			login();
		}
	};
	
	function browserCheck(){
		var bs = ChasonTools.isBrowser();
		
		var v = navigator.userAgent.toLowerCase().match(/msie [\d.]+/gi);
		if(bs == 'IE' && parseInt((v + "").replace('msie','')) < 10){
			alert('当前浏览器版本过低，版本：'+ v +'。\n建议使用更高版本或其他浏览器，以免影响使用。\n谢谢。\n(推荐Chrome等以webkit为内核的浏览器)');
		}
	}
	
})(window);

$(document).ready(function(){
	$(".imgPanel > .arrow").click(function(){
		if($(".imgPanel").width() > 0){
			$(".imgPanel").animate({width:'0px'},'fast');
			$(this).removeClass('arrowLeft');
			$(".imgbgBox > img ").hide();
		}else{
			$(".imgPanel").animate({width:'120px'},'fast');
			$(this).addClass('arrowLeft');
			$(".imgbgBox > img ").show();
		}
	});
	
	$(".imgbgBox > img").live('click',function(){
		setBackGround($(this).index());
	});
});

