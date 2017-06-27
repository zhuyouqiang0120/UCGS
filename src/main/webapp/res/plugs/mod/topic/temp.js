var PContent = {
		pageTempId : null,
		pateTempTitle : null,
		tempListData : null,
		siteList : function(areaGuid){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':1000,'del':0,'areaguid':(areaGuid || '')},function(d){
				Chasonx.Wait.Hide();
				var options = '',_siteguid = null;
				$.each(d.list,function(i,u){
					if(i == 0) _siteguid = u.fguid;
					options += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
				});
				$("#siteList").html(options);
				PContent.templateList(_siteguid);
			});
		},
		templateList : function(siteGuid){
			if(siteGuid == null) return;
			getAjaxData(DefConfig.Root + '/main/topic/topicTemplateList',{'siteGuid':siteGuid},function(d){
				var op = '';
				PContent.tempListData = d;
				$.each(d,function(i,u){
					op += '<p data="'+ u.id +'" idx="'+ i +'">'+ u.ftname +'</p>';
				});
				$("#templateList").html(op);
			});
		},
		fileList : function(id){
			var siteGuid = $("#siteList").val();
			if(siteGuid == '' || siteGuid == null) return Chasonx.Hint.Faild('请先选择网站');
			fileDialogHtml(siteGuid,function(ck){
				var prewimgsrc = ck.parent().find('img').attr('data');
				$("#" + id).val(prewimgsrc);
			});
		},
		saveTemp : function(){
			var site = $("#siteList").val();
			if(site == null || site == '') return Chasonx.Hint.Faild('请先选择网站');
			new Chasonx({
				title : '文章模板页设置',
				html : '<br><p style="text-align:center;">输入模板名称：<input type="text" class="inputText" id="_pageTemplateName" /></p>',
				width : 400,height : 150,
				modal : true,
				success : function(){
					var _ptitle = $("#_pageTemplateName").val();
					if(_ptitle == '') return;
					PContent.exec(_ptitle,site);
					return true;
				}
			});
		},
		update : function(){
			if(this.pageTempId == null) return;
			this.exec(this.pateTempTitle,$("#siteList").val());
		},
		exec : function(_ptitle,site){
			var data = {},currRes = {};
			var bgimg = $("#fbgimg").val(),banner = $("#fbanner").val();
			if(_ptitle != undefined) data.title = _ptitle;
			if(site != undefined) data.siteGuid = site;
			if(bgimg != ''){
				currRes.bgimg = bgimg;
				bgimg = bgimg.substring(bgimg.lastIndexOf('upload/') + 7,bgimg.length);
			}
			if(banner != ''){
				currRes.banner = banner;
				banner = banner.substring(banner.lastIndexOf('upload/') + 7,banner.length);
			}
			if(PContent.pageTempId != null) data.tempGuid = PContent.pageTempId;
			data.bgimage = bgimg;
			data.banner = banner;
			data.rawData = JSON.stringify(currRes);
			
			Chasonx.Wait.Show('正在保存');
			getAjaxData(DefConfig.Root + '/main/topic/savePageTemp',data,function(u){
				Chasonx.Wait.Hide();
				if(~~u > 0){
					Chasonx.Hint.Success('保存成功');
					PContent.templateList(site);
				}else{
					Chasonx.Hint.Faild('保存失败');
				}
			});
		},
		del  : function(){
			if(this.pageTempId == null) return ;
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定删除该模板页面吗？',
				modal : true,
				success : function(){
					getAjaxData(DefConfig.Root + '/main/topic/delPageTemp',{'tid':PContent.pageTempId},function(d){
						if(~~d > 0){
							Chasonx.Hint.Success('模板已删除');
							PContent.templateList($("#siteList").val());
						}else{
							Chasonx.Hint.Faild('模板删除失败');
						}
					});
					return true;
				}
			});
		},
		loadDef : function(){
			$("#_pagePreviewFrame").attr('src','pageContentPreview');
			$("#fbgimg").val('/UCGS/files/upload/default_pagetemp.jpg');
			$("#fbanner").val('/UCGS/files/upload/default_banner.jpg');
			$("#tabTitle3").html('默认设置');
		},
		_openDesigner : function(){
			window.open(DefConfig.Root + '/main/pdesigner');
		}
};

window.onload = function(){
	$("#siteList").live('change',function(){
		PContent.templateList(this.value);
	});
	
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '68px',border:false,bgColor:false},
			right: {id : 'rightPanel',border:false,bgColor:false}
			}
	});
	
	setTimeout(function(){
		Chasonx.DragBox({
			target : 'rightPanel',
			lineColor : _GetBoxLineColor(),
			items : [
			         {id : 'draglistLeft',width : '15' },
			         {id : 'dragListCenter',width : '15'},
			         {id : 'dragListRight',width : '70' }
			        ]
		});
	},50);
	
	Area.list('areaList',[],function(){
		PContent.siteList(Area.currArea.fguid);
	});
	
	$("#templateList > p").live('click',function(){
		PContent.pageTempId = $(this).attr('data');
		PContent.pateTempTitle = $(this).text();
		$("#tabTitle3").html(PContent.pateTempTitle);
		$("#templateList > p").removeClass('templateListFocus');
		$(this).addClass('templateListFocus');
		
		var config = PContent.tempListData[$(this).attr('idx')].frawdata;
		if(config != 'null' && config != ''){
			config = JSON.parse(config);
			if(config.bgimg) $("#fbgimg").val(config.bgimg);
			if(config.banner) $("#fbanner").val(config.banner);
		}
		$("#_pagePreviewFrame").attr('src','pageContentPreview?tempGuid=' + PContent.pageTempId);
	});
	
	PContent.siteList();
	PContent.loadDef();
};
