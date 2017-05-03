
window.onload = function(){
	var PageShowType = $("#PageShowType").val();
	Chasonx.Frameset({
		main   : 'CheckMain',
		window : {
			top  : {id : 'CheckTop' ,height :(PageShowType == 1? '73px':'0px'),border:false,bgColor:false},
			right : {id : 'CheckCenter',width : '100%',border:false,bgColor:false},
			}
	});
	
	if(PageShowType == 1)	CheckInit();
	else PublishHistoryFileInit();
};

function PublishHistoryFileInit(){
	Chasonx.Table({
		url : DefConfig.Root + '/main/template/publishHistoryFileList',
		dataPanel : 'CheckCenter',
		check : {name : 'publishHistoryVal',value:'id'},
		tableNames : [
		       {name : "fadminname",text:"发布人",width:'15%'},
		       {name : "fpublishTime",text:"发布时间",width:"15%"},
		       {name : "fpublishFileLength",text:"文件大小",width:"10%",handler : function(v){
		    	   return fileSizeForamt(v);
		       }},
		       {name : "fpublishFilePath",text:"路径",width:"25%",handler : function(v){ 
		    	   v = v.replace(/[\\]/ig,'/');
		    	   v = v.substring(v.indexOf(DefConfig.Root),v.length);
		    	   var path = v;
		    	   if(isBlankString(v) && v.length > 30){
		    		   v = v.substring(0,10) + '......' + v.substring(v.length - 10,v.length);
		    	   }
		    	   return v + '<span class="icon_zip" style="position: relative; top: 7px;cursor:pointer;" title="点击下载文件包" onclick="OpenDownload(\''+ path +'\')"></span>'; 
		       }},
		       {name : "ftarget",text : "目标设备",width:"30%",handler : function(v){ 
		    	   var btn = '<input type="button" class="button green btnsmall" value="查看设备ID" onclick="ShowDeviceid(this)" data="'+ v +'"/>';
		    	   if(isBlankString(v) && v.length > 20){
		    		   v = v.substring(0,20) + '......';
		    	   }
		    	   return v + btn;
		       }}
		              ]
	}).createTable().getData();
}

function OpenDownload(path){
	window.open(path,'_blank');
}

function ShowDeviceid(obj){
	var deviceid = obj.getAttribute('data').split(',');
	var html = '<br>';
	for(var i = 0,len = deviceid.length;i < len;i++){
		html += '<span class="badge badge_blue">'+ deviceid[i] +'</span>';
	}
	new Chasonx({
		title : '设备ID记录',
		html : html,
		width : 450,height : 450,
		modal : true
	});
}

function CheckInit(){
	PCheckKit.table = Chasonx.Table({
		url : DefConfig.Root + '/main/template/publishCheckDataList',
		dataPanel : 'CheckCenter',
		check : {name : 'publishCheckVal',value:'id',attr:{'filetype':'ftype'}},
		tableNames : [
		       {name : "fpublishTitle",text:"标题",width:'10%'},
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
		    	   else if(~~v == 2) return "升级文件";
		       }},
		       {name : "fstatus",text:"状态",width:"6%" ,handler : function(v){ 
		    	   if(v == 0) return '<span class="badge badge_blue">未审核</span>';
		    	   else if(v == 1) return '<span class="badge badge_gray">审核不通过</span>';
		    	   else if(v == 2) return '<span class="badge badge_upd">已审核</span>';
		       }},
		       {name : "fcreateTime",text:"申请时间",width:"6%",handler : function(v){ return getString(v); }},
		       {name : "fpanPublishTime",text:"发布时间",width:"6%",handler : function(v){ return getString(v); }},
		       {name : "fmodifyTime",text:"审核时间",width:"6%",handler : function(v){ return getString(v);}},
		       {name : "fadminname",text:"申请人",width:"6%"},
		       {name : "fcheckname",text:"审核人",width:"10%",handler : function(v){ return getString(v); }},
		       {name : "fremark" ,text : "备注",width:"15%",handler : function(v){ return  '<div class="tdOverHide">' + getString(v) + '</div>'; }}
		              ]
	}).createTable();
	
	PCheckKit.list();
	
	$("#CheckStatus").live('change',function(){
		PCheckKit.list();
	});
}

var PCheckKit = {
		table : null,
		data  : null,
		stopProgress : false,
		publishStatusName : 'ucmsPublish' + ~~(Math.random()*1000),
		list : function(){
			this.table.data.status = $("#CheckStatus").val();
			this.table.getData(function(data){
				PCheckKit.data = data;
			});
		},
		publish : function(){
			this.choose(function(d){
				Chasonx.Alert({
					modal : true,
					html : '确定下发资源吗？',
					success : function(){
						if(d.attr('filetype') == 1)
							PCheckKit.posterPublish(d);
						else
							PCheckKit.upgradePublish(d);
						return true;
					}
				});
			});
		},
		posterPublish : function(d){
			var _data = PCheckKit.data.list[d.attr('idx')];
			PCheckKit.stopProgress = false;
			var data = {};
				data['tempSourceGuid'] = _data.ftemplateGuid;
				data['type'] = 2;
				data['publishStatus'] = PCheckKit.publishStatusName;
				data['pname'] = _data.fpublishTitle;
				data['pmode'] = _data.fpublishMode;
				data['ptype'] = _data.fpublishType;
				data['device'] = _data.fpublishDevice.split(",");
				data['devmac'] = _data.fpublishDeviceMac.split(",");
				data['statuGuid'] = _data.fextData;
				
				getAjaxData(DefConfig.Root + '/main/template/publishResource',data,function(d){
					var res = '资源已成功发布';
					try{
						switch(~~d.result){
						case 1 :
							PCheckKit.changeStatus({id:_data.id,fstatus : 2,type : 2});
							break;
						case -1: res = '发布资源名称为空'; break;
						case -2: res = '发布资源方式为空'; break;
						case -3: res = '发布资源文件路径为空'; break;
						case -4: res = '发布范围类型为空'; break;
						case -5: res = '发布范围值为空'; break;
						case -6: res = '发布文件不存在'; break;
						case 0: res = '发布接口连接超时，发布资源失败'; break;
						case -99: res = '未知错误';break;
						}
					}catch(e){
						res = "系统发生错误";
						PCheckKit.stopProgress = true;
					}
					Chasonx.Hint.Success(res);
				});
				PCheckKit.getPublishStatus();
		},
		upgradePublish : function(d){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/template/upgradeFile',{id:d.val()},function(d){
				var res = '资源已成功发布';
				try{
					switch(~~d.result){
					case 1 :
						PCheckKit.changeStatus({id:d.val(),fstatus : 2,type : 2});
						break;
					case -1: res = '发布资源名称为空'; break;
					case -2: res = '发布资源方式为空'; break;
					case -3: res = '发布资源文件路径为空'; break;
					case -4: res = '发布范围类型为空'; break;
					case -5: res = '发布范围值为空'; break;
					case -6: res = '发布文件不存在'; break;
					case 0: res = '发布接口连接超时，发布资源失败'; break;
					case -99: res = '未知错误';break;
					}
				}catch(e){
					res = "系统发生错误";
				}
				Chasonx.Hint.Success(res);
				Chasonx.Wait.Hide();
			});
		},
		unCheck : function(){
			this.choose(function(d){
				Chasonx.Alert({
					alertType : 'warning',
					html : '<div style="position:absolute;top:20%;">确认不通过该请求吗？<br><br>输入备注信息:<br><textarea class="inputText textarea" cols="28" rows="4" id="unCheckRemark"></textarea></div>',
					width : 350,height : 250,
					modal : true,
					success : function(){
						PCheckKit.changeStatus({id:d.val(),fstatus : 1,type : 2,fremark:$("#unCheckRemark").val()});
						return true;
					}
				});
			});
		},
		changeStatus : function(data){
			getAjaxData(DefConfig.Root + '/main/template/modifyPublishToDo',data,function(d){
				PCheckKit.list();
			});
		},
		previewRes : function(){
			this.choose(function(d){
				var _data = PCheckKit.data.list[d.attr('idx')];
				var size =  ChasonTools.getWindowSize();
				new Chasonx({
					title : '查看资源',
					html : '<div id="PreviewResPanel"></div>',
					width : size[2]*0.6,height:size[3]*0.7,
					modal : true
				});
				
				if(d.attr('filetype') == 1){
					getAjaxData(DefConfig.Root + "/main/template/mediaRequestInfoList",{"siteGuid":_data.ftemplateGuid,"statuGuid":_data.fextData},function(d){
						var line = '',media,timer;
						$.each(d,function(i,u){
							line += '<div ><p class="title">目标页面：'+ u.tempname +'</p>';
							$.each(u.items,function(j,k){
								timer = JSON.parse(k.markname != ""?k.markname:null ) || {};
								
								line += '<div style="border-bottom: 1px #ccc dotted;"><div class="left">\
												<p>位置：'+ k.mname +'</p>\
												<p>类型：'+ k.type +'</p>\
												<p>开始时间：'+ (timer.startDate || '') + ' ' + (timer.startTime || '') +'</p>\
												<p>结束时间：'+ (timer.endDate || '') + ' ' + (timer.endTime || '') +'</p>\
										 </div>\
										 <div class="right">';
								media = JSON.parse( k.medialist || null) || [];
								if(k.type == "Image"){
									for(var n = 0;n < media.length;n++){
										media[n].fullUri = media[n].fullUri? media[n].fullUri.replace(SyncUrl.UAMS_IP,SyncUrl.UAMS):'';
										line += '<p><img src="'+ media[n].fullUri +'" /><br>链接：'+ media[n].url +'<span>'+ (n  + 1) +'</span>'+ (media[n].title?'<br>标题：' + media[n].title : '') +'</p>';
									}
								}else{
									for(var n = 0;n < media.length;n++){
										media[n].fullUri = media[n].fullUri? media[n].fullUri.replace(SyncUrl.UAMS_IP,SyncUrl.UAMS):'';
										line += '<p><video controls="controls" src="'+ (media[n].fullUri || '') +'">您的浏览器不支持video标签。</video><span>'+ (n  + 1) +'</span></p>';
									}
								}
								line += '</div><div style="clear:both;"></div></div>';
							});
							
							line +=	 '</div>';
						});
						$("#PreviewResPanel").html(line);
					});
				}else{
					var line = '<div class="upgradeItem" onclick="PCheckKit.dlUpgradeFile(\''+ _data.fextData +'\')"><span class="icon_zip" style="position: relative; top: 7px"></span>'+ _data.fpublishTitle +'</div>';
					$("#PreviewResPanel").html(line);
				}
			});
		},
		dlUpgradeFile : function(path){
			window.open(DefConfig.Root + path);
		},
		choose : function(fn){
			var ck = $("input[type='checkbox'][name='publishCheckVal']:checked");
			if(ck.size() > 0){
				fn(ck);
			}else{
				Chasonx.Hint.Faild("请选中一项再操作");
			}
		},
		getPublishStatus : function(){
			Chasonx.Wait.Show('<div class="publishState"><div class="font">发布中..</div><div class="state"></div></div>');
			var status = null;
			var getStatus = function(){
				
				getAjaxData(DefConfig.Root + '/main/template/publishStatus',{'publishStatus':PCheckKit.publishStatusName},function(d){
					$(".publishState > .font").html("发布中..." + d + "%");
					$(".publishState > .state").css('width',d + '%');
					if(~~d == 100 || PCheckKit.stopProgress == true){
						clearTimeout(status);
						setTimeout(function(){Chasonx.Wait.Hide();},300);
					}
				});
				status = setTimeout(function(){
					getStatus();
				},1000);
			};
			getStatus();
		}
};