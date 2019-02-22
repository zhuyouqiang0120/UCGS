
var Area = {
		html : '',
		areaData : null,
		currArea : null,
		add : function(T){
			if(T == 2 && this.currArea == null) return Chasonx.Hint.Faild('区域未选中');
			new Chasonx({
				title : (T == 1?'新建':'编辑') + '区域信息',
				html : '<div id="areaPanel" class="global_bg_c"></div>',
				width : 500, height : 360,
				success : function(){
					 if(FormData.requiredByAttr('areaPanel',['input'])){
						 var data = FormData.getFormData('areaPanel',['input','text','select','textarea']);
						 data['type'] = T;
					    if(T == 2) data['id'] = Area.currArea.id;
						Area.exec(data);
						return true;
					 }
				},
				modal : true
			});
			
			var D = this.currArea || {};
			
			 ChasonxDom.draw({
				  id : 'areaPanel',
				  item : [
				      {text:'&nbsp;',type:'br',info:'&nbsp;'},
				      {text:'父区域:',name:'fparentguid',attr:' readonly="readonly" class="inputText textReadyOnly"',type:'input',value : T == 2?D.fparentguid:D.fguid?D.fguid:''},
				      {text:'区域名称:',name:'fname',type:'input',value:T == 2?D.fname:'',attr:' req = "true"'},
				      {text:'分级:',name:'flevel',type:'input',attr : ' readonly="readonly" class="inputText textReadyOnly"',value : D.flevel?D.flevel + 1:'1'},
				      {text:'状态:',name:'fstate',type:'select',value : T == 2?D.fstate: '',options : [{v:'0',t :'正常'},{v:'1',t :'冻结'}]},
				      {text:'备注:',name:'fremark',type:'textarea',value : T == 2?D.fremark: ''},
				      {text:'&nbsp;',type:'br',info:''}
				  ]
			  });
		},
		del : function(){
			if(this.currArea == null) return Chasonx.Hint.Faild('请先选择选项');
			
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定删除 [ ' + this.currArea.fname + ' ]吗？<br>也将删除该节点的所有子节点',
				modal:true,
				height:180,
				success:function(){
					Area.exec({'id':Area.currArea.id,'fguid':Area.currArea.fguid,'type':3});
					return true;
				}
			});
		},
		frozen : function(s){
			if(this.currArea == null) return Chasonx.Hint.Faild('请先选择选项');
			if(this.currArea.fstate == s) return Chasonx.Hint.Faild('当前已是该状态');
			
			Chasonx.Alert({
				alertType : 'warning',
				html : '确定'+ (s == 0?'解除':'设定') +' [ ' + this.currArea.fname + ' ]以及其子节点的限制状态吗？',
				modal:true,
				width:400,
				success:function(){
					Area.exec({'id':Area.currArea.id,'fguid':Area.currArea.fguid,'fstate':s,'type':4});
					return true;
				}
			});
		},
		exec : function(data){
			getAjaxData(DefConfig.Root + '/main/adminarea/modify',data,function(d){
				Chasonx.Hint.Success('操作成功');
				pageInit();
			});
		},
		list : function(panelId,para,callback,check,checkName){
			check = check || false;
			checkName = checkName || 'areaCheckValue';
			Chasonx.Wait.Show('数据加载中....');
			getAjaxData(DefConfig.Root + '/main/adminarea/list',null,function(d){
				Chasonx.Wait.Hide();
				Area.areaData = d;
				Area.draw(d,panelId,para,callback,check,checkName);
			});
		},
		draw : function(data,panelId,para,callback,check,checkName){
			if(data == null)	return $("#" + panelId).html('<div class="areaNoneData">未添加区域信息</div>');
			
			var flag,havaChild,random = ~~(Math.random()*20),baseLevel = this.checkLevel(data),tempLevl = 1 - baseLevel;
			Area.html = '<div class="areaItems" aname="全部" guid=""><span style="width:'+ (para.length > 0?'60%':'98%;min-width:190px;') +'">&nbsp;&nbsp;&nbsp;&nbsp;<span class="areaNodeIcon"></span><label class="anameHandler'+ random +'">全部站点</label></span></div>';
			$.each(data,function(i,u){
				if(u.flevel == baseLevel){
					havaChild = false;
					flag = '<i class="areaBlank"></i><span class="areaChildIcon'+ (u.fstate == 0?'':'ice') +'"></span>';
					if(Area.checkChild(u.fguid,data).length > 0){
						flag = '<i class="node_p node_" onclick="Area.openOrclose(this,'+ u.id +','+ random +')"></i><span class="areaNodeIcon'+ (u.fstate == 0?'':'ice') +'"></span>';
						havaChild = true;
					}
					
					Area.html += '<div class="'+ (u.required && u.required == 'allow'?'areaItems':'areaBan') +'" aname="'+ u.fname +'" guid="'+ u.fguid +'"><span style="width:'+ (para.length > 0?'60%':'98%;min-width:190px;') +'">'+ flag + (check == true?'<input type="checkbox" name="'+ checkName +'" value="'+ u.fguid +'" />':'') + (u.required && u.required == 'allow'?'<label class="anameHandler'+ random +'">' + u.fname + '</label>':u.fname)  + (u.fstate == 1?'<font color="red">权限受限</font>':'') +'</span>'+ Area.drawEle(u, para) +'</div>';
					Area.html += '<div id="areaItem'+ u.id + random +'">';
					if(havaChild) Area.drawChild(data,u.fguid,para,u.flevel,u.id,random,tempLevl,check,checkName);
					Area.html += '</div>';
				}
			});
			
			$("#" + panelId).html(this.html).find('.anameHandler' + random).live('click',function(){
				Area.click(panelId,$(this),callback);
			});
			
		},
		drawChild : function(data,parentGuid,para,level,pid,random,tempLevl,check,checkName){
			var flag,haveChild;
			$.each(this.checkChild(parentGuid,data),function(i,u){
				haveChild = false;
				flag = '<i class="areaBlank" style="margin-left:'+ ((level + tempLevl)*18) +'px;"></i><span class="areaChildIcon'+ (u.fstate == 0?'':'ice') +'"></span>';
				
				if(Area.checkChild(u.fguid,data).length > 0){
					flag = '<i onclick="Area.openOrclose(this,'+ u.id +','+ random +')" class="node_p node_" style="margin-left:'+ ((level + tempLevl )*18) +'px;"></i><span class="areaNodeIcon'+ (u.fstate == 0?'':'ice') +'"></span>';	
					haveChild = true;
				}
				
				Area.html += '<div  class="'+ (u.required && u.required == 'allow'?'areaItems':'areaBan') +'" aname="'+ u.fname +'" guid="'+ u.fguid +'"><span style="width:'+ (para.length > 0?'60%':'98%;min-width:190px;') +'">'+ flag + (check == true?'<input type="checkbox" name="'+ checkName +'" value="'+ u.fguid +'" />':'') + (u.required && u.required == 'allow'? '<label class="anameHandler'+ random +'">' + u.fname + '</label>':u.fname) + (u.fstate == 1?'<font color="red">权限受限</font>':'') +'</span>'+ Area.drawEle(u, para) +'</div>';
				Area.html += '<div id="areaItem'+ u.id + random +'">';
				if(haveChild) Area.drawChild(data,u.fguid,para,u.flevel,u.id,random,tempLevl,check,checkName);
				Area.html += '</div>';
			});
		},
		checkLevel : function(data){
			var minLV = 0;
			$.each(data,function(i,u){
				if(minLV == 0) minLV = u.flevel;
				else if(u.flevel < minLV) minLV = u.flevel;
			});
			return minLV;
		},
		checkChild : function(parentGuid,data){
			var child = [];
			$.each(data,function(i,u){
				if(u.fparentguid == parentGuid){
					child.push(u);
				}
			});
			return child;
		},
		getArea : function(guid){
			var area = {};
			$.each(this.areaData,function(i,u){
				if(u.fguid == guid) {
					area = u;
					return false;
				}
			});
			return area;
		},
		drawEle : function(u,para){
			var _w = ~~(40/para.length);
			var ele = '';
			for(var i = 0;i < para.length;i++){
				ele += '<span style="width:'+ _w +'%;">'+ getString(u[para[i]]) +'</span>';
			}
			return ele;
		},
		click : function(panelId,obj,callback){
			obj = obj.parent().parent();
			$(".areaChoose").html(obj.attr('aname'));
			this.currArea = this.getArea(obj.attr('guid'));
			$("#" + panelId).find("div[class='areaItems areaItemsFocus']").removeClass('areaItemsFocus');
			obj.addClass('areaItemsFocus');
			if(typeof(callback) == 'function') callback();
		},
		openOrclose : function(obj,id,random){
			id = id + '' + random;
			if($("#areaItem" + id).css('display') == 'block'){
				$("#areaItem" + id).slideUp();
				$(obj).removeClass('node_').addClass('node_1');
			}else{
				$("#areaItem" + id).slideDown();
				$(obj).removeClass('node_1').addClass('node_');
			}
		},
		checkAll : function(check,checkName){
			checkName = checkName || 'areaCheckValue';
			$("input[type='checkbox'][name='"+ checkName +"']").attr('checked',check);
		},
		getCheckValus : function(checkName){
			checkName = checkName || 'areaCheckValue';
			var ck = [];
			var cks = $('input[type="checkbox"][name="'+ checkName +'"]:checked');
			if(cks.size() > 0){
				cks.each(function(){
					ck.push(this.value);
				});
			}
			return ck;
		}
};

function pageInit(){
	Area.list('dataGrid',['flevel','addtime','fremark']);
}

