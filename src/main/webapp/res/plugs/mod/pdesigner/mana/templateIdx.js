/**
*
*/
var PDesTemplate = {
		table : null,
		customTable : null,
		data : null,
		customData : null,
		_ckName : 'pdesigner',
		tabIdx : 0,
		openDesigner : function(){
			window.open(DefConfig.Root + '/main/pdesigner','');
		},
		brezzed : function(T){
			this.choose(function(chk){
				var ids = [];
				chk.each(function(){
					ids.push($(this).val());
				});
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定设置选中的模板为 [' + (T == 0?'解冻':'冻结') + '] 状态码 ？',
					modal : true,
					width : 350,
					success : function(){
						UCGS_DAO.updeOrDel({modelName : 'PageDesigner',fstate:T,ids : ids,type : 'update'});
						PDesTemplate.afterLoad();
						return true;
					}
				});
			});
		},
		getTableData : function(){
			var _data = [];
			with(this){
				switch(tabIdx){
				case 0:
					_data = data;
					break;
				case 1:
					_data = customData;
					break;
				}
			}
			return _data;
		},
		afterLoad : function(){
			switch(this.tabIdx){
			case 0:
				PDesTemplate.loadTemp();
				break;
			case 1:
				PDesTemplate.customTable.getData(function(data){
					PDesTemplate.customData = data;
				});
				break;
			}
		},
		modify : function(){
			this.choose(function(chk){
				window.open(DefConfig.Root + '/main/pdesigner?guid=' + chk.attr('guid'),'');
			});
		},
		preview : function(){
			this.choose(function(chk){
				switch(PDesTemplate.tabIdx){
				case 0:
					window.open(DefConfig.Root + '/data/preview/' + chk.attr('guid'));
					break;
				case 1:
					var _data = PDesTemplate.customData.list[chk.attr('idx')];
					window.open(DefConfig.Root + _data.furl);
					break;
				}
			});
		},
		checked : function(T){
			this.choose(function(chk){
				var ids = [];
				chk.each(function(){
					ids.push($(this).val());
				});
				
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定设置选中的模板为 [' + (T == 2?'通过审核':'审核不通过') + '] 状态码 ？',
					modal : true,
					width : 350,
					success : function(){
						UCGS_DAO.updeOrDel({modelName : 'PageDesigner',fchecked:T,ids : ids,type : 'update'});
						PDesTemplate.afterLoad();
						return true;
					}
				});
			});
		},
		del : function(T){
			this.choose(function(chk){
				var ids = [];
				chk.each(function(){
					ids.push($(this).val());
				});
				
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除该模板到回收站吗？',
					modal : true,
					success : function(){
						UCGS_DAO.updeOrDel({modelName : 'PageDesigner',fdelelte: T,ids : ids,type : 'update'});
						PDesTemplate.afterLoad();
						return true;
					}
				});
			});
		},
		choose : function(fn){
			var chk = $("input[type='checkbox'][name='"+ this._ckName +"']:checked");
			if(chk.size() == 0) return Chasonx.Hint.Faild('请选择一条选项');
			fn(chk);
		},
		siteSelectChange : function(obj){
			$("#tempSiteName").val(obj.options[obj.selectedIndex].text);
		},
		loadTemp : function(){
			this.table.getData(function(data){
				PDesTemplate.data = data;
			});
		},
		loadCustomTemp : function(T){
			Chasonx.Wait.Show('正在加载自定义模板...');
			getAjaxData(DefConfig.Root + '/main/pdesigner/customTemplateFolder',{getType : T},function(data){
				var line = '';
				$.each(data,function(i,u){
					line += '<div data="'+ u.fsiteguid +'" class="customTempFolder"><div><i class="icon-folder-plus"></i>\
								<p>' + u.fcustomsitename + '</p>\
								<p>简介:' + u.fremark + '</p>\
							 </div></div>'
				});
				$("#customTemplateList").html(line);
				Chasonx.Wait.Hide();
			});
		},
		customTempList : function(obj){
			obj = $(obj);
			if(obj.attr('openDir') == 'true') return;
			
			var pW = $("#customTemplateList").width(),pH = $("#customTemplateList").height(),pT = $("#customTemplateList").offset().top;
			var off = obj.offset();
			var target = obj.find('div');
			target.addClass('customTempFolderFocus');
			var style = 'width:' + (pW - 32) + 'px;height:' + (pH - 32) + 'px;left:-' + (off.left - 16) + 'px;top:-' + (off.top - pT - 16) + 'px';
			target.attr('style',style);
			target.find('i').removeClass().addClass('icon-folder-open');
			target.append('<b class="icon-cancel customFocusClose" onclick="PDesTemplate.closeFolder(this)"></b>');
			target.append('<div id="customTemplateListDetail" style="width: 99%;margin:0px auto;"></div>');
			obj.attr('openDir','true');
			
			setTimeout(function(){
			
				PDesTemplate.customTable = Chasonx.Table({
					id : 'ptemplateTable00101',
					url : DefConfig.Root + '/main/pdesigner/customTemplateFolder',
					dataPanel : 'customTemplateListDetail',
					data : {'getType' : 2,'siteGuid' : obj.attr('data')},
					before : function(op){
						op.PageNumber = (op.PageNumber + op.PageSize)/op.PageSize;
						return op;
					},
					check : {name : 'customTemplateListCk',value : 'id',attr : {"guid":"fguid","unauditrs" : "uncheckCount"}},
					tableNames : [
				       {name : "ftitle",text:"模板名称",width:'10%'},
				       {name : "furl",text:"预览地址",width:"40%"},
				       {name : "fmodifytime",text:"编辑时间",width:"10%"},
				       {name : "fstate",text:"状态",width:"10%",handler : function(v){ return v == 0?'正常':'冻结'; }},
				       {name : "fchecked",text:"审核",width:"10%" ,handler : function(v){ return v == 0?'未审核':v == 1?'不通过':'通过';}},
				       {name : "uncheckCount",text : "未审核资源数",width : "10%",handler : function(v){ return v == null?0:v; }}
					  ]
					}).createTable();
				PDesTemplate.customTable.getData(function(data){
					PDesTemplate.customData = data;
				});
			
			},600);
		},
		closeFolder : function(obj){
			var folder = $(obj).parent();
			folder.attr('style','');
			folder.find('i').removeClass().addClass('icon-folder-plus');
			folder.find('#customTemplateListDetail').remove();
			folder.removeClass('customTempFolderFocus');
			folder.find('b').remove();
			folder.parent().attr('openDir','false');
		}
};
/**
 * 发布
 */
var TPublish = {
		doAudit : function(){
			PDesTemplate.choose(function(chk){
				var tGuids = [];
				chk.each(function(){
					tGuids.push(this.getAttribute('guid'));
				});
				
				Chasonx.Wait.Show('资源检查中，请稍后...');
				getAjaxData(DefConfig.Root + '/main/pdesigner/checkTemplateResouceState',{tGuids : tGuids},function(d){
					Chasonx.Wait.Hide();
					if(~~d > 0){
						Chasonx.Hint.Success('资源检查完毕');
						PDesTemplate.afterLoad();
					}else{
						Chasonx.Hint.Faild('检查出错');
					}
				});
			});
		},
		todo : function(){
			PDesTemplate.choose(function(chk){
				//Chasonx.Wait.Show('正在发布...');
				var tGuids = [],ret = false,_data = PDesTemplate.getTableData().list;
				chk.each(function(){
					tGuids.push(this.getAttribute('guid'));
					if(~~this.getAttribute('unauditrs') > 0){
						Chasonx.Hint.Faild("模板：" + _data[this.getAttribute("idx")].ftitle + "<br>存在资源未审核，将取消发布");
						ret = true;
					}
				});
				if(ret == true) return;
				getAjaxData(DefConfig.Root + '/main/pdesigner/publishTemplate',{tGuids : tGuids},function(d){
					Chasonx.Wait.Hide();
					var wSize = ChasonTools.getWindowSize();
					var xpackager = new Chasonx({
						width : wSize[2] * 0.8,height : wSize[3] * 0.9,
						title : '资源发布',
						html : '<iframe src="'+ d.xpackager + "&packPath=" + d.path +'" style="border:none;width:100%;height:100%;"></iframe>',
						modal : true,
						cancel : false
					});
					
				});
			});
		}
};


window.onload = function(){
	
	var skinName = _GetSkinName();
	var fc,fcb,fb,fbb;
	if('lightblue' == skinName){
		fc = '#464646';
		fcb = '#6b6969';
		fb = '#cacaca';
		fbb = '#dedede';
	}else{
		fc = '#969696';
		fcb = '#a7a7a7';
		fb = '#383737';
		fbb = '#464646';
	}
	
	Chasonx.Frameset({
		  main : 'mainPanel',
	      window : {
	          top : { id : 'topPanel', height : '70px',border:false,bgColor : false},
	          right:{ id:'centerPanel', width : '100%' ,bgColor : false,border : false}
	      }
	});
	
	Chasonx.Tab({
	   	id : 'centerPanel',
	   	bHeight : 30,
	   	bWidth : 150,
	   	fontColor : fc,
	   	fontBlurColor : fcb,
	   	itemGroup :[
	   	      {  
	   	    	  position : 'top|left',
				  items :[{
				   		title : '模板列表',
				   		focusColor : fb,
				   		blurColor : fbb,
				   		panelId : 'templateListTab',
				   		handler : function(){
				   			PDesTemplate._ckName = 'pdesigner';
				   			PDesTemplate.loadTemp();
				   			PDesTemplate.tabIdx = 0;
				   		}
				   	},
				   	{
				   		title : '自定义模板列表',
				   		focusColor : fb,
				   		blurColor : fbb,
				   		panelId : 'customTemplateList',
				   		handler : function(){
				   			PDesTemplate._ckName = 'customTemplateListCk';
				   			PDesTemplate.loadCustomTemp(1);
				   			PDesTemplate.tabIdx = 1;
				   		}
				   	},
				   	{	
				   		title : '模板上传',
				   		focusColor : fb,
				   		blurColor : fbb,
				   		panelId  : 'templateUploadTab',
				   		handler : function(){
				   			SitePub.list(null,null,function(data){
				   				var li = '<option value="" ></option>';
				   				$.each(data.list,function(i,u){
				   					li += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
				   				});
				   				$("#tempSiteList").html(li);
				   			});
				   			PDesTemplate.tabIdx = 2;
				   		}
				   	}]
	   	      	}
	   	    ]
	});
	
	var supload = Chasonx.SimpleUpload({targetID : 'templateBrowserFile',targetInputID : 'templateFileVal',accept : '.zip,.rar',size : 1024 * 2014 * 10,selectCallBack : function(obj){
		var file = obj.files[0];
		$(".templateUploadState").html('<b>'+ file.name +'<br>'+ fileSizeForamt(file.size) +'</b>').css('background','#ffb405').css('color','#fff');
	}});
	
	$("#templateStartUPload").live('click',function(){
		supload.startUpload({
			url :DefConfig.Root + '/main/pdesigner/customTemplateUpload',
			required : true,
			panelID : 'templateUploadTab',
			reqTypes : ['input','select'],
			success : function(idx){
				console.debug(idx);
			}
		});
	});
	
	$(".customTempFolder").live('click',function(){
		PDesTemplate.customTempList(this);
	});
	
	
	PDesTemplate.table = Chasonx.Table({
		id : 'ptemplateTable008',
		url : DefConfig.Root + '/main/pdesigner/ptemplateList',
		dataPanel : 'templateListTab',
		data : {'delete' : 0},
		before : function(op){
			op.PageNumber = (op.PageNumber + op.PageSize)/op.PageSize;
			return op;
		},
		check : {name : 'pdesigner',value : 'id',attr : {"guid":"fguid","unauditrs" : "uncheckCount"}},
		tableNames : [
	       {name : "ftitle",text:"模板名称",width:'10%'},
	       {name : "sitename",text:"站点名",width:"10%"},
	       {name : "adminname",text:"创建人",width:"10%"},
	       {name : "fmodifytime",text:"编辑时间",width:"10%"},
	       {name : "fstate",text:"状态",width:"8%",handler : function(v){ return v == 0?'正常':'冻结'; }},
	       {name : "fchecked",text:"审核",width:"8%" ,handler : function(v){ return v == 0?'未审核':v == 1?'不通过':'通过';}},
	       {name : "furl",text:"数据地址",width:"15%",handler : function(v){ return getString(v); }},
	       {name : "flinkpageurl",text:"外链地址",width:"15%",handler : function(v){ return getString(v);}},
	       {name : "uncheckCount",text : "未审核资源数",width : "9%",handler : function(v){ return v == null?0:v; }}
				]
		}).createTable();
	
	PDesTemplate.loadTemp();
};