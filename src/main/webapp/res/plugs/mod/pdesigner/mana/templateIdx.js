/**
*
*/
var PDesTemplate = {
		table : null,
		data : null,
		openDesigner : function(){
			window.open(DefConfig.Root + '/main/pdesigner','');
		},
		brezzed : function(T){
			this.choose(function(chk){
				var ids = [];
				chk.each(function(){
					ids.push($(this).val());
				});
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定设置选中的模板为 [' + (T == 0?'解冻':'冻结') + '] 状态码 ？',
					modal : true,
					width : 350,
					success : function(){
						UCGS_DAO.updeOrDel({modelName : 'PageDesigner',fstate:T,ids : ids,type : 'update'});
						
						PDesTemplate.table.getData(function(data){
							PDesTemplate.data = data;
						});
						return true;
					}
				});
			});
		},
		modify : function(){
			this.choose(function(chk){
				window.open(DefConfig.Root + '/main/pdesigner?guid=' + chk.attr('guid'),'');
			});
		},
		preview : function(){
			this.choose(function(chk){
				window.open(DefConfig.Root + '/data/preview/' + chk.attr('guid'));
			});
		},
		checked : function(T){
			this.choose(function(chk){
				var ids = [];
				chk.each(function(){
					ids.push($(this).val());
				});
				
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定设置选中的模板为 [' + (T == 2?'通过审核':'审核不通过') + '] 状态码 ？',
					modal : true,
					width : 350,
					success : function(){
						UCGS_DAO.updeOrDel({modelName : 'PageDesigner',fchecked:T,ids : ids,type : 'update'});
						
						PDesTemplate.table.getData(function(data){
							PDesTemplate.data = data;
						});
						return true;
					}
				});
			});
		},
		del : function(T){
			this.choose(function(chk){
				var ids = [];
				chk.each(function(){
					ids.push($(this).val());
				});
				
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除该模板到回收站吗？',
					modal : true,
					success : function(){
						UCGS_DAO.updeOrDel({modelName : 'PageDesigner',fdelelte: T,ids : ids,type : 'update'});
						PDesTemplate.table.getData(function(data){
							PDesTemplate.data = data;
						});
						return true;
					}
				});
			});
		},
		choose : function(fn){
			var chk = $("input[type='checkbox'][name='pdesigner']:checked");
			if(chk.size() == 0) return Chasonx.Hint.Faild('请选择一条选项');
			fn(chk);
		}
};

window.onload = function(){
	Chasonx.Frameset({
		  main : 'mainPanel',
	      window : {
	          top : { id : 'topPanel', height : '70px',border:false,bgColor : false},
	          right:{ id:'centerPanel', width : '100%' ,bgColor : false,border : false}
	      }
	});
	
	PDesTemplate.table = Chasonx.Table({
		id : 'ptemplateTable008',
		url : DefConfig.Root + '/main/pdesigner/ptemplateList',
		dataPanel : 'centerPanel',
		data : {'delete' : 0},
		before : function(op){
			op.PageNumber = (op.PageNumber + op.PageSize)/op.PageSize;
			return op;
		},
		check : {name : 'pdesigner',value : 'id',attr : {"guid":"fguid"}},
		tableNames : [
	       {name : "ftitle",text:"模板名称",width:'10%'},
	       {name : "sitename",text:"站点名",width:"10%"},
	       {name : "adminname",text:"创建人",width:"10%"},
	       {name : "fmodifytime",text:"编辑时间",width:"10%"},
	       {name : "fstate",text:"状态",width:"10%",handler : function(v){ return v == 0?'正常':'冻结'; }},
	       {name : "fchecked",text:"审核",width:"10%" ,handler : function(v){ return v == 0?'未审核':v == 1?'不通过':'通过';}},
	       {name : "furl",text:"数据地址",width:"20%",handler : function(v){ return getString(v); }},
	       {name : "flinkpageurl",text:"外链地址",width:"15%",handler : function(v){ return getString(v);}},
				]
		}).createTable();
	
	PDesTemplate.table.getData(function(data){
		PDesTemplate.data = data;
	});
};