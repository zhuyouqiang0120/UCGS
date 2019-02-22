$(function(){
	
var WFlist = {
	   newWF : function(){
		   window.open(DefConfig.Root + '/main/workflow/edit','_blank');
	   }
};
var CONS_TYPE = {
		options : [ {t : '文章审核' ,v : '100'} , {t : '资源审核',v : '101'} ],
		getText : function(v){
			with(this){
				var _t = '';
				for(var i = 0; i < options.length;i ++){
					if(options[i].v == v){
						_t = options[i].t;
						break;
					}
				}
				return _t;
			}
		}
};

var WorkFlow = {
		getList : function(){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/workflow/list',{pageSize : 50,pageNumber : 1},function(d){
				if(d.result > 0){
					var line = [];
					
					if(d.data.length != 0){
						$.each(d.data,function(i,u){
							line.push('<tr class="dataGridTr" onclick="_setTrFocus(this,\'workflowVal\',\'_selectAll\')">\
									    <td><input type="checkbox" name="workflowVal" value="'+ u.guid +'" /></td>\
									    <td>'+ (i +1) +'</td>\
									    <td>'+ u.businessType +'</td>\
									    <td>'+ u.name +'</td>\
									    <td>'+ CONS_TYPE.getText(u.businessType) +'</td>\
									    <td>'+ u.modifyTime +'</td>\
									    <td>'+ u.remark +'</td></tr>');
						});
					}else{
						line.push('<tr class="dataGridTr"><td colspan="7">暂无数据</td></tr>');
					}
					$("#workflowListData").html(line.join(''));
				}
				Chasonx.Wait.Hide();
			});
		},
		create : function(){
			with(this){
				var wf = new Chasonx({
					title : '创建工作流类型',
					modal : true,
					width : 500,height : 400,
					html : '<div id="wfInfoPane" class="global_bg_c" style="width : 100%;height : 100%;"></div>',
					success : function(){
						if(FormData.requiredByAttr('wfInfoPane',['input'])){
							var data = FormData.getFormData('wfInfoPane',['input','select','textarea']);
							getAjaxData(DefConfig.Root + '/main/workflow/create',data,
							  function(d){
								if(d.result > 0){
									Chasonx.Hint.Success('信息已保存');
									getList();
									wf.Hide();
								}else{
									Chasonx.Hint.Faild('保存失败');
								}
							});
						}
					}
				});
				
				ChasonxDom.draw({
					  id : 'wfInfoPane',
					  item : [
					      {text : '&nbsp;',info : '<br><br>'},
					      {text:'名称：',name:'workfName',type:'input',attr : ' req = "true" ',value : ''},
					      {text : '工作流类型：',name : 'workfType',type : 'select',options : CONS_TYPE.options },
					      {text : '站点选择：',name : 'workSite' ,type : 'select' ,options : []},
					      {text : '描述：' ,name : 'workfDesc', type : 'textarea' },
					      {text : '&nbsp;',info : '<i class="icon_tip"></i>本系统支持对不同站点创建工作流'}
					      ]
				});
				
				siteList('workSite');
			}
		},
		siteList : function(id){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':249,'del':0},function(d){
				Chasonx.Wait.Hide();
				var line = [];
				line.push('<option value="">--站点列表--</option>');
				$.each(d.list,function(i,u){
					line.push('<option value="'+ u.fguid +'">'+ u.fsitename +'</option>');
				});
				$("#" + id).html(line.join(''));
	   		});
		}
};


	WorkFlow.getList();
	
	$("#createWorkflow").live('click',function(){
		WorkFlow.create();
	});
	
	$("#editWorkflow").live('click',function(){
		var ck = $("input[type='checkbox'][name='workflowVal']:checked");
		if(ck.size() == 0) return Chasonx.Hint.Faild('请选择一项后开始设计流程');
		
		window.open($("#_WORKFLOW_URL").val() + '/api/wf/editFlowChar?wfGuid=' + ck.val() + '&accepterUrl=' + SyncUrl.UserData ,'_blank');
	});
});