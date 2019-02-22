
var SysConfig = {
		data : null,
		list : function(){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/config/list',null,function(d){
				Chasonx.Wait.Hide();
				SysConfig.data = d;
				SysConfig.draw(d);
			});
		},
		draw : function(d){
			var html = '';
			if(d.length > 0){
				$.each(d,function(i,u){
					html +=  '<tr class="dataGridTr" onclick="_setTrFocus(this,\'configVal\',\'\')">\
						<td><input type="checkbox" name="configVal" value="'+ i +'" /></td>\
						  <td>'+ u.filename +'</td>\
						  <td>'+ u.filetype +'</td>\
						  <td>'+ getString(u.localdir) +'</td>\
						  <td>'+ getString(u.remotedir) +'</td>\
						  <td>'+ getString(u.remotehost) +'</td>\
						  <td>'+ getString(u.remoteuser) +'</td></tr>';
				});
			}else{
				html = '<tr class="dataGridTr"><td colspan="6">暂无信息</td></tr>';
			}
			$("#configData").html(html);
		},
		modify : function(type){
			this.choose(function(_i){
				var winSize = ChasonTools.getWindowSize();
				var _w = winSize[2]*0.4,_h = winSize[3]*0.3;
				var D = SysConfig.data[_i.val()];
				new Chasonx({
					title : '配置编辑',
					html : '<div id="configPanel" class="global_bg_c" style="height:100%;"></div>',
					width:_w > 500?_w:500,height:_h > 400?_h:400,
					success : function(){
						var formdata = FormData.getFormData('configPanel',['input']);
						formdata['id'] = D.id;
						getAjaxData(DefConfig.Root + '/main/config/modify',formdata,function(d){
							if(d > 0){
								Chasonx.Hint.Success('配置已更新');
								SysConfig.list();
							}else{
								Chasonx.Hint.Faild('配置更新失败');
							}
						});
						return true;
					},
					modal:true
				});
				switch(type){
				case 1:
					ChasonxDom.draw({
						  id : 'configPanel',
						  item : [
						      {text:'&nbsp;',type:'br',info:'&nbsp;'},
						      {text:'名称:',name:'filename',attr : ' maxlength="50" ',type:'input',value : (D.filename || '')},
						      {text:'标示:',name:'filetype',attr:' readonly="readonly" ',type:'input',value : (D.filetype || '')},
						      {text:'配置1:',name:'localdir',attr : ' maxlength="100" ',type:'input',value : (D.localdir || '')},
						      {text:'配置2:',name:'remotedir',attr : ' maxlength="100" ',attr : ' maxlength="100" ',type:'input',value : (D.remotedir || '')},
						      {text:'配置三:',name:'remotehost',attr : ' maxlength="50" ',type:'input',value : (D.remotehost || '')},
						      {text:'&nbsp;',type:'br'}
						  ]
					  });
					break;
				case 2:
					ChasonxDom.draw({
						  id : 'configPanel',
						  item : [
						      {text:'&nbsp;',type:'br',info:'&nbsp;'},
						      {text:'用户名:',name:'remoteuser',attr : ' maxlength="15" ',type:'input',value : (D.remoteuser || '')},
						      {text:'密码:',name:'remotepwd',attr : ' maxlength="15" ',type:'input',atype : 'password'},
						      {text:'密码确认:',name:'remotepwd2',attr : ' maxlength="15" ',type:'input',atype : 'password',handler : {
						    	  type : 'blur',
						    	  event : function(){
						    		  FormData.checkPwd('remotepwd',this);
						    	  }
						      }},
						      {text:'&nbsp;',type:'br'}
						  ]
					  });
					break;
				}
			});
		},
		choose : function(cb){
			var _i = $("input[type='checkbox'][name='configVal']:checked");
			if(_i.size() > 0)
				cb(_i);
			else return Chasonx.Hint.Faild('请先选中一条数据再操作');
		}
};

addLoadHandler(SysConfig.list);
