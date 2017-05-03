;(function(window,$){

	var defRouter = null,
		defStats = false,
		defMenuPanelX = -180,
		defPagePanelY = 60,
	    defMenuIdx = null,
	    PageTimeOut = null,
	    LeftMenuTimeOut = null; //当前点击的主菜单
	
	/**
	 * 系统配置
	 */
	var  ChasonConfig = {
			 menuArray : null,
			 main : function(){
			 	if(defRouter == null) ChasonConfig.getInstance();
			 	window.location.hash = '';
			 	ChasonConfig.loadMenu();
			 	UCGS.desc().setBg();
			 },
			 loadMenu : function(){
				 getAjaxData(DefConfig.Root + '/main/operationMenu',null,function(d){
					 var line = '',childMenu = [],topMenu = [];
					 ChasonConfig.menuArray = d;
					 $.each(d,function(i,u){
						 if(u.fparentid == 0){
							 line += '<li data="'+ u.id +'">'+ u.fmenuname +'</li>';
							 topMenu.push(u);
						 }else{
							 childMenu.push(u);
						 }
					 });
					 $(".mainMenuBox").html(line);
					 ChasonConfig.bindTopMenu();
					 
					 ChasonConfig.magentCtrl(childMenu,topMenu);
				 });
			 },
			 magentCtrl : function(childMenu,topMenu){
				 	var magent = [4,1,1,2,2,1,1,1,1,1,1,2],tempIdx = 0,mLength = magent.length;
				 	var color = ["#425258","#272c33","#7b919f","#646262","#425258","#272c33","#7b919f","#646262"];
			        var html = '';
			        var css = '',tt,_itemMenu = [];
			        
			        var checkInArray = function(_id){
			        	var  e = false;
			        	for(var j = 0;j < _itemMenu.length;j++){
			        		if(_itemMenu[j].id == _id){
			        			e = true;
			        			break;
			        		}
			        	}
			        	return e;
			        };
			        var _tItem;
			        while(_itemMenu.length < (childMenu.length >= 7?7:childMenu.length)){
			        	_tItem = childMenu[~~(Math.random()*childMenu.length)];
			        	if(!checkInArray(_tItem.id)) _itemMenu.push(_tItem);
			        }
			        
			        for(var i = 0;i < _itemMenu.length;i++){
			        	if(tempIdx  / mLength == 1) tempIdx = 0;
			        	tt = (0.8 + (0.1*i)).toFixed(1);
			        	css = 'transition:all ' + tt + 's ease;-moz-transition:all ' + tt + 's ease;-webkit-transition:all ' + tt + 's ease;background:'+ color[~~(Math.random()*color.length)] +';color:#000;';
			        	html += '<div class="magentBox'+ magent[tempIdx] +'" url="'+ (_itemMenu[i].fmenurl != null?_itemMenu[i].fmenurl:"") +'" _id="'+ _itemMenu[i].id +'" pid="'+ _itemMenu[i].fparentid +'" style="'+ css +'">';
			        	if(_itemMenu[i].ficon != '' && _itemMenu[i].ficon != null){
				      		html += '<img align="center" src="'+ _itemMenu[i].ficon +'" />';
				      	}
				      	html += _itemMenu[i].fmenuname + '</div>';
				      	tempIdx ++;
			        }
				    html += '<div style="clear:both;"></div>';
			        $("#magentBox").html(html);
			        
			        var exist = function(pid){
			        	var e = false;
			        	for(var i = 0;i < topMenu.length;i++){
			        		
			        		if(topMenu[i].id == pid) e = true;
			        	}
			        	return e;
			        };
			        var getChildMenu = function(pid){
			        	var _m;
			        	for(var i = 0;i < childMenu.length;i++){
			        		if(childMenu[i].id == pid){
			        			_m = childMenu[i];
			        		}
			        	}
			        	return _m;
			        };
			        
			        $("#magentBox > div").live('click',function(){
			        	var _this = $(this);
			        	$("#mainMenuBox > li[data='"+ _this.attr("pid") +"']").click();
			        	setTimeout(function(){
			        		if(exist(_this.attr("pid")) == true){
			        			if(_this.attr('url') != ""){
			        				$(".frameCenLeft[parent='ParentMmenu"+ _this.attr("pid") +"']").find("div[curl='"+ _this.attr('url') +"']").click();
			        			}else{
			        				$(".frameCenLeft[parent='ParentMmenu"+ _this.attr("pid") +"']").find("div[data='"+ _this.attr('_id') +"']").click();
			        			}
			        		}else{
			        			var pm = getChildMenu(_this.attr("pid"));
			        			$("#mainMenuBox > li[data='"+ pm.fparentid +"']").click();
			        			setTimeout(function(){
			        				$(".frameCenLeft[parent='ParentMmenu"+ pm.fparentid +"']").find("div[class='menuItem'][data='"+ pm.id +"']").click();
			        				if(_this.attr('url') != ""){
				        				setTimeout(function(){
				        					$("#_ChildMenuBox" + pm.id ).find('div[curl="'+ _this.attr('url') +'"]').click();
				        				},200);
			        				}
			        			},200);
			        		}
			        	},200);
			        });
			        
			        setTimeout(function(){ $("#magentBox > div").css('top','0px').css('opacity',1);},200);
			 },
			 hashChange : function(){
			 	defRouter.main();
			 },
			 leftMenu : function(pmid){
			 	 if(!defStats){
				 	 setTimeout(function(){
					 	 new Animate().fadeIn({obj:$(".userinfo")[0],v:defMenuPanelX,attr:'left',rev:true},function(){
					 	 	defStats = true;
					 	 	$(".metroPanel").fadeOut();
					 	 });
				 	 },100);
				 }
			 	 defRouter.menulist("ParentMmenu" + pmid,pmid);
			 },
			 checkChildMenu : function(mid){
				 if(ChasonConfig.menuArray == null) return;
				 var node = [];
				 $.each(ChasonConfig.menuArray,function(i,u){
					if(u.fparentid == mid) node.push(u); 
				 });
				 return node;
			 },
			 bindTopMenu : function(){
				$(".mainMenuBox > li").live('click',function(){
					$(".mainMenuBox > li").removeClass('mainMenuBoxLiFocus');
			 		$(this).addClass('mainMenuBoxLiFocus');
			 		ChasonConfig.leftMenu($(this).attr('data'));
		 		});
			 },
			 bindLeftMenu : function(obj){
			 	$(obj).find('.menuItem').live('click',function(){
			 		$(obj).find('.box').removeClass('divFocus');
		 			$(obj).find('.menuItem > label').remove();
		 			$(".childMenuItem").slideUp();
			 		$(this).find('.box').addClass('divFocus');
			 		if($(this).attr('hasChild') == 'true'){
			 			
			 			$("#_ChildMenuBox" + $(this).attr('data')).slideDown().find('div').live('click',function(){
			 				$('div[class="_childMenuItemFocus"]').find('label').remove();
			 				$('div[class="_childMenuItemFocus"]').removeClass('_childMenuItemFocus');
			 				$(this).addClass('_childMenuItemFocus');
			 				$(this).append('<label class="frameRefresh" title="刷新" onclick="document.getElementById(\''+ $(this).attr('curl') +'\').src = \''+ $(this).attr('curl') +'\';" ></label>');
			 				window.location.hash = "#" + escape($(this).attr('curl'));
			 			});
			 		}else{
				 		$(this).append('<label class="frameRefresh" title="刷新" onclick="document.getElementById(\''+ $(this).attr('curl') +'\').src = \''+ $(this).attr('curl') +'\';" ></label>');
				 		window.location.hash = "#" + escape($(this).attr('curl'));
			 		}
			 	});
			 	
			 },
			 getInstance : function(){
				if(defRouter == null) defRouter = new Router();
			 }
	 };
	/*左侧菜单*/
	function LeftMenuInit(pname,pmid,exist){
		if(LeftMenuTimeOut != null) clearTimeout(LeftMenuTimeOut);
		LeftMenuTimeOut = setTimeout(function(){
			
			if(!exist){
				var html = '<div class="frameCenLeft" parent="'+ pname +'"></div>';
				$(".mainFrame").append(html);
			}
			if(pmid != defMenuIdx || defMenuIdx == null){
				defMenuIdx = pmid;
				
				var _menu = $(".frameCenLeft[parent='"+ pname +"']");
					_menu.css('z-index',535).show();
	
				if(!exist){
					var line = '<div class="borderBottom"></div>',_childNode = [],_line = '';
					$.each(ChasonConfig.menuArray,function(i,u){
						if(u.fparentid == pmid){
							_childNode = ChasonConfig.checkChildMenu(u.id);
							if(_childNode.length == 0){
								line += '<div class="menuItem" curl="'+ u.fmenurl +'"><div class="box"><span><img src="'+ (u.ficon != null?u.ficon:DefConfig.Root + '/res/skin/css/default/icon/setting.png') +'"/>'+ u.fmenuname + '</span><font ></font></div></div>';
							}else{
								line += '<div class="menuItem" hasChild="true" data="'+ u.id +'"><div class="box"><span><img src="'+  (u.ficon != null?u.ficon:DefConfig.Root + '/res/skin/css/default/icon/setting.png') +'"/>'+ u.fmenuname + '</span><font ></font></div></div>';
								_line = '<div class="childMenuItem" id="_ChildMenuBox'+ u.id +'">';
								$.each(_childNode,function(j,k){
									_line += '<div curl="'+ k.fmenurl +'"><img src="'+  (k.ficon != null?k.ficon:DefConfig.Root + '/res/skin/css/default/icon/setting.png') +'"/>'+ k.fmenuname +'</div>';
								});
								_line += '</div>';
								line += _line;
							}
						}
					});
					_menu.html(line);
					ChasonConfig.bindLeftMenu(_menu);
				}
				new Animate().fadeIn({obj:_menu[0],v:defMenuPanelX,attr:'left',rev:true},function(){
					$(".frameCenLeft").each(function(){
						if($(this).attr('parent') != pname)   $(this).css('z-index',525);
						else _menu.css('z-index',530);
					});
				});
			
				var _focus = _menu.find('div[class="box divFocus"]');
				if(_focus.size() === 0){
					var _firstMenuObj = _menu.find('div[class="menuItem"]').eq(0);
					_firstMenuObj.click();
					if(_firstMenuObj.attr('hasChild') == 'true'){
						$("#_ChildMenuBox" + _firstMenuObj.attr('data')).find('div').eq(0).click();
					}
				}else{
					_focus.click();
					if(_focus.parent().attr('hasChild') == 'true'){
						$("#_ChildMenuBox" + _focus.parent().attr('data')).find('div[class="_childMenuItemFocus"]').click();
					}
				}
				
			}
		
		},100);
	}
	/*页面*/
	function PageInit(url,exist){
		if(PageTimeOut != null) clearTimeout(PageTimeOut);
		PageTimeOut = setTimeout(function(){
			
			if(!exist){
				var html = '<div class="pagePanel" dataurl="'+ url +'" drawdom="false"><iframe id="'+ url +'" src="'+ url +'" style="border:0px;" width="100%" height="100%" ></iframe></div>';
				$(".mainFrame").append(html);
			}
			//Loader.js(url,true);
			var page = $(".pagePanel[dataurl='"+ url +"']");
				page.css('z-index',688).show();
	
			//new Animate().fadeIn({obj:page[0],v:defPagePanelY,attr:'top'},function(){
				 $(".pagePanel").each(function(){
				 	if($(this).attr('dataurl') == url) $(this).css('z-index',676);
				 	else $(this).css('z-index',666);
				 });
			//});
		
		},100);
	}

	/**
	*路由控制
	*/
	function Router(){}
	Router.prototype = {
		leftMenuContainer : [],
		pageContainer : [],
		go : function(url){
		 	var exist = inArray(this.pageContainer,url);
		 	if(!exist)	this.pageContainer.push(url);
		 	PageInit(url,exist);
		},
		menulist : function(name,pmid){
			var exist = inArray(this.leftMenuContainer,name);
			if(!exist) this.leftMenuContainer.push(name);
			LeftMenuInit(name,pmid,exist);
		},
		main : function(){
			if(this.leftMenuContainer.length == 0) return window.location.hash = '';
			
		 	var _url = Utils.getHash();
		 	if(_url != '' && _url != undefined){
		 		this.go(_url);
		 		this.menulist("ParentMmenu" + defMenuIdx,defMenuIdx);
		 	}else{
		 		this.showMetro();
		 	}
		},
		showMetro : function(){
			$(".userinfo").css('left',0 + 'px').css('opacity',0);
		 	$(".pagePanel").css('z-index',525);
		 	$(".frameCenLeft").css('z-index',525);
		 	$(".mainMenuBox > li").removeClass('mainMenuBoxLiFocus');
		 	$(".metroPanel").fadeIn();
		 	defStats = false;
		}
	};

	function inArray(array,ele){
		var res = false;
		for(var i = 0,len = array.length;i < len;i++){
			if(array[i] == ele){
				res = true;
				break;
			}
		}
		return res;
	}

	/**
	*hash 操作
	*/
	var Utils = {
		getHash : function(name){
			var _hash = unescape(window.location.hash);
			if(_hash == '') return '';
			
			_hash = _hash.replace('#','');
			if(!name) return  _hash;
			
			_hash = _hash.split("&");
			var _v,_s;
			for(var i = 0,len = _hash.length;i < len;i++){
				_v = _hash[i].split('=');
				if(_v[0] == name){
					 _s = _v[1] || '';
					 break;
				}
			}
			return _s;
		}
	};

	/*
	*动画
	*/
	function Animate(){};
	Animate.prototype = {
		/*
		*{v:100,attr:'top',obj:Object,rev:true}
		*/
		fadeIn : function(op,callback){
			var t = 0,b = 0,c = op.v,d = 25,_temp = 0,_opacity = 0,timeout;

			if(op.rev && op.rev) c = c*-1;
			var run = function(){
				_temp = Tween.base(t,b,c,d);
				_opacity = Tween.base(t,b,1,d);

				if(op.rev && op.rev) _temp = (op.v + _temp);
				op.obj.style[op.attr] = _temp + 'px';
				op.obj.style.opacity = _opacity;

				timeout = setTimeout(function(){
					t += 1;
					if(t > d){
					 	clearTimeout(timeout);
					 	if(typeof(callback) == 'function') callback();
					}else{ run(); }
				},16);
			};
			run();
		}
	};


	window.onhashchange = ChasonConfig.hashChange;
	window.onload = ChasonConfig.main;

	var Tween = {
		  base : function(t,b,c,d){
				 return -c*(t/=d)*(t-2) + b;
		  },
		  easeOut:function(t,b,c,d){
				if ((t/=d) < (1/2.75)) {
					return c*(7.5625*t*t) + b;
				} else if (t < (2/2.75)) {
					return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
				} else if (t < (2.5/2.75)) {
					return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
				} else {
					return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
				}
		  },
		  easeInBack : function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		  },
		  easeOutElastic : function(t,b,c,d){
			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
		  }
	};
})(window,$);