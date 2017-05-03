/**
*站点数据绑定
*/

var SiteBinder = {
		limit : 6,
		bindLimit  : 5,
		bindGuids : '',
		wSize  : ChasonTools.getWindowSize(),
		_currentSiteData : {},
		bindLimit : false,
		relation : {
			show : function(){
				SiteBinder.dialog(1);
				SiteBinder.bindLimit = false;
			}
		},
		bind : {
			show : function(){
				SiteBinder.dialog(2);
				SiteBinder.bindLimit = true;
			}
		},
		drawItem : function(_start){
			getAjaxData(DefConfig.Root + '/main/site/sitelist',{'PageNumber':_start * this.limit,'PageSize':this.limit,'del':0},function(d){
				var ht = '',cht = '',_text;
				$("#siteDragMain89List").html('');
				$.each(d.list,function(i,u){
					_text = u.fsitename + (u.ftype == 'normal'?'[常规]':'[公共]');
					ht += '<div onclick="'+ (u.fguid != SiteBinder._currentSiteData.fguid?'SiteBinder.addToChoose(this)':'') +'" guid="'+ u.fguid +'">'+ _text +'<span></span></div>';
				});
				$("#siteDragMain89List").html(ht);
				var pageCtrl = '<a class="ucgsBtn_A'+ (_start == 0?' ucgsBtn_A_blur':' ucgsBtn_A_focus') +'" onclick="'+ (_start > 0?'SiteBinder.drawItem('+ (_start - 1) +');':'void(0);') +'">上一页</a>\
								<a class="ucgsBtn_A'+ (_start == (d.totalPage - 1)?' ucgsBtn_A_blur':' ucgsBtn_A_focus') +'" onclick="'+ (_start < (d.totalPage - 1)?'SiteBinder.drawItem('+ (_start + 1) +');':'void(0);') +'">下一页</a>';
				$("#siteDragMain89Btn").html(pageCtrl);
			});
		},
		addToChoose : function(E){
			E = $(E);
			var G = E.attr('guid');
			if(this.bindGuids.indexOf(G) != - 1) return  Chasonx.Hint.Faild('已添加该站点');
			if(this.bindLimit == true){
				this.bindGuids = G;
				$("#siteDragMain89ChooseList").html('');
			}else{
				this.bindGuids += G + ',';
			}
			this.drawExisItem(G,E.text());
		},
		drawExisItem : function(G,Text){
			var ht = '<div guid="'+ G +'">'+ Text +'<font onclick="SiteBinder.removeChoose(this)">删除</font></div>';
			$("#siteDragMain89ChooseList").append(ht);
		},
		removeChoose : function(E){
			var P = $(E).parent();
			this.bindGuids = this.bindGuids.replace(P.attr('guid') + (this.bindLimit == true?'':','),'');
			P.remove();
		},
		dialog : function(T){
			this.bindGuids = '';
			SiteList.choose(function(_site){
				UCGS_DAO.getRecord({id : _site.val(),modelName : 'Site'},function(d){
					SiteBinder._currentSiteData = d;
					SiteBinder.bindGuids = (d.fbindsitetype == T?(d.fbindsiteguid || ''):'');
				    var w = SiteBinder.wSize[2]*0.5,h = SiteBinder.wSize[3]*0.8;
				    w = w < 400?400:w;
				    h = h < 300?300:h;
					new Chasonx({
						title : (T == 1?'站点关联':'站点绑定') + '  <span style="font-weight:normal;color:#8e8c88;">当前选择站点: ' + SiteBinder._currentSiteData.fsitename + '</span>',
						html : '<div id="siteBindPanelx99" style="height:100%;"></div>',
						width : w,height : h,
						modal : true,
						success : function(){
							//if(SiteBinder.bindGuids == '') return Chasonx.Hint.Faild('未添加站点');
							Chasonx.Alert({
								alertType : 'warning',
								html : '确定继续执行吗？',
								modal : true,
								success : function(){
									UCGS_DAO.modify({id : SiteBinder._currentSiteData.id,fbindsiteguid : SiteBinder.bindGuids,fbindsitetype : (SiteBinder.bindGuids == ''?0:T) ,modelName : 'Site'});
									return true;
								}
							});
						}
					});
					ChasonTools.delayRun(function(){
						  var css = "padding-top:6px;color:#d4831c;padding-left:10px;";
						  var tipStr = '<i class="icon_tip"></i>提示：<b>站点关联</b>为在原站点基础上额外展示被关联站点的信息，<b>站点绑定</b>为只展示被绑定站点信息.<br>\
							  			<i class="icon_tip"></i>提示：支持<b>关联</b>多个站点信息，仅支持站点<b>绑定</b>单个站点信息.<br>\
							  			<i class="icon_tip"></i>提示：站点只能<b>关联</b> 或 <b>绑定</b>其他站点信息.<br>\
							  			<i class="icon_tip"></i>提示：站点<b>关联</b>或<b>绑定</b>可能会降低系统性能.';
						  var tdDiv = '<div id="siteBindDragMain89">\
							  		   <div id="siteDragMain89Left">\
							  			 <div id="siteDragMain89List" class="siteDragMain89List"></div>\
							  			 <div id="siteDragMain89Btn"></div></div>\
							  		   <div id="siteDragMain89Center"><span class="badge badge_blue" style="position:relative;left:24%;top:40%;">'+ (T == 1?'已关联 ›':'已绑定 ›') +'</span></div>\
							           <div id="siteDragMain89Right">\
							  		   <div id="siteDragMain89ChooseList" class="siteDragMain89List"></div></div>\
							  		   </div>';
						  Chasonx.Frameset({
							target : 'siteBindPanelx99',
							window : {
							     top : {id : 'siteBindPanelTop',height:'90px',html : '<div style="'+ css +'">'+ tipStr +'</div>',border:false},
							     left : {id : 'siteBindPanelLeft',width : '100%',html : tdDiv,slide : false}
							}
						  });
						  Chasonx.DragBox({
								target : 'siteBindDragMain89',
								lineColor : '#d0d0d0',
								drag : false,
								items : [
								         {id : 'siteDragMain89Left',width : '40' },
								         {id : 'siteDragMain89Center',width : '20' },
								         {id : 'siteDragMain89Right',width : '40'}
								        ]
							});
						   SiteBinder.drawItem(0);
						   if(!StringHasText(SiteBinder.bindGuids)) return;
						   
						   UCGS_DAO.getRecordList({fguid : '&|in|'+ SiteBinder.bindGuids,modelName : 'Site'},function(d){
								$.each(d.reData,function(i,u){
									SiteBinder.drawExisItem(u.fguid,u.fsitename + (u.ftype == 'normal'?'[常规]':'[公共]'));
								});
						  });
					});
				});
		   });
		},
		exec : function(data){
			getAjaxData(DefConfig.Root + '/main/unifyFX/modifyData',data,function(d){
				if(d.result) Chasonx.Hint.Success('处理成功');
				else Chasonx.Hint.Faild('处理失败：' + d.msg);
			});
		}
};