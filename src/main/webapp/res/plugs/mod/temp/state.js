/*$(document).ready(function(){

	
	$(".boxPanelCenter > div > a").live('click',function(){
		$(".boxPanelCenter > div[class='item itemFocus']").removeClass('itemFocus');
		$(this).parent().addClass('itemFocus');
		TempState.currTempGuid = $(this).parent().attr('data');
		TempState.mediaList();
	});
});*/

var TempState = {
		currSiteGuid : null,
		currTempGuid : null,
		publishStatusName : 'ucmsPublish' + ~~(Math.random()*1000),
		templateList : function(){
			Chasonx.Wait.Show('努力加载中...');
			getAjaxData(DefConfig.Root + '/main/template/templist',{'siteGuid':this.currSiteGuid},function(d){
				var html = '';
				$.each(d,function(i,u){
					html += '<div class="item" data="'+ u.guid +'" title="标识:'+ u.guid  +'&#13;创建:'+ u.createtime +'"><a href="javascript:void(0)">'+ u.tempname + '</a>' + (u.state == 0?'<font color="#F05959">[编辑中]</font>':'<font color="#229ffd">[已编辑]</font>') + (u.publish == 1?'<span title="预览模版" class="preview" onclick="TempState.previewPage.show(\''+ u.previewpath +'\')"></span><span title="已发布" class="publish"></span>':'') +'</div>';
				});
				$(".boxPanelCenter").html(html);
				
				Chasonx.Wait.Hide();
			});
		},
		mediaList : function(){
			Chasonx.Wait.Show('努力加载中...');
			getAjaxData(DefConfig.Root + '/main/template/getAdList',{'tempguid':this.currTempGuid},function(d){
				var html = '';
				$.each(d,function(i,u){
					html += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'media\',\'_selectAll\')">\
								<td><input type="checkbox" value="'+ u.id +'" name="media" data="'+ u.fstate +'"/></td>\
								<td>'+ (i + 1) +'</td>\
								<td>'+ getString(u.fname) +'</td>\
								<td>'+ u.ftype +'</td>\
								<td>'+ (u.fstate == 1?'<font color="#23cbed">资源已设置</font>':'<font color="#ef9797">设置中</font>') +'</td>\
								<td>'+ u.fwidth + '*' + u.fheight +'</td>\
								<td>'+ u.fmarkid +'</td>\
								<td>'+ u.fmarkname +'</td>\
								<td>'+ getString(u.fmodifyer) +'</td>\
								<td>'+ getString(u.fmodifytime) +'</td>\
							 </tr>';
				});
				$("#mediaData").html(html);
				$("#pagePanel").html('<br>找到资源资源：' + d.length + '条');
				
				Chasonx.Wait.Hide();
			});
		},
		cancelTemplate : function(){
			this.chooseTemp(function(obj){
				Chasonx.Alert({alertType:'warning',html:'确定删除该条模版信息吗？',modal:true,success:function(){
					getAjaxData(DefConfig.Root + '/main/template/cancelTemplate',{'tguid':obj.attr('data')},function(){
						Chasonx.Hint.Success('模版已删除');
						TempState.templateList();
						$("#mediaData").html('<tr class="dataGridTr"><td colspan="10">暂无数据</td></tr>');
						$("#pagePanel").html('');
					});
					return true;
				}});
			});
		},
		cancelAd : function(){
			this.chooseAd(function(obj){
				var _id = [];
				obj.each(function(){
					_id.push( this.value);
				});
				Chasonx.Alert({alertType:'warning',html:'确定删除该条资源请求吗？',modal:true,success:function(){
					getAjaxData(DefConfig.Root + '/main/template/cancelAd',{'id':_id},function(){
						Chasonx.Hint.Success('资源请求已删除');
						
						TempPreview.mrPreview();
					});
					return true;
				}});
			});
		},
		tempState : function(){
			this.chooseTemp(function(obj){
				new Chasonx({
					title : '模版状态变更',
					width:300,height:200,
					html : '<div id="tempsatePanel"></div>',
					success:function(){
						getAjaxData(DefConfig.Root + '/main/template/tempStateModify',{'guid':obj.attr('data'),'state':$('#_uptempState').val()},function(d){
							Chasonx.Hint.Success('模版状态已更改');
							TempState.templateList();
						});
						return true;
					},
					modal:true
				});
				
				ChasonxDom.draw({
					id:'tempsatePanel',
					item :[{text:'&nbsp;',type:'br',info:'&nbsp;'},{text:'模版状态:',name:'_uptempState',type:'select',options: [{v:'0',t:'编辑中'},{v:'1',t:'已编辑'}]}]
				});
			});
		},
		adPreview : function(){
			this.chooseAd(function(obj){
				if(~~obj.attr('data') == 0){
					Chasonx.Hint.Faild('该资源位还未设置资源信息');
				}else{
					getAjaxData(DefConfig.Root + '/main/template/adInfo',{'id':obj.val()},function(d){
						new Chasonx({title:'资源预览',width:600,height:500,html:'<div id="adPreviewPanel"></div>',modal:true});
						var mdlist = eval(d.fextdata) || [];
						
						var mdHtml = '';
						$.each(mdlist,function(i,u){
							if(null != u){
								if(u.type == "Image"){
									mdHtml += '<img src="'+ u.fullUri +'" width="300px" height="200px" onerror="this.src=\'/UCGS/res/skin/images/error.jpg\'"/><br><Br>';
								}else if( u.type == "Video"){
									mdHtml += '<video src="'+ u.fullUri +'" width="300px" height="200px" controls="controls">您的浏览器不支持 video 标签。</video><br>';
								}
							}
						});
						
						ChasonxDom.draw({
							id:'adPreviewPanel',
							item:[
							   {text:'编辑人:',type:'br',info:d.fmodifyer},
							   {text:'编辑时间:',type:'br',info:d.fmodifytime},
							   {text:'资源类型:',type:'br',info:d.ftype},
							   {text:'尺寸:',type:'br',info:d.fwidth + '*' + d.fheight},
							   {text:'资源类型:',type:'br',info:d.ftype},
							   {text:'资源列表:',type:'br',info:mdHtml}
							 ]
						});
					});
				}
			});
		},
		previewPage : {
			 _chasonx : null,
			 modal : null,
			 bg : null,
			 show : function(url){
				url = DefConfig.Root + url || '';
				this._chasonx = new Chasonx();
				this.modal = this._chasonx.CreateModal();
				this._chasonx.Show(null, {modal:this.modal});
				
				var size = ChasonTools.getWindowSize();
				var bg = ChasonTools.createEle({type:'div',css:'position:fixed;z-index:9999;width:400px;height:810px;left:'+ (size[2] - 400)/2 +'px;top:' + (size[3] > 810?((size[3] - 810)/2):0) + 'px'});
				bg.innerHTML = '<div class="phoneBg"><div onclick="TempState.previewPage.hide()" title="关闭" class="phoneClose"></div><iframe src="'+ url +'" class="templatePagePreview"></iframe></div>';
				ChasonTools.AppendToBody(bg);
				this.bg = bg;
				this._chasonx.Show(bg,{});
			},
			hide : function(){
				this._chasonx.Hide(this.bg,{modal:this.modal});
			}
		},
		publishPrew : function(){
			var obj = $("#fileListSite").find('div[class="fileSiteFocus"]');
			if(obj.size() > 0){
				
			Chasonx.Alert({
					html : '确定发布该网站吗？',
					modal:true,
					success:function(){
						Chasonx.Wait.Show('发布演示中，请稍后...');
						getAjaxData(DefConfig.Root + '/main/template/publishSite',{'siteGuid':obj.attr('data'),'publishStatus':TempState.publishStatusName,'type':1},function(d){
							Chasonx.Hint.Success('网站已成功发布');
							Chasonx.Wait.Hide();
						});
						TempState.getPublishStatus();
						return true;
					}
				});
			}else{
				Chasonx.Hint.Faild('请先选择网站');
			}
		},
		checkDevice : null,
		stopProgress : false,
		publish : function(){
			//var obj = $("#fileListSite").find('div[class="fileSiteFocus"]');
			//if(obj.size() > 0){
				TempState.stopProgress = false;
				
				DevSelector.show("",function(data){
					data['tempSourceGuid'] = TempPreview.currTempSourceGuid;
					data['type'] = 2;
					data['publishStatus'] = TempState.publishStatusName;
					
					getAjaxData(DefConfig.Root + '/main/template/publishResource',data,function(d){
						var res = '网站已成功发布';
						try{
							switch(~~d.result){
							case -1: res = '发布资源名称为空'; break;
							case -2: res = '发布资源方式为空'; break;
							case -3: res = '发布资源文件路径为空'; break;
							case -4: res = '发布范围类型为空'; break;
							case -5: res = '发布范围值为空'; break;
							case -6: res = '发布文件不存在'; break;
							case 0: res = '发布资源失败'; break;
							case -99: res = '未知错误';break;
							}
						}catch(e){
							res = "系统发生错误";
							TempState.stopProgress = true;
						}
						Chasonx.Hint.Success(res);
					});
					TempState.getPublishStatus();
					DevSelector.checkDevice = null;
				});
				
	/*			new Chasonx({
					title : '设备选择',
					html : '<div id="devicePanel"></div>',
					width:700,height:550,
					success : function(){
						var _checkDevice = TempState.checkDevice;
						if(_checkDevice == null || !_checkDevice.data) return Chasonx.Hint.Faild('选择设备后进行下发操作');
						var data = {"pname":$("#pname").val(),"pmode":_checkDevice.model,"ptype":_checkDevice.rangeType};
						
						data['devmac'] = [];
						data['device'] = [];
						for(var i = 0,ddlen = _checkDevice.data.length;i < ddlen;i++){
							data['device'].push(_checkDevice.data[i].deviceId);
							data['devmac'].push(_checkDevice.data[i].mac.substring(_checkDevice.data[i].mac.length - 4,_checkDevice.data[i].mac.length));
						}
						
						data['siteGuid'] = obj.attr('data');
						data['type'] = 2;
						data['publishStatus'] = TempState.publishStatusName;
						
						getAjaxData(DefConfig.Root + '/main/template/publishSite',data,function(d){
							var res = '网站已成功发布';
							try{
								switch(~~d.result){
								case -1: res = '发布资源名称为空'; break;
								case -2: res = '发布资源方式为空'; break;
								case -3: res = '发布资源文件路径为空'; break;
								case -4: res = '发布范围类型为空'; break;
								case -5: res = '发布范围值为空'; break;
								case -6: res = '发布文件不存在'; break;
								case 0: res = '发布资源失败'; break;
								case -99: res = '未知错误';break;
								}
							}catch(e){
								res = "系统发生错误";
								TempState.stopProgress = true;
							}
							Chasonx.Hint.Success(res);
						});
						TempState.getPublishStatus();
						
						TempState.checkDevice = null;
						return true;
					},
					modal : true
				});
				ChasonxDom.draw({
					id : 'devicePanel',
					item : [
					      {text:'&nbsp;',type:'br',info:'&nbsp;'},
					      {text:'发布名称:',name:'pname',attr:' readonly="readonly"',type:'input',value : obj.text(),info:'<input type="button" class="button blue" value="同步设备" onclick="TempState.syncDevice()"/>'},
					      {text:'选择设备:',type:'br',info:'<div id="deviceList"></div>'},
					      {text:'已选设备:',type:'br',info:'<div class="_currCheckDevicePanel"></div>'}
					]
				});
				
				this.execLoadDevice(); */
//			}else{
//				Chasonx.Hint.Faild('请先选择网站');
//			}
		},
		execLoadDevice : function(){
			DevicePub.getList('deviceList',function(){
				TempState.checkDevice = DevicePub.getDevice();
				
				var line = '';
				if(TempState.checkDevice.type == 'device'){
					$.each(TempState.checkDevice.data,function(i,u){
						line += '<span>'+ u.name +'&nbsp;&nbsp;&nbsp;Mac：'+ u.mac +'</span>';
					});
				}else if(TempState.checkDevice.type == 'group'){
					line = '<span>'+ TempState.checkDevice.data.name +'&nbsp;&nbsp;&nbsp;Mac：'+ TempState.checkDevice.data.mac +'</span>';
				}
				$("._currCheckDevicePanel").html(line);
			});
		},
		syncDevice : function(){
			Chasonx.Wait.Show('正在同步设备，请稍候...');
			getAjaxData(DefConfig.Root + '/main/template/syncDeviceData',null,function(d){
				if(~~d > 0){
					Chasonx.Hint.Success("设备已同步");
					TempState.execLoadDevice();
				}else{
					Chasonx.Hint.Faild("设备同步失败");
				}
				Chasonx.Wait.Hide();
			});
		},
		getPublishStatus : function(){
			Chasonx.Wait.Show('<div class="publishState"><div class="font">发布中..</div><div class="state"></div></div>');
			var status = null;
			var getStatus = function(){
				
				getAjaxData(DefConfig.Root + '/main/template/publishStatus',{'publishStatus':TempState.publishStatusName},function(d){
					$(".publishState > .font").html("发布中..." + d + "%");
					$(".publishState > .state").css('width',d + '%');
					if(~~d == 100 || TempState.stopProgress == true){
						clearTimeout(status);
						setTimeout(function(){Chasonx.Wait.Hide();},300);
					}
				});
				status = setTimeout(function(){
					getStatus();
				},1000);
			};
			getStatus();
		},
/*		device : {
			deviceData : null,
			groupArray : [],
			locationArray : [],
			channelArray : [],
			deviceArray : [],
			get : function(){
				var _this = this;
				getAjaxData(DefConfig.Root + '/main/template/deviceList',{'deviceName':'GetDevice'},function(d){
					TempState.device.deviceData = d.data;
					
					$.each(d.data,function(i,u){
						if(TempState.checkInArray(_this.groupArray, u.groupNames)) _this.groupArray.push(u);
						if(TempState.checkInArray(_this.locationArray, u.locationName)) _this.locationArray.push(u);
						if(TempState.checkInArray(_this.channelArray, u.channelName)) _this.channelArray.push(u);
						if(TempState.checkInArray(_this.deviceArray, u.deviceName)) _this.deviceArray.push(u);
						
					});
				});
			},
			draw : function(type){
				type = ~~type || 0;
				var arr = [];
				switch(type){
				case 0: arr = this.deviceData;break;
				case 1: arr = this.deviceArray;break;
				case 2: arr = this.groupArray; break;
				case 3: arr = this.locationArray; break;
				case 4: arr = this.channelArray; break;
				}
				var item = '';
				$.each(arr,function(i,u){	
					item += '<div><input type="checkbox" name="device" mac="'+ u.mac +'" value="'+ u.deviceId +'"/>'+ u.deviceName + (u.channelName != ''?'-' + u.channelName:'') + (u.groupNames != ''?'-' + u.groupNames:'') + (u.locationName != ''?'-' + u.locationName:'') +'</div>';
				});
				$("#deviceList").html(item);
			}
		},
*/		
		checkInArray : function(arr,v){
			if(v == '') return false;
			
			var res = true;
			for(var i = 0,len = arr.length;i < len;i++){
				if(arr[i] == v){
					res = false;
					break;
				}
			}
			return res;
		},
		chooseTemp : function(cb){
			var obj = $(".boxPanelCenter > div[class='item itemFocus']");
			if(obj.size() > 0){
				cb(obj);
			}else{
				Chasonx.Hint.Faild('请选择一项模版信息');
			}
		},
		chooseAd : function(cb){
			var obj = $("input[type='checkbox'][name='media']:checked");
			if(obj.size() > 0){
				cb(obj);
			}else{
				Chasonx.Hint.Faild('请选择一项资源信息');
			}
		}
};

/*window.onload = function(){
	setTimeout(function(){
		TempState.device.get();
	},200);
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '60px'},
			left : {id : 'leftPanel',width : '25%'},
			right: {id : 'rightPanel'}
			}
	});
	SitePub.list('fileListSite','');
	SitePub.handler('fileListSite',function(siteguid){
		TempState.currSiteGuid = siteguid;
		TempState.templateList();
	});
	Area.list('areaList',[],function(){
		SitePub.list('fileListSite',Area.currArea.fguid);
	});
};*/
