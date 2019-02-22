/**
 * 开发模式
 * @desc 开发模式<br>
 * @author Chasonx<br>
 */
;(function(win,$,undefined){
	var _wbID = "ChasonxDevPanel007",
		_codePadID = "ChasonxCodePad007";
	
	var DevPattern = {
		  pluginGroup : [],
		  _codePadObj : null,
		  currentPluginID : null,
		  init : function(){
			  var _wbEle = ChasonTools.createEle({id : _wbID,type : 'div'});
			  _wbEle.innerHTML = '<div><font>我的插件</font></div>\
								  <div><font>编辑器</font></div>\
				  				  <div><font>教程</font></div>\
								  <div><font>关于</font></div>\
				  				  <div id="DevMovePanel"><i class="icon-games"></i></div>';
			  ChasonTools.AppendToBody(_wbEle);
			  
			  Chasonx.Drag($("#DevMovePanel")[0],$("#ChasonxDevPanel007")[0]);
			  this.handler();
			  this.getPGroup();
			  return this;
		  },
		  getPGroup : function(){
			  ChasonxTScaler.loadPluginGroups(function(data){
				  DevPattern.pluginGroup = data;
			  });
		  },
		  getPlugin : function(pid){
			  Chasonx.Wait.Show();
			  getAjaxData(DefConfig.Root + '/main/pdesigner/getPlugin',{pluginid : pid},function(data){
				  DevPattern._codePadObj.setValue(data.codeStr);
				  $("#ftitle").val(data.ftitle);
				  $("#fpluginame").val(data.fpluginame);
				  $("#fversion").val(data.fversion);
				  $("#fremark").val(data.fremark);
				  $("#fplugingroup").val(data.fplugingroup);
				  $("#ficon").val(data.ficon);
				  $("#iconSelector").html('<i class="'+ data.ficon +'"></i>');
				  DevPattern.currentPluginID = data.id;
				  
				  Chasonx.Wait.Hide();
			  });
		  },
		  getPGroupHtml : function(){
			  var line = '';
			  for(var i = 0,len = this.pluginGroup.length;i < len;i++)
				  line += '<option value="'+ this.pluginGroup[i].id +'">' + this.pluginGroup[i].ftitle + '/' + this.pluginGroup[i].fname +'</option>';
			  return line;
		  },
		  checkPluginame : function(T,fn){
			  var _this = $("#fpluginame")[0];
			  if(T == 1){
				  getAjaxData(DefConfig.Root + "/main/pdesigner/checkPluginName",{pluginName : _this.value},function(d){
					  if(d > 0){
						  _this.value = '';
						  _this.focus();
						  Chasonx.Hint.Faild('已经存在相同的插件名称了！');
					  }else{
						  fn();
					  }
				  });
			  }else{
				  fn();
			  }
		  },
		  createPlugin : function(T){
			 if(FormData.requiredByAttr("codePadAttributes",['input','textarea','select'])){
				 var data = FormData.getFormData("codePadAttributes",['input','textarea','select']);
				 
				 DevPattern.checkPluginame(T,function(){
					 data.groupName = $("#fplugingroup").find("option:selected").text().split("/")[1];
					 data.type = T;
					 if(T == 2){
						 data.id = DevPattern.currentPluginID;
						 data.pluginCodeStr = DevPattern._codePadObj.getValue();
					 }
					 getAjaxData(DefConfig.Root + '/main/pdesigner/savePlugin',data,function(d){
						 if(d > 0){
							 ChasonxTScaler.ready();
							 DevPattern.getPlugin(d);
						 }
					 });
				 });
			 }
		  },
		  handler : function(){
			  $("#ChasonxDevPanel007 > div").live('click',function(){
				  var idx = $(this).index();
				  switch(idx){
				  case 0: DevPattern.showPluginList(); break;
				  case 1: DevPattern.codePad(); break;
				  case 2: DevPattern.help(); break;
				  case 3: DevPattern.about(); break;
				  }
			  });
			  $("#createPlugin").live('click',function(){
				  DevPattern.createPlugin(1);
			  });
			  $("#runingPlugin").live('click',function(){
				  if(DevPattern.currentPluginID == null) return;
				  DevPattern.createPlugin(2);
			  });
			  
			  var _this = this;
			  $("#iconSelector").live('click',function(){
				  var _tele = $(this);
				  if(_this.tipsPanelHtml == null){
						var html = '<div class="menuIconBox">';
						$.each(UCGS_ICON,function(i,u){
							html += '<span class="'+ u +'"></span>';
						});
						html += '</div>';
						_this.tipsPanelHtml = html;
						
						$(".menuIconBox > span").live('click',function(){
							_tele.html('<i class="'+ this.getAttribute('class') +'"></i>');
							$("#ficon").val(this.getAttribute('class'));
						});
					}
				  _this.tipsPanel = Chasonx.Tips.Show({id: this,text:_this.tipsPanelHtml,width:340,height:250});
			  });
			  
			  $("#codePadArrow_left").live('click',function(){
				  DevPattern.showPluginList();
			  });
			  $(".pluginList > div").live('click',function(){
				  DevPattern.getPlugin(this.getAttribute('data'));
			  });
			  
			  $("#codePadArrow_right").live('click',function(){
				  DevPattern.help();
			  });
		  },
		  codePad : function(){
			  if(this._codePadObj == null){
				  var codeP = ChasonTools.createEle({id : _codePadID,type : 'div'});
				  codeP.innerHTML = '<div class="title" id="codePadDragTitle"><span title="插件列表" id="codePadArrow_left" class="icon-keyboard_arrow_left"></span>插件编辑器<span title="教程" id="codePadArrow_right" class="icon-keyboard_arrow_right"></span></div>\
					  				 <div class="pluginList"></div>\
					  				 <div class="pluginHelp"><iframe src="' + DefConfig.Root + '/res/plugs/mod/pdesigner/help/TScaler.html' + '"></iframe></div>\
					  				 <div class="left" id="codePadAttributes">\
					  				  <label>插件标题：</label><input type="text" id="ftitle" req="true" placeholder="电视页面"/>\
					  				  <label>插件名称：</label><input type="text" id="fpluginame"  req="true" placeholder="std"/>\
					  				  <label>版本：</label><input type="text" id="fversion" req="true" placeholder="0.0.1"/>\
					  				  <label>控件组：</label><select  req="true" id="fplugingroup">'+ DevPattern.getPGroupHtml() +'</select>\
					  				  <label>图标：</label>\
					  				  <label><input type="text" id="ficon" style="width:118px;float:left;"/><span class="icon" id="iconSelector"></span></label>\
					  				  <label>备注：</label><textarea rows="8"  req="true" id="fremark"></textarea>\
					  				  <span class="runBtn" id="createPlugin">创建插件</span><span id="runingPlugin" class="runBtn">运行</span>\
					  				 </div>\
					  				 <div id="devCodePadMirror" class="right"></div>';
				  ChasonTools.AppendToBody(codeP);
				  
				  this._codePadObj = CodeMirror($("#devCodePadMirror")[0],{
						extraKeys: {"Ctrl-Space": "autocomplete"},
						theme : "base16-dark",
						height : '100%',
						autoMatchParens : true,
						lineNumbers : true
					});
				  this._codePadObj.setSize('100%','100%');
				  
				  Chasonx.Drag($("#codePadDragTitle")[0],$("#" + _codePadID)[0]);
			  }else{
				  var _codPad = $("#" + _codePadID);
				  if(!_codPad.is(":hidden")) _codPad.hide(200);
				  else _codPad.show(200);
			  }
		  },
		  about : function(){
			  new Chasonx({
				 title : '关于',
				 html : '<br><p style="text-align:center;"><font size="5" color="#229ffd"><b>T&D v0.0.1</b></font></p>\
					 	 <br><p style="width:80%;margin:0px auto;"><label class="devAboutLabel">名称：</label>TScaler 模板设计器开发模式 </p>\
					 	 <p style="width:80%;margin:0px auto;"><label class="devAboutLabel">快捷键：</label>空格 + C -> 调出/隐藏编辑器<br>\
					 			<label class="devAboutLabel"></label>空格 + D -> 显示插件列表 <br>\
					 			<label class="devAboutLabel"></label>空格 + R -> 运行 <br>\
					 			<label class="devAboutLabel"></label>空格 + E -> 显示教程 </p>\
					     <p style="width:80%;margin:0px auto;"><label class="devAboutLabel">作者：</label>Chasonx</p>\
					     <p style="width:80%;margin:0px auto;"><label class="devAboutLabel">更新时间：</label>build:20170420180888</p>',
				 modal : true,
				 width : 400,height : 300
			  });
		  },
		  showPluginList : function(){
			  if(this._codePadObj == null) this.codePad();
			  else if($("#" + _codePadID).is(":hidden")) $("#" + _codePadID).show(200);
			  
			  var _this = $(".pluginList");
			  if(~~(_this.css('left').replace('px','')) == 0){
				  _this.css('left','-199px');
				  
				  ChasonxTScaler.loadPluginList(function(data){
					  var line = '';
					  $.each(data,function(i,u){
						  line += '<div data="'+ u.id +'"><i class="'+ u.ficon +'"></i>'+ u.ftitle +'</div>';
					  });
					  $(".pluginList").html(line);
				  });
				  
				  $("#codePadArrow_left").addClass('codePadArrowTurnRight');
			  }else{
				  _this.css('left','0px');
				  $("#codePadArrow_left").removeClass('codePadArrowTurnRight');
			  }
		  },
		  help : function(){
			  if(this._codePadObj == null) this.codePad();
			  else if($("#" + _codePadID).is(":hidden")) $("#" + _codePadID).show(200);
			  
			  var _this = $(".pluginHelp");
			  if(~~(_this.css('right').replace('px','')) == 0){
				  _this.css('right','-599px');
				  $("#codePadArrow_right").addClass('codePadArrowTurnRight');
			  }else{
				  _this.css('right','0px');
				  $("#codePadArrow_right").removeClass('codePadArrowTurnRight');
			  }
		  }
	};

	$(document).ready(function(){
		DevPattern.init();
		
		var keyCodes = [];
		document.onkeydown = function(e){
			e = e || window.event;
			switch(e.keyCode){
			case 32:
			case 67:
			case 68:
			case 69:
				keyCodes[e.keyCode] = true;
				break;
			}
		};
		document.onkeyup = function(e){
			e = e || window.event;
			
			if(keyCodes[32] && keyCodes[67]) DevPattern.codePad();
			if(keyCodes[32] && keyCodes[68]) DevPattern.showPluginList();
			if(keyCodes[32] && keyCodes[69]) DevPattern.help();
			keyCodes[e.keyCode] = false;
		};
	});
	
})(window,$);