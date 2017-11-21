var contentEditor,setDataTimeout,$LinkImageItems;

function EditerInit(W,H){
	KindEditor.ready(function(K) {
		contentEditor = K.create('#etopicContent', {
			bindMethod : 'EtopicSet.openResDialog',
			width : W,
			height: H,
			allowPreviewEmoticons : false,
			allowImageUpload : false,
			autoHeightMode : false,
			resizeType:0,
			htmlTags:{
				font : ['color', 'size', 'face', '.background-color'],
		        span : [
		                '.color', '.background-color', '.font-size', '.font-family', '.background',
		                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
		        ],
		        div : [
		                'align', '.border', '.margin', '.padding', '.text-align', '.color',
		                '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
		                '.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		        ],
		        table: [
		                'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
		                '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
		                '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
		                '.width', '.height', '.border-collapse'
		        ],
		        'td,th': [
		                'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
		                '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
		                '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
		        ],
		        img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
		        'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
		                'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
		                '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		        ],
		        pre : ['class'],
		        hr : ['class', '.page-break-after'],
		        'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del,&nbsp;' : []
			},
			items : [
				'source','undo', 'redo', '|',  'template',  'cut', 'copy', '|', 'justifyleft', 'justifycenter', 'justifyright',
				'justifyfull','|', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent','|','subscript',
				'superscript', 'clearhtml','/', 'quickformat', 'selectall', '|','formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor','|', 'bold',
				'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 
				 'table','fullscreen','imgsource'],
			afterChange : function() {
				
				//getEditersImg
				//$($(".ke-edit-iframe")[0].contentDocument.body).find('img').attr('src')
				
				if(setDataTimeout) clearTimeout(setDataTimeout);
				setDataTimeout = setTimeout(function(){
					var _size = contentEditor.count('text');
					if(_size > 0 && EtopicSet.setInput){
						EtopicSet.currPage = contentEditor.html();
						$("#pageCurr").html('当前输入');
					}
					if(_size == 0){
						EtopicSet.currPage = '';
						$("#pageCurr").html('未输入');
					}
					if(_size > 134 && $("#fsummary").val() == ''){
						$("#fsummary").val(contentEditor.text().replace(/\s+/ig,'').replace(/<img[^>]*>/ig,'').substring(0,140) + '......');
					}
					if(EtopicSet.currInx != null && !EtopicSet.setInput && _size > 0){
						EtopicSet.pageData[EtopicSet.currInx] = contentEditor.html();
					}
					
					
					var zoom,w,h;
					$LinkImageItems = $(".ke-edit-iframe").contents().find('img');
					if($LinkImageItems.size() > 0){
						if($(".linkImages").width() == 0 && ETOPIC_OPEN_SOURCE){
							$(".slideBtn").click();
							ETOPIC_OPEN_SOURCE = false;
						}
						$LinkImageItems.each(function(){
							w = $(this).width();
							h = $(this).height();
							zoom = (Math.min(Math.min(120/w,1),Math.min(150/h,1))).toFixed(3);
							ImageDown.add($(this).attr('src'),~~(w*zoom),~~(h*zoom));
						});
					}
					
				},200);
			}
		});
	});
}

function PageContentSet(){
	
	var scal = $("#pageScaling").val();
	
	var currHtml = contentEditor.html();
	$("#editContentPanel").html('<div id="etopicContent"></div>');
	
	if($("#pageSetting").val() == ''){
		EditerInit('98%','500px');
	}else{
		var px = $("#pageSetting").val().split('*');
		EditerInit((~~px[0]*scal || null) + 'px',(~~px[1]*scal || null) + 'px');
	}
	contentEditor.html(currHtml);
}

var ETOPIC_TYPE_VAL = 0;
var ETOPIC_OPEN_SOURCE = true;

$(document).ready(function(){
	
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '52px',border:false,bgColor:false},
			left : {id : 'leftPanel',width : '0%',border:false,bgColor:false},
			right: {id : 'rightPanel',border:false,bgColor:false}
			}
	});
	
	Chasonx.DragBox({
		target : 'rightPanel',
		lineColor : _GetBoxLineColor(),
		items : [
		         {id : 'DragLeftPanel',width : '10'},
		         {id : 'DragCenterPanel' ,width : '10'},
		         {id : 'DragRightPanel',width : '80'}
		        ]
	});
	
	
	ETOPIC_TYPE_VAL = ($("#_topicClass").val() != undefined? $("#_topicClass").val():0);
	
	Area.list('topicAreaPanel',[],function(){
		EtopicSet.siteList(Area.currArea.fguid);
	});
	EtopicSet.siteList();
	EditerInit('98%','500px');
	
	setTimeout(function(){
		EtopicSet.contentInit();
	},200);
	
	$("#siteItems").bind('change',function(){
		PublicCol.list('topicColTree',{'id':$(this).val(),'name':$(this).find('option:selected').text(),'state':1},function(node){
			EtopicSet.columnData = node;
		});
		
		_templateListload($(this).val());
	});
	
	var op = '';
	$.each(TopicAttr.page.data,function(i,u){
		op += '<option value="'+ u.v +'">'+ u.t +'</option>';
	});
	$("#pageSetting").html(op).bind('change',function(){
		PageContentSet();
	});
	
	$("#pageScaling").bind('change',function(){
		PageContentSet();
	});
	
	
	$(".pagePanelBox > .pageItem").live('click',function(){
		EtopicSet.setPageContent(1, $(this).index());
		$(".pagePanelBox > .pageItem").css('border-color','black');
		$(this).css('border-color','#000');
	});
	$(".pagePanelBox > .pageItem > span").live('click',function(){
		var index = $(this).parent().index();
		Chasonx.Alert({alertType:'warning',html:'确定删除该页吗?',close:true,modal:true,success:function(){
			EtopicSet.delPage(index);
		}});
	});
	
	$("#labelBox > span").live('click',function(){
		var _v = $("#flable").val(),_s = $(this).html();
		
		if(_v.indexOf(_s) < 0)	_v += _s + ",";
		else	_v = _v.replace(_s + ',','');
		
		var vdata = _v.split(',');
		if(vdata.length > 4) return;
		
		$("#labelPanel").html('');
		for(var n = 0;n < vdata.length;n++) if(vdata[n] != '')  $("#labelPanel").append('<span class="labelMore">'+ vdata[n] +'</span>');
		$("#flable").val(_v);
	});
	
	$(".etopicClass > span").live('click',function(){
		$(".topicClassBtn").each(function(){
			$(this).removeClass($(this).attr('id') + 'Focus');
			$("#" + $(this).attr('for')).hide();
		});
		$("#" + $(this).attr('for')).show();
		$(this).addClass($(this).attr('id') + 'Focus');
		ETOPIC_TYPE_VAL = $(this).index();
	});
	
	$(".etopicClass > span").eq(ETOPIC_TYPE_VAL).click();
	
	Chasonx.Tips.Move({id:'pageSetting',direction:'bottom',text:'该选项意在编辑内容时提供视图区域参考，编辑时不超出编辑框可见区域然后分页，效果最佳。'});
	
	var label = '';
	$.each(TopicAttr.types.data,function(i,u){
		label += '<span class="badge badge_blue">'+ u.t +'</span>';
	});
	$("#labelBox").html(label);
	
	$(".linkImages > .slideBtn").bind('click',function(){
		if($(this).attr('_open') == 'true'){
			$(".linkImages").css('width','0px');
			$(this).html('展开资源').attr('_open','false');
		}else{
			$(".linkImages").css('width','220px');
			$(this).html('收起').attr('_open','true');
		}
	});
	
	$("#linkImagePanel > .item > b").live('click',function(){
		ImageDown.remove($(this).parent().find('img').attr('src'));
		$(this).parent().remove();
	});
	
	$("#linkImagePanel > .item > span").live('click',function(){
		ImageDown.doing($(this).parent().index());
	});
	
	$("#_downall").bind('click',function(){
		ImageDown.downAll();
	});
	$("#_clearall").bind('click',function(){
		ImageDown.clear();
	});
});

var EtopicSet = {
		currPage : null,
		pageData : [],
		setInput : true,
		currInx : null,
		artState : 0,
		labelData : null,
		columnData : null,
		addPage : function(){
			if(contentEditor.count('text') > 0){
				
				this.pageData.push(contentEditor.html());
				contentEditor.html('');
				this.currPage = '';
				$(".pagePanelBox").append('<div class="pageItem"><span></span>'+ ($(".pagePanelBox > .pageItem").size() + 1) +'</div>');
			}else{
				Chasonx.Hint.Success({text:'输入点内容吧'});
			}
		},
		setPageContent : function(type,inx){
			if(type == 0){
				contentEditor.html(this.currPage);
				this.setInput = true;
				this.currInx = null;
				
				$(".pagePanelBox > .pageItem").css('border-color','black');
			}else{
				this.setInput = false;
				this.currInx = inx;
				contentEditor.html(this.pageData[inx]);
			}
		},
		delPage : function(inx){
			this.pageData.splice(inx, 1);
			$(".pagePanelBox > .pageItem").eq(inx).detach();
			this.pageInit();
		},
		pageInit : function(){
			$(".pagePanelBox > .pageItem").each(function(){
				$(this).html('<span></span>'+ ($(this).index() + 1));
			});
		},
		siteList : function(areaGuid){
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':1000,'del':0,'areaguid':(areaGuid || '')},function(d){
				var line = "";
				$.each(d.list,function(i,u){
					line += "<option value='"+ u.fguid +"' data='"+ u.ftype +"' "+ (u.fguid == $("#_topicSiteGuid").val()?'selected="selected"':'') +">"+ u.fsitename +"</option>";
				});
				$("#siteItems").html(line);
				
				if($("#_topicSiteGuid").val() != ''){
					_editColumnInit();
				}else{
					console.debug(11);
					PublicCol.list('topicColTree',{'id':$("#siteItems").val(),'name':$("#siteItems").find('option:selected').text(),'state':1},function(node){
						EtopicSet.columnData = node;
					});
				}
				_templateListload($("#_topicSiteGuid").val());
			});
		},
		showLabel : function(O){
			if(O.innerHTML == '更多'){
				O.innerHTML = "收起";
				$("#labelBox").slideDown(200);
			}else{
				O.innerHTML = "更多";
				$("#labelBox").slideUp(200);
			}
		},
		contentInit : function(){
			var _guid = $("#_topicguid").val();
			if(_guid == '' && _guid == undefined) return;
			
			if(this.pageData.length == 0){
				getAjaxData(DefConfig.Root + '/main/topic/textContentList',{'guid':_guid},function(d){
					if(d.length == 1){
						EtopicSet.currPage = d[0].fcontent;
						contentEditor.html(EtopicSet.currPage);
					}else{
						$.each(d,function(i,u){
							EtopicSet.pageData.push(u.fcontent);
							$(".pagePanelBox").append('<div class="pageItem"><span></span>'+ ($(".pagePanelBox > .pageItem").size() + 1) +'</div>');
						});
					}
				});
			}else{
				if(this.pageData.length == 1){
					this.currPage = this.pageData[0];
					contentEditor.html(this.currPage);
				}else{	
					$.each(this.pageData,function(i,u){
						EtopicSet.pageData.push(u);
						$(".pagePanelBox").append('<div class="pageItem"><span></span>'+ ($(".pagePanelBox > .pageItem").size() + 1) +'</div>');
					});
				}
			}
		},
		openResDialog : function(T){
			fileDialogHtml($("#siteItems").val(),function(ck){
				var prewimgsrc = ck.parent().find('img').attr('data');
				contentEditor.insertHtml('<img src="'+ prewimgsrc +'" />');
			});
		},
		selectMallimg : function(){
			fileDialogHtml($("#siteItems").val(),function(ck){
				var prewimgsrc = ck.parent().find('img').attr('data');
				$("#fthumbnail").val(prewimgsrc);
				$("#fthumbnailPrewImg").attr('src',prewimgsrc);
			});
		},
		cancelImg : function(){
			$("#fthumbnail").val('');
			$("#fthumbnailPrewImg").attr("src",DefConfig.Root + '/res/skin/images/prewimg.png');
		},
		save : function(T){
			
			if(ETOPIC_TYPE_VAL === 0){
				this.saveText(T);
			}else if(ETOPIC_TYPE_VAL === 1){
				this.saveVideo(T);
			}else if(ETOPIC_TYPE_VAL === 2){
				
			}else if(ETOPIC_TYPE_VAL == 3){
				this.saveLink(T);
			}
		},
		saveVideo : function(T){
			if(T == 1 && this.columnData == null ) return Chasonx.Hint.Faild('未选择栏目');
			
			if(FormData.requiredByAttr('contentTable',['input'])){
				var formdata = FormData.getFormData('contentTable',['input','textarea','select']);
				formdata['fregion'] = $("#videoRegion").val();
				formdata['fyears'] = $("#videoYears").val();
				formdata['fextdata'] = $("#videoDetailJson").val();
				formdata['fclass'] = ETOPIC_TYPE_VAL;
				formdata['fgrade'] = $("#videoGrade").val();
				formdata['type'] = T;
				formdata['siteGuid'] = $("#siteItems").val();
				formdata['UCGSFORMDATAFILTER'] = $("#UCGSFORMDATAFILTER").val();
				if(T == 2){
					formdata['id'] = $("#_uepk").val();
				}else{
					formdata['colguid'] = this.columnData.guid;
					//formdata['fguid'] = $("#videoGuid").val(); 
					
					if($("#siteItems option:selected").attr('data') == 'public' && $("#siteItems").val() == this.columnData.attributes.siteGuid)
						formdata['topicType'] = 1;
					else
						formdata['topicType'] = 0;
				}
				this.exec(DefConfig.Root + "/main/topic/videoTopicOperation", formdata , T);
			}
		},
		saveText : function(T){
			if(T == 1 && this.columnData == null ) return Chasonx.Hint.Faild('未选择栏目');
			if(FormData.requiredByAttr('contentTable',['input'])){
				
				if(this.currPage != null && this.currPage != ''){
					this.pageData.push(this.currPage);
				}
				if(this.pageData.length == 0) this.pageData.push(" ");
				var formdata =  FormData.getFormData('contentTable',['input','textarea','select']);
				
				formdata['type'] = T;
				formdata['flable'] = $("#flable").val();
				formdata['fclass'] = ETOPIC_TYPE_VAL;
				formdata['contents'] = this.pageData;
				formdata['templateId'] = $("#templateList").val();
				formdata['colguid'] = this.columnData.guid;
				formdata['UCGSFORMDATAFILTER'] = $("#UCGSFORMDATAFILTER").val();
				formdata['siteGuid'] = $("#siteItems").val();
				if(T == 1){
					if($("#siteItems option:selected").attr('data') == 'public' && $("#siteItems").val() == this.columnData.attributes.siteGuid)
						formdata['topicType'] = 1;
					else
						formdata['topicType'] = 0;
				}else{
					formdata["id"] = $("#_uepk").val();
					formdata["fguid"] = $("#_topicguid").val();
				}
				
				this.exec(DefConfig.Root + "/main/topic/textTopicOperation", formdata, T);
			}
		},
		saveLink : function(T){
			if(T == 1 && this.columnData == null ) return Chasonx.Hint.Faild('未选择栏目');
			if(FormData.requiredByAttr('contentTable',['input'])){
				
				var formdata =  FormData.getFormData('contentTable',['input','textarea','select']);
				formdata['type'] = T;
				formdata['flable'] = $("#flable").val();
				formdata['fclass'] = ETOPIC_TYPE_VAL;
				formdata['fextdata'] = $("#_topicLink").val();
				formdata['contents'] = [];
				formdata['colguid'] = this.columnData.guid;
				formdata['UCGSFORMDATAFILTER'] = $("#UCGSFORMDATAFILTER").val();
				if(T == 1){
					formdata['siteGuid'] = $("#siteItems").val();
					if($("#siteItems option:selected").attr('data') == 'public' && $("#siteItems").val() == this.columnData.attributes.siteGuid)
						formdata['topicType'] = 1;
					else
						formdata['topicType'] = 0;
				}else{
					formdata["id"] = $("#_uepk").val();
					formdata["fguid"] = $("#_topicguid").val();
				}
				this.exec(DefConfig.Root + "/main/topic/textTopicOperation", formdata, T);
			}
		},
		badWordCheck : function(){
			if(this.pageData.length == 0 && this.currPage == "") return;
			
			$(".pagePanelBox").html('');
			if(this.currPage != null){
				this.pageData.push(this.currPage);
				this.currPage = null;
			}
			
			Chasonx.Wait.Show();
			var _data = FormData.getFormData('contentTable',['input','textarea','select']);
			_data['contents'] = this.pageData;
			getAjaxData(DefConfig.Root + '/main/topic/badwordCheck',_data,function(d){
				Chasonx.Wait.Hide();
				Chasonx.Hint.Success({text:"敏感词已标记",time:4000});
				EtopicSet.pageData = d.contentData;
				
				contentEditor.html(EtopicSet.pageData[EtopicSet.pageData.length - 1]);
				if(EtopicSet.pageData.length > 1){
					for(var i = 0;i < EtopicSet.pageData.length - 1;i++){
						$(".pagePanelBox").append('<div class="pageItem"><span></span>'+ ($(".pagePanelBox > .pageItem").size() + 1) +'</div>');
					}
				}
				if($("#ftitle").val().trim() != '' && $("#ftitle").val() != d.topicData.ftitle) EtopicSet.inputBorderError(true,true,0); 
				if($("#ftitlesec").val().trim() != '' && $("#ftitlesec").val() != d.topicData.ftitlesec) EtopicSet.inputBorderError(true,true,1); 
				if($("#fsource").val().trim() != '' && $("#fsource").val() != d.topicData.fsource) EtopicSet.inputBorderError(true,true,2); 
				if($("#fsummary").val().trim() != '' && $("#fsummary").val() != d.topicData.fsummary) EtopicSet.inputBorderError(true,true,3); 
			});
		},
		exec : function(URL,D,T){
			Chasonx.Wait.Show('正在努力保存哦...');
			$.ajax({
				url:URL,
				type:'post',
				dataType:'json',
				data:D,
				success:function(d){
					if(d == 0){
						Chasonx.Hint.Faild('数据保存失败');
					}else{
						Chasonx.Hint.Success('数据保存成功');
						$("#UCGSFORMDATAFILTER").val(d);
					}
					EtopicSet.inputBorderError(false,false); 
					EtopicSet.clear();
					Chasonx.Wait.Hide();
				},
				error:function(e){
					Chasonx.Hint.Faild(e.responseText);
					Chasonx.Wait.Hide();
				}
			});
		},
		linkContentCheck : function(v){
			/*
			if(v.value == '') return;
			var res = RegexUrl(v.value);
			if(!res){
				v.value = '';
				v.focus();
				Chasonx.Hint.Faild('链接地址不合法，请重新输入');
			}
			*/
		},
		clear : function(S){
			S = S || false;
			if($("#_uepk").val() != '' && S == false) return;
			
			this.pageData = [];
			this.currInx = null;
			this.currPage = '';
			contentEditor.html('');
			this.cancelImg();
			$("#ftitle").val('');
			$("#fsource").val('');
			$("#ftitlesec").val('');
			$("#fextendtitle").val('');
			$("#flable").val('');
			$("#labelBox").html('');
			$("#fsummary").val('');
			$("#fartfrom").val('');
			$(".pagePanelBox").html('');
			$("#_topicLink").val('');
			
			ETOPIC_OPEN_SOURCE = true;
		},
		close : function(){
			window.opener = null;
			window.open("","_parent","");
			window.close();
		},
		inputBorderError : function(B,L,idx){
			var _input = ['ftitle','ftitlesec','fsource','fsummary'];
			for(var i = 0;i < _input.length;i ++){
				if(L && i == idx){
					$("#" + _input[idx]).css('border-color',B?'#f09':'#A19E9E');
				}else{
					$("#" + _input[idx]).css('border-color',B?'#f09':'#A19E9E');
				}
			}
		}
};

function _editColumnInit(){
	PublicCol.list('topicColTree',{'id':$("#siteItems").val(),'name':$("#siteItems").find('option:selected').text(),'state':1},function(node){
		EtopicSet.columnData = node;
	});
	
	setTimeout(function(){
		var _node = $("#topicColTree").tree('find',$("#_uecolid").val());
		if(_node == null) return;
		$('#topicColTree').tree('select', _node.target);
		$('#topicColTree').tree('scrollTo',_node.target);
		EtopicSet.columnData = _node;
	},300);
	
	$(".editTopicShade").show();
	
	_templateListload($("#siteItems").val());
}

function moveToDoPlay(){
	$(".videoDetailBox > .ctrl").addClass('vbctrlAnimate').css('top','60px');
	$(".videoDetailBox > .grade").addClass('vbgradeAnimate').css('top','66px').css('right','40px').css('font-size','15px');
	$(".videoDetailBox > .video").fadeIn().find('video').attr('src',$("#videoMessUrl").val()).attr('autoplay','autoplay');
}


function _templateListload(sguid){
	getAjaxData(DefConfig.Root + '/main/topic/topicTemplateList',{'siteGuid':sguid},function(d){
		var op = '<option value="0">---选择模版---</option>';
		$.each(d,function(i,u){
			op += '<option value="'+ u.id +'" '+ ($("#_topicTemplate").val() == u.id?'selected="selected"':'') +'>'+ u.ftname +'</option>';
		});
		
		$("#templateList").html(op);
	});
}


