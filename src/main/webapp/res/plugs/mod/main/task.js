$(function(){

	var Task_Module = {
			taskData : null,
			selfData : null,
			baseUrl : DefConfig.Root + '/main/workflow/',
			getTaskSize : function(){
				with(this){
					getAjaxData(baseUrl + 'getTaskSize',null,function(d){
						$("#pendingSize").html(d.data.workflow.untreatedSize);
						$("#processSize").html(d.data.workflow.processedSize);
						$("#selfPendingSize").html(d.data.selfPendingSize);
					});
				}
			},
			getNodeInfo : function(data,topicGuid){
				var info = {};
				$.each(data,function(i,u){
					if(u.topicGuid == topicGuid){
						info = u;
						return false;
					}
				});
				return info;
			},
			listSelfPendingTopic : function(){
				with(this){
					Pane.openFade('mainPane','selfListTopicPane',function(){
						Chasonx.Wait.Show();
						Chasonx.Ajax({
							 url:DefConfig.Root + '/main/topic/pendingTopicList',
							 PageNumber:0,
							 PageSize:10,
							 before : function(param){
								 param.PageNumber = (~~param.PageNumber + ~~param.PageSize) / ~~param.PageSize;
								 return param;
							 },
							 data :{checkState : $("#selfCheckState").val()},
							 success : function(d){	
								 d = d.data;
								 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ Task_Module.drawSelf(d.data); });	
								 Task_Module.drawSelf(d);
								 Chasonx.Wait.Hide();
							 },
							 error:function(e){
							 	Chasonx.Hint.Faild('错误：' + e);
							 	Chasonx.Wait.Hide();
							 }
						});
					});
				}
			},
			listCheckTopic : function(){
				with(this){
					Pane.openFade('mainPane','listCheckTopicPane',function(){
						Chasonx.Wait.Show();
						getAjaxData(baseUrl + 'listTask',{pageSize : 10,pageNumber : 1,getDetail : true},function(d){
							taskData = d.data;
							draw(d.data);
							Chasonx.Wait.Hide();
						});
					});
				}
			},
			check : function(id){
				with(this){
					var  checkPane = new Chasonx({
						title : '审核',
						html : '<div id="checkEditPane" style="width : 100%;height : 100%;" class="global_bg_c"></div>',
						modal : true,
						width : 600,height : 400,
						success : function(){
							var task = Task_Module.getNodeInfo(Task_Module.taskData,id);
							var data = FormData.getFormData('checkEditPane',['select','textarea']);
							data.taskId = task.taskId;
							data.topicGuid = task.topicGuid;
							
							getAjaxData(Task_Module.baseUrl + 'modifyNodeState',data,function(d){
								console.log(d);
								if(d.result > 0 && d.data.result == true){
									Chasonx.Hint.Success('已审核');
									Task_Module.listCheckTopic();
									getTaskSize();
								}else{
									Chasonx.Hint.Faild('审核失败 ： ' + d.msg);
								}
								checkPane.Hide();
							});
							
						}
					});
					
					ChasonxDom.draw({
						  id : 'checkEditPane',
						  item : [
						      {text : '&nbsp;',info : '<br>'},
						      {text : '&nbsp;',info : '<br>'},
						      {text:'审核结果：',name:'check',type:'select',options : [{t : '通过', v : '1'},{ t : '不通过',v : '0'}]},
						      {text:'审核备注：',name:'remark',type:'textarea',attr : ' rows="8" '}
						      ]
					});
				}
			},
			getCheckDetail : function(guid){
				with(this){
					Task_Module.detailPane(true);
					$("#workflowDetailTitle").html($("#_td_" + guid).html());
					getAjaxData(Task_Module.baseUrl + 'getDetail',{topicGuid : guid},function(d){
						console.log(d);
						if(d.result ==  1){
							var line = [];
							if(d.data != ""){ 
								$.each(d.data,function(i,u){
									line.push('<div class="item '+ (u.completeState ? '' :'disable') +'">' + u.nodeName +'</div>');
									if(u.history.length > 0){
										$.each(u.history,function(n,m){
											line.push('<div class="history">\
													   <p><label>状态：</label>' + DefConfig.WorkflowState.text[m.checkState] + '</p>\
													   <p><label>操作时间：</label>' + m.modifyTime + '</p>\
													   <p><label>备注：</label>' + m.remark + '</p>\
													   </div>');
										});
									}
								});
							}else{
								line.push('<div class="item">未找到详情</div> ');
							}
							$("#workflowDetail").html(line.join(''));
						}else{
							Chasonx.Hint.Faild("无法找到审核详情");
						}
					});
				}
			},
			draw : function(d){
				var line = [];
				if(d != null){
					$.each(d,function(i,u){
						line.push('<tr class="dataGridTr" onclick="_setTrFocus(this,\'stateCheckTopic\',\'\')">\
							    <td><input type="checkbox" name="stateCheckTopic" value="'+ u.topicGuid +'" /></td>\
							    <td>'+ (i +1) +'</td>\
							    <td id="title'+ u.topicGuid +'">'+ u.title +'</td>\
							    <td>'+ TopicAttr.classes.getText(u.classes) +'</td>\
							    <td>'+ u.source +'</td>\
							    <td>'+ getString(u.label) +'</td>\
							    <td>'+ u.releaseer +'</td>\
							    <td>'+ u.releasetime +'</td>\
							    <td><input type="button" class="button blue btnsmall" onclick="WorkFlowCheck(\'' + u.topicGuid +'\')" value="审核"/>\
								<input type="button" class="button green btnsmall" onclick="PreviewTopic(\''+ u.topicGuid +'\')" value="预览"/></td></tr>');
					});
				}else{
					line.push('<tr class="dataGridTr"><td colspan="6"></td></tr>');
				}
				$("#stateCheckTopicData").html(line.join(''));
			},
			drawSelf : function(d){
				console.log(d);
				var line = [];
				if(d.list.length > 0){
					$.each(d.list,function(i,u){
						line.push('<tr class="dataGridTr" onclick="_setTrFocus(this,\'selfCheckTopic\',\'\')">\
								    <td><input type="checkbox" name="selfCheckTopic" value="'+ u.fguid +'" /></td>\
								    <td>' + ((d.pageNumber - 1) * d.pageSize + i + 1) + '</td>\
								    <td id="_td_'+ u.fguid +'">' + u.ftitle + '</td>\
								    <td>' + TopicAttr.classes.getText(u.fclass) + '</td>\
								    <td>' + u.fsource + '</td>\
								    <td>' + getString(u.flabel) + '</td>\
								    <td>' + u.freleasetime + '</td>\
								    <td>' + DefConfig.TopicCheckState.text[u.fcheck] + '</td>\
								    <td><input type="button" class="button blue btnsmall" onclick="CheckDetail(\'' + u.fguid +'\')" value="详情"/>\
								    <input type="button" class="button green btnsmall" onclick="PreviewTopic(\''+ u.fguid +'\')" value="预览"/></td>\
								  </tr>');
					});
				}else{
					line.push('<tr class="dataGridTr"><td colspan="6"></td></tr>');
				}
				$("#selfCheckTopicData").html(line.join(''));
			},
			detailPane : function(s){
				$("#workflowDetailPane").css('width', (s ? 500 : 0) + 'px' ); 
			}
	};
	
	$("#viewCheckTopics").live('click',function(){
		Task_Module.listCheckTopic();
	});
	
	$("#selfTopics").live('click',function(){
		Task_Module.listSelfPendingTopic();
	});
	
	$("#selfCheckState").live('change',function(){
		Task_Module.listSelfPendingTopic();
	});
	
	$(".icon-cross").live('click',function(){
		Task_Module.detailPane(false);
	});
	
	Task_Module.getTaskSize();
	
	
	window.WorkFlowCheck = Task_Module.check;
	window.CheckDetail = Task_Module.getCheckDetail;
	window.PreviewTopic = function(guid){
		window.open(DefConfig.Root + '/data/uRequest/topicPreview?id=' + guid);
	};
});