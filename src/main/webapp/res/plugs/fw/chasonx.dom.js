/*ChasonxDom.draw({
			  id : 'sitePanel',
			  item : [
			      {text:'用户名:',name:'aa',type:'input',attr : ' data = "" req = "true" ',value : '',,info:'5-6个字符',handler:{
			    	  type : 'click',
			    	  event : function(){
			    		  alert(11);
			    	  }
			        }
			      },
			      {text:'密码:',name:'aa',type:'input'},
			      {text:'邮箱:',name:'ccc',type:'input'},
			      {text:'拿吗:',name:'dddd',type:'select',options : [{v:'1',t :'管理员'},{v:'2',t :'看看'},{v:'3',t :'可i港交所'}]},
			      {text:'点点滴滴:',name:'eeee',type:'textarea',handler:{
			    	  type : 'click',
			    	  event : function(){
			    		  alert(11);
			    	  }
			        }},
			      {text:'确定:',name:'rrrr',type:'radio',options: [{v:'2',t:'可以'},{v:'3',t:'不可以'}],handler:{
			    	  type : 'click',
			    	  event : function(){
			    		  alert(11);
			    	  }
			        }},
			      {text:'操蛋:',name:'cccao',type:'checkbox',options:[{v:'1',t:'国家'},{v:'2',t:'地区'},{v:'3',t:'人文'}],handler:{
			    	  type : 'click',
			    	  event : function(){
			    		  alert(11);
			    	  }
			        }}
			  ]
		  });
*/

var ChasonxDom = {
		  draw : function(opt){
			var line = '';
			if(opt.item && opt.item.length > 0){
				var _item;
				for(var i = 0;i < opt.item.length;i ++){
					_item = opt.item[i];
					line += '<div class="domPanelBox"><domItem>'+ _item.text +'</domItem>';
					
					if(_item.type == 'input'){
						_item.atype = _item.atype || 'text';
						line += '<domItem><input type="'+ _item.atype +'" id="'+ _item.name +'" name="'+ _item.name +'" '+ (_item.attr || '') +' value="' +(_item.value || '')+ '" class="inputText"/>'+ (_item.info || '') +'</domItem>';
					}else if(_item.type == 'select'){
						line += '<domItem><select id="'+ _item.name +'" name="'+ _item.name +'" '+ (_item.attr || '') +' class="inputText select">';
						if(_item.options && _item.options.length > 0){
							var op = '';
							for(var o = 0;o < _item.options.length;o++){
								op += '<option value="'+ _item.options[o].v +'" '+ ((_item.value || '') == _item.options[o].v?'selected="selected"':'') +'>'+ _item.options[o].t +'</option>';
							}
							line += op;
						}
						line += '</select>'+ (_item.info || '') +'</domItem>';
					}else if(_item.type == 'textarea'){
						line += '<domItem><textarea id="'+ _item.name +'" name="'+ _item.name +'" '+ (_item.attr || '') +' class="inputText textarea">'+ (_item.value || '') +'</textarea>'+ (_item.info || '') +'</domItem>';
					}else if(_item.type == 'radio'){
						line += '<domItem>';
						if(_item.options && _item.options.length > 0){
							var op = '';
							for(var o = 0;o < _item.options.length;o++){
								op += '<input type="radio" name="'+ _item.name +'" '+ (_item.attr || '') +' value="'+ _item.options[o].v +'" '+ ((_item.value || '') == _item.options[o].v?'checked="checked"':'') +'/>' + _item.options[o].t + '&nbsp;&nbsp;';
							}
							line += op;
						}
						line += '</domItem>';
					}else if(_item.type == 'checkbox'){
						line += '<domItem>';
						if(_item.options && _item.options.length > 0){
							var op = '';
							for(var o = 0;o < _item.options.length;o++){
								op += '<input type="checkbox" name="'+ _item.name +'" '+ (_item.attr || '') +' value="'+ _item.options[o].v +'" '+ ((_item.value || '') == _item.options[o].v?'checked="checked"':'') +'/>' + _item.options[o].t + '&nbsp;&nbsp;';
							}
							line += op;
						}
						line += '</domItem>';
					}else if(_item.type == 'time'){
						line += '<domItem><input id="'+ _item.name +'" name="'+ _item.name +'" '+ (_item.attr || '') +' value="'+ (_item.value || '') +'" type="text" onclick="WdatePicker({dateFmt:\''+ (_item.dateFormat || 'yyyy-MM-dd') +'\',realFullFmt:\'%Date\'})" class="inputText Wdate"/></domItem>';
					}else if(_item.type == 'br'){
						line += '<domItem style="font-size:15px;padding-top:3px;">'+ (_item.info || '') +'</domItem>';
					}else{
						line += '<domItem>'+ (_item.info || '') +'</domItem>';
					}
					
					line += '</div>';
				}
			}
			$e(opt.id).innerHTML = line;
			this.bindHandler(opt);
		},
		bindHandler : function(opt){
			if(opt.item && opt.item.length > 0){
				for(var i = 0;i < opt.item.length;i++){
					if(opt.item[i].handler){
						if(opt.item[i].type == 'input' || opt.item[i].type == 'select' || opt.item[i].type == 'textarea'){
							ChasonTools.addEventHandler($e(opt.item[i].name),opt.item[i].handler.type,opt.item[i].handler.event);
						}else if(opt.item[i].type == 'radio' || opt.item[i].type == 'checkbox'){
							var eles = document.getElementsByTagName('input');
							for(var e = 0,elen = eles.length;e < elen;e++){
								if((eles[e].type == 'radio' || eles[e].type == 'checkbox') && eles[e].name == opt.item[i].name){
									ChasonTools.addEventHandler(eles[e],opt.item[i].handler.type,opt.item[i].handler.event);
								}
							}
						}
						
					}
				}
			}
		}
};