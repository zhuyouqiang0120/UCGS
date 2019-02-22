$(function(){
	$("#addCacheServer").live('click',function(){
		Cache.add();
	});
	$("#updateCacheServer").live('click',function(){
		Cache.modify();
	});
	$("#changeState").live('click',function(){
		Cache.getCheckData(function(d){
			var data = {id : d.id},route = '/main/config/modifyCacheServer';
			if(d.cache_state == DefConfig.CacheServer.freeze){
				Chasonx.Alert({
					html : '确定解除该设备的冻结状态码？',
					modal : true,
					success : function(){
						data.cache_state = DefConfig.CacheServer.unfreeze;
						Cache.exec(route,data,function(d){
							if(d.result > 0){
								Cache.list();
								Chasonx.Hint.Success('已解除冻结');
							}else{
								Chasonx.Hint.Faild('操作失败');
							}
						});
						return true;
					}
				});
			}else if(d.cache_state == DefConfig.CacheServer.unfreeze){
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定冻结该设备吗？冻结后将不会映射资源地址到该服务器上',
					modal : true,
					success : function(){
						data.cache_state = DefConfig.CacheServer.freeze;
						Cache.exec(route,data,function(d){
							if(d.result > 0){
								Cache.list();
								Chasonx.Hint.Success('已设置为冻结状态');
							}else{
								Chasonx.Hint.Faild('操作失败');
							}
						});
						return true;
					}
				});
			}
		});
	});
	$("#removeCache").live('click',function(){
		Cache.removeById();
	});
	
	var Cache = {
		  cacheData : null,
		  add : function(_data){
			  with(this){
				  _data = _data || {};
				  var pane = new Chasonx({
					  title : 'CacheServer 编辑',
					  html : '<div id="cacheServerPane" class="global_bg_c"></div>',
					  modal : true,
					  width : 600,height : 500,
					  success : function(){
						  if(FormData.requiredByAttr('cacheServerPane',['input'])){
							  var data = FormData.getFormData('cacheServerPane',['input','select']);
							  if(_data.id){
								  data.id = _data.id;
								  data.guid = _data.guid;
							  }
							  exec('/main/config/modifyCacheServer',data,function(d){
								  if(d.result > 0){
									  list();
									  Chasonx.Hint.Success('保存成功');
									  FormData.clearInput('cacheServerPane',['input','select']);
									  
									  if( data.id){
										  pane.Hide();
									  } 
								  }else{
									  Chasonx.Hint.Faild('保存失败');
								  }
							  });
						  }
					  }
				  });
				  ChasonxDom.draw({
					  id : 'cacheServerPane',
					  item : [
					      {text : '',type:'br' , info : '&nbsp;'},
					      {text:'服务器名称:',name:'server_name',type:'input',attr : ' req = "true" maxlength="50" ',value : (_data.server_name || '')},
					      {text:'服务器IP:',name:'server_ip',type:'input',attr : ' req="true" maxlength="50" ',value : (_data.server_ip || '')},
					      {text:'资源访问路径：',name:'server_host',type:'input',attr : ' req="true" maxlength="50" ',value : (_data.server_host || '')},
					      {text:'FTP用户名：', name : 'server_ftp_name', type : 'input' , attr : ' req="true" maxlength="30" ',value : (_data.server_ftp_name || '')},
					      {text:'FTP密码：',name : 'server_ftp_pwd',type : 'input' ,attr : ' req="true" maxlength="30" ',value : (_data.server_ftp_pwd || '')},
					      {text:'FTP端口：',name : 'server_ftp_port',type : 'input',attr : ' req="true" maxlength="8" ',value : (_data.server_ftp_port || '')},
					      {text:'FTP缓存目录：',name : 'cache_path',type : 'input',attr : ' req="true" maxlength="100" ',value : (_data.cache_path || '')},
					      {text:'服务器状态：',name : 'cache_state',type : 'select',value :(_data.cache_state || DefConfig.CacheServer.unfreeze) ,options : [{t : '正常',v : DefConfig.CacheServer.unfreeze},{t : '冻结',v : DefConfig.CacheServer.freeze}]},
					      {text:'',info : '<i class="icon_tip"></i>本功能支持不同站点资源缓存到不同设备上，<br>主要通过FTP服务传输数据，请确保FTP填写正确，IP为localhost系统将作为默认缓存服务器'}
					      ]
				  });
			  }
		  },
		  modify : function(){
			  with(this){
				  getCheckData(function(d){
					  console.log(d);
					  add(d);
				  });
			  }
		  },
		  removeById : function(){
			  with(this){
				getCheckData(function(d){
					Chasonx.Alert({
						alertType : 'error',
						title : '警告',
						html : '确定删除该设备吗？删除后不可恢复',
						modal : true,
						success : function(){
							exec('/main/config/delCacheServer',{id : d.id},function(d){
								if(d.result > 0){
									list();
									Chasonx.Hint.Success('信息已删除');
								}else{
									Chasonx.Hint.Faild('删除失败');
								}
							});
							return true;
						}
					});
				});  
			  }
		  },
		  getCheckData : function(fn){
			 var ck = $('input[type="checkbox"][name="cacheServerVal"]:checked');
			 if(ck.size() > 0){
				 fn(this.cacheData[ck.val()]);
			 }else{
				 return Chasonx.Hint.Faild('选中一项后进行操作');
			 }
		  },
		  list : function(){
			  with(this){
				  Chasonx.Wait.Show();
				  this.exec('/main/config/listCacheServer',null,function(d){
					  cacheData = d.data;
					  var line = [];
					  $.each(d.data,function(i,u){
						  line.push('<tr class="dataGridTr" onclick="_setTrFocus(this,\'cacheServerVal\',\'\')">\
								<td><input type="checkbox" name="cacheServerVal" value="'+ i +'" /></td>\
								  <td>'+ u.guid +'</td>\
								  <td>'+ u.server_name +'</td>\
								  <td>'+ u.server_ip +'</td>\
								  <td>'+ u.server_host +'</td>\
								  <td>'+ u.server_ftp_name +'</td>\
								  <td>'+ u.server_ftp_pwd +'</td>\
								  <td>'+ u.server_ftp_port +'</td>\
								  <td>'+ u.cache_path +'</td>\
								  <td>'+ DefConfig.CacheServer.getState(u.cache_state) +'</td>\
								  </tr>');
					  });
					  $("#cacheServerData").html(line.join(''));
					  Chasonx.Wait.Hide();
				  });
			  }
		  },
		  exec : function(url,data,fn){
			  Chasonx.Wait.Show();
			  getAjaxData(DefConfig.Root + url,data,function(d){
				  fn(d);
				  Chasonx.Wait.Hide();
			  });
		  }
	};
	
	Cache.list();
});