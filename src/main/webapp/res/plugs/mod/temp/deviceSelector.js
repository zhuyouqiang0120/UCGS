
var DevSelector = {
		checkDevice : null,
		show : function(pname,fn){
			var size = ChasonTools.getWindowSize();
			new Chasonx({
				title : '设备选择',
				html : '<div id="devicePanel"></div>',
				width:size[2] * 0.5,height:size[3] * 0.8,
				success : function(){
					var _checkDevice = DevSelector.checkDevice;
					if(_checkDevice == null || !_checkDevice.data) return Chasonx.Hint.Faild('选择设备后进行下发操作');
					
					var data = {"pname":$("#pname").val(),"pmode":$("#pubModel").val(),"ptype":$("#pubRangType").val()};
					data['devmac'] = [];
					data['device'] = [];
					data['deviceNames'] = [];
					for(var i = 0,ddlen = _checkDevice.data.length;i < ddlen;i++){
						data['deviceNames'].push(_checkDevice.data[i].name);
						data['device'].push(_checkDevice.data[i].deviceId);
						data['devmac'].push(_checkDevice.data[i].mac.substring(_checkDevice.data[i].mac.length - 4,_checkDevice.data[i].mac.length));
					}
					if(typeof fn == 'function') return fn(data);
					return true;
				},
				modal : true
			});
			ChasonxDom.draw({
				id : 'devicePanel',
				item : [
				      {text:'&nbsp;',type:'br',info:'&nbsp;'},
				      {text:'发布名称:',name:'pname',attr:' ',type:'input',value : pname,info:''},
				      {text:'预选设备:',name:'presetDevList',type : 'select',options : [],info: '从已发布设备列表中快速选择'},
				      {text:'选择设备:',type:'br',info:'<div id="deviceList" style="border:1px solid #ccc;height:250px;background:#fff;position:relative;"></div>'},
				      {text:'发布方式',name : 'pubModel',type:'select',options : [{t : '广播',v : '1'},{t : '互联网',v : '2'}]},
				      {text:'发布范围',name : 'pubRangType',type : 'select',options : [{t : '所有',v : 0},
				                                                                  {t : '设备',v : 1},
				                                                                  {t : '组',v : 2},
				                                                                  {t : '节点',v : 3},
				                                                                  {t : '渠道',v : 4}]},
				      {text:'已选设备:',type:'br',info:'<div class="_currCheckDevicePanel"></div>'}
				     // {text:'预约发布时间:',name : 'publishTime',type:'time',dateFormat : 'yyyy-MM-dd HH:mm:ss',info:''},
				]
			});
			this.execLoadDevice();
		},
		execLoadDevice : function(){
			DevicePub.getList('deviceList',function(){
				DevSelector.checkDevice = DevicePub.getDevice();
				var line = '';
				if(DevSelector.checkDevice.type == 'device'){
					$.each(DevSelector.checkDevice.data,function(i,u){
						line += '<span>'+ u.name +'&nbsp;&nbsp;&nbsp;Mac：'+ u.mac +'</span>';
					});
				}else if(DevSelector.checkDevice.type == 'group'){
					line = '<span>'+ DevSelector.checkDevice.data.name +'&nbsp;&nbsp;&nbsp;Mac：'+ DevSelector.checkDevice.data.mac +'</span>';
				}
				$("._currCheckDevicePanel").html(line);
			});
		}
//		,
//		syncDevice : function(){
//			Chasonx.Wait.Show('正在同步设备，请稍候...');
//			getAjaxData(DefConfig.Root + '/main/template/syncDeviceData',null,function(d){
//				if(~~d > 0){
//					Chasonx.Hint.Success("设备已同步");
//					DevSelector.execLoadDevice();
//				}else{
//					Chasonx.Hint.Faild("设备同步失败");
//				}
//				Chasonx.Wait.Hide();
//			});
//		}
};