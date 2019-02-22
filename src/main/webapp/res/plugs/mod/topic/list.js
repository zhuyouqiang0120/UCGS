
var TopicSet = {
		colData : null,
		currCol : null,
		_table : null,
		loadSite : function(areaguid,targetSitePanel,targetColumnPanel,colClickCallback,addCallBack){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':0,'PageSize':1000,'del':0,'areaguid':(areaguid || '')},function(d){
				Chasonx.Wait.Hide();
				var line = "";
				$.each(d.list,function(i,u){
					line += "<option value='"+ u.fguid +"'>"+ u.fsitename +"</option>";
				});
				$("#" + targetSitePanel).html(line).bind('change',function(){
					if($(this).val() == '') return;
					PublicCol.list(targetColumnPanel,{'id':$(this).val(),'name':$(this).find('option:selected').text(),'state':1},function(N){
						colClickCallback(N);
					});
					if(typeof( addCallBack) == 'function') addCallBack(this.value);
				});
				
				if($("#" + targetSitePanel).val() != ''){
					PublicCol.list(targetColumnPanel,{'id':$("#" + targetSitePanel).val(),'name':$("#" + targetSitePanel).find('option:selected').text(),'state':1},function(N){
						colClickCallback(N);
					});
					
					if(typeof addCallBack == 'function') addCallBack(this.value);
				}else{
					$("#targetColumnPanel").html('');
				}
			});
		},
		loadTopic : function(){
			if(TopicSet.currCol == null) return;
			
			var para = {'colGuid':TopicSet.currCol.guid,'delete':($("#_pagetype").val() == 2 ?1:0),"siteGuid":$("#siteItems").val()};
			if($("#_pagetype").val() == 3) para.check = $("#checkState").val();
			else if($("#_pagetype").val() == 1) para.check = 1;
			this._table.url = DefConfig.Root + '/main/topic/topiclist';
			this._table.data = para;
			this._table.getData(function(data){
				TopicSet.colData = data;
			});
		   /*Chasonx.Wait.Show();
			 Chasonx.Ajax({
				 url:DefConfig.Root + '/main/topic/topiclist',
				 PageNumber:0,
				 PageSize:10,
				 data :para,
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ TopicSet.drawHtml(d);});	
					 
					 TopicSet.colData = d;
					 TopicSet.drawHtml(d);
					 Chasonx.Wait.Hide();
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 	Chasonx.Wait.Hide();
				 }
			});*/
		},
		queryTopic : function(){
			var title = $("#queryTitle").val(),start = $("#startTime").val(),end = $("#endTime").val();
			if(title == '' && start == '' && end == '') return;
			this._table.url = DefConfig.Root + '/main/topic/topicQuery';
			this._table.data = {'startTime':start,'endTime':end,'title':title};
			this._table.getData(function(data){
				TopicSet.colData = data;
			});
//			Chasonx.Wait.Show();
//			Chasonx.Ajax({
//				 url:DefConfig.Root + '/main/topic/topicQuery',
//				 PageNumber:0,
//				 PageSize:10,
//				 data :{'startTime':start,'endTime':end,'title':title},
//				 success : function(d){	
//					 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ TopicSet.drawHtml(d);});	
//					 
//					 TopicSet.colData = d;
//					 TopicSet.drawHtml(d);
//					 Chasonx.Wait.Hide();
//				 },
//				 error:function(e){
//				 	Chasonx.Hint.Faild({text:'错误：' + e});
//				 	Chasonx.Wait.Hide();
//				 }
//			});
		},
		drawHtml : function(d){
			var _ht = '';
			if(d.list.length > 0){
				$.each(d.list,function(i,u){
					_ht += '<tr class="dataGridTr" onclick="_setTrFocus(this,\'topicval\',\'_selectAll\')">\
						    <td><input type="checkbox" name="topicval" value="'+ u.id +'" rid="'+ u.rid +'" guid="'+ u.fguid +'" idx="'+ i +'"/></td>\
						    <td>'+ (d.pageSize * (d.pageNumber - 1) + i + 1) +'</td>\
						    <td id="td_title_'+ u.id +'">'+ u.ftitle + (u.ftop === 1?'<font color="red">[置顶]</font>':'') +'</td>\
						    <td>'+ TopicAttr.classes.getText(u.fclass) +'</td>\
						    <td>'+ u.fsource  +'</td>\
						    <td>'+ u.fregion + '/' + u.fyears +'</td>\
						    <td>'+ u.fpvsize +'</td>\
						    <td>'+ u.fgrade +'</td>\
						    <td>'+ u.freleasetime +'</td>\
						    <td>'+ u.freleaseer +'</td>\
						   </tr>';
				});
			}else{
				_ht += '<tr class="dataGridTr"><td colspan="10">暂无数据</td></tr>';
			}
			$("#topicData").html(_ht);
		},
		openEdit : function(e){
			var url = DefConfig.Root + '/main/topic/edittopic';
			var t = $("input[type='checkbox'][name='topicval']:checked");
			if(e && t.size() > 0){
				 url += '/' + t.val();
			}else if(e){
				return  Chasonx.Hint.Faild('请选中一项后进行操纵');
			}
			window.open(url,'_blank');
		},
		setCheckOrRecyclebin : function(T,S){
			this.choose(function(item){
				
				Chasonx.Alert({
					title : '提示',
					html : '确定'+ (T == 1?S == 1?'通过审核':'不通过审核':S == 0?'恢复':'删除') +'吗?',
					alertType : 'warning',
					modal : true,
					success : function(){
						var idStr = '';
						item.each(function(){
							idStr += $(this).attr('guid') + ';';
						});
						var data = {'type':T,'idStr':idStr,'fdelete':S,'colGuid':TopicSet.currCol.guid,'check':S,'oldCheck':$("#checkState").val()};
						getAjaxData(DefConfig.Root + '/main/topic/topicdelete',data,function(d){
							Chasonx.Hint.Success('操作成功');
							TopicSet.loadTopic();
							
							TopicSet._table.unCheck();
						});
						
						return true;
					}
				});
				
			});
			
		},
		changeTopState : function(state){
			this.choose(function(item){
				Chasonx.Alert({
					title : '提示',
					html : '确定设置为[' + (state === 1?'置顶':'复原') + ']状态吗？',
					modal : true,
					success : function(){
						var idStr = '';
						item.each(function(){
							idStr += $(this).val() + ';';
						});
						
						getAjaxData(DefConfig.Root + '/main/topic/topicsettop',{'idStr':idStr,'top':state},function(d){
							Chasonx.Hint.Success('主题状态已更改');
							TopicSet.loadTopic();
							
							TopicSet._table.unCheck();
						});
						
						return true;
					}
				});
			});
		},
		attrEdit : function(){
			this.choose(function(item){
				new Chasonx({
					title : '主题属性设置',
					html : '<div id="topicAttrEdit" class="global_bg_c" style="height:100%"></div>',
					width:400,height:400,
					modal: true,
					success : function(){
						var data = FormData.getFormData('topicAttrEdit',['input']);
						data['id'] = item.val();
						data['type'] = 2;
						getAjaxData(DefConfig.Root + '/main/topic/videoTopicOperation',data,function(d){
							Chasonx.Hint.Success('属性已更改');
							TopicSet.loadTopic();
						});
						return true;
					}
				});
				console.debug(item.attr("idx"));
				var D = TopicSet.colData.list[item.attr('idx')];
				ChasonxDom.draw({
					 id : 'topicAttrEdit',
					  item : [
					      {text:'&nbsp;',type:'br',info:'&nbsp;'},
					      {text:'标题:',type : 'input' , attr : ' readonly = "readonly" ',value :  $("#td_title_" + item.val()).html()},
					      {text:'来源:',name:'fsource',attr:' req = "true"',type:'input',value : (D.fsource || '')},
					      {text:'评分:',name:'fgrade',type:'input',value : (D.fgrade || '')},
					      {text:'收藏数:',name:'fcollectsize',type:'input',value : (D.fcollectsize || '')},
					      {text:'支持数:',name:'ftopsize',type:'input',value : (D.ftopsize || '')},
					      {text:'浏览量:',name:'fpvsize',type:'input',value : (D.fpvsize || '')}
					  ]
				});
			});
		},
		choose : function(callback){
			
			var item = $("input[type='checkbox'][name='topicval']:checked");
			if(item.size() > 0){
				callback(item);
			}else{
				return Chasonx.Hint.Faild('请选择一项后操作');
			}
		},
		relation : {
			colData : null,
			show : function(type,target){
				if(TopicSet.currCol == null) return Chasonx.Hint.Faild('请选择栏目');
				
				var topicGuidArray = [];
				if(target == 'topic'){
					var _topics = $("input[type='checkbox'][name='topicval']:checked");
					if(_topics.size() == 0) return Chasonx.Hint.Faild('请选择主题');
					
					_topics.each(function(){
						topicGuidArray.push($(this).attr('guid'));
					});
				}
				var winSize = ChasonTools.getWindowSize();
				var _w = winSize[2]*0.5,_h = winSize[3]*0.6;
				var ss = (type == 'copy'?'复制':'移动');
				
				var RelationPanel = new Chasonx({
					 title : '主题' + ss + ( target == 'topic'?'--将对选中的主题进行' + ss:'--将对选中栏目下的所有主题进行' + ss),
					 html  : '<div id="relationBox">\
						 		<div id="relationLeft"><div id="relationAreaList" class="global_bg_c" style="overflow:auto;height:100%;"></div></div><div id="relationRight">\
						 		<div style="overflow:auto;height:100%;"><p style="text-align:center;">\
						 			<input type="button" class="button blue" style="width:60px;height:25px;font-size:12px;padding: .3em 0.5em .3em;" onclick="TopicSet.relation.siteList()"  value="全部网站"/>\
						 		        网站:<select id="relationSiteItems" class="inputText select" style="width:150px;"></select>\
						 			文章页模板:<select id="relationTemplate" class="inputText select" style="width:150px;"></select></p>\
						 		<ul id="relationTopColumnTree" class="easyui-tree" data-options="animate:true"></ul></div></div></div>',
					 width : _w, height : _h,
					 success : function(){
						 if(TopicSet.relation.colData == null) return Chasonx.Hint.Faild('请选择目标栏目');
						 if(TopicSet.relation.colData.guid == TopicSet.currCol.guid) return Chasonx.Hint.Faild("请选择不同栏目进行关联");
						 
						 var data = {
								"type" :type,
								"targetColGuid" : TopicSet.relation.colData.guid,
								"targetSiteGuid": TopicSet.relation.colData.attributes.siteGuid,
								"sourceColGuid" : TopicSet.currCol.guid,
								"topicGuid": topicGuidArray,
								"templateId" : $("#relationTemplate").val()
						 };
						 Chasonx.Alert({
							title : '确认提示？',
							html : '确定将选中的主题' + ss + '到 ['+ $("#relationSiteItems option:selected").text() + '--' + TopicSet.relation.colData.colname +']下吗?',
							modal : true,
							width : 360,height:200,
							success : function(){
								getAjaxData(DefConfig.Root + "/main/topic/mover",data,function(d){
									 if(d > 0){
										 Chasonx.Hint.Success("操作成功");
										 RelationPanel.Hide();
										 TopicSet.loadTopic();
									 }else{
										 Chasonx.Hint.Faild("操作失败"); 
									 }
								 });
								
								return true;
							}
						 });
					 },
					 modal : true
				});
				
				Chasonx.DragBox({
					target : 'relationBox',
					lineColor : '#ADADAD',
					items : [
					         {id : 'relationLeft',width : '20' ,css : 'background:#fff;'},
					         {id : 'relationRight',width : '80' }
					        ]
				});
				
				Area.list('relationAreaList',[],function(){
					TopicSet.loadSite(Area.currArea.fguid,'relationSiteItems','relationTopColumnTree',function(N){
						TopicSet.relation.colData = N;
					});
				});
				
				setTimeout(function(){
					TopicSet.relation.siteList();
				},300);
			},
			siteList : function(){
				TopicSet.loadSite(null,'relationSiteItems','relationTopColumnTree',function(N){
					TopicSet.relation.colData = N;
				},
				function(siteGuid){
					getAjaxData(DefConfig.Root + '/main/topic/topicTemplateList',{'siteGuid':siteGuid},function(d){
						var op = '<option value="">使用原始模板</option>';
						$.each(d,function(i,u){
							op += '<option value="'+ u.id +'">'+ u.ftname +'</option>';
						});
						$("#relationTemplate").html(op);
					});
				});
			}
		},
		sort : function(type){
			this.choose(function(item){
				var itemObj = item.get(0);
				var target = $(itemObj).attr('rid');
				var $itemParent = $(itemObj).parent().parent();
				var $sourceParent = null;
				var tarIdx = $itemParent.index();
				var source = -1;
				var sourIdx = -1;
				
				var Flash = true;
				if(type == 'prev'){
					$sourceParent = $itemParent.prev();
					source = $sourceParent.find("input[type='checkbox'][name='topicval']").attr('rid');
					sourIdx = $sourceParent.index();
				}else if(type == 'next'){
					$sourceParent = $itemParent.next();
					source = $sourceParent.find("input[type='checkbox'][name='topicval']").attr('rid');
					sourIdx = $sourceParent.index();
				}
				
				if(sourIdx >= 0 && $sourceParent != null){
					var temp = $itemParent.html();
					$itemParent.html($sourceParent.html()).find('td').eq(1).html(tarIdx + 1);
					$sourceParent.html(temp).find('td').eq(1).html(sourIdx + 1);
					$itemParent.removeClass().addClass('dataGridTr');
					$sourceParent.removeClass().addClass('dataGridTrFocus');
					Flash = false;
				}
				TopicSet.sortModify({'type':type,'target':target,'source':source},Flash);
			});
		},
		sortModify : function(data,F){
			Chasonx.Wait.Show('正在移动，请稍候...');
			getAjaxData(DefConfig.Root + '/main/topic/sort',data,function(d){
				Chasonx.Wait.Hide();
				if(d > 0) Chasonx.Hint.Success('主题已移动');
				else Chasonx.Hint.Faild('移动失败');
				
				if(F) TopicSet.loadTopic();
			});
		},
		tabCtrl : function(T){
			$("#_pagetype").val(T);
			
			if(this.currCol != null) this.loadTopic();
		},
		previewTopic : function(){
			var _topics = $("input[type='checkbox'][name='topicval']:checked");
			if(_topics.size() == 0) return Chasonx.Hint.Faild('请选择主题');
			window.open(DefConfig.Root + '/data/uRequest/topicPreview?id=' + _topics.attr('guid'));
		}
};

function _columnCallback(N){
	TopicSet.currCol = N;
	TopicSet.loadTopic();
}

function AllSiteLoad(){
	TopicSet.loadSite(null,'siteItems','topColumnTree',_columnCallback);
};

window.onload = function(){
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '70px',border:false,bgColor:false},
			left : {id : 'leftPanel',width : '0%',border:false,bgColor:false},
			right: {id : 'rightPanel',border:false,bgColor:false}
			}
	});
	setTimeout(function(){
		Chasonx.DragBox({
			target : 'rightPanel',
			lineColor : _GetBoxLineColor(),
			items : [
			         {id : 'draglistLeft',width : '10' },
			         {id : 'dragListCenter',width : '15'},
			         {id : 'dragListRight',width : '75' }
			        ]
		});
	},200);
	
	Area.list('areaList',[],function(){
		TopicSet.loadSite(Area.currArea.fguid,'siteItems','topColumnTree',_columnCallback);
	});
	AllSiteLoad();
	
	$(".topicOrder > span").live('click',function(){
		if($(this).parent().width() == '25'){
			$(this).addClass('topicOrderFocus');
			$(this).parent().css('width','250px');
		}else{
			$(this).removeClass('topicOrderFocus');
			$(this).parent().css('width','25px');
		}
	});
	
	$(".topicOrder > div > font").live('click',function(){
		TopicSet.sort($(this).attr('data'));
	});
	
	$("#queryTitle").bind('keypress',function(e){
		e = e || window.event;
		if(e.keyCode == 13) TopicSet.queryTopic();
	}); 
	
	$(".buttonTabBox > li > label").live('click',function(){
		var tt = $(this).text();
		if(tt == '审核') $("#_pagetype").val(3);
		else if(tt == '回收站')   $("#_pagetype").val(2);
		else $("#_pagetype").val(1);
	});
	
	TopicSet._table = Chasonx.Table({
		id : 'topicTable1107',
		url : DefConfig.Root + '/main/topic/topiclist',
		dataPanel : 'topicDataGrid',
		check : {name : 'topicval',value:'id',attr:{"rid":"rid","guid":"fguid"},
				html : '<div class="topicOrder"><div><font data="top">快速置顶</font><font data="prev">上移</font><font data="next">下移</font><font data="bottom">快速至尾</font></div><span title="主题排序">序</span></div>',
				css : 'position:relative;'},
		tableNames : [
		       {name : "ftitle",text:"标题",width:'20%',attr:{"id":"td_title_#id"},handler: function(v,u){return v + (u.ftop === 1?'<font color="red">[置顶]</font>':'');}},
		       {name : "fclass",text:"分类",width:"8%",handler : function(v){ return  TopicAttr.classes.getText(v);}},
		       {name : "fsource",text:"文章来源",width:"10%"},
		       {name : "flabel",text:"标签",width:"10%",handler : function(v){ return getString(v); }},
		       {name : "fpvsize",text:"浏览量",width:"8%" ,handler : function(v){ return getString(v);}},
		       {name : "fgrade",text:"评分",width:"10%",handler : function(v){ return getString(v); }},
		       {name : "freleasetime",text:"发布时间",width:"14%"},
		       {name : "freleaseer",text:"发布人",width:"10%"}
		              ]
	}).createTable();
	
	ChasonTools.delayRun(function(){
		Chasonx.TableResizable('topicTable1107');
	});
	
};

