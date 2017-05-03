
var TaskGroup = {
		route : {
			modify : DefConfig.Root + '/main/task/modify',
			excuteNow : DefConfig.Root + '/main/task/excuteNow',
		},
		table : null,
		list : function(){
			this.table.getData(null,function(data){
				return data = data.reData;
			});
		},
		modify : function(type){
			this.choose(function(_ck){
				if(type == _ck.attr('state')) return Chasonx.Hint.Faild('操作被拒绝');
				Chasonx.Alert({
					html : '确定' + (type == 0?'停止':'启动') + '该进程吗?',
					title : '温馨提示',
					success : function(){
						getAjaxData(TaskGroup.route.modify,{'id':_ck.val(),'fclass':_ck.attr('className'),'fstate':type},function(d){
							if(d > 0){
								Chasonx.Hint.Success('任务已启动');
								TaskGroup.list();
							}else{
								Chasonx.Hint.Faild('任务启动失败');
							}
						});
						return true;
					},
				    modal : true
				});
			});
		},
		excuteNow : function(){
			this.choose(function(_ck){
				Chasonx.Wait.Show();
				getAjaxData(TaskGroup.route.excuteNow,{classes : _ck.attr('className')},function(d){
					if(d == 1)  Chasonx.Hint.Success('执行完毕');
					else Chasonx.Hint.Faild('执行失败');
					Chasonx.Wait.Hide();
				});
			});
		},
		choose : function(fn){
			var ck = $("input[type='checkbox'][name='taskItem']:checked");
			if(ck.size() == 0) return Chasonx.Hint.Faild('请选择一条记录');
			if(typeof fn == 'function') fn(ck);
		}
};

window.onload = function(){
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '68px',bgColor : false,border:false},
			left : {id : 'centerPanel',width : '100%',bgColor : false,border:false,slide : false}
			}
	});
	
	var getState =  function(s){
		var v = '';
		switch(s){
		case 0: v = '<span class="badge badge_gray">已停止</span>'; break;
		case 1: v = '<span class="badge badge_blue">正在运行</span>';break;
		}
		return v;
	}
	
	TaskGroup.table = Chasonx.Table({
		id : 'taskListTable',
		url : DefConfig.Root + '/main/unifyFX/getRecordList',
		dataPanel : 'centerPanel',
		data : {modelName : 'TQuartz'},
		before : function(options){
			options.PageNumber = (options.PageNumber + options.PageSize)/options.PageSize;
			return options;
		},
		check : {name:'taskItem',value:'id',attr:{"className":"fclass","state":"fstate"}},
		tableNames : [
		      {name : 'fname',text : '任务名称',width : '10%'},
		      {name : 'fcron',text : '执行周期',width : '10%'}, 
		      {name : 'fstate',text : '状态',width : '10%',handler : function(v){ return getState(v);}},
		      {name : 'fclass' ,text : '目标函数' ,width : '25%',handler : function(v){ return v; }},
		      {name : 'ftype' ,text : '标识' ,width : '10%',handler : function(v){ return v;}},
		      {name : 'fmodifytime' ,text : '更新时间' ,width : '15%' ,handler : function(v){ return getString(v);}},
		      {name : 'fresponsetime' ,text : '耗时(ms)' ,width : '10%' , handler : function(v){ return getString(v);}}
		    ]
	}).createTable();
	TaskGroup.list();
};
