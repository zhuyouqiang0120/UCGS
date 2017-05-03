var Serv = {
		scol : null,
		siteData : null,
		siteList : function(areaGuid){
			Chasonx.Wait.Show();
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'del':0,'PageNumber':0,'PageSize':100,'areaguid' : (areaGuid || '')},function(d){
				Chasonx.Wait.Hide();
				Serv.siteData = d.list;
				
				var option = '<option value="">--选择--</option>';
				$.each(d.list,function(i,u){
					option += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
				});
				$("#siteItems").html(option);
			});
		},
		areaList : function(){
			Area.list('colAreaPanel',[],function(){
				$("#columnTree").html('');
				Serv.siteList(Area.currArea.fguid);
			});
		},
		add : function(T){
			var fcname = $("#fcname").val();
			if(Serv.scol != null){
				Chasonx.Alert({html:'确定'+ (T == 1?'添加':'更新') +'[' + fcname + ']业务吗？',success:function(){
					var data = {'type':T,'fservicename':fcname,'fstate':$("#fstate").val(),'ficon':$("#ficon").val(),
							  'fremark':$("#fremark").val(),'fadtactics':$("#fadtactics").val(),'fsiteguid':$("#siteItems").val(),
							  'ftype':$("#columnType").val()};
					data['fextdata'] = JSON.stringify( Serv.getExtData());
					if(T == 2){
						data['id'] = $("#fid").val();
					}else{
						data['flevel'] = parseInt($("#fclevel").attr('cdata')) + 1;
						data['fparentuid'] = $("#fguid").val();
					}
					Serv.exec(data);
					return true;
				},modal:true});
			}else{
				Chasonx.Hint.Faild('未选择栏目');
			}
		},
		getExtData : function(){
			var ext = {};
			var mess = [];
			$("#columnMess > div").each(function(){
				mess.push($(this).find('font').html());
			});
			
			var items = [],item;
			$("#bindImagePanel > div").each(function(){
				item = {};
				item['src'] = $(this).attr('data');
				item['link'] = $(this).attr('link');
				items.push(item);
			});
			ext['Message']  = mess;
			ext['Image'] = items;
			ext['Link'] = $("#LinkText").val();
			
			return ext;
		},
		upState : function(S){
			Chasonx.Alert({html:'确定设置为:' + (S == 1?'发布':'冻结') +'状态吗？(含子业务)',modal:true,success:function(){
				Serv.modifyexec({'ckey':$("#fid").val(),'guid':$("#fguid").val(),'siteGuid':$("#siteItems").val(),'state':S,'type':1});
				return true;
			}});
		},
		del: function(){
			Chasonx.Alert({alertType:'warning',html:'确定要删除吗？(含子业务)',success:function(){
				Serv.modifyexec({'ckey':$("#fid").val(),'guid':$("#fguid").val(),'siteGuid':$("#siteItems").val(),'type':2});
				return true;
			},modal:true});
		},
		modifyexec : function(data){
			$.ajax({
				url:DefConfig.Root + '/main/column/servmodify',
				type:'post',
				dataType:'json',
				data:data,
				success:function(d){
					Chasonx.Hint.Success({text:'操作成功'});
					Serv.load($("#siteItems")[0]);
					
					Serv.setFocus(d);
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错，操作失败'});
				}
			});
		},
		exec : function(data){
			$.ajax({
				url:DefConfig.Root + '/main/column/servoperaton',
				type:'post',
				dataType:'json',
				data:data,
				success:function(d){
					Chasonx.Hint.Success({text:'操作成功'});
					Serv.load($("#siteItems")[0]);
					if(data.type == 1){
						Serv.clearExtData();
						FormData.clearInput('columnPanel',['input','textarea']);
					}
					Serv.setFocus(d);
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'系统出错，操作失败'});
				}
			});
		},
		load : function(obj){
			if(obj.value == '' || obj.value == undefined) return;
			Serv.scol = null;
			Chasonx.Wait.Show("正在加载业务列表...");
			$.ajax({
				url:DefConfig.Root + '/main/column/servlist',
				type:'get',
				dataType:'json',
				data : {'siteGuid':obj.value},
				success:function(d){
					Serv.gennerTree(d,{'id':obj.value,'name':$(obj).find('option:selected').text()});
					Chasonx.Wait.Hide();
				},
				error:function(e){
					Chasonx.Hint.Faild({text:'业务栏目加载失败'});
					Chasonx.Wait.Hide();
				}
			});
		},
		setFocus : function(nodeId){
			setTimeout(function(){
				var _node = $("#columnTree").tree('find',nodeId);
				if(_node == null) return;
				
				$('#columnTree').tree('select', _node.target);
				$('#columnTree').tree('scrollTo',_node.target);
				Serv.attrDraw(_node);
				Serv.scol = _node;
			},300);
		},
		gennerTree : function(d,siteData){
		    $("#columnTree").tree({
				data:FormatColumnData.format(d,siteData),
				onClick:function(node){
					Serv.scol = node;
					Serv.attrDraw(node);
					Serv.paraMap.list(node.guid);
				},
				onBeforeDrop : function(target,source,point){
					var txt = '',tarNode = $("#columnTree").tree('getNode',target);
					if(point == "append")
						txt = '\t\t“'+ source.colname +'” \t作为:\t“'+ tarNode.colname +'”\t的子栏目';
					else if(point == "top")
						txt = '\t\t“'+ source.colname +'”\t作为:\t“'+ tarNode.colname +'”\t同级栏目并处于该栏目之前';
					else if(point == "bottom")
						txt = '\t“'+ source.colname +'”\t作为:\t“'+ tarNode.colname +'”\t同级栏目并处于该栏目之后';
					
					if(confirm("确定:" + txt + "吗？")){
						$.ajax({
							url:DefConfig.Root + '/main/column/servmove',
							type:'post',
							dataType:'json',
							data:{'targetid':tarNode.id,'sourceid':source.id,'point':point,'siteGuid':$("#siteItems").val()},
							success:function(d){
								Chasonx.Hint.Success({text:'栏目移动成功'});
								Serv.load($("#siteItems")[0]);
							},error:function(e){
								Chasonx.Hint.Faild({text:'栏目移动出错'});
							}
						});
					}else{
						return false;
					}
				}
				
			});
		},
		attrDraw : function(node){
			$("#fid").val(node.id);
			$("#fguid").val(node.attributes.level == 0?0:node.guid);
			$("#fcname").val(node.colname);
			$("#ficon").val(node.icon != 'null'?node.icon:'');
			$("#ficonImg").attr('src',node.icon != 'null'?node.icon:$("#ficonImg").attr('def'));
			$("#fclevel").val(node.attributes.level != 0? node.attributes.level + "级": "初级").attr('cdata',node.attributes.level || 0);
			$("#fstate").find("option[value='"+ node.attributes.fstate +"']").attr('selected',true);
			$("#fcpid").val(node.attributes.parentid);
			$("#fremark").val(node.attributes.remark != "null"?node.attributes.remark:"");
			//$("#fadtactics option[value='"+ node.attributes.fadtactics +"']").attr('selected',true);
			var reHtml = '';
			if(node.attributes.rsiteguid != "null" && node.attributes.rsiteguid != undefined){
				reHtml = '<i class="colLIcon" title="已关联"></i>' + node.attributes.rname + '<span id="unrelation" class="badge badge_del" style="cursor:pointer;">解除关联</span>\
						  <span id="setrelationLevel" class="badge badge_blue" data="'+ node.attributes.rischild +'" style="cursor:pointer;">'+ (node.attributes.rischild == 0?'设为子级':'设为同级') +'</span>';
			}
			$("#relationMess").html(reHtml); 
			Serv.drawExtData(node.attributes.ext);
		},
		drawExtData : function(data){
			this.clearExtData();
			if(data == '' || data == undefined) return;
			data = JSON.parse(data.replace(/[']/g,'"'));
			$("#LinkText").val(data.Link);
			for(var i = 0;i < data.Message.length;i++){
				$("#columnMess").append('<div><font>'+ data.Message[i] +'</font><span>×</span></div>');
			}
			for(var i = 0;i < data.Image.length;i++){
				$("#bindImagePanel").append('<div data="'+ data.Image[i].src +'" link="'+ data.Image[i].link +'"><img src="'+ data.Image[i].src  +'" /><span><a href="'+ data.Image[i].link +'" target="_blank">'+ data.Image[i].link +'</a><p>删除</p></span></div>');
			}
		},
		clearExtData : function(){
			$("#columnMess").html('');
			$("#bindImagePanel").html('');
			$("#LinkText").val('');
		},
		icon : {
			show : function(){
				fileDialogHtml($("#siteItems").val(),function(ck){
					var prewimgsrc = ck.parent().find('img').attr('src');
					$("#ficon").val(prewimgsrc);
					$("#ficonImg").attr('src',prewimgsrc);
				});
			},
			cancel : function(){
				$("#ficon").val('');
				$("#ficonImg").attr('src',$("#ficonImg").attr('def'));
			}
		},
		image : {
			show : function(){
				fileDialogHtml($("#siteItems").val(),function(ck){
					var prewimgsrc = ck.parent().find('img').attr('src');
					$("#bindImage").val(prewimgsrc);
				});
			},
			ok : function(){
				var link = $("#imageLink").val(),imgsrc = $("#bindImage").val().trim();
				if(link != '' && !RegexUrl(link)) return Chasonx.Hint.Faild('输入的链接地址不合法');
				
				if(imgsrc != ''){
					$("#bindImagePanel").append('<div data="'+ imgsrc +'" link="'+ link +'"><img src="'+ imgsrc +'" /><span><a href="'+ link +'" target="_blank">'+ link +'</a><p>删除</p></span></div>');
					
					$("#imageLink").val('');
					$("#bindImage").val('');
				}
			}
		},
		relation : {
			publicSite : null,
			publicCol : null,
			chooseSite : null,
			show : function(){
				if(Serv.scol == null) return Chasonx.Hint.Faild('请选择栏目');
				
				if(!this.check($("#siteItems").val())) return Chasonx.Alert({
					alertType:'warning',
					html : '该网站类型为公共网站，不用关联',
					modal:true
				});
				
				var html = '<div class="publicSitePanel">选择：<select id="publicSiteItem" class="inputText select"></select>\
							<ul id="publicColumnTree" class="easyui-tree" data-options="animate:true"></ul></div>\
							<div id="chooseRelation" class="publicSitePanel"><br><font>提示：可关联整个网站或指定栏目</font><span>\
							<input type="checkbox" name="relationIsChild" value="1" checked="checked"/><font size="2">作为子栏目</font>&nbsp;&nbsp;<input type="checkbox"  name="relationIsChild" value="0"/><font size="2">作为同级栏目</font><br>已选择关联到：</span><p></p><p></p></div>';
				new Chasonx({
					title : '栏目关联',
					html : html,
					width:800,height:600,
					success : function(){
						if(Serv.relation.chooseSite != null){
							var data = {'id': $("#fid").val(),'frelationsiteguid':Serv.relation.chooseSite,'type':2};
							if(Serv.relation.publicCol != null) data['frelationcolguid'] = Serv.relation.publicCol.guid;
							
							var relaname = $("#publicSiteItem").find('option:selected').text() + (Serv.relation.publicCol != null?'-' + Serv.relation.publicCol.text:'');
							data['frelationdefname'] = relaname;
							data['frelatitonischid'] = $("input[type='checkbox'][name='relationIsChild']:checked").val();
							
							Serv.exec(data);
							return true;
						}else{
							return Chasonx.Hint.Faild('未选择网站或栏目');
						}
					},
					modal:true
				});
				
				getAjaxData(DefConfig.Root + '/main/site/publicSiteList',null,function(d){
					Serv.relation.publicSite = d;
					Serv.relation.draw();
				});
				
				$("#chooseRelation > p > span").live('click',function(){
					if($(this).attr('type') == 'site') Serv.relation.chooseSite = null;
					else Serv.relation.publicCol = null;
					
					$(this).parent().html('');
				});
				$("input[type='checkbox'][name='relationIsChild']").bind('click',function(){
					$("input[type='checkbox'][name='relationIsChild']:checked").attr('checked',false);
					$(this).attr('checked',true);
				});
			},
			draw : function(){
				var html = '<option value="">---选择网站---</option>';
				$.each(this.publicSite,function(i,u){
					html += '<option value="'+ u.fguid +'">'+ u.fsitename +'</option>';
				});
				var sitename,siteData;
				$("#publicSiteItem").html(html).bind('change',function(){
					Serv.relation.chooseSite = $(this).val();
					sitename = $(this).find('option:selected').text();
					$("#chooseRelation > p").eq(0).html('<span type="site" title="取消">×</span>网站：' + sitename);
					$("#chooseRelation > p").eq(1).html('');
					
					siteData = {'id':$(this).val(),'name':sitename,'state':1};
					getAjaxData(DefConfig.Root + '/main/column/servlist',{'siteGuid':siteData.id,'state':(siteData.state || null)},function(d){
						PublicCol.genner('publicColumnTree',d,siteData,function(node){
							Serv.relation.publicCol = node;
							$("#chooseRelation > p").eq(0).html('<span type="site" title="取消">×</span>网站：' + sitename);
							$("#chooseRelation > p").eq(1).html('<span type="col" title="取消">×</span>栏目：' + node.text );
						});
					});
				});
			},
			check : function(currSite){
				var res = true;
				for(var i = 0;i < Serv.siteData.length;i++){
					if(Serv.siteData[i].fguid === currSite && Serv.siteData[i].ftype == 'public'){
						res = false;
						break;
					}
				}
				return res;
			}
		},
		paraMap : {
			currData : null,
			showPan : null,
			list : function(tarGuid){
				getAjaxData(DefConfig.Root + '/main/column/getParaMaps',{'targetGuid':tarGuid},function(d){
					Serv.paraMap.currData = d;
					var line = '';
					$.each(d,function(i,u){
						line += '<div class="Items"><span class="key"><input type="checkbox" name="customerPara" value="'+ u.id +'" idx="'+ i +'" />键：'+ u.fkey +'</span><span class="value">值：'+ u.fvalue +'</span><div class="clear"></div></div>';
					});
					$("#uparaMaps").html(line);
				});
			},
			oper : function(type){
				if(Serv.scol == null) return Chasonx.Hint.Faild('未选择任何选项');
				var _id = null;
				var map = {};
				if(type == 2){
					var _cb = $("input[type='checkbox'][name='customerPara']:checked");
					if(_cb.size() == 0) return Chasonx.Hint.Faild('未选择任何参数选项');
					map = Serv.paraMap.currData[_cb.attr('idx')];
					_id = _cb.val();
				}
				
				Serv.paraMap.showPan = new Chasonx({
					title : '自定义参数',
					html : '<div id="customerParaMap"></div>',
					width:500,height:400,
					modal : true,
					okText : '保存',
					success : function(){
						var key = $("#fparakey").val();
						var value = $("#fparavalue").val();
						if(key == '') return Chasonx.Hint.Faild('请输入Key值');
						
						var data = {'targetGuid':Serv.scol.guid,'key':key,'value':value.replace(/[\r\n]/ig,''),'type':type};
						if(type == 2) data['id'] = _id;
						Serv.paraMap.exec(data);
					}
				});
				
				 ChasonxDom.draw({
					  id : 'customerParaMap',
					  item : [
					          	{text:'&nbsp;',type:'br',info:'&nbsp;'},
					          	{text:'键名称:',type:'input',name : 'fparakey',value : (map.fkey || '') , attr : ' maxlength=50 '},
					          	{text:'输入值:',type:'textarea',name : 'fparavalue',value : (map.fvalue || '') ,attr : '  rows="13"'},
					          ]
				 });
			},
			exec : function(data){
				getAjaxData(DefConfig.Root + '/main/column/setParaValue',data,function(d){
					d = ~~d;
					if(d == 1){
						Chasonx.Hint.Success('参数已保存');
						Serv.paraMap.showPan.Hide();
						Serv.paraMap.list(Serv.scol.guid);
					}else if(d == 0){
						Chasonx.Hint.Faild('保存失败');
					}else if(d == 2){
						Chasonx.Hint.Faild('该Key已经被使用了');
					}
				});
			},
			del : function(){
				var _cb = $("input[type='checkbox'][name='customerPara']:checked");
				if(_cb.size() == 0) return Chasonx.Hint.Faild('未选择任何参数选项');
				Chasonx.Alert({
					alertType : 'warning',
					html : '确定删除吗？',
					modal : true,
					success : function(){
						getAjaxData(DefConfig.Root + '/main/column/removeValue',{'id':_cb.val()},function(d){
							if(~~d > 0){
								Chasonx.Hint.Success('参数已删除');
								Serv.paraMap.list(Serv.scol.guid);
							}else{
								Chasonx.Hint.Faild('删除失败');
							}
						});
						
						return true;
					}
				});
			}
		}
};

window.onload = function(){
	Chasonx.Frameset({
		main   : 'mainPanel',
		window : {
			top  : {id : 'topPanel' ,height : '68px',bgColor:false,border:false},
			left : {id : 'leftPanel',width : '0%',bgColor:false,border:false},
			right: {id : 'rightPanel',bgColor:false,border:false}
			}
	});
	
	Chasonx.DragBox({
		target : 'rightPanel',
		lineColor : '#ADADAD',
		items : [
		         {id : 'dragLeft',width : '15'},
		         {id : 'dragCenter' ,width : '15'},
		         {id : 'dragRight',width : '70'}
		        ]
	});
	
	Serv.siteList();
	Serv.areaList();
	
	$("#addShortMess").bind('click',function(){
		var mess = $("#shortMess").val().trim();
		if(mess != ''){
			$("#columnMess").append('<div><font>'+ mess +'</font><span>×</span></div>');
			$("#shortMess").val('');
		}
	});
	$("#columnMess > div > span").live('click',function(){
		$(this).parent().remove();
	});
	
	$("#bindImagePanel > div > span > p").live('click',function(){
		$(this).parent().parent().remove();
	});
	
	$("#unrelation").live('click',function(){
		Chasonx.Alert({
			alertType:'warning',
			html : '确定解除关联吗?',
			success : function(){
				var data = {'id':$("#fid").val(),'frelationsiteguid':'','frelationcolguid':'','frelationdefname':'','type':2};
				Serv.exec(data);
				return true;
			},
			modal : true
		});
	});
	
	$("#setrelationLevel").live('click',function(){
		var isChild = $(this).attr('data');
		Chasonx.Alert({
			alertType:'warning',
			html : '确定设置关联栏目为' + (isChild == 0?'子栏目':'同级栏目') + '吗',
			success : function(){
				var data = {'id':$("#fid").val(),'frelatitonischid':(isChild == 0?1:0),'type':2};
				Serv.exec(data);
				return true;
			},
			modal : true
		});
	});
	
	$("#uparaMaps > .Items").live('click',function(){
		$("input[type='checkbox'][name='customerPara']").attr('checked',false);
		$(this).find('input[type="checkbox"]').attr('checked',true);
	});
	
/*	$("#columnType").bind('change',function(){
		$(".colType").hide();
		$("tr[class='colType " + $(this).val()+"']").show();
	});*/
};