
window.onload = function(){
	Chasonx.Frameset({
		window : {
			top  : {id : 'topPanel' ,height : '68px',border:false,bgColor:false},
			right : {id : 'centerPanel',width : '100%',border:false,bgColor:false},
			}
	});
	
	Dimension.list();
};

var Dimension = {
		currNode : null,
		modify : function(type,state){
			var D = {};
			
			if(type != 1 && this.currNode != null){
				D.guid = this.currNode.guid;
			}else if(type != 1 && this.currNode == null){
				return Chasonx.Hint.Faild('请选择一项后再操作');
			}
			
			if(type == 3){
				return Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除该选项及子选项吗？',
					modal : true,
					success : function(){
						Dimension.exec({guid : D.guid,execType : type});
						return true;
					}
				});
			}else if(type == 4){
				return Chasonx.Alert({
					alertType : 'warning',
					html : '确定 ' + (state == 0?'冻结该节点吗？ <br>冻结可导致该节点下账户无法登录！':'解冻冻结该节点吗？') + ' ',
					modal : true,
					height : 180,
					success : function(){
						Dimension.exec({guid : D.guid,execType : type,state:state});
						return true;
					}
				});
			}
			
			
			var wsize = ChasonTools.getWindowSize();
			new Chasonx({
				title : (type == 1?"新增":"更新") + '机构信息',
				html : '<div id="dimensionPanel"class="global_bg_c"></div>',
				width : wsize[2] * 0.4,height : wsize[3] * 0.5,
				modal : true,
				success : function(){
					if(FormData.requiredByAttr('dimensionPanel',['input','textarea'])){
						var data = FormData.getFormData('dimensionPanel',['input','textarea','select']);
						data.execType = type;
						if(type != 1) data.guid = D.guid;
						Dimension.exec(data);
						return true;
					}
				}
			});
			
			if(type == 1 && this.currNode != null){
				D.parentGuid = this.currNode.guid;
				D.level = ~~this.currNode.attributes.level + 1;
			}else if(type == 2 && this.currNode != null){
				D.value = this.currNode.value;
				D.envalue = this.currNode.envalue;
				D.level = this.currNode.attributes.level;
				D.parentGuid = this.currNode.attributes.parentid;
				D.icon = this.currNode.icon;
				D.state = this.currNode.attributes.fstate;
				D.remark = this.currNode.attributes.remark;
				D.extdata = this.currNode.attributes.ext;
			}
			
			 ChasonxDom.draw({
				id : 'dimensionPanel' ,
				item : [
			         {text:'&nbsp;',type:'br',info:'&nbsp;'},
				     {text:'组织名称:',name:'value',attr:'maxlength="200" req = "true"',type:'input',value : (D.value || ''),info:'<font color="red">必填</font>'},
				     {text:'英文简称:',name:'envalue',attr:'maxlength="200" req = "true"',type:'input',value : (D.envalue || ''),info:'<font color="red">必填</font>'},
				     {text:'级别:',name:'level',attr:'maxlength="2" req = "true" readonly="readonly"',type:'input',value : (D.level || 1)},
				     {text:'父级GUID:',name:'parentGuid',attr:'maxlength="40"  readonly="readonly"',type:'input',value : (D.parentGuid || '0')},
				     {text:'图标:',name:'icon',attr:'maxlength="2000" ',type:'input',value : (D.icon || '')},
				     {text:'状态:',name:'state',type:'select',value : (D.state || ''),options:[{v:'1',t:'正常'},{v:'0',t:'冻结'}]},
				     {text:'备注:',name:'remark',attr:'maxlength="500" ',type:'textarea',value : (D.remark || '')},
				     {text:'扩展数据:',name:'extdata',attr:'maxlength="500" ',type:'textarea',value : (D.extdata || '')}
				]
			 });
		},
		exec : function(data){
			  $.ajax({
				  url:DefConfig.Root + '/main/dimension/modifyDimension',
				  type:'post',
				  dataType:'json',
				  data:data,
				  success:function(d){
					  if(~~d > 0){
					 	Chasonx.Hint.Success('操作成功');
					 	Dimension.list();
					  }else{
						Chasonx.Hint.Faild('操作失败');
					  }
				  },
				  error:function(e){
					  Chasonx.Hint.Faild(e.responseText);
				  }
			  });
		  },
		  list : function(){
			  Chasonx.Wait.Show();
			  getAjaxData(DefConfig.Root + '/main/dimension/getAllDimensions',null,function(d){
				  Dimension.gennerTree(d);
				  Chasonx.Wait.Hide();
			  });
		  },
		  gennerTree : function(d){
			    $("#udimensionTree").tree({
					data:FormatDimensionData.format(d),
					onClick:function(node){
						Dimension.currNode = node;
					},
					onBeforeDrop : function(target,source,point){
						
						var txt = '',tarNode = $("#dimensionTree").tree('getNode',target);
						if(point == "append")
							txt = '\t\t“'+ source.value +'” \t作为:\t“'+ tarNode.value +'”\t的子项';
						else if(point == "top")
							txt = '\t\t“'+ source.value +'”\t作为:\t“'+ tarNode.value +'”\t同级并处于该项之前';
						else if(point == "bottom")
							txt = '\t“'+ source.value +'”\t作为:\t“'+ tarNode.value +'”\t同级并处于该项之后';
						
						if(confirm("确定:" + txt + "吗？")){
							$.ajax({
								url:DefConfig.Root + '/main/dimension/moveDimension',
								type:'post',
								dataType:'json',
								data:{'targetGuid':tarNode.guid,'sourceGuid':source.guid,'derection':point},
								success:function(d){
									if(~~d > 0){
										Chasonx.Hint.Success('移动成功');
										Dimension.list();
									}else{
										Chasonx.Hint.Faild('移动失败');
									}
								},error:function(e){
									Chasonx.Hint.Faild('移动出错');
								}
							});
						}else{
							return false;
						}
					}
					
				});
			}
};