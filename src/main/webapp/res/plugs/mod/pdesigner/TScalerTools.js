
;(function(window,$,undefined){
	var _QUIRKS = document.compatMode != 'CSS1Compat',
		_pluginsPath = '/UCGS/res/plugs/mod/pdesigner/plugins/',
		_UUPDT_Instance = null,
		_PlugsContainer = [];
	
	var _PaddingGlobal = 10;
	
	function UPDTools(){
		this.groupNames = [];
		this.config = {
				text	: '',
        		type	: 'Ctrls',
        		classes : '',
        		only	: false,
        		eleType	: 'div',
        		move	: true,
        		dataType: '',
        		css		: '',
        		itemSize: 8,
        		hasData : false,
        		clear	: false,
        		dataSourceKey : '',
        		linkTarget : false,
        		linkTargetKey : null,
				attr : {
					width   	: 0,
					height  	: 0,
					left		: 0,
					top			: 0,
					bgImg   	: '',
					bgmRepeat	: 'no-repeat',
					bgmPos_x 	: -1,
					bgmPos_y 	: -1,
					bgColor		: '',
					borderWidth : -1,
					borderColor : '',
					fontSize 	: 18,
					fontColor 	: '',
					fontLHeight : 0,
					fontAlign 	: 'left',
					src			: '',
					focusColor  : '',
	        		focuSrc 	: '',
	        		href		: '',
	        		mainDraw    : false
				},
				customAttr : {
				}
			};
	} 
	UPDTools.prototype = {
		click : function(){
		},
		focus : function(){
		},
		blur  : function(){
		},
		data  : function(){
		},
		append : function(){
		},
		appendToDraw : function(ele){
			var draw = document.getElementById(this.drawPanelId);
		 	if(typeof(draw) != 'object') return;
		 	draw.appendChild(ele);
		},
		creatEle : function(){
			
			var _e = document.createElement(this.config.eleType),_eid = 'TsNo_' + (Math.random() + '').replace('.','');
			if(this.config.id != undefined) _eid = this.config.id;
			_e.setAttribute('id',_eid);
			this.config.id = _eid;
			
			if(this.config.customAttr)
				for(var tn in this.config.customAttr)
					_e.setAttribute(tn,this.config.customAttr[tn]);
			
			if(this.config.type != 'Panel') _moveHandler(_e);
			_clickHandler(_e);
			return _e;
		},
		addEventHandler : function(oTarget, sEventType, fnHandler) {
			if (oTarget.addEventListener) {
				oTarget.addEventListener(sEventType, fnHandler, false);
			} else if (oTarget.attachEvent) {
				oTarget.attachEvent("on" + sEventType, fnHandler);
			} else {
				oTarget["on" + sEventType] = fnHandler;
			}
		},
		getData : function(_key){
			return PDesigner.pageData == null?null:_key == undefined?PDesigner.pageData:PDesigner.pageData[_key];
		},
		getConfigByKey : function(_key){
			return UU.getLiveCtrlItem(_key);
		},
		getStyle : function(){
			var css = '',attr = this.config.attr;
			if(attr.width && attr.width != 0) css += 'width:' + attr.width + 'px;';
			if(attr.height && attr.height != 0) css += 'height:' + attr.height + 'px;';
			if(attr.left && attr.left != 0) css += 'left:' + attr.left + 'px;';
			if(attr.top && attr.top != 0) css += 'top:' + attr.top + 'px;';
			if(attr.bgColor && attr.bgColor != null) css += 'background-color:#' + attr.bgColor + ';';
			else if(attr.bgImg && attr.bgImg != null) css += 'background-image:url('+ attr.bgImg +');';
			if(attr.bgmRepeat && attr.bgmRepeat != ''){
				if(attr.bgmRepeat != 'full')	css += 'background-repeat:' + attr.bgmRepeat + ';';
				else css += 'background-size:100% 100%;';
			}
			if(attr.bgmPos_x && attr.bgmPos_x != -1 && attr.bgmPos_y && attr.bgmPos_y != -1) css += 'background-position:' + attr.bgmPos_x + 'px ' + attr.bgmPos_y + 'px;';
			if(attr.borderWidth && attr.borderWidth != -1) css += 'border-width:' + attr.borderWidth + 'px;border-style:solid;';
			if(attr.borderColor && attr.borderColor != null) css += 'border-color:#' + attr.borderColor + ';';
			if(attr.fontSize && attr.fontSize != -1) css += 'font-size:' + attr.fontSize + 'px;';
			if(attr.fontLHeight && attr.fontLHeight != 0) css += 'line-height:' + attr.fontLHeight + 'px;';
			if(attr.fontColor && attr.fontColor != null) css += 'color:#' + attr.fontColor + ';';
			if(attr.fontAlign && attr.fontAlign != "") css += 'text-align:' + attr.fontAlign + ';';
			css += 'position:absolute;';
			if(this.config.css != '') css += this.config.css;
			return css;
		},
		$ : function(id){
			if( typeof( id ) != "string" ) return id;
			if( document.getElementById ) return document.getElementById( id );
			if( document.all ) return document.all[ id ];
			if( document.layers ) return document.layers[ id ];
			return undefined;
		}
	};
	
	var UU = {
		 _ctrlsPanel : null,
		 _drawPanelId : null,
		 liveCtrlContainer : [],
		 setMainCtrlStatus : false,
		 mainLiveCtrlId : null,
		 currendFocusid : null,
		 ready : function(ctrlsPanel,drawPanel,items,pluginGroup){
			 if(!items || !(items instanceof Array) || items.length == 0) return;
			 _PlugsContainer = [];
			 
			 if(_UUPDT_Instance == null) _UUPDT_Instance = new UPDTools();
			 _UUPDT_Instance.groupNames = pluginGroup;
			 var _location = _pluginsPath,_idx = 0,_len = items.length,_this = this;
			 this._ctrlsPanel = ctrlsPanel;
			 this._drawPanelId = drawPanel;
			 
			 var _temp = ~~(160/_len),_currHeight = 0;
			 var _each = function(){
				 _idx ++;
				 _currHeight = 200 - _temp*_idx;
				 _Loading(_idx >= _len && _currHeight >= 40?0:_currHeight,~~(_idx/_len*100));
				 
				 if(_idx >= _len) return  _this.ctrlDraw();
				 _this.loadJs(_location + items[_idx],_each);
			 };
			 this.loadJs(_location + items[_idx],_each);
		 },
		 ctrlDraw : function(){
			 var line = '';
			 $.each(_UUPDT_Instance.groupNames,function(i,u){
					line += '<div class="ChasonxP_ControlItems">\
								<div class="title ChasonxP_ControlItemFocus">&nbsp;&nbsp;<i class="icon-menu2"></i>'+ u.text +'</div>\
								<div class="ConPanel">';
					$.each(_PlugsContainer,function(j,k){
						if(k.currGroupName == u.name)
							line += '<div class="ConItem" C_NO="'+ k.ctrlNumber +'"><i class="'+ k.config.classes +'"></i>'+ k.config.text +'</div>';
					});
					line += '</div></div>';
				});
				$("#" + this._ctrlsPanel).html(line);
				this.bindHandler();
		 },
		 bindHandler : function(){
			    var _PanelContros,$_this = this;
				$(".ChasonxP_ControlItems > .title").live('click',function(){
					_PanelContros = $(this).parent().find('.ConPanel');
					if(_PanelContros.css('display') == 'block'){
						$(this).removeClass('ChasonxP_ControlItemFocus');
						_PanelContros.slideUp();
					}else{
						$(this).addClass('ChasonxP_ControlItemFocus');
						_PanelContros.slideDown();
					}
				});
			
				$(".ConItem").die('mousedown');
				$(".ConItem").live('mousedown',function(){
					
					var _this = $(this);
					Chasonx.FastMove(_this[0],$_this._drawPanelId,function(e){
						e = e || window.event;
						var _pOffset = $("#" + $_this._drawPanelId).offset();
						var _ctrlItem = $_this.getCtrlItem(_this.attr('C_NO'));
						if(_ctrlItem != null){
							$_this.setLiveCtrl(_ctrlItem,e.pageX - _pOffset.left,e.pageY - _pOffset.top);
						}
					},'background:rgba(0,0,0,0.5);font-size:18px;text-align:center;color:#f6f6f6;vertical-align:middle;line-height:'+ _this.height() +'px');
				});
		 },
		 plugins : function(_gName,_config){
			 	var $_this = this;
				var _plug =  function(){
					UPDTools.call(this);
					this.currGroupName = _gName;
					this.ctrlNumber = 'No_' + (Math.random() + '').replace('.','');
					this.drawPanelId = $_this._drawPanelId;
					for(var _a in _config)
						for(var _b in this.config)
							if(_a != 'attr' && _a != 'customAttr' && _a === _b) 	this.config[_b] = _config[_a];
					if(_config.attr){
						for(var _a in _config.attr)
							for(var _b in this.config.attr)
								if(_a === _b) 
									this.config.attr[_b] = _config.attr[_a];
						
					}
					if(_config.customAttr) this.config.customAttr = _copyObj(_config.customAttr);
					
				};
				_plug.prototype = new UPDTools();
				if(_isFunction(_config.append))	_plug.prototype.append = _config.append;
				if(_isFunction(_config.click)) _plug.prototype.click = _config.click;
				if(_isFunction(_config.focus)) _plug.prototype.focus = _config.focus;
				if(_isFunction(_config.blur)) _plug.prototype.blur = _config.blur;
				if(_isFunction(_config.data)) _plug.prototype.data = _config.data;
				
				_PlugsContainer.push(new _plug());
		 },
		 getCtrlItem : function(C_No){
			 for(var i = 0,len = _PlugsContainer.length;i < len;i++){
				 if(_PlugsContainer[i].ctrlNumber == C_No)
					 return _PlugsContainer[i];
			 }
			 return null;
		 },
		 getLiveCtrlItem : function(id){
			 for(var i = 0,len = this.liveCtrlContainer.length;i < len;i++){
				 if(this.liveCtrlContainer[i].config.id == id)
					 return this.liveCtrlContainer[i];
			 }
			 return null;
		 },
		 removeLiveCtrlItem : function(id){
			 for(var i = 0,len = this.liveCtrlContainer.length;i < len;i++){
				 if(this.liveCtrlContainer[i].config.id == id){
					 if(this.liveCtrlContainer[i].config.type == 'Panel') this.setMainCtrlStatus = false;
					 this.liveCtrlContainer.splice(i,1);
					 break;
				 }
			 }
		 },
		 setLiveCtrl : function(_config,_left,_top){
			 if(_config.config.type == 'Panel'){
				 if(!this.setMainCtrlStatus) this.setMainCtrlStatus = true;
				 else return  Chasonx.Hint.Faild('已添加过主控件了');
			 }
			 if(!this.setMainCtrlStatus) return Chasonx.Hint.Faild('未添加主控件，请 在[页面]菜单选项下选取');
			 var _newConfig = _copyObj(_config);
			 if(_newConfig.config.type == 'Panel'){
				 _newConfig.config.attr.left = 10;
			 	 _newConfig.config.attr.top = 10;
			 }else{
				 _newConfig.config.attr.left = ~~_left;
			 	 _newConfig.config.attr.top = ~~_top;
			 }
			     _newConfig.append();
			     _newConfig.data();
			     
			 if(_newConfig.config.hasData == true)  DataSourceBind.init(_newConfig.config.id);  //bind ContextMenu 
			 if(_newConfig.config.type == 'Panel')  this.mainLiveCtrlId = _newConfig.config.id;
			 
			 this.liveCtrlContainer.push(_newConfig);
		 },
		 setLiveCtrlFocus : function(id){
			    this.currendFocusid = id;
				var iconf = this.getLiveCtrlItem(this.currendFocusid);
				this.setAttrPanelText(iconf.config.attr);
				this.setCustomAttrPanelText(iconf.config,id);
				$(".ChasonxP_extendAttr").html('');
				$(".ChasonxP_currEdit").html('Edit : ' + iconf.config.text + "-" + iconf.config.id);
				$(".ChasonxP_Focus").removeClass('ChasonxP_Focus');
				$("#" + id).addClass('ChasonxP_Focus');
				
		 },
		 setAttrPanelText : function(data){
				data = data || {};
				$("#_ChasonxAttr-width").val(data.width || 0);
				$("#_ChasonxAttr-height").val(data.height || 0);
				$("#_ChasonxAttr-left").val(data.left || 0);
				$("#_ChasonxAttr-top").val(data.top || 0);
				$("#_ChasonxAttr-bgImg").val(data.bgImg || '');
				$("#_ChasonxAttr-bgmRepeat").find("option[text='"+ data.bgmRepeat +"']").attr("selected",true);
				$("#_ChasonxAttr-bgmPos_x").val(data.bgmPos_x && data.bgmPos_x < 0?'':data.bgmPos_x);
				$("#_ChasonxAttr-bgmPos_y").val(data.bgmPos_y && data.bgmPos_y < 0?'':data.bgmPos_y);
				$("#_ChasonxAttr-bgColor").val(data.bgColor?data.bgColor:'');
				$("#_ChasonxAttr-bgColor").next().css('background',data.bgColor?'#' + data.bgColor:'');
				$("#_ChasonxAttr-borderWidth").val(data.borderWidth && data.borderWidth > -1?data.borderWidth:'');
				$("#_ChasonxAttr-borderColor").val(data.borderColor?data.borderColor:'');
				$("#_ChasonxAttr-borderColor").next().css('background',data.borderColor?'#'+data.borderColor:'');
				$("#_ChasonxAttr-fontSize").val(data.fontSize || '');
				$("#_ChasonxAttr-fontLHeight").val(data.fontLHeight || 0);
				$("#_ChasonxAttr-fontColor").val(data.fontColor || '');
				$("#_ChasonxAttr-fontColor").next().css('background',data.fontColor?'#' + data.fontColor:'');
				$("#_ChasonxAttr-img").val(data.src || '');
				$("#_ChasonxAttr-focusColor").val(data.focusColor);
				$("#_ChasonxAttr-focusColor").next().css('background',data.focusColor?'#' + data.focusColor:'');
				$("#_ChasonxAttr-focusImg").val(data.focusImg || '');
				
				var idx = -1;
				$(".ChasonxP_bg > span").removeClass('ChasonxP_fontAlignFocus');
				if(data.fontAlign == "left") idx = 0;
				else if(data.fontAlign == "center") idx = 1;
				else if(data.fontAlign == "right") idx = 2;
				else $(".ChasonxP_fontAlignFocus").removeClass('ChasonxP_fontAlignFocus');
				if(idx > -1){
					$(".ChasonxP_bg > span").eq(idx).addClass('ChasonxP_fontAlignFocus');
				}
		 },
		 /**
		  * Support Custom Attributes
		  */
		 setCustomAttrPanelText : function(data,panelId){
			 $("#ChasonxCustomAttrPanel > p").remove();
			 this.setCustomAttrHandler('id',panelId,panelId,false);
			 for(var name in data.customAttr)
				 this.setCustomAttrHandler(name,data.customAttr[name],panelId,true);
		 },
		 /**
		  * bind customAttrInput handler
		  */
		 setCustomAttrHandler : function(name,value,panelId,append){
			 var _iptID = '_ChasonxCustomerAttr-' + name;
			 if(append)
				 $("#ChasonxCustomAttrPanel").append('<p class="labelP"><b>'+ name +':</b><span class="ChasonxP_slideInput">\
						 							  <input type="text" id="'+ _iptID +'"/></span></p>');
			 var $customId = $("#" + _iptID);
			 	 $customId.val(value);
			 
			 var _this = this;
			 var _bindSta = $customId.attr('bind');
			 if(_bindSta != 'true'){
				 $customId.live('blur',function(){
					if(!StrKit.isBlank(this.value)){
						var _confs;
						if(!append) _confs = _this.getLiveCtrlItem(_this.currendFocusid).config;
						else _confs = _this.getLiveCtrlItem(_this.currendFocusid).config.customAttr;
						_confs[name] = this.value;
						$("#" + _this.currendFocusid).attr(name,this.value);
					}
				 });
				 $customId.attr('bind','true');
			 }
		 },
		 modifyConfig : function(F,V){
			    if(!this.currendFocusid) return;
			    var $tObj = $("#" + this.currendFocusid);
			    var icon = this.getLiveCtrlItem(this.currendFocusid);
			    icon.config.attr[F] = V;
			    
			    if(F == 'src') $tObj.attr('src',V);
			    else	$tObj.attr('style',icon.getStyle());
		 },
		 loadJs : function(url,fn){
			 var head = document.getElementsByTagName('head')[0] || (_QUIRKS ? document.body : document.documentElement),
				script = document.createElement('script');
			 	head.appendChild(script);
			 	script.src = url + '.js?v=' + (Math.random() + '').replace('.','');
			 	script.charset = 'utf-8';
			 	script.onload = script.onreadystatechange = function() {
			 	 if (!this.readyState || this.readyState === 'loaded') {
			 		 if(fn) fn();
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);
				 }
			};
		 },
		 getSourcePluginByName : function(_name){
			with(this){
				var _config = {};
				$.each(_PlugsContainer,function(i,u){
					if(u.config.text == _name){
						_config = u;
						return false;
					}
				});
				return _config;
			} 
		 },
		 recoverConfig : function(_config){
			 
			 if(_config.length == 0) return;
			 this.liveCtrlContainer = [];
			 this.setMainCtrlStatus = false;
			 this.mainLiveCtrlId = '';
			 $("#" + this._drawPanelId).html('');
			 
			 this.liveCtrlContainer = _config;
			 var _sourcePlugin;
			 for(var i = 0;i < this.liveCtrlContainer.length;i ++){
				   _sourcePlugin = this.getSourcePluginByName(this.liveCtrlContainer[i].config.text);
				 
				   this.liveCtrlContainer[i].drawPanelId = this._drawPanelId;
				   this.liveCtrlContainer[i].config.attr.left += 10;
				   this.liveCtrlContainer[i].config.attr.top += 10;
				   
				   if(this.liveCtrlContainer[i].config.type == 'Panel'){
					   this.mainLiveCtrlId = this.liveCtrlContainer[i].config.id;
					   this.setMainCtrlStatus = true;
					   this.liveCtrlContainer[i].config.attr.left = 0;
					   this.liveCtrlContainer[i].config.attr.top = 0;
				   }
				   
				   for(var fn in this.liveCtrlContainer[i]){
					   if(fn == 'data' || fn == 'click' || fn == 'blur' || fn == 'focus' || fn == 'append' || fn == '$' || fn == 'getData' || fn == 'getStyle' || fn == 'creatEle' || fn == 'appendToDraw' || fn == 'addEventHandler' || fn == 'getConfigByKey'){ 
						  if(fn == 'appendToDraw') this.liveCtrlContainer[i][fn] = new UPDTools().appendToDraw;
						  else	this.liveCtrlContainer[i][fn] = _sourcePlugin[fn] || null;   //eval('(' + this.liveCtrlContainer[i][fn] + ')');
					   }
				   }
			  }
			 this.reDraw();
			 
		 },
		 reDraw : function(){
			 var _e;
			 for(var i = 0;i < this.liveCtrlContainer.length;i ++){
				 	if(typeof this.liveCtrlContainer[i].append == 'function'){
						this.liveCtrlContainer[i].append();
						
						if(this.liveCtrlContainer[i].config.hasData == true)  DataSourceBind.init(this.liveCtrlContainer[i].config.id);
						_e = this.liveCtrlContainer[i].$(this.liveCtrlContainer[i].config.id);
						if(this.liveCtrlContainer[i].config.type != 'Panel') _moveHandler(_e);
						_clickHandler(_e);
				 	}
					if(typeof this.liveCtrlContainer[i].data == 'function')
						this.liveCtrlContainer[i].data(undefined);
			 }
		 },
		 clearDrawPanel : function(){
			 if(UU.liveCtrlContainer.length == 0) return;
			 Chasonx.Alert({
				title : '提示',
				html : '确定清除编辑区域吗？',
				alertType : 'warning',
				success : function(){
					UU.liveCtrlContainer = [];
					UU.setMainCtrlStatus = false;
					UU.mainLiveCtrlId = '';
					$("#" + UU._drawPanelId).html('');
					return true;
				},
				modal : true
			 });
		 }
	};
	/**
	 * 数据绑定
	 */
	var DataSourceBind = {
			bindDataKey : '',
			dataBaseName : 'PDFBaseData',
			init : function(id){
			  var menu = Chasonx.ContextMenu.init({id:id,
					items:[
	                  {text:'添加数据源',todo:function(){ 
	                	  UU.setLiveCtrlFocus(id);
	                	  ChasonxDataPicker.bindDataSource();
	                	  menu.Hide();
	                  }},
	                  {text:'解除数据源',todo:function(){ 
	                	  menu.Hide();
	                  }},
	                  {text:'删除控件',todo:function(){ 
	                	  UU.setLiveCtrlFocus(id);
	                	  Chasonx.Alert({
	                		  html : '确定删除该控件吗？',
	                		  modal : true,
	                		  alertType : 'warning',
	                		  success : function(){
	                			  UU.removeLiveCtrlItem(UU.currendFocusid);
	                			  $("#" + UU.currendFocusid).remove();
	                			  return true;
	                		  }
	                	  });
	                	  menu.Hide();
	                  }},
	                  {hr : true},
	                  {text : '关闭',todo : function(){
	                	  menu.Hide();
	                  }}
	               ]});
			},
			bindDataSource : function(){
				if(PDesigner.dataSetState == false) return Chasonx.Hint.Faild("主数据源还没有绑定");
				
				var _conf =  UU.getLiveCtrlItem(UU.currendFocusid);
				new Chasonx({
					title : '数据绑定(主题数据只展示最多5条作为示例)',
					html : '<div class="ChasonxP_DataBind"><div class="left"></div><div class="right"></div></div>',
					width : 700,height : 500,
					modal : true,
					success : function(){
						var _key = $('input[type="checkbox"][name="dataBindCheck"]:checked');
							_conf.config.dataSourceKey =  _key.val();
							console.log(PDesigner.pageData);
							
							_conf.data(ChasonxDataPicker.bindDataKey);
						
						//Link
						var _linkO = $("#DataSourceLink");
						if(_linkO.attr('ctrl_id') != undefined && _linkO.attr('ctrl_id') != ''){
							var _linkConf = UU.getLiveCtrlItem(_linkO.attr('ctrl_id'));
							_linkConf.config.linkTarget = true;
							_linkConf.config.linkTargetKey = _conf.config.id;
						}
						return true;
					}
				});
				
				var line = '<span onclick="ChasonxDataPicker.chooseDataItem(this,\''+ _conf.config.dataType +'\')"  guid="'+ PDesigner.pageData.Node[0] +'"><font color="red"> '+ PDesigner.pageData.NodeNames[0] +'</font><input type="checkbox" value="'+ PDesigner.pageData.Node[0] +'" name="dataBindCheck"/></span>';
					line += '<div id="'+ (PDesigner.pageData.Node[0].replace(/[-]/gi,'')) +'">';
				$.each(PDesigner.pageData[PDesigner.pageData.Node[0]].Columns,function(i,u){
					hasC = false;
					if(PDesigner.checkChild(u.Id) != '') hasC = true;
					line += '<span onclick="ChasonxDataPicker.chooseDataItem(this,\''+ _conf.config.dataType +'\')" level="1" guid="'+ u.Id +'"><b>'+ (hasC?'+':'')  +'{</b>Column: '+ u.Name +' [TopicSize: '+ u.TopicSize +']<b>}</b>\
					 		 <input type="checkbox" value="'+ u.Id +'" name="dataBindCheck"/></span>';
				});
				line += '</div>';
				$(".ChasonxP_DataBind > .left").html(line);
			},
			bindCtrlItems : function(obj){
				var panel = $("#DataSourceBindCtrlBox");
				if(panel.css('display') == 'none'){
					var _ctrls = '',_liveCtrls = UU.liveCtrlContainer;
					
					for(var i = 0,len = _liveCtrls.length;i < len;i++){
						if(_liveCtrls[i].config.type == 'Ctrls' && _liveCtrls[i].config.id != UU.currendFocusid){
							_ctrls += '<span onclick="ChasonxDataPicker.focus(this)" ctrl_id="'+ _liveCtrls[i].config.id +'">'+ _liveCtrls[i].config.text +'</span>';
						}
					}
					if(_ctrls == '') _ctrls = '<span>无关联控件</span>';
					panel.html(_ctrls);
					panel.slideDown();
				}else{
					panel.slideUp();
				}
			},
			focus : function(obj){
				$("#DataSourceBindCtrlBox > span").removeClass('DSBFocus');
				var _obj = $(obj);
				_obj.addClass('DSBFocus');
				$("#DataSourceLink").html(_obj.html());
				$("#DataSourceLink").attr('ctrl_id',_obj.attr('ctrl_id'));
				$("#DataSourceBindCtrlBox").slideUp();
			},
			chooseDataItem : function(obj,_dataType){
				var _this = $(obj);
				$('input[type="checkbox"][name="dataBindCheck"]:checked').attr('checked',false);
				_this.find('input').attr('checked',true);
				
				var guid = _this.attr('guid').replace(/[-]/ig,''),_showP = $("#" + guid);
				var _data = PDesigner.pageData[_this.attr('guid')];
				if(_showP[0] == undefined && _data){
					var line = '<div id="'+ guid +'">',lv = ~~_this.attr('level') + 1,hasC;
					if(_data.Columns){
						$.each(PDesigner.pageData[_this.attr('guid')].Columns,function(i,u){
							hasC = false;
							if(PDesigner.checkChild(u.Id) != '') hasC = true;
							line += '<span onclick="ChasonxDataPicker.chooseDataItem(this,\''+ _dataType +'\')" level="'+ lv +'" guid="'+ u.Id +'"><b style="margin-left:'+ (hasC?(lv-1)*18:lv*18) +'px;">'+ (hasC?'+':'') +' {</b>Column: '+ u.Name +' [TopicSzie: '+ u.TopicSize +']<b>}</b>\
							         <input type="checkbox" value="'+ u.Id +'" name="dataBindCheck"/></span>';
						});
					}
					if(_data.Topics.length > 0){
						$.each(_data.Topics,function(i,u){
							line += '<p style="left:'+ (lv*18) +'px;"><font>Topic:</font> '+ u.Name +'</p>';
							if(i > 5) return false;
						});
					}
					line += '</div>';
					_this.after(line);
					_this.find('b').eq(0).html('- {');
				}
				
				var data = PDesigner.pageData[_this.attr('guid')];
				var line = '<p>数据来源：<b id="DataSourceForm">'+ ChasonxDataPicker.dataBaseName +'['+ _this.attr('guid') +']</b></p>\
					        <p>控件关联：<b id="DataSourceLink" onclick="ChasonxDataPicker.bindCtrlItems(this)">设置关联控件</b> <div id="DataSourceBindCtrlBox"></div>  </p><p>已选数据：</p>';
				if(data){
					this.bindDataKey = _this.attr('guid');
					data = data[_dataType];
					$.each(data,function(i,u){
						line += '<span>'+ u.Name +'</span>';
					});
				}
					$(".ChasonxP_DataBind > .right").html(line);
			}
	};
	
	function _clickHandler(obj){
		ChasonTools.addEventHandler(obj,'click',function(){
			UU.setLiveCtrlFocus(this.getAttribute('id'));
		});
	}
	
	function _moveHandler(obj){
		$(obj).bind('mousedown',function(event){
			event = event || window.event;
			if(event.button == 2) return;
			var _id = this.getAttribute('id');
			UU.setLiveCtrlFocus(_id);
			var conf = UU.getLiveCtrlItem(_id);
			
			Chasonx.BodySelection(false);
			var d = window.document,tOffset = $("#" + UU.mainLiveCtrlId),event = event || window.event;
			
			var _L = tOffset.offset().left,_T = tOffset.offset().top,objW = $(this).width(),objH = $(this).height();
			var objL = conf.config.attr.left,objT = conf.config.attr.top,_offX = event.pageX - _L,_offY = event.pageY - _T,X,Y,_W = tOffset.width(),_H = tOffset.height();
			
			d.onmousemove = function(e){
				e = e || window.event;
				X = e.pageX - _L - _offX + objL;
				Y = e.pageY - _T - _offY + objT;
				
				if(X < 0) X = _PaddingGlobal;
				if(X > (_W - objW)) X = _W - objW + _PaddingGlobal;
				if(Y < 0) Y = _PaddingGlobal;
				if(Y > (_H - objH)) Y = _H - objH + _PaddingGlobal;
				
				obj.style.left = X + 'px';
				obj.style.top = Y + 'px';
				conf.config.attr.left = ~~X;
				conf.config.attr.top = ~~Y;
				$("#_ChasonxAttr-left").val(~~X - _PaddingGlobal);
				$("#_ChasonxAttr-top").val(~~Y - _PaddingGlobal);
			};
			d.onmouseup = function(){
				d.onmousemove = null;
				Chasonx.BodySelection(true);
			};
		});
	}
	
	function _Loading(_currHeight,percent){
		$("#logo2").css('height',_currHeight);
		$("#loadingText").text(percent + ' %');
		if(_currHeight == 0){
			setTimeout(function(){
				$("#LoadingFadeTop").css('height','0%');
				$("#LoadingFadeBottom").css('height','0%');
				$("#loadingText").hide();
				$("#LoadingLogoBox").addClass('LoadingLogoBoxMove');
				$("#LoadingLogoBox > #logo").addClass('LoadingLogoFade');
			},800);
		}
	}
	
	function _copyObj(obj){
		var nb = new Object();
		_loopObj(obj,nb);
		return nb;
	}
	function _loopObj(obj,tarObj){
		for(var f in obj){
			if(typeof obj[f] == 'object'){
				tarObj[f] = new Object();
				_loopObj(obj[f],tarObj[f]);
			}else{
				tarObj[f] = obj[f];
			}
		}
	}
	
	function _isFunction(fn){
		return typeof fn == 'function';
	}
	
	window.ChasonxTScaler = {
			liveCtrlContainer : function(){
				return UU.liveCtrlContainer;
			},
			ready : function(){
				var _this = this;
				_this.loadPluginGroups(function(data){
					var _data = [];
					for(var i = 0,len = data.length;i < len;i++) _data.push({name : data[i].fname, text : data[i].ftitle});
					
					_this.loadPluginList(function(da){
						var pnames = [];
						for(var p = 0,plen = da.length;p < plen;p ++) pnames.push(da[p].fpluginame);
						UU.ready("PD_Left", "PD_Designer",pnames,_data);
					});
				});
			},
			plugins : function(widget,config){
				UU.plugins(widget,config);
			},
			setPluginGroups : function(data){
				if(_UUPDT_Instance == null) return;
				_UUPDT_Instance.groupNames = data;
			},
			modifyConfig : function(f,v){
				UU.modifyConfig(f,v);
			},
			recoverConfig : function(config){
				UU.recoverConfig(config);
			},
			deleteCtrler : function(){
				if(UU.currendFocusid == null) return ;
				Chasonx.Alert({
          		  html : '确定删除该控件吗？',
          		  modal : true,
          		  alertType : 'warning',
          		  success : function(){
          			  UU.removeLiveCtrlItem(UU.currendFocusid);
          			  $("#" + UU.currendFocusid).remove();
          			  return true;
          		  }
          	  });
			},
			setCurrentFocusidEmplty : function(){
				UU.currendFocusid = null;
			},
			clearDrawPanel : function(){
				UU.clearDrawPanel();
			},
			getMainCtrlConf : function(){
				return UU.getLiveCtrlItem(UU.mainLiveCtrlId);
			},
			loadPluginGroups : function(fn){
				UCGS_DAO.getRecordList({modelName : 'PluginsGroup',orderBy : 'id'},function(data){
					 fn(data.reData);
				});
			},
			loadPluginList : function(fn){
				getAjaxData(DefConfig.Root + "/main/pdesigner/getPluginList",null,function(data){
					fn(data);
				});
			}
	};
	window.ChasonxDataPicker = DataSourceBind;
	
})(window,$);