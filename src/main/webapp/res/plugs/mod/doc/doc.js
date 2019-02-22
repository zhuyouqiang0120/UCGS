
	var _FILE_TYPE = 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint';
	var _BGFileUploader = null;
	
	var Doc = {
			folderData : null,
			docData : null,
			folderIdx : -1,
			currentFolder : null,
			currentDocData : null,
			detailDocData : null,
			currentDocImgIdx : -1,
			assetsData : null,
			docPanid : null,
			folderPid : null,
			init : function(_folderPid,docPid){
				with(this){
					docPanid = docPid;
					folderPid = _folderPid;
					folderData = null;
					currentFolder = null;
					currentDocData = null;
					detailDocData = null;
				}
				
				$(".docFolderPanel").live('click',function(){
					$(".docFolderPanel > i").removeClass('icon-folder-open').addClass('icon-folder');
					$(this).find('i').removeClass('icon-folder').addClass('icon-folder-open');
					Doc.currentFolder = $(this).attr('data');
					Doc.folderIdx = $(this).attr('idx');
					Doc.getDocList();
				});
				
				$(".docItem").live('click',function(){
					$(".docItem").removeClass('docItemFocus');
					$(this).addClass('docItemFocus');
					Doc.currentDocData = Doc.docData[$(this).index()];
				});
				
				$(".icon-cancel-circle").live('click',function(){
					$(this).parent().remove();
				});
				
				$("#uploadBGFileBtn").live('click',function(){
					getDocAuthCode(function(param){
						param.type = $("#bgFileType").val();
						_BGFileUploader.startUpload({
							url : DefConfig.Doc.UploadAssets,
							data : param,
							jsonp : DefConfig.JSONP,
							complete : function(){
								Chasonx.Hint.Success('上传成功');
								Doc.getBGFileData();
							}
						});
					});
				});
				
				var __audioObj,__audioBtn;
				$(".fadePanel > i").live('click',function(E){
					$(".fadePanel").find('i[class="icon-pause"]').not(this).removeClass('icon-pause').addClass('icon-play2');
					__audioBtn = $(this);
					if(__audioBtn.attr('class') == 'icon-pause'){
						__audioObj.pause();
						__audioObj.currentTime = 0;
						__audioBtn.removeClass().addClass('icon-play2');
					}else{
						__audioObj = $("#previewBGMusicPanel")[0];
						__audioObj.src = $(this).parent().parent().attr('data');
						__audioObj.play();
						__audioBtn.removeClass().addClass('icon-pause');
					}
					E.stopPropagation();
				});
				
				var __assetsItems,__input;
				$(".assetsBGImage,.assetsBGMusic").live('click',function(){
					__assetsItems = $(this);
					$("input[type='checkbox'][name='"+ __assetsItems.attr('class') +"']:checked").attr('checked',false);
					__input = __assetsItems.find("input[type='checkbox']");
					__input.attr('checked',!__input[0].checked);
					
					$("#chooseStatePanel").find('div[class="choose_'+ __input.attr('name') +'"]').remove();
					Doc.setBGFileToPanel(__input.attr('name'),__input.val(),__input.attr('etype'));
				});
				this.bindDetailHandler();
				return this;
			},
			bindDetailHandler : function(){
				$(".thumbImagePanel").live('click',function(){
					$(".thumbImagePanel").removeClass('thumbViewFocus');
					$(this).addClass('thumbViewFocus');
					Doc.currentDocImgIdx = $(this).attr('data');
					Doc.setView();
				});
				
				$("#updateDocViewRemark").live('click',function(){
					Doc.updateView();
				});
			},
			appendSearch : function(){
				with(this){
					var search = document.createElement('div'),
					sar = document.createElement('i');
				
					search.setAttribute('class','docSearchPanel');
					sar.setAttribute('class','icon-keyboard_return');
					sar.setAttribute('title','搜索');
					
					var ht = ['<input id="_sarchDocTitle" type="text" placeholder="文档标题"/>'];
					ht.push('<input id="_sarchSTime" type="text" placeholder="开始时间" class="Wdate" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',realFullFmt:\'%Date\'})" />至');
					ht.push('<input id="_sarchETime" type="text" placeholder="结束时间" class="Wdate" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',realFullFmt:\'%Date\'})" />');
					search.innerHTML = ht.join('');
					
					search.appendChild(sar);
					$("#" + docPanid).parent().append(search);
					
					ChasonTools.addEventHandler(sar,'click',function(){
						Doc.searchDoc();
					});
				}
				return this;
			},
			getFolder : function(){
				getDocAuthCode(function(param){
					getAjaxData(DefConfig.Doc.GetFolder,{param : JSON.stringify(param)},function(data){
						if(data.result > 0){
							var folder = [];
							$.each(data.data,function(i,u){
								folder.push('<div class="docFolderPanel" title="名称：'+ u.FName +'&#10;添加人：'+ u.FUploaderName +'&#10;更新时间：'+ u.FModifyTime +'&#10;属性：'+ (u.FPublic == 1?'公开':'私有') +'&#10;备注：'+ u.FRemark +'" data="'+ u.FGuid +'" idx="'+ i +'"><i class="icon-folder ' + (u.FPublic == 1?'pub':'') + '"></i>');
								folder.push('<span>'+ u.FName +'</span></div>');
							});
							$("#" + Doc.folderPid).html(folder.join(''));
							
							Doc.folderData = data.data;
						}else{
							Chasonx.Hint.Faild(data.msg);
						}
					},'jsonp',DefConfig.JSONP);
				});
				
				return this;
			},
			searchDoc : function(){
				getDocAuthCode(function(param){
					var t = $("#_sarchDocTitle").val(),
						st = $("#_sarchSTime").val(),
						et = $("#_sarchETime").val();
					if(!StrKit.isBlank(t)) param.title = t;
					if(!StrKit.isBlank(st)) param.startTime = st;
					if(!StrKit.isBlank(et)) param.endTime = eet;
					if(!StrKit.isBlank(Doc.currentFolder))	param.folderGuid = Doc.currentFolder;
					param['delete'] = 0;
					
					Doc.drawDocList(param);
				});
			},
			getDocList : function(){
				getDocAuthCode(function(param){
					if(!StrKit.isBlank(Doc.currentFolder))
						param.folderGuid = Doc.currentFolder;
					param['delete'] = 0;
					
					Doc.drawDocList(param);
				});
				return this;
			},
			drawDocList : function(param){
				this.currentDocData = null;
				Chasonx.Wait.Show();
				getAjaxData(DefConfig.Doc.GetDocList,{param : JSON.stringify(param)},function(data){
					Doc.docData = data.data;
					var docs = [];
					$.each(data.data,function(i,u){
						docs.push('<div class="docItem" data="'+ u.FolderGuid +'" title="标题：'+ u.FTitle +'&#10;创建人:'+ u.FCreaterName +'&#10;创建时间:'+ u.FModifyTime +'&#10;来源:'+ u.FSource +'&#10;属性：'+ (u.FPublic == 1?'公开':'私有') +'&#10;备注:'+ u.FRemark +'&#10;文件名:'+ u.FFileName +'\
									&#10;文件大小:'+ fileSizeForamt(u.FSize) +'&#10;自动播放:'+ (u.FAutoPlay == 1) +'&#10;间隔时长:'+ u.FTimeout +'秒"><i class="icon-insert_drive_file '+ (u.FPublic == 1?'pub':'') +'"></i><span>'+ u.FType +'</span>\
								  ' + '<p>'+ u.FModifyTime +'</p><p>'+ u.FTitle +'</p></div>');
					});
					$("#" + Doc.docPanid).html(docs.join(''));
					
					Chasonx.Wait.Hide();
				},'jsonp',DefConfig.JSONP);
			},
			add : function(T){
				var _url = DefConfig.Doc.AddFolder,_data = {};
				if(T == 2){
					if(Doc.currentFolder == null) return Chasonx.Hint.Faild('请选择一项');
					_url = DefConfig.Doc.ModifyFolder;
					_data = Doc.folderData[Doc.folderIdx];
				}
				
				new Chasonx({
					title : '图册编辑',
					html : '<div id="docFolderEditPanel" style="height:100%;" class="global_bg_c"></div>',
					width : 700,height : 500,
					modal : true,
					success : function(){
						if(FormData.requiredByAttr('docFolderEditPanel',['input','textarea'])){
							var param = FormData.getFormData('docFolderEditPanel',['input','textarea','select']);
							if(T == 2) param.FGuid = _data.FGuid;
								
							getDocAuthCode(function(_param){
								param.FUploader = _param.authCode;
								param.FUploaderName = _param.authName;
								param = Object.assign(param,_param);
								
								getAjaxData(_url,{param : JSON.stringify(param)},function(data){
									console.debug(data);
									if(data.result > 0) {
										Chasonx.Hint.Success('操作成功');
										Doc.getFolder();
										FormData.clearInput('docFolderEditPanel',['input','textarea']);
									}else{
										Chasonx.Hint.Faild(data.msg);
									}
								},'jsonp',DefConfig.JSONP);
							});
							
							return true;
						}
					}
				});
				
				ChasonxDom.draw({
					  id : 'docFolderEditPanel',
					  item : [
					      {text : '&nbsp;'},
					      {text:'图册名称:',name:'FName',type:'input',attr : ' req = "true" maxlength="25" ',value : (_data.FName || '')},
					      {text:'描述:',name:'FRemark',type:'textarea',attr : ' req = "true" maxlength="255" ',value : (_data.FRemark || '')},
					      {text:'状态:',name:'FState',type:'select',options : [{t : '正常' ,v : '0'},{t : '冻结' ,v : '1'}],value : (_data.FState || 0)},
					      {text:'属性:',name:'FPublic',type:'select',options : [{t : '私有' ,v : '0'},{t : '公共' ,v : '1'}],value : (_data.FPublic || 0)}
					  ]
				});
			},
			updateDocMess : function(){
				with(this){
					if(currentDocData == null) return Chasonx.Hint.Faild('请先选择文档');
					var _dialog = new Chasonx({
						 title : '文档信息更新',
						 html : '<div id="updateDocMessPanel" class="global_bg_c" style="height:100%;"></div>',
						 height : 540,width : 600,
						 modal : true,
						 success : function(){
							 if(FormData.requiredByAttr('updateDocMessPanel',['input','textarea'])){
								 var _param = FormData.getFormData('updateDocMessPanel',['input','textarea']);
								 	 _param.FGuid = currentDocData.FGuid;
								 	console.log(currentDocData);
								 getDocAuthCode(function(param){
								 	 _param = Object.assign(_param,param);
									 getAjaxData(DefConfig.Doc.UpdateDoc,{param : JSON.stringify(_param)},function(data){
										if(data.result > 0){
											Chasonx.Hint.Success('信息已更新');
											currentDocData = null;
											_dialog.Hide();
											
											getDocList();
										}else{
											Chasonx.Hint.Faild('信息更新失败');
										}
									},'jsonp',DefConfig.JSONP);
								 });
							 }
						 }
					});
					
					ChasonxDom.draw({
						  id : 'updateDocMessPanel',
						  item : [
						      {text : '&nbsp;'},
						      {text:'标题:',name:'FTitle',type:'input',attr : ' req = "true" maxlength="25" ',value : (currentDocData.FTitle || '')},
						      {text:'来源:',name:'FSource',type:'input',attr : ' req = "true" maxlength="20" ',value : (currentDocData.FSource || '')},
						      {text:'备注:',name:'FRemark',type:'textarea',attr : ' req = "true" maxlength="255" rows="8" ',value : (currentDocData.FRemark || '')},
						      {text:'属性:',name : 'FPublic',type : 'select',value : currentDocData.FPublic ,options : [{t : '私有' ,v : '0'},{t : '公共' ,v : '1'}]},
						      {text:'创建时间:',type : 'input',attr : ' disabled="disabled" ',value : currentDocData.FModifyTime},
						      {text:'文件大小:',type : 'input',attr : ' disabled="disabled" ',value : fileSizeForamt(currentDocData.FSize)},
						      {text:'文件名:',type : 'input',attr : ' disabled="disabled" ',value : currentDocData.FFileName}
						  ]
					});
				}
			},
			updatePreview : function(){
				with(this){
				if(currentDocData == null) return Chasonx.Hint.Faild('请先选择文档');
				
				var size = ChasonTools.getWindowSize();
				var _dialog = new Chasonx({
					title : '预览推荐设置',
					html : '<div id="previewStatePanel">\
								<div id="pspSeting"></div>\
							    <div id="pspSetBGImage"></div>\
								<div id="pspSetBGMusic"></div>\
								<div id="pspSetUpload"></div>\
							</div>\
						    <div id="chooseStatePanel"></div>\
							<audio id="previewBGMusicPanel"></audio>',
					width : size[2] * 0.8,height : size[3] * 0.8,
					modal : true,
					success : function(){
						var _param = {};
						_param.FGuid = currentDocData.FGuid;
						_param.FPreview = $("#previewState").val();
						_param.FTimeout = $("#previewTimeout").val();
						_param.FAutoPlay = $("#previewAutoPlay").val();
						
						var _bgFiles = $("#chooseStatePanel > div");
						if(_bgFiles.size() > 0){
							_bgFiles.each(function(i,u){
								_param[$(this).attr('type') == 1?'FBGimg':'FBGmusic'] = $(this).attr('data');
							});
						}else{
							_param.FBGimg = _param.FBGmusic = '';
						}
						
						getDocAuthCode(function(param){
							_param = Object.assign(_param,param);
							getAjaxData(DefConfig.Doc.UpdateDoc,{param : JSON.stringify(_param)},function(data){
								if(~~data.result > 0){
									Chasonx.Hint.Success('已设置');
									currentDocData = null;
									_dialog.Hide();
									
									getDocList();
								}else{
									Chasonx.Hint.Faild('设置失败');
								}
							},'jsonp',DefConfig.JSONP);
						});
					}
				});
				
				Chasonx.Tab({
				   	id : 'previewStatePanel',
				   	bHeight : 30,
				   	bWidth : 150,
				   	fontBlurColor : '#887e7e',
				   	itemGroup :[
				   	      {  
				   	    	  position : 'top|left',
							  items :[{
							   		title : '推荐设置',
							   		panelId : 'pspSeting',
							   		handler : function(){
							   		}
							   	},
							   	{	
							   		title : '背景图设置',
							   		panelId  : 'pspSetBGImage',
							   		handler : function(e){
							   			if(assetsData == null) return;
							   			var line = [];
							   			$.each(assetsData.image,function(i,u){
							   				line.push('<div class="assetsBGImage"><img src="'+ GetZDocFactoryHost() + u.uri +'" />\
							   						   <p>大小:'+ (fileSizeForamt(u.size)) +'</p>\
							   						   <p>更新时间:'+ u.modifyTime +'</p><input type="checkbox" name="assetsBGImage"  etype="1"  value="' + u.uri +'"/></div>');
							   			});
							   			e.innerHTML = line.join('');
							   		}
							   	},
							   	{
							   		title : '背景音乐设置',
							   		panelId : 'pspSetBGMusic',
							   		handler : function(e){
							   			if(assetsData == null) return;
							   			var line = [];
							   			$.each(assetsData.music,function(i,u){
							   				line.push('<div class="assetsBGMusic" data="'+ GetZDocFactoryHost() + u.uri +'"><i class="icon-music_note"  ></i>\
							   						   <p>大小:'+ (fileSizeForamt(u.size)) +'</p>\
							   						   <p>更新时间:'+ u.modifyTime +'</p><input type="checkbox" name="assetsBGMusic" etype="2" value="'+ u.uri +'"/>\
							   						   <div class="fadePanel"><i class="icon-play2" title="试听"></i></div></div>');
							   			});
							   			e.innerHTML = line.join('');
							   		}
							   	},
							   	{
							   		title : '上传背景图/音乐',
							   		panelId : 'pspSetUpload'
							   	}]
				   	      	}
				   	    ]
				});
				
				ChasonTools.delayRun(function(){
					ChasonxDom.draw({
						  id : 'pspSeting',
						  item : [
						      {text : '&nbsp;'},
						      {text : '选项:',name : 'previewState',type : 'select',options :[{t : '推荐预览',v : '1'},{t : '取消推荐',v : (currentDocData.FPreview || 0)}]},
						      {text : '方式',name : 'previewAutoPlay' , type : 'select' ,options : [{t : '手动播放', v : '0'},{t : '自动播放',v : (currentDocData.FAutoPlay || 1)}]},
						      {text :'自动播放间隔时长:',name:'previewTimeout',type:'input',atype : 'number',attr : ' min="0" max="100" ',value : '3',info : '秒'},
						      {text : '&nbsp;',info : ''},
						  ]
					});
					ChasonxDom.draw({
						id : 'pspSetUpload',
						item : [
							      {text : '&nbsp;'},
							      {text:'选择文件:',info : '<div id="uploadBGFilePanel" class="dragFilePanel">单击选择文件</div><div class="dragDesc">&nbsp;(支持：jpeg | png | gif | mp3 文件上传图片小于 3MB,音频文件小于10MB)</div>'},
							      {text:'类型:',name:'bgFileType',type:'select',attr : ' disabled="disabled" ',options : [{t : '背景图',v : 'image'},{t : '背景音乐',v : 'music'}]},
							      {text : '&nbsp;',info : '<input id="uploadBGFileBtn" type="button" class="button blue" value="上传文件" />'}
							  ]
					});
					
					_BGFileUploader = Chasonx.SimpleUpload({
						targetID : 'uploadBGFilePanel',
						accept : '.jpeg,.jpg,.png,.gif,.mp3',
						size : 10 * 1024 * 1024,
						selectCallBack : function(e){
							if(e.files.length > 0){
								$("#uploadBGFilePanel").html(e.value + ('(大小：' + fileSizeForamt(e.files[0].size)) + ')');
								console.debug(e.files[0]);
								if(e.files[0].type.indexOf('image') != -1) $("#bgFileType").find('option[value="image"]').attr('selected',true);
								else	$("#bgFileType").find('option[value="music"]').attr('selected',true);
							}
						}
					});
					
					getBGFileData();
					
				},200);
				}
			},
			setBGFileToPanel : function(name,v,t){
				$("#chooseStatePanel").append('<div class="choose_'+ name +'" data="' + v + '" type="'+ t +'">\
					      '+ (__input.attr('etype') == 1?'<span>已设置背景图</span><img src="'+ GetZDocFactoryHost() + v +'" />':'<span>已设置背景音乐</span><i class="icon-music_note"></i>') +'<label class="icon-cancel-circle" title="移除"></label></div>')

			},
			getBGFileData : function(){
				with(this){
					getDocAuthCode(function(_param){
						getAjaxData(DefConfig.Doc.GetDocAssets,{param : JSON.stringify(_param)},function(d){
							assetsData = d.data || null;
						},'jsonp',DefConfig.JSONP);
					});
				}
			},
			docDetail : function(){
				with(this){
					if(currentDocData == null) return Chasonx.Hint.Faild('请先选择文档');
					
					var _p = {};
					_p.docGuid = currentDocData.FGuid;
					getDocAuthCode(function(param){
						_p = Object.assign(_p,param);
						
						getAjaxData(DefConfig.Doc.DocDetail,{param : JSON.stringify(_p)},function(data){
							detailDocData = data.data;
							
							var size = ChasonTools.getWindowSize();
							var dialog = new Chasonx({
								  title : '文档详情',
								  html : '<div id="detailDocPanel" style="width:100%;height:96%;">\
									  		<div id="detailDocLeft"></div><div id="detailDocRight"><div class="docImgView"></div><div class="docImgRemark">\
									  		<div class="domPanelBox"><domitem>备注</domitem><domitem><textarea id="docViewRemark" class="inputText textarea"></textarea></domitem></div>\
									  		 <div class="domPanelBox"><domitem>&nbsp;</domitem><domitem><input type="button" class="button green" value="更新备注" id="updateDocViewRemark"/></domitem>\
									  		</div></div></div>\
									  	  </div>',
								  modal : true,
								  width:size[2] * 0.8,height : size[3] * 0.8,
								  cancel : false
							});
							
							Chasonx.Frameset({
								target   : 'detailDocPanel',
								window : {
									left : {id : 'detailDocLeft',width : '20%',border:'#d2d2d2',bgColor : '#ffffff',slide : false},
									right: {id : 'detailDocRight',bgColor : '#ffffff',border:'#d2d2d2'},
									}
							});
							
							var thumbs = [];
							$.each(data.data.thumb,function(i,u){
								thumbs.push('<div class="thumbImagePanel" style="background-image:url('+ GetZDocFactoryHost() + u.FPath +');"  data="'+ i +'" ><span>'+ (i + 1) +'</span></div>');
							});
							
							$("#detailDocLeft").html(thumbs.join(''));
						},'jsonp',DefConfig.JSONP);
					});
				}
			},
			setView : function(){
				with(this){
					if(currentDocImgIdx == -1) return;
					var img = detailDocData.image[currentDocImgIdx];
					$("#detailDocRight > .docImgView").html('<img src="'+ GetZDocFactoryHost() + img.FPath +'" />');
					$("#docViewRemark").val(img.FName);
				}
			},
			updateView : function(){
				with(this){
					if(currentDocImgIdx == -1) return;
					var  p = {};
					p.id = detailDocData.image[currentDocImgIdx].id;
					p.FName = $("#docViewRemark").val();
					getDocAuthCode(function(_param){
						p = Object.assign(p,_param);
						getAjaxData(DefConfig.Doc.UpdateDocImage,{param : JSON.stringify(p)},function(d){
							if(d.result > 0){
								$("#docViewRemark").val('');
								Chasonx.Hint.Success('备注已更新');
							}
						},'jsonp',DefConfig.JSONP);
					});
				}
			},
			upload : function(){
				with(this){
					var _upload;
					if(currentFolder == null) return Chasonx.Hint.Faild('请先选择图册');
					var dialog = new Chasonx({
						title : '文档上传',
						html : '<div id="uploadPanel" style="height:100%;" class="global_bg_c"></div>',
						width : 700,height : 600,
						modal : true,
						okText : '开始上传',
						success : function(){
							if(FormData.requiredByAttr('uploadPanel',['input'])){
								
								getDocAuthCode(function(_param){
									var data = FormData.getFormData('uploadPanel',['input','select','textarea']);
									data.folderGuid = currentFolder;
									data.creater = _param.authCode;
									data.FCreaterName = _param.authName;
									data = Object.assign(data,_param);
									
									_upload.startUpload({
										url : DefConfig.Doc.DocUpload,
										data : data,
										jsonp : DefConfig.JSONP,
										success : function(){
											Chasonx.Hint.Success('操作完成');
											FormData.clearInput('uploadPanel',['input','textarea']);
											getDocList();
										},
										error : function(d){
											console.log(d);
										}
									});
								});
							}
						}
					});
					
					ChasonxDom.draw({
						  id : 'uploadPanel',
						  item : [
						      {text : '&nbsp;'},
						      {text:'选择文件:',info : '<div id="dragFilePanel" class="dragFilePanel">单击选择文件</div><div class="dragDesc">&nbsp;(支持：pdf | doc | docx | ppt | pptx 文件上传，大小 10MB以下)</div>'},
						      {text:'文档标题:',name:'title',type:'input',attr : ' req = "true" maxlength="150" ',info : '*'},
						      {text:'文档来源:',name:'source',type:'input',attr : ' req = "true" maxlength="100" ',info : '*'},
						      {text:'备注:',name:'remark',type:'textarea',attr : ' req = "true" ',value : ''},
						      {text:'图片宽:',name:'width',type : 'input',atype : 'number',info : 'PX,转换图片宽度'},
						      {text:'图片高:',name:'height',type:'input',atype : 'number',info : 'PX,转换图片高度'},
						      {text: '图片类型:',name : 'imageType',type : 'select',options : [{t : 'JPEG',v : 'jpeg'},{t : 'PNG',v : 'png'},{t : 'GIF',v : 'gif'}]},
						      {text: '文件后缀名:',name : 'filePrefix',type : 'input'},
						      
						  ]
					});
					
					_upload = Chasonx.SimpleUpload({
						targetID : 'dragFilePanel',
						accept : '.pdf,.doc,.docx,.ppt,.pptx',
						size : 10 * 1024 * 1024,
						selectCallBack : function(e){
							if(e.files.length > 0){
								$("#dragFilePanel").html(e.value + ('(大小：' + fileSizeForamt(e.files[0].size)) + ')');
							}
						}
					});
				}
			}
	};
	
	var GetZDocFactoryHost = function(){
		  return SyncUrl.DOCFactory.substring(0,SyncUrl.DOCFactory.lastIndexOf("/"));
	};
	
	var _keyC = [];
	window.onkeydown = function(event){
		event = event || window.event;
		switch(event.keyCode){
		case 17:
		case 81:
			_keyC[event.keyCode] = true;
			break;
		}
	};
	
	window.onkeyup = function(event){
		event = event || window.event;
		switch(event.keyCode){
		case 17:
		case 81:
			if(_keyC[17] && _keyC[81]){
				var _sar = $(".docSearchPanel");
				if(_sar.css('display') == 'none') _sar.fadeIn();
				else _sar.fadeOut();
			}
			_keyC[event.keyCode] = false;
			break;
		}
	};
	

