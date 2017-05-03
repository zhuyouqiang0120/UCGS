window.onload = function(){
	Chasonx.Frameset({
	  main : 'PermMain',
      window : {
         // top : { id : 'Perm_Top', height : '65px'},
          left: { id:'Perm_Left' , width : '20%',slide : false,title : '系统用户列表',bgColor:false},
          right:{ id:'Perm_Right',title : '设备列表',bgColor:false}
      }
    });
	
	$("#ChooseList > select").live('change',function(){
		Device.list(true);
	});
	
	DPerm.loadUser();
	Device.list(true);
	
	$("#Perm_Left > div").live('click',function(){
		$("div[class='UserFocus']").removeClass('UserFocus');
		$(this).addClass('UserFocus');
		DPerm.currUserGuid = $(this).attr('data');
		DPerm.loadHasDeviceStr(DPerm.currUserGuid);
	});
};

var DPerm = {
		currUserGuid : null,
		currDevice : {},
		loadUser : function(){
			getAjaxData(DefConfig.Root + '/main/admin/adminuserlist',{PageSize:100,PageNumber:1},function(d){
				var line = '';
				$.each(d.list,function(i,u){
					line += '<div data="'+ u.fguid +'"><i class="roleIcon"></i>'+ u.fadminname + '['+ (u.rolename || '') +']' +'</div>';
				});
				$("#Perm_Left").html(line);
			});
		},
		addDeviceToUser : function(deviceId,T){
			if(!deviceId) return Chasonx.Hint.Faild('添加失败');
			if(DPerm.currUserGuid == null) return Chasonx.Hint.Faild('请选择用户');
			if(this.currDevice.fdeviceid && this.currDevice.fdeviceid.indexOf(deviceId) != -1 && T == 1) return Chasonx.Hint.Faild('已经添加过该设备了');
			
			
			var data = {type : T,deviceIdStr : (this.currDevice.fdeviceid?this.currDevice.fdeviceid + deviceId + ',':deviceId + ','),adminGuid:DPerm.currUserGuid};
			if(this.currDevice.id){
				data.type = 2;
				data.id = this.currDevice.id;
			}
			if(T == 3){
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定从可操作设备列表中删除该项吗?',
					modal : true,
					success : function(){
						DPerm.currDevice.fdeviceid = DPerm.currDevice.fdeviceid.replace(deviceId + ',','');
						data.deviceIdStr = DPerm.currDevice.fdeviceid;
						DPerm.modifyPerimiss(data);
						return true;
					}
				});
				
			}else{
				this.modifyPerimiss(data);
			}
		},
		loadHasDeviceStr : function(guid){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/template/getDevicePermission',{'adminGuid':guid},function(d){
				DPerm.currDevice = d;
				Chasonx.Wait.Hide();
				DPerm.chooseDevice(d.fdeviceid || '');
			});
		},
		modifyPerimiss : function(data){
			getAjaxData(DefConfig.Root + '/main/template/setDevicePermission',data,function(d){
				if(~~d > 0){
					Chasonx.Hint.Success('已设置');
					DPerm.loadHasDeviceStr(DPerm.currUserGuid);
				}else{
					Chasonx.Hint.Faild('设置失败');
				}
			});
		},
		chooseDevice : function(deviceStr){
			var devices = deviceStr.split(","),_data = [],j,jlen;
			for(var i = 0,len = devices.length;i < len;i++){
				if(devices[i] != ""){
					for(j = 0,jlen = Device.data.length; j < jlen; j++){
						if(Device.data[j].deviceId == devices[i])
							_data.push(Device.data[j]);
					}
				}
			}
			var line = '',u;
			for(var i = 0,len = _data.length;i < len;i++){
				u = _data[i];
				line += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'deviceVal\',\'\')">\
				<td>'+ u.deviceId +'</td>\
				<td>'+ u.deviceName +'</td>\
				<td>'+ u.ssid +'</td>\
				<td>'+ u.groupNames +'</td>\
				<td>'+ u.locationName +'</td>\
				<td>'+ u.province +'</td>\
				<td>'+ u.city +'</td>\
				<td>'+ u.county +'</td>\
				<td>'+ u.channelName +'</td>\
				<td>'+ u.mac +'</td>\
				<td>30GB</td>\
				<td><input type="button" onclick="DPerm.addDeviceToUser(\''+ u.deviceId +'\',3)" value="删除" class="button red btnsmall" style="position:static;"/></td>\
			 <tr>';
			}
			$("#hasDeviceData").html(line);
		}
};