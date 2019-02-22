
$(function(){
	
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '80px',border:false,bgColor : false},
			left : {id : 'leftPanel',width : '16%',border:'#000000',bgColor : false,slide : false,title : '<div style="text-align:center;">选择关联目标</div>',titleBgColor : false},
			right: {id : 'rightPanel',bgColor : false,border:'#000000'}
			}
	});
	
	ChasonTools.delayRun(function(){
		Chasonx.Frameset({
			target   : 'rightPanel',
			window : {
				left : {id : 'labelGroupPane',width : '16%',border:'#000000',bgColor : false,slide : false,title : '<div style="text-align:center;">标签组列表</div>',titleBgColor : false},
				right: {id : 'labelPane',bgColor : false,border:'#000000',title : '<div style="text-align:center;">标签列表</div>',titleBgColor : false}
				}
		});
	});
	
	
	$("#siteList").live('change',function(){
		if(this.value == "") return;
		PublicCol.list('topicColTree',{'id':this.value,'name':$("#siteList").find('option:selected').text(),'state':1},function(node){
			Label.colGuid= node.guid;
			Label.list(1);
		});
		Label.siteGuid = $("#siteList").val();
		Label.colGuid = null;
		Label.pid = 0;
		Label.list(1);
	});
	
	$(".labelGroupPane").find('p').live('click',function(){
		$(".labelGroupFocus").removeClass('labelGroupFocus');
		$(this).addClass('labelGroupFocus');
		Label.pid = $(this).attr('data');
		Label.groupIdx = $(this).attr('idx');
		Label.list(2);
	});
	
	Label.getSites();
});

var Label = {
		siteGuid : null,
		colGuid : null,
		pid : 0,
		group : null,
		level : 1,
		groupData : null,
		groupIdx : -1,
		labelData : null,
		getSites : function(){
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':100,'del':0},function(d){
				var op = '<option value="">---选择网站---</option>';
				$.each(d.list,function(i,u){
					op += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
				});
				$("#siteList").html(op);
				Chasonx.Wait.Hide();
			});
		},
		list : function(T){
			with(this){
				getAjaxData(DefConfig.Root + '/main/label/list',{siteGuid : siteGuid ,columnGuid : colGuid,pid : (T == 1?0:pid)},function(d){
					var ht = [];
					if(T == 1) groupData = d;
					else labelData = d;
					
					$.each(d,function(i,u){
						if(T == 1) ht.push('<p data="' + u.fguid + '" idx="'+ i +'">#'+ u.flabelName +'</p>');
						else ht.push('<tr class="dataGridTr" onclick="_setTrFocus(this,\'labelval\',\'_selectAll\')">\
							    <td><input type="checkbox" name="labelval" value="'+ u.fguid +'" idx="' + i + '"/></td>\
							    <td>'+ (i + 1) +'</td>\
							    <td>'+ u.flabelName +'</td>\
							    <td>'+ u.siteName +'</td>\
							    <td>'+ (u.colName == null?'':u.colName)  +'</td>\
							    <td>'+ (u.fstate == 1?'启用':'停用')  +'</td>\
							   </tr>');
					});
					
					$("#" + (T == 1?'labelGroupPane':'labelListData') ).html(ht.join(''));
				});
			}
		},
		del : function(T){
			with(this){
				var id = [];
				if(T == 1){
					if(groupIdx == -1) return Chasonx.Hint.Faild('请选择一项');
					id.push(groupData[groupIdx].id);
				}else{
					var ck = $("input[type='checkbox'][name='labelval']:checked");
					if(ck.size() == 0) return Chasonx.Hint.Faild('请选择一项');
					
					$.each(ck,function(i,u){
						id.push(labelData[u.getAttribute('idx')].id);
					});
				}
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除选中项吗?',
					modal : true,
					success : function(){
						getAjaxData(DefConfig.Root + '/main/label/delete',{type :T,ids : id},function(d){
							console.log(d);
						});
						return true;
					}
				});
				
			}
		},
		modify : function(T,UT){
			with(this){
				if(siteGuid == null) return Chasonx.Hint.Faild('请选择关联目标');
				if(T == 2 && pid == 0) return Chasonx.Hint.Faild('请选择标签组');
				var D = {};
				D.fparentId = pid;
				if(UT == 1){
					if(groupIdx == -1) return Chasonx.Hint.Faild('请选择一项');
					D = groupData[groupIdx];
				}else if(UT == 2){
					var ck = $("input[type='checkbox'][name='labelval']:checked");
					if(ck.size() == 0) return Chasonx.Hint.Faild('请选择一项');
					D = labelData[ck.attr('idx')];
				}
				var pane = new Chasonx({
					 title : '编辑',
					 modal : true,
					 html : '<div id="labelEditPane" class="global_bg_c" style="height:100%;"></div>',
					 width : 500,height : 380,
					 success : function(){
						 if(FormData.requiredByAttr('labelEditPane',['input'])){
							 var formData = FormData.getFormData('labelEditPane',['input','select']);
							 formData.fsiteGuid = siteGuid;
							 if(!StrKit.isBlank(colGuid)) formData.fcolumnGuid = colGuid;
							 if(UT) formData['id'] = D.id;
							 formData.fparentId = D.fparentId;
							 getAjaxData(DefConfig.Root + '/main/label/modify',formData,function(d){
								 if(d > 0){
									 Chasonx.Hint.Success('操作成功');
									 Label.list(T);
									 $("#flabelName").val('');
									 pane.Hide();
								 }
							 });
						 }
					 }
				});
				 ChasonxDom.draw({
					  id : 'labelEditPane',
					  item : [
					      {text:'&nbsp;',type:'br',info:'&nbsp;'},
					      {text:'标签名:',name:'flabelName',attr:'maxlength="40" req = "true"',type:'input',value : (D.flabelName || '')},
					      {text:'状态:',name:'fstate',type:'select',value : (D.fstate + '' || ''),options:[{v:'1',t:'启用'},{v:'0',t:'停用'}]},
					      {text:'所属组:',name:'fparentId',attr:'maxlength="40" readonly="readonly" ',type:'input',value : D.fparentId},
					      {text:'站点标识:',name:'fsiteGuid',attr:'maxlength="40" readonly="readonly" ',type:'input',value : (D.fsiteGuid || siteGuid)},
					      {text:'栏目标识:',name:'fcolumnGuid',attr:'maxlength="40" readonly="readonly" ',type:'input',value : (D.fcolumnGuid || (colGuid || '') )},
					      ]
				 });
			}
		}
};