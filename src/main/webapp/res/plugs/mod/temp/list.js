

var Template = {
	  basePath : null,
	  currSiteGuid : null,
	  adContainer : {},
	  list : function(){
		  Chasonx.Wait.Show();
		  $.ajax({
			 url:DefConfig.Root + '/main/template/list',
			 type:'get',
			 dataType:'json',
			 data : {'siteguid':(this.currSiteGuid || '')},
			 success:function(d){
				 Template.draw(d);
			 },
			 error:function(e){
				 Chasonx.Hint.Faild(e.rsponseText);
				 Chasonx.Wait.Hide();
			 }
		  });
		  Chasonx.Wait.Hide();
	  },
	  draw : function(d){
		  var html = '';
		  if(d.length > 0){
			  $.each(d,function(i,u){
				  html += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'temp\',\'_selectAll\')">';
				  if(u.ftempguid != u.fguid) html += '<td><input  type="checkbox" name="temp" value="'+ u.id +'" path="'+ u.fpath + '" sitename="'+ u.fassetname +'" sourguid="'+ u.fguid +'" guid="'+ u.fsiteguid +'"/></td>';
				  else html += '<td><font color="#f09">[使用中]</font></td>';
				  html += '<td>'+( i+1 )+'</td>\
					    <td>'+ u.fassetname +'</td>\
					    <td>'+ u.fmd5code +'</td>\
					    <td>'+ u.fsitename +'</td>\
					    <td>'+ fileSizeForamt(u.fsize) +'</td>\
					    <td>'+ u.fpath +'</td>\
					    <td>'+ u.fuploader +'</td>\
					    <td>'+ u.fuploadtime +'</td>\
					    </tr>';
			  });
		  }else{
			  html += '<tr class="dataGridTr"><td colspan="9">暂无数据</td></tr>';
		  }
		  $("#tempData").html(html);
	  },
	  filelist : function(){
		  this.choseTemp(function(obj){
			  var html = '<div class="tempFileBoxLeft">\
		  			<div class="mainHead"><div class="buttonBox" ><input type="button" class="button green" value="插入资源请求" onclick="AdLocation.add(\''+ obj.attr('sitename') +'\')"/>\
		  				<input type="button" class="button red" onclick="AdLocation.cancelAd()" value="取消请求"/>\
		  			 </div></div>\
		  			 <div class="fileStats">模版名称:<input type="text" id="templateAlias" class="inputText" /><input type="hidden" id="templateGuid" /></div>\
				  	 <div id="currTemplatePath" class="fileStats">预览地址：<font></font></div>\
				  	 <div id="adLocation" class="adLocationBox"><div class="left">预广告位：</div><div class="right"></div></div>\
				  	 <div id="adLocationChoose" class="adLocationBox"><div class="left">已  选：</div><div class="right"></div></div>\
				     <div id="fileDirectory" class="fileStats"></div>\
		   		     <div><div class="fileAttr"><span>文件名</span><span>文件大小</span><span>更新时间</span><span>编辑时间</span></div></div>\
				  	 <div id="filelistBox" class="filePanel"></div>\
		  		  </div>\
		  		  <div class="tempFileBoxRight">\
		  			<img src="'+ DefConfig.Root +'/res/skin/images/iphone.png" class="phoneWebBg"/><div class="phoneWebView"><iframe id="templatePreview" src="" style="border:0px;" width="100%" height="100%"></iframe></div></div>';
			  new Chasonx({
				 title : '模版列表 - ['+ obj.attr('sitename') +']', 
				 html : html,
				 width:1200,height:850,
				 modal:true
			  });
			  Template.basePath = obj.attr('path');
			  Template.goDirectory(obj.attr('path'));
			 
			  $("#adLocation > .right > .item").live('click',function(){
				   var inp = $(this).find('input');
				   $(this).find('input').attr('checked',!inp.attr('checked'));
				   if(inp.attr('checked') == 'checked') $(this).css('border','1px solid #f95454');
				   else $(this).css('border','1px solid #ccc');
			  });
			  
			  $("#adLocationChoose > .right > .item").live('click',function(){
				   var inp = $(this).find('input');
				   $(this).find('input').attr('checked',!inp.attr('checked'));
				   if(inp.attr('checked') == 'checked') $(this).css('border','1px solid #49b5f4');
				   else $(this).css('border','1px solid #ccc');
			  });
		  });
	  },
	  goDirectory : function(dir){
		  this.drawFileList(dir);
		  
		  var sDir = dir.replace(this.basePath,''),base = '<a href="javascript:void(0)" onclick="Template.goDirectory(\''+ this.basePath +'\')" path="/"> / </a>';
		  if(sDir.length > 0){
			  var sDirArray = sDir.split('/'),temp = '';
			  for(var i = 0;i < sDirArray.length;i++){
				  if(sDirArray[i] != ''){
					  temp +=  sDirArray[i] + '/';
					  base += ' / <a href="javascript:void(0)" onclick="Template.goDirectory(\''+ this.basePath + '/' + temp +'\')" path="/"> '+ sDirArray[i] +' </a>';
				  }
			  }
		  }
		  $("#fileDirectory").html(base);
	  },
	  drawFileList : function(path){
		  Chasonx.Wait.Show();
		  $.ajax({
			  url : DefConfig.Root + '/main/template/fileList',
			  type:'get',
			  dataType:'json',
			  data:{'path':path},
			  success:function(d){
				  
				  var siteguid = $("input[type='checkbox'][name='temp']:checked").attr('guid');
				  $.ajax({
					 url : DefConfig.Root + '/main/template/templist', 
					 type:'get',
					 dataType:'json',
					 data:{'siteGuid':siteguid},
					 success:function(tdata){
						 
						 var html = '',editMark = '',tempguid,tname;
						  $.each(d,function(i,u){
							  
							 editMark = '<span></span>',tempguid = '',tname='';
							 $.each(tdata,function(n,k){
								 if(k.previewpath == (path + '/' + u.fileName)){
									 editMark = '<span>'+ k.createtime +'</span>';
									 tempguid = k.guid;
									 tname = k.tempname;
									 return false;
								 }
							 });
							  
							  html += '<div class="item">';
							 if(u.fileType == "directory"){
								 html += '<span><a href="javascript:void(0)" onclick="Template.goDirectory(\''+ path + '/' + u.fileName + '\')">'+ u.fileName +'</a></span>';
							 }else{
								 html += ' <span><a href="javascript:void(0)" onclick="Template.showHtml(\''+ path + '/' + u.fileName +'\',\''+ tname +'\',\''+ tempguid +'\')" style="color:#0fafff;">'+ u.fileName +'</a></span>';
							 }
							 html += '<span>'+ (u.fileSizeFormat || '文件夹') +'</span><span>'+ u.modifyTime +'</span>'+ editMark + '</div>';
						  });
						  $("#filelistBox").html(html);
						  
					 },
					 error:function(e){
						 Chasonx.Hint.Faild('模版加载失败');
					 }
				  });
				 
				  Chasonx.Wait.Hide();
			  },
			  error:function(e){
				  Chasonx.Hint.Faild(e.responseText);
				  Chasonx.Wait.Hide();
			  }
		  });
	  },
	  showHtml : function(url,tname,tempguid){
		  $("#templatePreview").attr('src',DefConfig.Root + url);
		  
		  var adLocation = $("#adLocation > .right");
		  	  adLocation.html('');
		  setTimeout(function(){
			  var $content = $("#templatePreview").contents();
			  var iframe = $content.find('iframe');
			  var video  = $content.find('video');
			  
			  var _w,_h,_id,_name;
			  if(iframe.size() > 0){
				  $.each(iframe,function(){
					  if($(this).css('display') != 'none' && $(this).attr('id') != ''){
						  $(this).css('border','1px solid red');
						  _w = $(this).width(),_h = $(this).height(),_id = $(this).attr('id'),_name= $(this).attr('name');
						  adLocation.append('<div id="t_'+ _id +'" class="item">图片广告<br>'+ _w + '*' + _h + '<input type="checkbox" name="adlocation" value="Image" dw="'+ _w +'" dh="'+ _h +'" did="'+ _id +'" dname="'+ _name +'"/></div>');
					  }
				  });
			  }
			  if(video.size() > 0){
				  $.each(video,function(){
					 if($(this).css('display') != 'none' && $(this).attr('id') != ''){
						  $(this).css('border','1px solid blue');
						  _w = $(this).width(),_h = $(this).height(),_id = $(this).attr('id'),_name= $(this).attr('name');
						  adLocation.append('<div id="t_'+ _id +'" class="item" style="background:#B0E2F4;">视频广告'+ _w + '*' + _h + '<input type="checkbox" name="adlocation" value="Video"  dw="'+ _w +'" dh="'+ _h +'" did="'+ _id +'" dname="'+ _name +'"/></div>');
					 }
				  });
			  }
			  
			  Template.getMedieList(tempguid);
		  },300);
		  
		  $("#currTemplatePath > font").html(url);
		  
		  /**/
		  $("#templateAlias").val(tname);
		  $("#templateGuid").val(tempguid);
	  },
	  getMedieList : function(tempguid){
		  $("#adLocationChoose > .right").html('');
		  if(tempguid != ''){
			  $.ajax({
				 url : DefConfig.Root + '/main/template/getAdList', 
				 type:'get',
				 dataType:'json',
				 data:{'tempguid':tempguid},
				 success:function(d){
					 var html = '';
					 $.each(d,function(i,u){
						 html += '<div class="item" style="background:#E9EAEA;">'+ (u.ftype == 'Image'?'图片广告':'视频广告') + u.fwidth + '*' + u.fheight +'<input type="checkbox" name="adlocationchoose" value="'+ u.id +'" data="'+ u.ftempguid +'"/></div>';
						 $("#t_" + u.fmarkid).find('input').remove();
					 });
					 $("#adLocationChoose > .right").html(html);
				 },
				 error:function(e){
					 Chasonx.Hint.Faild(e.responseText);
				 }
			  });
		  }
	  },
	  choseTemp : function(cb){
		  var chose = $("input[type='checkbox'][name='temp']:checked");
		  if(chose.size() > 0) cb(chose);
		  else Chasonx.Hint.Faild('请选择一项后进行操作');
	  },
	  delTemplate : function(){
		  this.choseTemp(function(obj){
			  Chasonx.Alert({alertType:'warning',html:'确定删除该模版吗？',modal:true,success:function(){
				  getAjaxData(DefConfig.Root + '/main/template/delTemplate',{'guid':obj.attr('sourguid')},function(d){
					  switch(d){
					  case 0: Chasonx.Hint.Faild('删除失败'); break;
					  case 1: Chasonx.Hint.Success('资源已删除'); Template.list(); break;
					  case 2: Chasonx.Hint.Faild('该模版在使用中，不可删除'); break;
					  default:break;
					  }
				  });
				  return true;
			  }});
		  });
	  },
	  tempFileList : function(templateResourceId){
		  if(!isBlankString(templateResourceId)) return false;
		  Chasonx.Wait.Show();
		  getAjaxData(DefConfig.Root + "/main/template/fileList",{"templateResourceGuid":templateResourceId},function(d){
			 var line = '';
			 if(d == null){
				 $("#tempItems").html('');
				 return $("#tempItems").html('未找到模板页面！');
			 }
			 
			 TempPreview.currTempSourceGuid = d.sourceGuid;
			 TempPreview.previewPath = d.previewPath;
			 $.each(d.list,function(i,u){
				 if(u.fileType == "file"){
					 line += '<p title="修改日期：'+ u.modifyTime +'&#13;文件大小：'+ u.fileSizeFormat +'&#13;文件类型：'+ u.fileSuffix +'&#13;预览地址：'+ u.parentDirectory +'">'+ u.fileName +'</p>';
				 }
			 });
			 $("#tempItems").html(line);
			 Chasonx.Wait.Hide();
		  });
	  }
};

var __PANEL_IDX_NUM = 0;
function panelCtrl(idx,obj){
	__PANEL_IDX_NUM = idx;
	$(".TempGroupItem").hide();
	$(".TempGroupItem").eq(idx).show();
	
//	if(obj == undefined) return;
//	$(".tempStateBtn").find("input[type='button']").removeClass('groupFocus');
//	$(obj).addClass('groupFocus');
	
	if(idx == 0) TempPreview.mrInit();
	if(idx == 1) TempPreview.mrPreview();//TempPreview.goEditMrPanel();
	if(idx == 2) TempPreview.applyHistory(); // TempPreview.mrPreview();
	//if(idx == 4) TempPreview.publishHistory();
}

function formatAttr(s){
	return (s == undefined || s == 'undefined' || s == null)?'':s;
}

var TempPreview = {
		childWin : null,
		mrData : {},
		siteName : null,
		currTempUrl : null,
		currTempSourceGuid : null,
		currTempMrItems : [],
		previewPath : null,
		texistName : '',
		show : function(url){
			this.currTempUrl = url;
			url = DefConfig.Root + this.previewPath + '/' + url;
			var winSize = ChasonTools.getWindowSize();
			var _w = 400,_h = 750;
			var para = "height="+ _h +",width="+ _w +",top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no,screenX=" + (winSize[0]/2 + _w)+",screenY="+(winSize[1]/2 - _h/2) ;
			this.childWin = window.open(url,'TempPreview',para);
			this.currTempMrItems = [];
			this.mrData = {};
			this.texistName = '';
			this.siteName = '';//$("#fileListSite > div[class='fileSiteFocus']").html();
			TempPreview.mrInit();
		},
		mrInit : function(existItems){
			if(__PANEL_IDX_NUM != 0 || this.childWin == null) return;
			var flag = 0;
			setTimeout(function(){
				var _type = '',$_dom = null,_color = '',_name,_width,_height,_size,_codec,_rate,_position,_items;
				$(TempPreview.childWin.window.document.body).find("*").each(function(i,dom){
					$_dom = $(dom);
					_type = $_dom.attr("OPG_MR_TYPE");
					if(_type == "Image" || _type == "Video"){
						_color = getRandomColor();
						_name = $_dom.attr('OPG_MR_NAME');
						_width = $_dom.attr('OPG_MR_WIDTH');
						_height = $_dom.attr('OPG_MR_HEIGHT');
						_size = $_dom.attr('OPG_MR_SIZE');
						_codec = $_dom.attr('OPG_MR_CODEC') || '';
						_rate = $_dom.attr('OPG_MR_BITRATE') || '';
						_position = $_dom.attr('POSITION') || '';
						_items = $_dom.attr('ITEMS') || '[]';
						
						$_dom.css("border","1px solid " + _color);
						
						flag = ~~(Math.random()*100);
						TempPreview.pushMrItem({'_type':_type,'_name':_name,'_width':_width,'_height':_height,'_position':_position,'_size':_size,'_codec':_codec,'_rate':_rate,'_color':_color,'idx':flag,'exist':false,'_items':_items});
						TempPreview.mrData["Data_" + flag] = {type : _type,name : _name,position : _position,width : _width,height : _height,size: _size,codec : _codec,rate : _rate,items : _items};
					}
				});
				
				TempPreview.checkExist(function(){
					$(".TempGroupItem").eq(0).html(TempPreview.returnMrDataHtml());
				});
			},500);
		},
		returnMrDataHtml : function(){
			var line = '',D,_ITEMS;
			for(var i = 0,len = this.currTempMrItems.length;i < len;i++){
				D = this.currTempMrItems[i];
				D._items = eval(D._items);
				line += '<div class="tempAttrPanel"><div class="attr">';
				line += '<p><label>资源请求类型：</label>'+ D._type +'</p>';
				line += '<p><label>资源请求位置：</label>'+ D._name +'</p>';
				line += '<p><label>资源请求尺寸：</label>';
				if(D._items.length > 0){
					for(var sfe = 0;sfe < D._items.length;sfe ++){
						line += '('+ (sfe + 1) +') : ' + D._items[sfe].WIDTH + 'px * ' + D._items[sfe].HEIGHT + ' px&nbsp;';
					}
				}else{
					line += D._width + '(宽) * ' + D._height + '(高)';
				}
				line += '</p>';
				line += '<p><label>资源请求大小限制：</label>'+ (D._size || '') +'</p>';
				line += '<p><label>位置标识：</label>'+ D._position +'</p>';
				
				if(D._type == "Video"){
					line += '<p><label>视频编码：</label>'+ D._codec +'</p>';
					line += '<p><label>视频码率：</label>'+ D._rate +' Kbits </p>';
				}
				if(!D.exist){
					line += '<p><label>颜色标示：</label><span class="_colorTips" style="background:'+ D._color +'">&nbsp;</span></p>';
					line += '<input type="checkbox" name="OPG_MR_CHECK" value="'+ D.idx +'"/>';
				}
				line += '</div><img src="'+ DefConfig.Root +'/res/skin/images/T_'+ D._type +'.png" /></div>';
			}
			
			if(line == ''){
				line = '<div class="mr_Tips">该模板未找到资源占位符！</div>';
			}else{
				line += '<div class="buttons">自定义模板页面名称：<input type="text" maxlength="100" id="customTempName" class="inputText" '+ (TempPreview.texistName != ''?'readonly="readonly"':'') +' value="'+ ( TempPreview.texistName != ''?TempPreview.texistName: TempPreview.siteName + '-' + TempPreview.currTempUrl) +'"/></div>';
				line += '<div class="buttons"><input type="button" id="_editMrBtn" class="button blue" onclick="TempPreview.modifyMrData()" value="现在开始设置资源"/></div>';
			}
			return line;
		},
		pushMrItem : function(data){
			var add = true;
			for(var i = 0,len = this.currTempMrItems.length;i < len;i ++){
				if(this.currTempMrItems[i]._type == data._type && this.currTempMrItems[i]._name == data._name) add = false;
			}
			if(add) this.currTempMrItems.push(data);
		},
		checkExist : function(fn){
			getAjaxData(DefConfig.Root + "/main/template/checkTemplateExist",{"previewPath":this.previewPath + "/" + this.currTempUrl},function(d){
				if(d != 0){
					TempPreview.texistName = d.ftname;
					$.each(d.items,function(i,u){
						if(TempPreview.currTempMrItems[i]._type == u.ftype && TempPreview.currTempMrItems[i]._name == u.fname)
							TempPreview.currTempMrItems[i].exist = true;
					});
				}
				if(typeof fn == 'function') fn();
			});
		},
		modifyMrData : function(){
			var mr_ck = $("input[type='checkbox'][name='OPG_MR_CHECK']:checked");
			if(mr_ck.size() > 0){
				var _customTName = $("#customTempName");
				if(_customTName.val() == '') _customTName.val(this.siteName + '-' + this.currTempUrl); 
				
				var mrType = [],mrW = [],mrH = [],mrName = [],mrSize = [],mrCodec = [],mrRate = [],mData = null,mrPosition = [],mrItems = [];
				mr_ck.each(function(){
					mData = TempPreview.mrData['Data_' + $(this).val()];
					mrType.push(mData.type);
					mrW.push(mData.width);
					mrH.push(mData.height);
					mrName.push(mData.name);
					mrSize.push(mData.size || '');
					mrCodec.push(mData.codec);
					mrRate.push(mData.rate);
					mrPosition.push(mData.position);
					mrItems.push(mData.items);
				});
				
				var _postData = {ftname:$("#customTempName").val(),ftempsourceguid:this.currTempSourceGuid,
							 fpreviewpath:this.previewPath + '/' + this.currTempUrl,adType:mrType,adW:mrW,adH:mrH,adName:mrName,
							 adCodec:mrCodec,adRate:mrRate,adSize:mrSize,adPosition:mrPosition,adItems:mrItems};
				getAjaxData(DefConfig.Root + "/main/template/modifyad",_postData,function(d){
					if(d > 0){
						//TempPreview.goEditMrPanel();
						panelCtrl(1);
						//$(".tempStateBtn > input").eq(1).click();
					}
				});
			}else{
				this.goEditMrPanel();
				$(".tempStateBtn > input").eq(1).click();
			}
		},
		goEditMrPanel : function(){
			if(TempPreview.currTempSourceGuid == null) return Chasonx.Hint.Faild('当前模板不可用');
			$(".editMrFrame").attr('src',DefConfig.Root + '/main/template/forwardUams?siteGuid=' + TempPreview.currTempSourceGuid);
		},
		MediaInfoData : null,
		mrPreview : function(){
			if(TempPreview.currTempSourceGuid == null) return Chasonx.Hint.Faild("无法加载资源预览");
			
			this.MediaInfoData = [];
			var _midx = 0;
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + "/main/template/mediaRequestInfoList",{"siteGuid":TempPreview.currTempSourceGuid},function(d){
				Chasonx.Wait.Hide();
				try{
				var line = '<p style="width:90%;display:block;padding: 8px 0px;margin:0px auto;">资源请求列表：</p>',items,randomId,timeSet,positionItems;
				if(d.length > 0){
					$.each(d,function(i,u){
						line += '<div class="mrItemsBox">\
									<div class="head" data="'+ u.previewpath +'">\
										<span>&nbsp;&nbsp;' + u.tempname + '</span>\
										<span></span>\
										<span></span>\
										<span>创建时间:' + u.createtime + '</span>\
										<span><input type="button" class="button blue btnsmall" style="width:70px;" value="预览效果" onclick="TempPreview.afterTempReview(\''+ u.guid +'\',\''+ u.previewpath +'\','+ u.state +')"/>\
										</span>\
									</div><div class="body">';
						
						$.each(u.items,function(j,k){
							TempPreview.MediaInfoData.push(k);
							
							items = (k.medialist? eval(k.medialist) || {}:[]);
							timeSet = (k.markname? JSON.parse(k.markname) || {}:{} );
							randomId = (Math.random() + "").replace('.','');
							positionItems = k.items?eval(k.items):[];
							line += '<div style="border-bottom:1px solid #ccc;"><div class="box" style="floag:left;">\
								 		<p>资源类型：'+ k.type +'</p>\
								 		<p>资源位置：'+ k.mname +'</p>\
								 		<p>资源尺寸：';
							if(positionItems.length > 0){
								for(var dnf = 0;dnf < positionItems.length;dnf ++){
									line += '('+ (dnf + 1) +')' + positionItems[dnf].WIDTH + 'px * ' + positionItems[dnf].HEIGHT + 'px&nbsp;';
								}
							}else{
								line += k.width + '*' + k.height;
							}
							line += '</p>';
							line += '<p>资源大小：'+ k.size +' kb</p>\
								 		<p>(注：不设时间则作为默认播单)</p>\
								 		<input type="checkbox" name="media" value="'+ k.id +'" data="'+ k.guid +'"/>\
								 		<p><div class="link"><label>开始时间：</label>\
							          		<input type="text" value="'+ (timeSet.startDate || '') +'" id="startDate'+ randomId +'" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',realFullFmt:\'%Date\'})" class="inputText Wdate" style="width:120px;" />\
							          		<input type="text" value="'+ (timeSet.startTime || '') +'" id="startTime'+ randomId +'" onclick="WdatePicker({dateFmt:\'HH:mm:ss\',realFullFmt:\'%Date\'})" class="inputText Wdate" style="width:120px;"/>\
							            </div>\
							            <div class="link"><label>结束时间：</label>\
						          			<input type="text" value="'+ (timeSet.endDate || '') +'" id="endDate'+ randomId +'" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',realFullFmt:\'%Date\'})" class="inputText Wdate" style="width:120px;" />\
						          			<input type="text" value="'+ (timeSet.endTime || '') +'" id="endTime'+ randomId +'" onclick="WdatePicker({dateFmt:\'HH:mm:ss\',realFullFmt:\'%Date\'})" class="inputText Wdate" style="width:120px;"/>\
							            </div></p>\
								 		<p><input type="button" value="保存" class="button blue" onclick="_setMediaUrl(\'' + randomId +'\','+ _midx +','+ k.id +')"/></p>\
									 </div>';
							 if(items != null && k.type == "Image"){
								 	line += '<div style="float:right;width:48%;">\
								 			 <div id="ResoucePanel_'+ k.id +'">';
								 
								 if(positionItems.length > 0 && items.length == 0){
									 for(var ssr = 0;ssr < positionItems.length;ssr ++){
										 line += '<div class="ResouceBox" style="text-align:center;float:right;width:100%;">\
										 		<div class="imgBox">\
										 				<img id="_mrpreviewObj'+ randomId +'" src="'+ DefConfig.Root +'/res/skin/images/error.jpg" data="" style="width:100%;height:100%;" />\
										 				<input type="button" class="button blue" value="设置" onclick="ResourceSelector('+ k.id +','+ ssr +')"/>\
									 			</div>\
									 			<div class="link"><label>超链接：</label><input type="text" class="inputText" etype="URL" value="" guid="'+ k.guid +'" name="TempImageLink'+ randomId + j +'" /></div>\
									 			' + ( k.markid == 'hotVideo'?'<div class="link"><label>标&nbsp;&nbsp;&nbsp;题：</label><input type="text" class="inputText" etype="TITLE" value="" guid="'+ k.guid +'" name="TempImageLink'+ randomId + j +'" /></div>':'') +'\
									 			<span>'+ (ssr + 1)  +'</span><em>分辨率：'+ positionItems[ssr].WIDTH + 'px*' + positionItems[ssr].HEIGHT +'px</em></div>';
									 }
								 }else{
									 for(var m = 0;m < items.length;m++){
										 items[m].fullUri = items[m].fullUri? items[m].fullUri.replace(SyncUrl.UAMS_IP,''):'';
										 line += '<div class="ResouceBox" style="text-align:center;float:right;width:100%;">\
											 		<div class="imgBox">\
											 				<img id="_mrpreviewObj'+ randomId +'" src="'+ SyncUrl.UAMS + items[m].fullUri + '" data="'+ items[m].fullUri +'" style="width:100%;height:100%;" />\
											 				<input type="button" class="button blue" value="设置" onclick="ResourceSelector('+ k.id +','+ m +')"/>\
												 			'+ (positionItems.length > 0?'':'<input type="button" class="button red" style="top:30%;" value="删除" onclick="TempPreview.delResouceSelector(this,'+ k.id +')"/>') + '\
										 			</div>\
										 			<div class="link"><label>超链接：</label><input type="text" class="inputText" etype="URL" value="'+ (items[m].url || '') +'" guid="'+ k.guid +'" name="TempImageLink'+ randomId + j +'" /></div>\
										 			' + ( k.markid == 'hotVideo'?'<div class="link"><label>标&nbsp;&nbsp;&nbsp;题：</label><input type="text" class="inputText" etype="TITLE" value="'+ (items[m].title || '') +'" guid="'+ k.guid +'" name="TempImageLink'+ randomId + j +'" /></div>':'') +'\
										 			<span>'+ (m + 1)  +'</span></div>';
									 }
								 }
								 line += '</div><div class="addItemPanel"><input type="button" class="button blue btnround" value="+" onclick="TempPreview.addResourceSelector('+ k.id +',\'Image\',\''+ k.markid +'\',' + positionItems.length + ')"/></div></div>';
							 }else if(items != null && k.type == "Video"){
								 line += '<div style="float:right;width:48%;">\
									     <div id="ResoucePanel_'+ k.id +'">';
								 for(var m = 0;m < items.length;m++){
									 items[m].fullUri = items[m].fullUri? items[m].fullUri.replace(SyncUrl.UAMS_IP,''):'';
									 line += '<div class="ResouceBox" style="text-align:center;float:right;width:100%;">\
												<div class="imgBox">\
											 		<video  controls="controls" src="'+ SyncUrl.UAMS + (items[m].fullUri || '') +'" data="'+ items[m].fullUri +'">您的浏览器不支持video标签。</video>\
											 		<input type="button" class="button blue" value="设置" onclick="VideoResourceSelector('+ k.id +','+ m +')"/>\
											 		<input type="button" class="button red" style="top:30%;" value="删除" onclick="TempPreview.delResouceSelector(this,'+ k.id +')"/>\
											 	 </div>\
											  <span>'+ (m + 1) +'</span></div>';
								 } 
								 line += '</div><div class="addItemPanel"><input type="button" class="button blue btnround" value="+" onclick="TempPreview.addResourceSelector('+ k.id +',\'Video\','+ positionItems.length +')"/></div></div>';
							 }
							 line += '<div style="clear:both;"></div></div>';
							 
							 _midx++;
						});
						line += '</div></div>';
					});
				}else{
					line += '<div class="mr_Tips">未找到资源请求列表！</div>';
				}
				$(".TempGroupItem").eq(1).html(line);
				
				}catch(e){
					console.debug(e);
				}
			});
			
		},
		afterTempReview : function(tempGuid,_URL,S){
			//if(S == 0) return Chasonx.Hint.Faild('资源编辑中...');
			Chasonx.Wait.Show('资源加载中,请稍候...');
			getAjaxData(DefConfig.Root + "/main/template/afterPreview",{'tempGuid':tempGuid},function(d){
				if(~~d > 0){
					var winSize = ChasonTools.getWindowSize();
					var _w = 400,_h = 750;
					var para = "height="+ _h +",width="+ _w +",top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no,screenX=" + (winSize[0]/2 + _w)+",screenY="+(winSize[1]/2 - _h/2) ;
					window.open(DefConfig.Root + _URL,'TempPreview',para);
				}
				Chasonx.Wait.Hide();
			});
		},
		publishHistory : function(){
			Chasonx.Wait.Show();
			Chasonx.Ajax({
				 url:DefConfig.Root + '/main/template/publishHistory',
				 PageNumber:0,
				 PageSize:10,
				 data :{'siteGuid':(Template.currSiteGuid || '')},
				 before : function(op){
					 op.PageNumber = Math.round((~~op.PageNumber + ~~op.PageSize)/~~op.PageSize);
					 return op;
				 },
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ TempPreview.showPublishHisHtml(d);});	
					 TempPreview.showPublishHisHtml(d);
					 Chasonx.Wait.Hide();
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 	Chasonx.Wait.Hide();
				 }
			});
		},
		applyHistory : function(){
			TempPreview.table.data = {'uGuid':$("#_LOGINUSERGUID").val()};
			TempPreview.table.getData();
		},
		showPublishHisHtml : function(d){
			var _ht = '';
			if(d.list.length > 0){
				$.each(d.list,function(i,u){
					_ht += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'publishval\',\'_selectAll\')">\
					    <td><input type="checkbox" name="publishval" value="'+ u.id +'"/></td>\
					    <td>'+ (d.pageSize * (d.pageNumber - 1) + i + 1) +'</td>\
					    <td>'+ u.fsitename +'</td>\
					    <td>'+ u.fadminname +'</td>\
					    <td>'+ u.fpublishTime  +'</td>\
					    <td>'+ u.publishFilePath +'</td>\
					    <td>'+ fileSizeForamt(u.fpublishFileLength) +'</td>\
					    <td>'+ u.ftarget +'</td>\
					   </tr>';
				});
			}else{
				_ht = '<tr class="dataGridTr"><td colspan="8">暂无数据</td></tr>';
			}
			$("#publishHistoryData").html(_ht);
		},
		historyShow : function(){
			if($(".historyTempList").height() == 0){
				$(".historyTempList").css('height','85%');
				Template.list();
			}else{
				$(".historyTempList").css('height','0%');
			}
		},
		addResourceSelector : function(panelId,type,position,itemLength){
			var size = $("#ResoucePanel_" + panelId + " > .ResouceBox").size(),link = '';
			if(itemLength != 0 && (size + 1) > itemLength) return Chasonx.Hint.Faild("改位置资源数量已限制为：" + itemLength);
			
			var line = '<div class="ResouceBox" style="text-align:center;float:right;width:100%;"><div class="imgBox">';
			if(type == 'Image'){
				line += '<img id="_mrpreviewObj'+ panelId +'" src="'+ DefConfig.Root +'/res/skin/images/error.jpg" style="width:100%;height:100%;" />';
				line += '<input type="button" class="button blue" value="设置" onclick="ResourceSelector('+ panelId +','+ size +')"/>';
				link = '<div class="LinkLocation"><label>超链接：</label><input type="text" etype="URL" class="inputText" value="" guid="" name="TempImageLink'+ panelId +'" />\
				'+ (position == 'hotVideo'?'<div class="link"><label>标&nbsp;&nbsp;&nbsp;题：</label><input type="text" etype="TITLE" class="inputText" value="" guid="" name="TempImageLink'+ panelId +'" /></div>':'') +'\
					</div>'
			}else{
				line += '<video  controls="controls" src="">您的浏览器不支持video标签。</video> ';
				line += '<input type="button" class="button blue" value="设置" onclick="VideoResourceSelector('+ panelId +','+ size +')"/>';
			}
				line += '<input type="button" class="button red" style="top:30%;" value="删除" onclick="TempPreview.delResouceSelector(this,'+ panelId +')"/></div>\
 							'+ link + '<span>'+ (size + 1)  +'</span></div>';
			$("#ResoucePanel_" + panelId).append(line);
			this.reSizeTips(panelId);
		},
		delResouceSelector : function(obj,pannelId){
			$(obj).parent().parent().remove();
			this.reSizeTips(pannelId);
		},
		reSizeTips : function(pannelId){
			var i = 0;
			$("#ResoucePanel_" + pannelId + " > .ResouceBox").each(function(){
				$(this).find('span').text(++i);
			});
		},
		getMediaItem : function(id){
			var _media = {};
			$.each(this.MediaInfoData,function(i,u){
				if(u.id === id){
					_media = u;
					return false;
				}
			});
			return _media;
		}
};

function _setMediaUrl(randomid,idx,id){
	var item = TempPreview.MediaInfoData[idx]; 
	if(item != null){
		var media = [],mediaStr,timeStr;
		var urlArray = $("#ResoucePanel_" + id + " > .ResouceBox");
		if(urlArray.size() > 0){
			urlArray.each(function(){
				media.push({type:item.type,fullUri: SyncUrl.UAMS_IP + $(this).find(item.type == 'Image'?'img':'video').attr('data'),
					title:$(this).find('input[type="text"][etype="TITLE"]').val(),ID:"",url:$(this).find('input[type="text"][etype="URL"]').val(),
					size:item.size,width:item.width,height:item.height});
			});
		}else{
			return Chasonx.Hint.Faild("未设置资源");
		}
		var time = {startDate : $("#startDate" + randomid).val(),endDate : $("#endDate" + randomid).val(),startTime : $("#startTime" + randomid).val(),endTime :$("#endTime" + randomid).val()};
		mediaStr = JSON.stringify(media);
		timeStr = JSON.stringify(time);
		
		getAjaxData(DefConfig.Root + '/main/template/modifyMediaUrl',{'id': id,'mediaList':mediaStr,'timeSet' : timeStr},function(d){
			if(~~d > 0){
				Chasonx.Hint.Success('已更新');
				TempPreview.MediaInfoData[idx].medialist = mediaStr;
				TempPreview.MediaInfoData[idx].markname = timeStr;
			}
		});
	}
}

function _mrPreviewCtrl(id,obj,type){
	var _this = $(obj);
	if(type == 1){
		$("#_mrpreviewObj" + id).attr('src',_this.attr('data'));
		$("#TempImageLink" + id).val(_this.attr('url'));
		$("#TempImageLink" + id).attr('idx',_this.attr('idx'));
	}else{
		$("#_mrpreviewVideo").attr('src',_this.attr('data'));
	}
	_this.parent().find('span').css('background','#969696');
	_this.css('background','#353535');
}

function _checkMediaList(idx){
	$(".mrItemsBox").css('height','40px').eq(idx).css('height','auto');
}

function loadTemplatePkgs(){
	getAjaxData(DefConfig.Root + '/main/template/templatePackageList',null,function(d){
		var line = '<option value="">--选择模板文件包--</option>';
		$.each(d,function(i,u){
			line += '<option value="'+ u.fguid +'">'+ u.fassetname +'</option>';
		});
		$("#templateResoucePkg").html(line).live('change',function(){
			Template.tempFileList($(this).val());
		});
	});
}
/**
 * 申请下发
 */
function applyPublish(){
	if(TempPreview.currTempSourceGuid == null)
		return Chasonx.Hint.Faild('请选择模板文件');
	var mediaCk = $("input[type='checkbox'][name='media']:checked");
	if(mediaCk.size() == 0) return Chasonx.Hint.Faild('请选择要发布的资源');
	
	DevSelector.show("广告资源更新",function(data){
		var formData = {},tempStatusGuids = '';
		mediaCk.each(function(){
			tempStatusGuids += $(this).attr('data') + ',';
		});
		formData.fpublishTitle = data.pname;
		formData.fpublishMode = data.pmode;
		formData.fpublishType = data.ptype;
		formData.fpublishDevice = data.device.join(',');
		formData.fpublishDeviceMac = data.devmac.join(',');
		formData.fpublishDeviceNames = data.deviceNames.join(',');
		formData.ftemplateGuid = TempPreview.currTempSourceGuid;
		formData.fextData = tempStatusGuids;
		formData.ftype = 1;
		formData.type = 1;
		
		getAjaxData(DefConfig.Root + '/main/template/modifyPublishToDo',formData,function(d){
			if(~~d > 0) Chasonx.Hint.Success("已申请下发");
		});
		DevSelector.checkDevice = null;
		return true;
	});
	PublishHisDev.init('presetDevList');
}

/**
 * 资源选择
 */
function ResourceSelector(panelId,idx){
	var _mediaItem = TempPreview.getMediaItem(panelId);
	new Chasonx({
		 title : '['+ _mediaItem.mname +'] 资源列表',
		 html : '<div id="ResourceUploadPanel" >\
			 		<div id="ResUploadItems1"><div id="romateResItems"></div><div id="romatePagePanel" ></div></div>\
			 		<div id="ResUploadItems2"></div>\
			    </div>',
		 width : 600,height:600,
		 modal : true,
		 success : function(){
			 var img = $("input[type='checkbox'][name='romateResItem']:checked");
			 if(img.size() > 0){
				 var url = img.val();
				 var panelObj = $("#ResoucePanel_" + panelId).find('.ResouceBox').eq(idx);
				 panelObj.find('img').attr('src',SyncUrl.UAMS + url).attr('data',url);
				 return true;
			 }
		 }
	});
	var _attr = {width : _mediaItem.width ,height :_mediaItem.height};
	InjectImage.init(_attr);
	Chasonx.Tab({
	   	id : 'ResourceUploadPanel',
	   	bHeight : 20,
	   	bWidth : 100,
	   	fontColor : '#da8f2e',
	   	fontBlurColor : '#7b7171',
	   	itemGroup :[
	   			{ position : 'top|left',
	   			  items :[{
					   		title : '资源选择',
					   		focusColor : '#f6f6f6',
					   		blurColor : '#dcdcdc',
					   		panelId : 'ResUploadItems1',
					   		handler : function(){
					   			ResourceLoading(_mediaItem.markid);
					   		}
					   	},
					   	{	
					   		title : '资源上传',
					   		focusColor : '#f6f6f6',
					   		blurColor : '#dcdcdc',
					   		panelId : 'ResUploadItems2',
					   		handler : function(){
					   			var _form = $("#UCGS_Injet_Form")[0];
					   			if(_form == undefined){
						   			$("#ResUploadItems2").html('<form id="UCGS_Injet_Form" method="post" encoding="multipart/form-data" enctype="multipart/form-data"></form>\
						   				<p>选择：<input type="text" class="inputText" accept="image/png,image/gif,image/jpg,image/jpeg" readonly="readonly" id="ucgsDataFile" />\
	 					   					<input type="button" class="button blue" value="浏览" onclick="InjectImage.browserFile(\'ucgsDataFile\',\'UCGS_Inject_ImgItems\')" />\
						   					<input type="button" class="button green" value="开始上传" onclick="InjectImage.startUpload(0,\''+ _mediaItem.markid +'\')" /></p>\
						   				<p><span class="badge badge_del">位置标识：'+ _mediaItem.markid +'，尺寸限制：'+ _mediaItem.width + ' * ' + _mediaItem.height +'</span></p>\
						   				<p><div id="UCGS_Inject_ImgItemBox" class="InjectShadow"><label class="InjectTitle">上传列表</label>\
						   				<div id="UCGS_Inject_ImgItems"></div></div></p>');
					   			}
					   		}
					   	}]
				 }]
	});
	ResourceLoading(_mediaItem.markid);
}

function ResourceLoading(_position){
	var _sifter = 'number:GID@0';
	if($("#_LOGINUSERTYPE").val() == 0){
		_sifter += ',string:AuthCode@' + $("#_LOGINUSERGUID").val() + ',string:Position@' + _position;
	}
	Chasonx.Ajax({
		 url:DefConfig.UAMS.getImageList,
		 PageNumber:0,
		 PageSize:9,
		 data :{'deleted':'2','currPage':1,'pageSize':9,'orderCase':'ID+desc','sifter':_sifter},
		 dataType : 'jsonp',
		 jsonp : 'UAMS_Callback',
		 before : function(op){
			 op.PageNumber = Math.round((~~op.PageNumber + ~~op.PageSize)/~~op.PageSize);
			 op.data.currPage = op.PageNumber;
			 op.data.pageSize = op.PageSize;
			 return op;
		 },
		 success : function(d){	
			 console.debug(d);
			 Chasonx.Page.init('romatePagePanel',d.totalRow,d.pageSize,d.pageNumber,this,function(d){ ResourceDraw(d);});	
			 ResourceDraw(d);
			 Chasonx.Wait.Hide();
		 },
		 error:function(e){
			 console.debug(e);
		 	Chasonx.Hint.Faild({text:'错误：' + e});
		 	Chasonx.Wait.Hide();
		 }
	});
}

function ResourceDraw(d){
	var html = '';
	if(d.list.length > 0){
		var zoom;
		$.each(d.list,function(i,u){
			zoom = (Math.min(Math.min(200/~~u.Width,1),Math.min(160/~~u.Height,1))).toFixed(3);
				html += '<div class="item"><img title="上传时间:'+ u.CreateTime + '" width="'+ ~~u.Width * zoom +'" height="'+ ~~u.Height*zoom +'" src="'+ SyncUrl.UAMS + u.Url +'" />\
						<p style="text-align:center;">'+ u.Width + 'px * ' + u.Height +'px</p>\
						<p style="text-align:center;">'+ fileSizeForamt(u.Size) +'</p>\
						<input type="checkbox" value="'+  u.Url  +'" id="'+ u.ID +'" size="'+ u.Size +'" name="romateResItem"/></div>';
		});
	}else{
		html += '<div style="text-align:center;">暂无数据</div>';
	}
	$("#romateResItems").html(html);
}
/**
 * 视频资源选择
 * @param panelId
 * @param idx
 */
function VideoResourceSelector(panelId,idx){
	new Chasonx({
		 title : '资源列表',
		 html : '<div id="romateResItems"></div><div id="VideoPagePanel" ></div>',
		 width : 800,height:600,
		 modal : true,
		 success : function(){
			 var img = $("input[type='checkbox'][name='videoitem']:checked");
			 if(img.size() > 0){
				 var url = img.val();
				 var panelObj = $("#ResoucePanel_" + panelId).find('.ResouceBox').eq(idx);
				 panelObj.find('video').attr('src',SyncUrl.UAMS + url).attr('data',url);
				 return true;
			 }
		 }
	});
 
	 Chasonx.Ajax({
			 url:DefConfig.UAMS.getMediaList,
			 PageNumber:0,
			 PageSize:12,
			 data :{'sifter':'string:Type@4,number:State@1,string:AuthCode@' + $("#_LOGINUSERGUID").val()},
			 dataType : 'jsonp',
			 jsonp : 'UAMS_Callback',
			 before : function(op){
				 op.PageNumber = Math.round((~~op.PageNumber + ~~op.PageSize)/~~op.PageSize);
				 return op;
			 },
			 success : function(d){	
				 Chasonx.Page.init('VideoPagePanel',d.totalRow,d.pageSize,d.pageNumber,this,function(d){ VideoResouceDraw(d);});	
				 
				 VideoResouceDraw(d);
				 Chasonx.Wait.Hide();
			 },
			 error:function(e){
			 	Chasonx.Hint.Faild({text:'错误：' + e});
			 	Chasonx.Wait.Hide();
			 }
		});
}
function VideoResouceDraw(d){
	  var line = '';
	  $.each(d.list,function(i,u){
		  line += '<div class="videoDialogItems"><img src="'+ SyncUrl.UAMS + u.PosterUrl +'" onerror="this.src=\'/UCGS/res/skin/images/posterDef.png\';" /><p>'+ u.Title +'<br><font color="blue">Tag:'+ u.Tag +'</font></p><input type="checkbox" value="'+ u.VideoUrl +'" name="videoitem"/></div>';
	  });
	  $("#romateResItems").html(line);
}
/**
 * 
 */
var PublishHisDev = {
		data : null,
		handlerState : false,
		init : function(id){
			getAjaxData(DefConfig.Root + '/main/template/publishPresetData',null,function(data){
				PublishHisDev.data = data;
				PublishHisDev.draw(id);
			});
		},
		draw : function(id){
			var opt = '<option value="">--预选设备列表--</option>';
			$.each(this.data,function(i,u){
				opt += '<option value="'+ i +'">' + u.fpublishTitle + '</option>';
			});
			$("#" + id).html(opt);
			this.handler(id);
		},
		handler : function(id){
			if(this.handlerState) return;
			$("#" + id).live('change',function(){
				$("._currCheckDevicePanel").html('');
				var _data = PublishHisDev.data[this.value].fpublishDevice.split(',');
				for(var k = 0,len = _data.length;k < len;k++){
					$(".DeviceItems").find("input[type='checkbox'][name='deviceList'][value='"+ _data[k] +"']").parent().click();
				}
			});
			
			this.handlerState = true;
		}
};


window.onload = function(){
	
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel',height : '68px',bgColor:false,border:false},
			right: {id : 'rightPanel',bgColor:false,border:false}
		}
	});
	
	Chasonx.Tab({
	   	id : 'tempSatePanel',
	   	bHeight : 30,
	   	bWidth : 150,
	   	fontColor : '#4a4545',
	   	fontBlurColor : '#7b7171',
	   	itemGroup :[
	   			{ position : 'top|left',
	   			  items :[{
					   		title : '确定位置信息',
					   		focusColor : '#ccc',
					   		blurColor : '#dcdcdc',
					   		panelId : 'tempGroupItem1',
					   		handler : function(){
					   			panelCtrl(0);
					   		}
					   	},
					   	{	
					   		title : '编辑图片/视频资源',
					   		focusColor : '#ccc',
					   		blurColor : '#dcdcdc',
					   		panelId : 'tempGroupItem2',
					   		handler : function(){
					   			panelCtrl(1);
					   		}
					   	},
					   	{
					   		title : '发布历史',
					   		focusColor : '#ccc',
					   		blurColor : '#dcdcdc',
					   		panelId : 'applyHisPanel',
					   		handler : function(){
					   			panelCtrl(2);
					   		}
					   	}]
				 }]
	});
	
//	Chasonx.DragBox({
//		target : 'rightPanel',
//		lineColor : '#ADADAD',
//		items : [
//		         {id : 'dragLeft',width : '10' },
//		         {id : 'dragCenter',width : '10' },
//		         {id : 'dragRight',width : '80' }
//		        ]
//	});
	
	//Template.tempFileList("");
	
//	SitePub.list('fileListSite','');
//	SitePub.handler('fileListSite',function(siteguid){
//		Template.currSiteGuid = siteguid;
//		Template.tempFileList(siteguid);
//		
//		if(__PANEL_IDX_NUM == 2) TempPreview.mrPreview();
//	});
//	Area.list('areaList',[],function(){
//		SitePub.list('fileListSite',Area.currArea.fguid);
//	});
	
	panelCtrl(0);
	
	var __TpreviewIframObj = null;
	$("#tempItems > p").live('click',function(){
		$("#tempItems > p").removeClass('tfilesPfocus')
		$(this).addClass('tfilesPfocus');
		TempPreview.show($(this).html());
	});
	$("#romateResItems > .item").live('click',function(){
		$("input[type='checkbox'][name='romateResItem']:checked").attr('checked',false);
		var input = $(this).find('input[type="checkbox"][name="romateResItem"]');
		input.attr('checked',!input.attr('checked'));
	});
	 $(".videoDialogItems").live('click',function(){
		  $('input[type="checkbox"][name="videoitem"]:checked').attr('checked',false);
		  $(this).find('input[type="checkbox"][name="videoitem"]').attr('checked',true);
	  });
	 TempPreview.table = Chasonx.Table({
			url : DefConfig.Root + '/main/template/publishCheckDataList',
			dataPanel : 'applyHisPanel',
			data:{type : 1},
			tableNames : [
			       {name : "fpublishTitle",text:"标题",width:'8%'},
			       {name : "fpublishMode",text:"发布方式",width:"5%",handler : function(v){ 
			    	   if(v == 1) return "广播";
			    	   else return "互联网";
			    	  }},
			       {name : "fpublishType",text:"发布范围",width:"5%",handler : function(v){
			    	   var str = '';
			    	   switch(~~v){
			    	   case 0: str = "所有";break;
			    	   case 1: str = "设备";break;
			    	   case 2: str = "组";  break;
			    	   case 3: str = "节点";break;
			    	   case 4: str = "渠道";break;
			    	   }
			    	   return str;
			       }},
			       {name : "fpublishDeviceNames",text:"设备",width:"15%",handler : function(v){ 
			    	   var dev = v.split(","),ht = '<div class="tdOverHide">';
			    	   for(var i = 0;i < dev.length;i++){
			    		   ht += '<span class="badge badge_blue">'+ dev[i] +'</span>';
			    	   }
			    	   return ht + '</div>'; 
			       }},
			       {name : "ftype",text : "类型",width:"5%",handler : function(v){ 
			    	   if(~~v == 1) return "广告资源";
			    	   else if(v == 2) return "升级文件";
			       }},
			       {name : "fstatus",text:"状态",width:"5%" ,handler : function(v){ 
			    	   if(v == 0) return '<span class="badge badge_blue">未审核</span>';
			    	   else if(v == 1) return '<span class="badge badge_gray">审核不通过</span>';
			    	   else if(v == 2) return '<span class="badge badge_upd">已审核</span>';
			       }},
			       {name : "fcreateTime",text:"申请时间",width:"9%",handler : function(v){ return getString(v); }},
			       {name : "fpanPublishTime",text:"发布时间",width:"9%",handler : function(v){ return getString(v); }},
			       {name : "fmodifyTime",text:"审核时间",width:"9%",handler : function(v){ return getString(v);}},
			       {name : "fcheckname",text:"审核人",width:"10%",handler : function(v){ return getString(v); }},
			       {name : "fremark" ,text : "备注",width:"10%",handler : function(v){ return '<div class="tdOverHide">' + getString(v) + '</div>'; }}
			              ]
		}).createTable();
	 
	 
	loadTemplatePkgs();
}