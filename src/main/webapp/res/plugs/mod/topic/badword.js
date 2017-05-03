
var BadWord = {
		add : function(){
			new Chasonx({
				title : '敏感词编辑',
				html : '<div id="badwordEditor"></div>',
				width:400,height:220,
				success : function(){
					var word = $("#fword").val();
					if(word == '') return Chasonx.Hint.Faild('输入为空');
					
					BadWord.exec({'word':word,'fstate':$("#fstate").val(),'type':1});
					return true;
				},
				modal : true
			});
			 ChasonxDom.draw({
				  id : 'badwordEditor',
				  item : [
				      {text:'&nbsp;',type:'br',info:'&nbsp;'},
				      {text:'名称:',name:'fword',attr:' req = "true"',type:'input'},
				      {text:'状态:',name:'fstate',type:'select',options : [{v:'0',t :'启用'},{v:'1',t :'禁用'}]},
				      {text:'&nbsp;',type:'br',info:''}
				  ]
			  });
		},
		update : function(T,S){
			this.choose(function(idStr){
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定' + (T == 2?S == 0?'启用':'禁用':'删除') + '选项吗？',
					success : function(){
						BadWord.exec({'idStr':idStr,'state':S,'type':T});
						return true;
					},
					modal : true
				});
			});
		},
		exec : function(data){
			getAjaxData(DefConfig.Root + '/main/badword/modify',data,function(d){
				Chasonx.Hint.Success('操作成功');
				BadWord.list();
			});
		},
		table : null,
		list : function(){
			if(this.table == null){
				this.table =  Chasonx.Table({
					url : DefConfig.Root + '/main/badword/list',
					dataPanel : 'badWordDataGrid',
					check : {name : 'badwordval',value : 'id'},
					tableNames : [{name : "fword",text:"名称",width:"80%"},{name :"fstate",text:"状态",width:"10%",handler:function(v){ return v == 0?'启用':'<font color="red">禁用</font>';}}]
				}).init();
			}else{
				this.table.getData();
			}
		},
		choose : function(cb){
			var ckarray = $("input[type='checkbox'][name='badwordval']:checked");
			if(ckarray.size() == 0) return Chasonx.Hint.Faild('请选择一项');
			
			var idStr = '';
			ckarray.each(function(){
				idStr += $(this).val() + ';';
			});
			cb(idStr);
		}
};
window.onload = BadWord.list;