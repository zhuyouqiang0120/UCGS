/**
* SimpleTab
*author : chasonx
*createTime : 171129
*desc : 简单的Tab选项卡，支持删除/添加tab
Chasonx.STab({
		id : 'STab1',  //显示区域id
		close : true, //关闭按钮
		ffocusColor : 'red', //获取焦点时字体颜色
		fblurColor : '#ffffff', //失去焦点时字体颜色
		width : 100,  //按钮宽
		height : 30 , //按钮高
		items : [{
			title : '选项卡一', //按钮名称
			html : 'Fuck',  //显示内容
			id : '', //tab显示区域id，不传默认创建
			close : true, //显示删除按钮
			handler : function(obj){ //点击回调  obj ：tab内容承载id
				console.log(1);
			}
		   }]
		});
*/

;(function(win,undefined){

	function stab(options){
		this.id = options.id;
		this.items = options.items;
		this.ffocusColor = options.ffocusColor || '#d87a7a';
		this.fblurColor = options.fblurColor || '#b3aeae';
		this.width = options.width || 120;
		this.height = options.height || 30;
		this.close = options.close || false;
		this.init();
	}
	stab.prototype = {
		style : {
			btnPane : 'width:100%;position:relative;overflow:hidden;white-space: nowrap;padding: 2px 0px 0px 2px;',
			boxPane : 'width : 100%;position : absolute;left:0px;top:30px;right:0px;bottom : 0px;overflow:hidden;margin: 0px 0px 0px 2px;z-index:1024;box-shadow: 0px 0px 5px #504d4d;-moz-box-shadow: 0px 0px 5px #504d4d;-webkit-box-shadow: 0px 0px 5px #504d4d;',
			btn : 'overflow:hidden;text-overflow:ellipsis;cursor:pointer;position:relative;display:inline-block;font-size:14px;text-align:center;vertical-align:middle;border-radius: 5px 5px 0px 0px;-moz-border-radius: 5px 5px 0px 0px;-webkit-border-radius: 5px 5px 0px 0px;',
			panel : 'position:absolute;overflow:auto;padding:5px;left : 0px;right : 0px;top : 0px;bottom : 0px;',
			close : 'display: inline-block; position: absolute; left: 1px;top: 1px; height: 15px;width: 15px; background: #d1d0d0;text-align: center;vertical-align: middle;line-height: 15px;border-radius: 10px;color: #b73e0d;',
			background : '#eee9e9',
			focus : 'box-shadow: 0px -2px 3px #504d4d;-moz-box-shadow: 0px -2px 3px #504d4d;-webkit-box-shadow: 0px -2px 3px #504d4d;z-index:1025;',
			focusColor : '#d87a7a',
			blurColor : '#b3aeae',
			arr : 'display: inline-block;  height: 20px; position: absolute;cursor:pointer; width: 15px; background: #fdfdfd;  text-align: center; vertical-align: middle;z-index:1030;  line-height: 20px;  color: #755f5f; top: 10px; border: 1px solid #b5b3b3; border-bottom: none;user-select:none;-moz-user-select:none;-webkit-user-select:none; ',
			arrRight : 'right: 0px;border-radius: 0px 4px 0px 0px; ',
			arrLeft : 'right : 15px;border-radius: 4px 0px 0px 0px; '
		},
		focusId : -1,
		maxSize : 0,
		right : null,
		left : null,
		panel : undefined,
		btnPane : null,
		boxPane : null,
		init : function(){
			with(this){
				panel = _$(id);
				if(panel == undefined) return;
				if(items.length == 0) return;

				panel.style.position = 'relative';
				var size = ChasonTools.getObjectSize(panel);
				btnPane = ChasonTools.createEle({type:'div',css:style.btnPane});	
				boxPane = ChasonTools.createEle({type:'div',css:style.boxPane});

				btnPane.style.height = height + 'px';
				//boxPane.style.height = (size[1] - height) + 'px';

				maxSize = ~~(size[0] / width);
				append();
				panel.appendChild(btnPane);
				panel.appendChild(boxPane);
			}
		},
		setFocus : function(_id){
			with(this){
				if(!_id) return;
				each(items,function(i,u){
					if(u.id == _id){
						_$(u.btnId).click();
						return false;
					}
				});
			}
		},
		remove : function(bid){
			with(this){
				if(items.length == 1) return;
				
				var idx = -1,u = {};
				each(items,function(i,m){
					if(m.btnId == bid){
						 idx = i;
						 u = m;
						 return false;
					}
				});
				items.splice(idx,1);

				var _cbtn = _$(u.btnId);
				_cbtn.parentNode.removeChild(_cbtn);
				var _cPan =  _$(u.paneId);
				_cPan.parentNode.removeChild(_cPan);

				if(bid == focusId)
					_$(items[items.length - 1].btnId).click();
				if(items.length < maxSize && right != null){
					right.parentNode.removeChild(right);
					left.parentNode.removeChild(left);
					right = left = null;
				}
			}
		},
		add : function(item){
			with(this){
				if(panel == undefined) return;
				if(!item.title) return;
				if(item.id){
					var _add = false;	
					each(items,function(i,u){
						if(u.id == item.id){
							_add = true;
							return false;
						}
					});
					if(_add == true) return;
				}	
				items.push(item);
				append();
			}
		},
		append : function(){
			with(this){
				var random,_btnId,_panelId,_btn,_pane,_css;
				each(items,function(i,u){

					if(u.create == true) return;
					random = (Math.random() + "").replace(".","");
					_btnId = 'ChasonxTabBtn' + (u.id || random);
					_panelId = u.id || ('ChasonxTabPanel' + random);
					_css = focusOrBlur(i == 0,u);				
					_btn = ChasonTools.createEle({type:'span',id : _btnId,css: _css.b });

					_pane = _$(_panelId);
					if(_pane == undefined){
						_pane =  ChasonTools.createEle({type:'div',id : _panelId,css : _css.p + (u.css || '') });
						_pane.innerHTML = u.html || '';
					}else{
						_pane.setAttribute('style',_css.p + (u.css || ''));
					}
					_btn.innerHTML = u.title || ('Tab' + i);
					
					u.create = true;
					u.btnId = _btnId;
					u.paneId = _panelId;

					if(close == true || u.close == true) setClose(_btn,_btnId);

					btnPane.appendChild(_btn);
					boxPane.appendChild(_pane);
					handler(_btn);
				});
				scroll();
			}
		},
		scroll : function(){
			with(this){
				if(items.length > maxSize){
					if(right == null){
						right = ChasonTools.createEle({type:'span',css: style.arr + style.arrRight});
						left =  ChasonTools.createEle({type:'span',css: style.arr + style.arrLeft});
						right.innerHTML = '>';
						left.innerHTML = '<';

						panel.appendChild(right);
						panel.appendChild(left);

						ChasonTools.addEventHandler(right,'click',function(event){
							btnPane.scrollLeft += width;
							event.stopPropagation();
						});
						ChasonTools.addEventHandler(left,'click',function(event){
							btnPane.scrollLeft -= width;
							event.stopPropagation();
						});
					}
				}
			}
		},
		setClose : function(_btn,_bid){
			with(this){
				var _close = ChasonTools.createEle({type:'font',css: style.close });
				_close.innerHTML = '×';
				_close.setAttribute('title','关闭');
				_btn.appendChild(_close);
				ChasonTools.addEventHandler(_close,'click',function(event){
					remove(_bid);
					event.stopPropagation();
				});
			}
		},
		focusOrBlur : function(focus,item){
			with(this){
				var _b = style.btn + 'width :' + width + 'px;height :' + height + 'px;line-height:' + height + 'px;';
				var _p = style.panel,_bg;
				if(focus){	
					_bg = 'background : ' + (item.focusColor || style.background) + ';';
					_b += 'color : ' + ffocusColor + ';' + style.focus + _bg;
					_p  += 'display : block;' + _bg + 'color : ' + ffocusColor + ';' ;
				}else{
					_b += 'color : ' + fblurColor + ';background:' + (item.blurColor || style.background);
					_p += 'display : none;';
				}
				return {b : _b,p : _p};
			}
		},
		each : function(data,fn){
			for(var i = 0,len = data.length;i < len;i++){
				if(typeof fn == 'function')
					if(fn(i,data[i]) == false) break;
			}
		},
		handler : function(e){
			with(this){
				var _currId,_btn,_pane,_css;
				ChasonTools.addEventHandler(e,'click',function(){
					_currId = this.id;
					each(items,function(i,u){
						_btn = _$(u.btnId);
						_pane = _$(u.paneId);
						if(u.btnId == _currId){
							_css = focusOrBlur(true,u);
							focusId = _currId;
							if(typeof u.handler == 'function') u.handler(_pane);
						}else{
							_css = focusOrBlur(false,u);
						}
						_btn.style = _css.b;
						_pane.style = _css.p + (u.css || '');
					});

				});
		   }
		}
	};
	function _$(id){
		if( typeof( id ) != "string" ) return id;
		if( document.getElementById ) return document.getElementById( id );
		if( document.all ) return document.all[ id ];
		if( document.layers ) return document.layers[ id ];
		return undefined;
	}
	window.Chasonx.STab = function(options){
		return new stab(options);
	}
})(window);