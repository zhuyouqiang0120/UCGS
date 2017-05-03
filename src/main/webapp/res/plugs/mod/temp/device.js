
var Device = {
		groups : [],
		location : [],
		province : [],
		city : [],
		county : [],
		channelName : [],
		data : [],
		list : function(ck){
			if(this.data.length == 0){
				getAjaxData(DefConfig.Root + '/main/template/deviceList',{'deviceName':'GetDevice'},function(d){
					var line = '';
					Device.data = d.data;
					$("#deviceData").html(Device.drawList(true,false,ck));
					
					Device.drawSelect(Device.groups,'groups');
					Device.drawSelect(Device.location,'locations');
					Device.drawSelect(Device.province,'province');
					Device.drawSelect(Device.city,'citiys');
					Device.drawSelect(Device.county,'contrys');
					Device.drawSelect(Device.channelName,'channels');
				});
			}else{
				$("#deviceData").html(this.drawList(false,true,ck));
			}
		},
		drawList : function(add,choose,ck){
			var line = '',_group = $("#groups").val(),_loca = $("#locations").val(),_prov = $("#province").val(),_city = $("#citiys").val(),_cont = $("#contrys").val(),_chan = $("#channels").val();
			$(".LiveCount").html('总找到：'+ this.data.length +' 个设备');
			if(this.data && this.data.length > 0){
				$.each(this.data,function(i,u){
					if(choose){
						if(_group != '' && u.groupNames != _group) return true;
						if(_loca != '' && u.locationName != _loca) return true;
					    if(_prov != '' && u.province != _prov) return true;
					    if(_city != '' && u.city != _city) return true;
					    if(_cont != '' && u.county != _cont) return true;
					    if(_chan != '' && u.channelName != _chan) return true;
						line += Device.retLine(u,ck);
					}else{
						line += Device.retLine(u,ck);
					}
						
					if(add){
						Device.put(Device.groups,u.groupNames);
						Device.put(Device.location,u.locationName);
						Device.put(Device.province,u.province);
						Device.put(Device.city,u.city);
						Device.put(Device.county,u.county);
						Device.put(Device.channelName,u.channelName);
					}
				});
			}else{
				line = '<tr class="dataGridTr"><td colspan="'+ (ck?12:11) +'">暂无数据</td></tr>';
			}
			return line;
		},
		retLine : function(u,ck){
			if(typeof(u) != 'object') return '';
			return '<tr class="dataGridTr" onclick="_setTrFocus(this,\'deviceVal\',\'\')">\
				<td>'+ (u.deviceId || '无数据') +'</td>\
				<td>'+ (u.deviceName || '无数据') +'</td>\
				<td>'+ (u.ssid || '无数据') +'</td>\
				<td>'+ (u.groupNames || '无数据') +'</td>\
				<td>'+ (u.locationName || '无数据') +'</td>\
				<td>'+ (u.province || '无数据') +'</td>\
				<td>'+ (u.city || '无数据') +'</td>\
				<td>'+ (u.county || '无数据') +'</td>\
				<td>'+ (u.channelName || '无数据') +'</td>\
				<td>'+ (u.mac || '无数据') +'</td>\
				<td>30GB</td>\
				'+ (ck?'<td><input type="button" onclick="DPerm.addDeviceToUser(\''+ u.deviceId +'\',1)" value="添加" class="button blue btnsmall" style="position:static;"/></td>':'') + '\
			 <tr>';
		},
		put : function(arr,ele){
			var exist = false;
			for(var i = 0;i < arr.length;i++){
				if(arr[i] == ele){
					exist = true;
					break;
				}
			}
			if(!exist) arr.push(ele);
		},
		drawSelect : function(arr,id){
			var line = '<option value="">全部</option>';
			for(var i = 0;i < arr.length;i++){
				line += '<option value="'+ arr[i] +'">'+ arr[i] +'</option>';
			}
			$("#" + id).html(line);
		},
		syncRun : function(state){
			Chasonx.Wait.Show('正在同步中，请稍候...');
			getAjaxData(DefConfig.Root + '/main/template/syncDeviceData',null,function(d){
				Chasonx.Wait.Hide();
				if(~~d > 0){
					Chasonx.Hint.Success('已同步完成.');
					Device.data = [];
					Device.list(state);
				}else{
					Chasonx.Hint.Faild('设备同步失败！');
				}
			});
		}
};