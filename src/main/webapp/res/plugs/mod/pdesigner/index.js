
window.onload = function(){
	Chasonx.Frameset({
	      window : {
	          top : { id : 'PD_Top', height : '55px',border:false,bgColor : '#242526',color:'#f6f6f6'},
	          left: { id:'PD_Left' , title : '控件列表' , width : '15%',border:false,bgColor : '#2e2e2e'},
	          right:{ id:'PD_Rigth',bgColor : '#FFFFFF',border:false,title : '设计<div id="Ctrl_List" class="ChasonxP_transition">模板列表</div><div id="Ctrl_Clear" class="ChasonxP_transition">清空编辑区</div>\
	        	  							<div class="ChasonxP_currEdit"></div><div id="viewCode" class="viewCode" title="显示源码">View Code</div>'},
	          bottom:{ id : 'PD_Bottom',height:'30px',bgColor : '#2e2e2e'}
	      }
	});
	
	var _CodeMirror = null;
	$("#viewCode").live('click',function(){
		var _view = $("#codeViewerPanel");
		if(_view.css('display') == 'none'){
			_view.show();
			$(this).addClass('viewCodeFocus');
			
			if(_CodeMirror == null){
				_CodeMirror = CodeMirror(_view[0],{
					readOnly : "nocursor",
					extraKeys: {"Ctrl-Space": "autocomplete"},
					theme : "base16-dark",
					height : '100%',
					autoMatchParens : true,
					lineNumbers : true
				});
				_CodeMirror.setSize('100%','100%');
			}
		}else{
			_view.hide();
			$(this).removeClass('viewCodeFocus');
		}
		_CodeMirror.setValue(HTMLFormat($("#PD_Designer").html()));
	});
	
	$("#Ctrl_List").live('click',function(){
		var _this = $(this);
		var dis = $(".ChasonxP_TemplateList");
		
		if(dis.css('display') == 'none'){
			PDesigner.getTemplateList(function(d){
				_this.addClass('Ctrl_List_Focus');
				var left = _this.offset().left,top = _this.offset().top;
				var dataGrid = $(".ChasonxP_TemplateList");
					dataGrid.css('left',left).css('top',top + _this.height()).show();
				var line = '';
				$.each(d,function(i,u){
					line += '<div data="'+ u.fguid +'" url="'+ u.furl +'"><i class="icon-IE"></i>'+ u.ftitle +'<span title="预览" onclick="PDesigner.showPreview(\''+ u.fguid +'\')">预览</span><span title="编辑" onclick="PDesigner.reEdit(\''+ u.fguid +'\')">编辑</span></div>';
				});
				dataGrid.html(line);
			});
		}else{
			dis.hide();
			_this.removeClass('Ctrl_List_Focus');
		}
	});
	
	Chasonx.Tips.Move({id:'PD_DataSorce',direction:'bottom',text:'<br>提示：设置页面主数据源后即可为相关控件绑定数据.'});
	
	$("#PD_Left_box > div").eq(0).css('background','#363636').css('font-size','12px');
	$("#PD_Rigth_box > div").eq(0).css('background','#363636');
	
	$("#_ChasonxAttr-bgColor,#_ChasonxAttr-borderColor,#_ChasonxAttr-fontColor").ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).parent().find('.color').css('background-color','#' + hex);
			$(el).ColorPickerHide();
			
			ChasonxTScaler.modifyConfig(el.id.split('-')[1],el.value);
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		}
	});
	$("#_ChasonxAttr-focusColor").ColorPicker({
		onSubmit: function(hsb, hex, rgb, el) {
			$(el).val(hex);
			$(el).parent().find('.color').css('background-color','#' + hex);
			$(el).ColorPickerHide();
			
			ChasonxTScaler.modifyConfig('focusColor',el.value);
		},
		onBeforeShow: function () {
			$(this).ColorPickerSetColor(this.value);
		}
	});
	
	$("span[class='ChasonxP_slideBase mult']").live('click',function(){
		var i = $(this).parent().find('input');
		if(i.val() == '') i.val(0);
		if(~~i.val() < 1) return;
		i.val(~~i.val() - 1);
		ChasonxTScaler.modifyConfig(i[0].id.split('-')[1],i.val());
	});
	
	$("span[class='ChasonxP_slideBase add']").live('click',function(){
		var i = $(this).parent().find('input');
		if(i.val() == '') i.val(0);
		if(~~i.val() > 9999) return;
		i.val(~~i.val() + 1);
		ChasonxTScaler.modifyConfig(i[0].id.split('-')[1],i.val());
	});
	
	$(".ChasonxP_slideInput > input").live('mousewheel',function(event,delta){
		if(document.activeElement == this){
			if(this.value == '') this.value = 0;
			if(delta > 0 && this.value < 9999) this.value = ~~this.value + 1;
			else if(delta < 0 && this.value > 0) this.value = ~~this.value - 1;
			
			ChasonxTScaler.modifyConfig(this.id.split('-')[1],this.value);
		}
	});
	
	$("#_ChasonxAttr-bgmRepeat").live('change',function(){
		ChasonxTScaler.modifyConfig(this.id.split('-')[1],this.value);
	});
	
	$(".ChasonxP_bg > span").live('click',function(){
		$(this).parent().find('.ChasonxP_fontAlignFocus').removeClass('ChasonxP_fontAlignFocus');
		$(this).addClass('ChasonxP_fontAlignFocus');
		var idx = $(this).index();
		ChasonxTScaler.modifyConfig('fontAlign',idx == 0?'left':(idx == 1?'center':'right'));
	});
	
	$("#ChasonxP_browserBtn_bgImg").live('click',function(){
		fileDialogHtml(PDesigner.getSite('fguid'),function(ck){
			var prewimgsrc = ck.parent().find('img').attr('src');
			$("#_ChasonxAttr-bgImg").val(prewimgsrc);
			ChasonxTScaler.modifyConfig('bgImg',prewimgsrc);
		});
	});
	
	$("#ChasonxP_browserBtn_img").live('click',function(){
		fileDialogHtml(PDesigner.getSite('fguid'),function(ck){
			var prewimgsrc = ck.parent().find('img').attr('src');
			$("#_ChasonxAttr-img").val(prewimgsrc);
			ChasonxTScaler.modifyConfig('src',prewimgsrc);
		});
	});
	
	$("#ChasonxP_browserBtn_Focusimg").live('click',function(){
		fileDialogHtml(PDesigner.getSite('fguid'),function(ck){
			var prewimgsrc = ck.parent().find('img').attr('src');
			$("#_ChasonxAttr-focusImg").val(prewimgsrc);
			ChasonxTScaler.modifyConfig('focusImg',prewimgsrc);
		});
	});
	
	$("#ChasonxP_browserBtn_href").live('click',function(){
		var siteGuid = PDesigner.getSite('fguid');
		if(siteGuid == '') return Chasonx.Hint.Faild('请选择站点');
		
		Chasonx.Wait.Show();
		new Chasonx({
			title : '页面列表',
			html : '<div id="_SiteTemplateListPanel"></div>',
			width : 600,height:500,
			modal : true,
			success : function(){
				var _E = $("#_SiteTemplateListPanel > div[class='SiteTLP_Focus']");
				ChasonxTScaler.modifyConfig('href',DefConfig.previewBasePath + '/' + _E.attr('data'));
				$("#_ChasonxAttr-href").val(_E.text());
				return true;
			}
		});
		
		PDesigner.getTemplateList(function(data){
			var line = '';
			$.each(data,function(i,u){
				line += '<div data="'+ u.fguid +'" url="'+ u.furl +'" onclick="_modifyHref(this)"><i class="icon-IE"></i>&nbsp;'+ u.ftitle +'</div>';
			});
			$("#_SiteTemplateListPanel").html(line);
		});
	});
	
	$("#PD_Designer").live('click',function(e){
		e = e || window.event;
		if(e.target.id == this.id)
			$('.ChasonxP_Focus').removeClass('ChasonxP_Focus');
	});
	
	$("#_ChasonxAttr-mainDraw").live('change',function(){
		ChasonxTScaler.modifyConfig('mainDraw',this.value);
	});
	
	$(".siteDataItems").bind('click',function(){
		var _panel = $(".ChasonxP_SiteItem_Panel");
		if(_panel.css('display') == 'none'){
			var offset = $(this).offset(),w =  200 - $(this).width(),h = $(this).height();
			_panel.css('top',(offset.top + h - 2) + 'px').css('left',(offset.left - w) + 'px').slideDown('fast');
		}else{
			_panel.slideUp('fast');
		}
	});
	
	$(".ChasonxP_SiteItem_Panel > div").live('click',function(){
		PDesigner.siteCurrIdx = $(this).attr('idx');
		if(PDesigner.mainPara.legnth > 0){
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定更改主数据源吗?',
				modal : true,
				success : function(){
					PDesigner.mainPara = [];
					return true;
				}
			});
		}
		$(".siteDataItems > .left").html('<span class="ChasonxP_SiteItem_Panel_span"></span>' + $(this).text());
		$(".ChasonxP_SiteItem_Panel").slideUp('fast');
	});
	
	$("#Ctrl_Clear").live('click',function(){
		ChasonxTScaler.clearDrawPanel();
	});
	
	ChasonxTScaler.ready();
	PDesigner.loadSite();
	ChasonTools.delayRun(function(){
		var _Guid = StrKit.getSearchParam('guid');
		PDesigner.reEdit(_Guid);
	},1500);
};

function _modifyHref(_E){
	$("#_SiteTemplateListPanel > div").removeClass('SiteTLP_Focus');
	$(_E).addClass('SiteTLP_Focus');
}

function dataSourceItem(obj){
	var _this = $(obj);
	var guid = _this.attr('guid').replace(/[-]/ig,''),_showP = $("#" + guid);
	var _data = PDesigner.pageData[_this.attr('guid')];
	if(_showP[0] == undefined && _data){
		var line = '<div id="'+ guid +'">',lv = ~~_this.attr('level') + 1,hasC;
		if(_data.Columns){
			$.each(_data.Columns,function(i,u){
				hasC = false;
				if(PDesigner.checkChild(u.Id) != '') hasC = true;
				line += '<span onclick="dataSourceItem(this)" level="'+ lv +'" guid="'+ u.Id +'"><b style="margin-left:'+ (hasC?(lv-1)*18:lv*18) +'px;">'+ (hasC?'+':'') +' {</b><u> Column:'+ u.Name +'</u> [TopicSize : '+ u.TopicSize +']<b>}</b></span>';
			});
		}
		if(_data.Topics.length > 0){
			$.each(_data.Topics,function(i,u){
				line += '<p style="left:'+ (lv*18) +'px;"><font>Topic:</font> '+ u.Name +'</p><br>';
				if(i > 5) return false;
			});
		}
		
		line += '</div>';
		_this.after(line);
		_this.find('b').eq(0).html('- {');
	}else{
		if(_showP.css('display') == 'block'){
			_showP.hide();
			_this.find('b').eq(0).html('+ {');
		}else if(_showP.css('display') == 'none'){
			_showP.show();
			_this.find('b').eq(0).html('- {');
		}
	}
}

var PDesigner = {
		siteItems : null,
		siteCurrIdx : -1,
		pageData : null,
		modifyEntity : null,
		mainPara : [],
		dataSetState : false,
		baseDataUrl : '/UCGS/data/uRequest/unifyJson',
		getSite : function(field){
			if(this.siteCurrIdx == -1){
				return '';
			}
			if(field != undefined && field != '') return this.siteItems[this.siteCurrIdx][field];
			return this.siteItems[this.siteCurrIdx]
		},
		getSiteIdx : function(guid){
			var idx = -1;
			for(var i in this.siteItems){
				if(this.siteItems[i].fguid == guid){
					idx = i;
					break;
				}
			}				
			return idx;
		},
		dataConfigInit : function(siteGuid){
			$(".ChasonxP_SiteItem_Panel > div").eq(this.getSiteIdx(siteGuid)).click();
			PDesigner.dataSetState = true;
			$("#PD_DataSorce > b").html('已设置');
		},
		loadSite : function(areaGuid){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'del':0,'PageNumber':0,'PageSize':100,'areaguid' : (areaGuid || '')},function(d){
				Chasonx.Wait.Hide();
				PDesigner.siteItems = d.list;
				var item = '';
				$.each(d.list,function(i,u){
					item += '<div idx="'+ i +'"><span class="ChasonxP_SiteItem_Panel_span"></span>&nbsp;&nbsp;'+ u.fsitename +'</div>';
				});
				$(".ChasonxP_SiteItem_Panel").html(item);
			});
		},
		setDataPara : function(obj,B){
			var iv = B?$(obj).next():null,v;
			if(B == true){
				if(iv == null || iv.val() == '') return;
				else v = iv.val();
			}else{
				v = true;
			}
			var add = true,_idx;
			for(var i = 0,len = this.mainPara.length;i < len;i++){
				if(this.mainPara[i].P == obj.value){
					add = false;
					_idx = i;
					break;
				}
			}
			if(obj.checked){
				if(add) this.mainPara.push({P : obj.value,V : v});
				else this.mainPara[_idx].V = v;
			}else if(!add){
				this.mainPara.splice(_idx,1);
			}
			
			$("#mainParaShow").html(this.showPara());
			this.showData();
		},
		getPvalue : function(para){
			var res = "";
			for(var i = 0;i < this.mainPara.length;i ++){
				if(para == this.mainPara[i].P){
					res = this.mainPara[i].V;
				}
			}
			return res;
		},
		loadDataSource : function(){
			if(this.siteCurrIdx == -1) return Chasonx.Hint.Faild({text:'请先在这里设置站点 ☝<br>请先在这里设置站点 ☝<br>请先在这里设置站点 ☝',hor:40});
			var ws = ChasonTools.getWindowSize();
			new Chasonx({
				title : '数据绑定设置(主题数据只展示最多5条作为示例)',
				html  : '<div id="dataSourcePanel"><div class="top"></div><div class="left"></div>\
					     <div class="right"><div id="ChooseDataSourcePanel">\
						 <font>提示：当前展示的数据仅供参考.</font>\
					     <p><label for="colGuid_Ck">栏目标识符：</label><input id="colGuid_Ck" onclick="PDesigner.setDataPara(this,true)" type="checkbox" value="colGuid" '+ this.getPvalue('colGuid') +'/></p>\
						 <p><label for="colLevel_Ck">栏目级数：</label><input id="colLevel_Ck" onclick="PDesigner.setDataPara(this,true)" type="checkbox" value="level" /><input type="text" onkeyup="if(window.event.keyCode == 8) return this.value = this.value.substring(0,(this.value.length > 0)?this.value.length - 1:0);; if(!RegexNumbber(this.value)){ this.value = this.value.replace(/[^0-9,]*/gi,\'\');}" />数字以\',\'号隔开 ex：1,2</p>\
						 <p><label for="getTopic_Ck">显示主题数据：</label><input id="getTopic_Ck" type="checkbox" onclick="PDesigner.setDataPara(this,false)" value="getTopic" '+ (this.getPvalue('getTopic') == ""?"":'checked="checked"') +'/></p>\
						 <p><label for="getTopicurl_Ck">是否包含主题地址：</label><input id="getTopicurl_Ck" type="checkbox" onclick="PDesigner.setDataPara(this,false)" value="getPreview" '+ (this.getPvalue('getPreview') == ""?"":'checked="checked"') +'/></p>\
					     </div></div></div>',
				width : ws[2]*0.7,height : ws[3]*0.8,
				modal : true,
				success : function(){
					PDesigner.dataSetState = true;
					$("#PD_DataSorce > b").html('已设置');
					return true;
				}
			});
			var _siteItem = this.getSite();
			if(this.mainPara.length == 0)  PDesigner.mainPara.push({P : 'aliasName',V : _siteItem.fsitealias});
			this.showData();
		},
		showData : function(){
			var _para = this.showPara();
			$("#dataSourcePanel > .top").html('RequestURL : '+ this.baseDataUrl +' , RequestPara : <span id="mainParaShow">'+ _para +'</span>');
			Chasonx.Wait.Show();
			getAjaxData(this.baseDataUrl + '?' + _para,null,function(d){
				PDesigner.pageData = d;
				var line = '<span guid="'+ d.NodeNames[0] +'"><font>Node</font> :<font color="red"> '+ d.NodeNames[0] +'</font></span>\
				    		<div id="'+ d.NodeNames[0].replace(/[-]/gi,'') +'">',hasC;
				$.each(d[d.Node[0]].Columns,function(i,u){
					hasC = false;
					if(PDesigner.checkChild(u.Id) != '') hasC = true;
					line += '<span onclick="dataSourceItem(this)" level="1" guid="'+ u.Id +'"><b>'+ (hasC?'+':'')  +'{</b><u> Column：'+ u.Name +'</u>[TopicSize: '+ u.TopicSize +']<b>}</b></span>';
				});
				line += '</div>';
				$("#dataSourcePanel > .left").html(line);
				Chasonx.Wait.Hide();
			});
		},
		showPara : function(){
			var str = '';
			for(var i = 0,len = this.mainPara.length;i < len;i++){
				str += this.mainPara[i].P + '=' + this.mainPara[i].V;
				if(i < (len - 1)) str += '&';
			}
			return str;
		},
		checkChild : function(field){
			return this.pageData[field] && this.pageData[field].Columns != undefined && this.pageData[field].Columns.length > 0?'+':'';
		},
		newPage : function(){
			new Chasonx({
				title : '页面参数',
				html : '<div id="PageParaPanel"></div>',
				modal:true,
				width:300,height:250,
				success : function(){
					
				}
			});
			ChasonxDom.draw({
				  id : 'PageParaPanel',
				  item : [
				      {text:'&nbsp;',type:'br',info:'&nbsp;'},
				      {text:'页面宽:',name:'PageWidth',attr:'maxlength="5" ',type:'input',etype : 'number'},
				      {text:'页面高:',name:'PageWidth',attr:'maxlength="5" ',type:'input',etype : 'number'}
				      ]
			});
		},
		saveTemplate : function(type){
			if(ChasonxTScaler.liveCtrlContainer().length == 0) return Chasonx.Hint.Faild('先设计一下吧');
			if(type == 2 && this.modifyEntity == null) return;
			
			var _pageConfig = ChasonxTScaler.getMainCtrlConf();
			var _title = type == 2?PDesigner.modifyEntity.ftitle:'';
			var dataUrl = this.baseDataUrl + '?' + this.showPara();
			new Chasonx({
				title : '保存模板页面',
				html : '<div id="saveTemplatePanel"></div>',
				width: 500,height:400,
				success : function(){
					if(!FormData.requiredByAttr('saveTemplatePanel',['input'])) return false;
					
					Chasonx.Wait.Show('页面保存中，请稍候...');
					var siteguid = PDesigner.getSite('fguid');
					var data = FormData.getFormData('saveTemplatePanel',['input','select','textarea']);
					Ghtml.html(function(str){
						data['fsiteguid'] = siteguid;
						data['fhtmldata'] = str;
						data['fhtmlconf'] = Ghtml.getArrayToString();
						data['furl'] = dataUrl;
						data['type'] = type;
						data.UCGSFORMDATAFILTER = $("#_UCGSFORMDATAFILTER").val();
							
						if(type == 2) {
							data.id = PDesigner.modifyEntity.id;
							data.fsiteguid = PDesigner.modifyEntity.fsiteguid;
						}	
						
						getAjaxData(DefConfig.Root + '/main/pdesigner/modifyPage',data,function(d){
							if(d != 0){
								$("#_UCGSFORMDATAFILTER").val(d.Token);
								Chasonx.Hint.Success('页面已保存');
							}else{
								Chasonx.Hint.Faild('页面保存失败');
							}
							Chasonx.Wait.Hide();
						});
					},_title);
					
					return true;
				},
				modal : true
			});
			
			ChasonxDom.draw({
				  id : 'saveTemplatePanel',
				  item : [
				      {text:'&nbsp;',type:'br',info:'&nbsp;'},
				      {text:'模板名称:',name:'ftitle',type:'input',attr : ' req="true" ',value : _title},
				      {text:'应用设备类型:',name:'fdevicetype',attr:' req="true" ',type:'select',options : DeviceTypeInfo,value : (PDesigner.modifyEntity.fdevicetype || '')},
				      {text:'设备描述:',name:'fdevicedesc',type:'input',attr : ' req="true" ',value : (PDesigner.modifyEntity.fdevicedesc || '')},
				      {text:'模板分辨率:',info : 'width:<input type="number" id="fwidth" class="inputText" min="0" style="width:80px;" value="'+ (PDesigner.modifyEntity.fwidth || _pageConfig.config.attr.width) +'"/>\
				    	  						 height:<input type="number" id="fheight" class="inputText" min="0" style="width:80px;" value="'+ (PDesigner.modifyEntity.fheight || _pageConfig.config.attr.height) +'"/>'},
				      {text:'模板描述:',type : 'textarea',name : 'fremark'}
				      ]
			});
		},
		reEdit : function(_guid){
			if(StrKit.isBlank(_guid)) return;
			
			$(".ChasonxP_TemplateList").hide();
			$("#Ctrl_List").removeClass('Ctrl_List_Focus');
			_EDITLOADING();
			
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/pdesigner/templateEntity',{'guid':_guid},function(d){
				PDesigner.modifyEntity = d;
				
				var baseUrl = d.furl;
				if(baseUrl.indexOf("?") != -1) baseUrl = baseUrl.substring(baseUrl.indexOf("?") + 1,baseUrl.length);
				baseUrl = baseUrl.split("&");
				
				var _temp;
				for(var i = 0;i < baseUrl.length;i++){
					_temp = baseUrl[i].split('=');
					PDesigner.mainPara.push({P : _temp[0], V : _temp[1]});
				}
				ChasonxTScaler.recoverConfig(JSON.parse(d.fhtmlconf));
				PDesigner.dataConfigInit(d.fsiteguid);
				
				Chasonx.Wait.Hide();
			});
		},
		getTemplateList : function(callback){
			var siteguid = this.getSite('fguid');
			if(siteguid == '') return Chasonx.Hint.Faild('请先选择站点');
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/pdesigner/pageList',{'siteGuid':siteguid},function(d){
				//page template list
				callback(d);
				Chasonx.Wait.Hide();
			});
		},
		previewTemplate : function(){
			Ghtml.html();
		},
		showPreview : function(_guid){
			window.open(DefConfig.Root + '/data/preview/' + _guid);
		},
		getArrayToString : function(_array){
			for(var i = 0,len = _array.length;i < len;i ++){
				for(var c in _array[i]){
					if(typeof _array[i][c] == 'function') _array[i][c] =  _array[i][c].toString();
				}
			}
			return JSON.stringify(_array);
		}
};

function _EDITLOADING(){
	$("#logo").addClass('LogoRotate');
	setTimeout(function(){ $("#logo").removeClass('LogoRotate'); },1000);
}


