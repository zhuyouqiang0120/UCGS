;(function(window,$){
	var CURRENT_VIEW_PANEL_ID = "ucgs_view_panel_";
	var CURRENT_VIEW_PANEL_IDX = 0;
	var UCGS_Skin = {
		dark : {
			href : '/res/skin/css/m/dark.css',
			conf : {
				top : '#414042',left : '#6d6d6d',right:'#212121',bottom:'#808080',
				borderRightColor : '#505050',borderBottomColor : '#636262'
			}},
		lightblue : {
			href : '/res/skin/css/m/lightblue.css',
			conf : {
				top : '#3A5898',left : '#e0e0e0',right : '#f6f6f6',bottom : '#f1f1f1',
				borderRightColor : '#f6f6f6',borderBottomColor : '#e0e0e0'
		}},
		frostedGlass : {
			href : '/res/skin/css/m/frostedGlass.css',
			conf : {
				top : false,left : false,right : '#e2e0c8',bottom : false,
				borderRightColor : false,borderBottomColor : false
		}}
	};
	
	var UCGS = {
		  _menuData : null,
		  loadMenu : function(){
			  var _res = 0,line = '';
			  var ckChild = function(pid){
				  _res = 0;
				  $.each(UCGS._menuData,function(i,u){
					  if(u.fparentid == pid){
						  _res = 1;
						  return false;
					  }
				  });
				  return _res;
			  };
			  
			  var loopMenu = function(pid){
				  $.each(UCGS._menuData,function(i,u){
					  if(u.fparentid == pid){
						  if(ckChild(u.id) > 0){
							  line += '<div class="items" data="'+ u.id +'"><span class="ucgs_menugroup" style="margin-top:5px;"><i class="'+ (u.ficon || 'icon-menu') +'"></i> '+ u.fmenuname + '</span>';
							  line += '<div class="ucgs_menu_item'+ u.id +'">';
							  loopMenu(u.id);
							  line += '</div></div>';
						  }else{
							  line += '<p url="'+ u.fmenurl +'" id="'+ u.id +'"><i class="'+ (u.ficon || 'icon-menu') +'"></i> '+ u.fmenuname +'</p>';
						  }
					  }
				  });
			  };
			  
			  getAjaxData(DefConfig.Root + '/main/operationMenu',null,function(d){
				 UCGS._menuData = d;
				 $.each(d,function(i,u){
					 if(u.fparentid == 0){
						 line += '<div class="items" data="'+ u.id +'"><span class="ucgs_menugroup"><i class="'+ (u.ficon || 'icon-menu') +'"></i> '+ u.fmenuname + '</span>';
						 line += '<div class="ucgs_menu_item'+ u.id +'">';
						 loopMenu(u.id);
						 line += '</div></div>';
					 }
				 });
				 $(".ucgs_menu_items").html(line);
				 UCGS.defClick();
			  });
		  },
		  defClick : function(){
			  $(".ucgs_menu_items > .items").eq(0).find('.ucgs_menugroup').click();  
		  },
		  updpwd : function(){
			  Main.updatePwd();
		  },
		  mess : function(){
			  Chasonx.Tips.Show({id:'UCGSMess',text:'暂无消息',height:120})
		  },
		  setBg : function(){
			 // var idx = ChasonTools.getCookie('ucms_admin_bgidx');
			 // $(".metroPanel").css('background-image','url(/UCGS/res/skin/css/default/'+ (idx != null?'logbg/bg_' + idx + '.jpg':'main_bg.jpg') +')');
		  }
	};
	
	window.UCGS = UCGS;
	
	var Main = {
		  state : false,
		  init : function(skin_type){
			var _def_s_conf = isBlankString(skin_type)?UCGS_Skin[skin_type].conf:UCGS_Skin.dark.conf;
			var _right = {id : 'ucgs_main_right',bgColor : _def_s_conf.right,border: _def_s_conf.borderRightColor};
			var _bottom = {id : 'ucgs_main_bottom',height : '30px',bgColor : _def_s_conf.bottom,border : _def_s_conf.borderBottomColor};
			if(_def_s_conf.borderRightColor == false) _right.border = false;
			if(_def_s_conf.borderBottomColor == false) _bottom.border = false;
			if(skin_type == 'frostedGlass') $('body').css('background-image','url(' + DefConfig.Root + '/res/skin/css/default/frostedGlass.png)').css('background-size','cover');
			
			Chasonx.Frameset({
				main   : 'ucgs_main_panel',
				window : {
					top  : {id : 'ucgs_main_top' ,height : '80px',border:false,bgColor : _def_s_conf.top},
					left : {id : 'ucgs_main_left',width : '15%',border:false,bgColor : _def_s_conf.left},
					right: _right,
					bottom : _bottom
					}
			});
		  },
		  updatePwd : function(){
			  new Chasonx({
				 title : '修改密码',
				 html : '<div id="upwPanel"></div>',
				 width:500,height:300,
				 success : function(){
					 var pwd = $("#newpwd2").val();
					 if(Main.state && FormData.checkPwd('newpwd','newpwd2') && pwd != ''){
						getAjaxData(DefConfig.Root + '/main/modifyPwd',{'newPwd':pwd},function(d){
							 if(d > 0){
								 Chasonx.Alert({
									 html : '密码已更改，请谨记新密码。',
									 modal : true
								 });
							 }else{
								 Chasonx.Hint.Faild('密码更新失败');
							 }
						 });
						 return true;
					 }
				 },
				 modal:true
			  }); 
			  ChasonxDom.draw({
				  id : 'upwPanel',
				  item : [
				       {text:'&nbsp;',type:'br',info:'&nbsp;'},
				       {text:'原密码:',name:'oldpwd',type:'input',attr:' req = "true"',atype:'password',handler : {
				    	   type:'blur',
				    	   event : function(){
				    		   this.value = this.value.replace(/[ ]/ig,'');
				    		   if(this.value == '') return;
				    		   getAjaxData(DefConfig.Root + '/main/validatePwd',{'oldPwd':this.value},function(d){
				    			   if(d == 0){
				    				   $("#showErr").html('<span class="badge badge_del">&nbsp;原密码不正确请重新输入&nbsp;</span>');
				    				   $("#oldpwd").val('');
				    			   }else{
				    				   Main.state = true;
				    				   $("#showErr").html('');
				    			   }
				    		   });
				    	   }
				       }},
				       {text:'新密码:',name:'newpwd',type:'input',atype:'password',info : '(5-20位字母开头密码)',handler : {
				    	   type : 'blur',
				    	   event : function(){
				    		   FormData.validata(1,this);
				    	   }
				       }},
				       {text:'确认密码:',name:'newpwd2',type:'input',atype:'password',handler : {
				    	   type : 'blur',
				    	   event : function(){
				    		   FormData.checkPwd('newpwd',this);
				    	   }
				       }},
				       {text:'&nbsp;',type:'br',info:'<span id="showErr"></span>'}
				    ]
			  });
		  }
	};
	
	window._setDefaultSkin = function(v){
		ChasonTools.setCookie('UCGS_DEF_SKIN_TYPE',v);
		ChasonTools.setCookie('UCGS_DEF_SKIN',UCGS_Skin[v].href);
		window.location.reload();
	}
	
	window.onload = function(){
		var _current_skin = ChasonTools.getCookie("UCGS_DEF_SKIN_TYPE");
		Main.init(_current_skin);
		UCGS.loadMenu();
		
		var _progress,_progressTimer;
		var progressHandler = function(){
			_progress = $("#ucgs_progress");
			_progress.css('width','100%');
			
			_progressTimer = setTimeout(function(){
				_progress.hide().css('width','0%');
			},600);
		};		
		
		$(".ucgs_menugroup").live('click',function(){
			var _p = $(this).parent();
			
			if(_p.parent().attr('class') == 'ucgs_menu_items'){
				$(".uucgsmenuFocus").css('height','0px');
				$(".uucgsmenuTitleFocus").removeClass('uucgsmenuTitleFocus');
			}
			$(this).addClass('uucgsmenuTitleFocus');
			var _menuPanel = $(".ucgs_menu_item" + _p.attr('data'));
			_menuPanel.addClass('uucgsmenuFocus').css('height',(_menuPanel.find('p').size()*25 + _menuPanel.find('.ucgs_menugroup').size()*32) + 'px');
		});
		$(".ucgs_menu_items > .items > div > p").live('click',function(){
			$(".ucgs_menuitem_focus").removeClass();			
			$(this).addClass('ucgs_menuitem_focus');
			
			/**createView*/
			var fid = $(this).attr('id'),framePanel = $("#" + CURRENT_VIEW_PANEL_ID + fid);
			if(framePanel[0] == undefined && framePanel[0] == null){
				$("#ucgs_progress").show().css('width','80%');
				framePanel = document.createElement('iframe');
				framePanel.setAttribute('id',CURRENT_VIEW_PANEL_ID + fid);
				framePanel.setAttribute('src',$(this).attr('url'));
				framePanel.setAttribute('width','100%');
				framePanel.setAttribute('height','100%');
				framePanel.setAttribute('style','border:0px');
				$("#ucgs_main_right")[0].appendChild(framePanel);
				framePanel.onload = function(){
					progressHandler();
					if(CURRENT_VIEW_PANEL_IDX != fid){
						$("#" + CURRENT_VIEW_PANEL_ID + CURRENT_VIEW_PANEL_IDX).hide();
						CURRENT_VIEW_PANEL_IDX = fid;
					}
				};
			}else{
				framePanel.show();
				if(CURRENT_VIEW_PANEL_IDX != fid){
					$("#" + CURRENT_VIEW_PANEL_ID + CURRENT_VIEW_PANEL_IDX).hide();
					CURRENT_VIEW_PANEL_IDX = fid;
				}
			}
		});
		
		$(".ucgs_index").live('click',function(){
			$("#" + CURRENT_VIEW_PANEL_ID + CURRENT_VIEW_PANEL_IDX).hide();
			CURRENT_VIEW_PANEL_IDX = 0;
			$("#" + CURRENT_VIEW_PANEL_ID + CURRENT_VIEW_PANEL_IDX).show();
			$(".ucgs_menuitem_focus").removeClass();
		});
		
		$("#ucgs_btn_reflash").live('click',function(){
			$("#ucgs_progress").show().css('width','80%');
			$("#" + CURRENT_VIEW_PANEL_ID + CURRENT_VIEW_PANEL_IDX).attr('src',$("#" + CURRENT_VIEW_PANEL_ID + CURRENT_VIEW_PANEL_IDX).attr('src'));
		});
		$("#ucgs_btn_message,#ucgs_btn_todo,#ucgs_main_btn_setting").live('click',function(){
			Chasonx.Alert({
				html : '功能正在完善中...',
				modal : true
			});
		});
		
		$("#ucgs_main_btn_changeskin").live('click',function(){
			var html = '<div class="ucgs_main_btn_skinitem">\
						<span onclick="_setDefaultSkin(\'dark\')">太空灰'  + (_current_skin == 'dark'?'<b>√</b>':'') + '</span>\
					    <span onclick="_setDefaultSkin(\'lightblue\')">海之蓝'  + (_current_skin == 'lightblue'?'<b>√</b>':'') + '</span>';
						//<span onclick="_setDefaultSkin(\'frostedGlass\')">毛玻璃'  + (_current_skin == 'frostedGlass'?'<b>√</b>':'') + '</span></div>';
			Chasonx.Tips.Show({id:'ucgs_main_btn_changeskin',text:html,direction:'bottom',width:90,height:124});
		});
	};
})(window,$);
