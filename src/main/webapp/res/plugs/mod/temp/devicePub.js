$(document).ready(function(){
	
	$("#FastSerachVal").live('keyup',function(){
		DevicePub.drawList(false,this.value);
	});
	
	var _deviceIpt;
	$(".DeviceItems > .item").live('click',function(){
		_deviceIpt = $(this).find('input[type="checkbox"]');
		if(!_deviceIpt.attr('checked')){
			$(this).addClass('deviceItemFocus');
			_deviceIpt.attr('checked',true);
		}else{
			$(this).removeClass('deviceItemFocus');
			_deviceIpt.attr('checked',false);
		}
		
		if(typeof(DevicePub.callBack) == 'function') DevicePub.callBack();
	});
	
	$(".FastSearch > label > select").live('change',function(){
		DevicePub.drawList(true);
	});
});

var DevicePub = {
		callBack : null,
		deviceData : null,
		groupList : [],
		deviceArray : [],
		groupArray : [],
		locationArray : [],
		channelArray : [],
		groups : [],
		location : [],
		province : [],
		city : [],
		county : [],
		channelName : [],
		getList : function(id,callback){
			if(typeof(callback) == 'function') this.callBack = callback;

			var line = '<div class="FastSearch" id="FastSearch">\
						<label>按组：<select id="groups" class="inputText select" ></select></label>\
						<label>地点：<select id="locations" class="inputText select" ></select></label>\
						<label>省市：<select id="province" class="inputText select" ></select></label>\
						<label>城市：<select id="citiys" class="inputText select" ></select></label>\
						<label>按县：<select id="contrys" class="inputText select" ></select></label>\
						<label>频道：<select id="channels" class="inputText select" ></select></label>\
						<label style="width:40%;">快搜：&nbsp;<input type="text" id="FastSerachVal" class="inputText select" /></label>\
						<input type="checkbox" onclick="DevicePub.checkAll(this)" title="全选/反选"></div>\
				<div class="DeviceItems"></div>';
			$("#" + id).html(line);
			getAjaxData(DefConfig.Root + '/main/template/deviceList',{'deviceName':'GetDevice'},function(d){
				DevicePub.deviceData = d.data;
				
				var UserToken = $("#_LOGINUSERGUID").val();
				getAjaxData(DefConfig.Root + '/main/template/getDevicePermission',{'adminGuid':UserToken},function(d){
					var deviceStr = d.fdeviceid || '',u;
					if(isBlankString(deviceStr)){
						var devices = deviceStr.split(","),_data = [],j,jlen;
						for(var i = 0,len = devices.length;i < len;i++){
							if(devices[i] != ""){
								for(j = 0,jlen = DevicePub.deviceData.length; j < jlen; j++){
									if(DevicePub.deviceData[j].deviceId == devices[i])
										u = DevicePub.deviceData[j];
										_data.push(u);
								}
							}
						}
						DevicePub.deviceData = _data;
					}
					DevicePub.drawList();
					
					DevicePub.drawSelect(DevicePub.groups,'groups');
					DevicePub.drawSelect(DevicePub.location,'locations');
					DevicePub.drawSelect(DevicePub.province,'province');
					DevicePub.drawSelect(DevicePub.city,'citiys');
					DevicePub.drawSelect(DevicePub.county,'contrys');
					DevicePub.drawSelect(DevicePub.channelName,'channels');
				});
			});
		},
		drawList : function(choose,title){
			var itemStr = '',
				_group = $("#groups").val(),
				_loca = $("#locations").val(),
				_prov = $("#province").val(),
				_city = $("#citiys").val(),
				_cont = $("#contrys").val(),
				_chan = $("#channels").val();
			
			$.each(DevicePub.deviceData,function(i,u){
				if(choose){
					if(_group != '' && u.groupNames != _group) return true;
					if(_loca != '' && u.locationName != _loca) return true;
				    if(_prov != '' && u.province != _prov) return true;
				    if(_city != '' && u.city != _city) return true;
				    if(_cont != '' && u.county != _cont) return true;
				    if(_chan != '' && u.channelName != _chan) return true;
				}
				if(isBlankString(title) && u.deviceName.indexOf(title) == -1) return true;
				
				itemStr += DevicePub._chooseData(u);
			});
			$(".DeviceItems").html(itemStr);
		},
		drawSelect : function(arr,id){
			var line = '<option value="">全部</option>';
			for(var i = 0;i < arr.length;i++){
				line += '<option value="'+ arr[i] +'">'+ arr[i] +'</option>';
			}
			$("#" + id).html(line);
		},
		_chooseData : function(u){
			this.put(this.groups,u.groupNames);
			this.put(this.location,u.locationName);
			this.put(this.province,u.province);
			this.put(this.city,u.city);
			this.put(this.county,u.county);
			this.put(this.channelName,u.channelName);
			
		   return this.draw(u);
		},
		draw : function(u,title,idx){
				return '<div class="item" >'+ u.deviceName +'&nbsp;<font color="#0daae2">['+ u.mac +']</font><input value="'+ u.deviceId +'" title="'+ u.deviceName +'" data="'+ u.mac +'"  type="checkbox" name="deviceList"></div>';
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
		getDevice : function(){
			var dev = $("input[type='checkbox'][name='deviceList']:checked"),result = {};
			if(dev.size() == 0) return result;
			
			//if($("#FastSelect").val() <= 1){
				var data = [];
				dev.each(function(){
					data.push({mac : $(this).attr('data'),name : $(this).attr('title') ,deviceId : $(this).val()});
				});
				result.type = 'device';
				result.data = data;
//			}else{
//				result.data = {mac : dev.attr('data'),name : dev.attr('title') ,deviceId : dev.val()};
//				result.type = 'group';
//			}
//			result.rangeType = $("#pubRangType").val();
//			result.model = $("#pubModel").val();
			return result;
		},
		checkAll : function(obj){
			$("input[type='checkbox'][name='deviceList']").attr('checked',obj.checked);
			if(obj.checked) $(".DeviceItems > .item").addClass('deviceItemFocus');
			else $(".DeviceItems > .item").removeClass('deviceItemFocus');
			
			if(typeof(DevicePub.callBack) == 'function') DevicePub.callBack();
		},
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
		}
};