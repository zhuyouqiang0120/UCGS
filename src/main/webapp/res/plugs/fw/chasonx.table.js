/**
 * automatic table
 * Chasonx.Table({
 * 			id : '', 表格ID，不写默认生成一个ID
 * 			url : '', 请求地址
 * 			data ：{}，请求参数
 * 			dataType ： ‘GET’，请求方式
 * 			dataPanel ：‘’，数据渲染目标ID
 * 			pageSize : 10, 每页数据量
 * 			pageNumber : 0, 页码
 * 			before : fn, 在请求之前改变请求参数
 * 			check : {name:'复选框name',value:'复选框取值属性名',attr:{自定义复选框属性参数},html:''},
 * 			tableNames ： [ 表头属性数组
 * 				{name : '属性名',text : '显示名称',attr:{}td增加额外属性,width : '9%',html : '' 额外显示的html, css : '' 自定的样式,handler ： funciton(){} 渲染数据时的回调
 * 			]
 * });
 * 
 * table.getData(callbackFn,dataFilterFn);
 */
;(function(){
	function table(options){
		this.id = options.id || 'ChasonxTable' + (Math.random() + "").replace('.',''); //tableId
		this.url = options.url; // get data url
		this.data = options.data || {};
		this.dataType = options.dataType || 'GET';
		this.tableNames = options.tableNames || [];
		this.check = options.check || {};
		this.check.name = this.check.name || '';
		this.check.value = this.check.value || '';
		this.check.attr = this.check.attr || {};
		this.check.html = this.check.html || '';
		this.pageSize = options.pageSize || 10;
		this.pageNumber = options.pageNumber || 0;
		this.dataPanel = options.dataPanel;
		this.dataGridUid = 'DataGrid_' + (Math.random() + '').replace('.','');
		this.before = (typeof options.before == 'function'?options.before:null);
		//this.init();
	}
	table.prototype = {
			init : function(){
				this.createTable();
				this.getData();
				return this;
			},
			createTable : function(){
				if(this.tableNames.length == 0) return "";
				var _headSize = 0;
				var table = '<table id="'+ this.id +'" class="tableDefault" width="100%" cellpadding="0" cellspacing="0">\
					         <thead><tr class="trDefault">';
				if(this.check.name != ''){
					table += '<td width="5%">'+ (this.check.html || '') +'<input id="CK_'  +this.dataGridUid+ '" type="checkbox" title="反选/全选" onclick="TableselectAll(this,\''+ this.check.name +'\')"/></td>';
					_headSize += 1;
				}
				table += '<td width="5%">编号</td>';
				_headSize += 1;
				
				this.each(this.tableNames,function(i,u){
					table += '<td width="'+ u.width +'" style="'+ (u.css || '') +'">'+ (u.html || '') + u.text +'</td>';
					_headSize += 1;
				});
				table += '</tr></thead>\
						  <tbody id="'+ this.dataGridUid +'"></tbody>\
					      </table>';
				table += '<div id="Page_'+ this.dataGridUid +'"></div>';
				this.$(this.dataPanel).innerHTML = table;
				this.headSize = _headSize;
				return this;
			},
			getData : function(fn,dataFilter){
				var _this = this;
				Chasonx.Wait.Show();
				Chasonx.Ajax({
					 url:this.url,
					 PageNumber:this.pageNumber,
					 PageSize:this.pageSize,
					 data :this.data,
					 before : _this.before,
					 success : function(d){	
						 if(typeof dataFilter == 'function') d = dataFilter(d);
						 
 						 Chasonx.Page.init('Page_' + _this.dataGridUid,d.totalRow,_this.pageSize,1,this,function(d){ _this.drawDataGrid(d,dataFilter); });
						 _this.drawDataGrid(d);
						 Chasonx.Wait.Hide();
						 if(typeof fn == 'function') fn(d);
					 },
					 error:function(e){
					    Chasonx.Hint.Faild(e);
					 	Chasonx.Wait.Hide();
					 }
				});
				return this;
			},
			drawDataGrid : function(data , dataFilter){
				if(typeof dataFilter == 'function') data = dataFilter(data);
				var line = '',_this = this,_temp,n,handler;
				this.each(data.list,function(i,u){
					line += '<tr class="dataGridTr" '+ (_this.check.name != ''?'onclick="TablesetTrFocus(this,\''+ _this.check.name +'\',\'CK_'+ _this.dataGridUid +'\')"':'') +'>';
					if(_this.check.name != ''){
						line += '<td><input  type="checkbox" name="'+ _this.check.name +'" value="'+ u[_this.check.value] +'" ';
						for(var xx in _this.check.attr) line += xx + '="'+ u[_this.check.attr[xx]] +'" ';
						line += ' idx="'+ i +'"/></td>';
					}
					line += '<td>' + ((data.pageNumber - 1)*data.pageSize + i + 1) + '</td>';
					_this.each(_this.tableNames,function(j,k){
						handler = false;
						if(typeof k.handler == 'function') handler = true;
						if(k.attr){
							line += '<td ';
							for(var sb in k.attr){
								if(k.attr[sb].indexOf('#') != -1){
									k.attr[sb] = k.attr[sb].split("#");
									line += sb + '="' + k.attr[sb][0] + u[k.attr[sb][1]] + '" ';
								}else{
									line += sb + '="'+ k.attr[sb] +'" ';
								}
							}
							line += ' >';
						}else{
							line += '<td>';
						}
						if(k.name.indexOf("|") != -1){
							_temp = k.name.split('|');
							for(n = 0;n < _temp.length;n++){
								line += handler?k.handler( u[_temp[n]],u):u[_temp[n]];
								if(n < (_temp.length - 1)) line += '/';
							}
						}else{
							line += handler? k.handler(u[k.name],u):u[k.name];
						}
						line += '</td>';
					});
					line += '</tr>';
				});
				if(data.list.length == 0) line = '<tr class="dataGridTr"><td colspan="'+ this.headSize +'" align="center">暂无数据</td></tr>';
				this.$(this.dataGridUid).innerHTML = line;
			},
			unCheck : function(){
				with(this){
					$("CK_" + dataGridUid).checked = false;
				}
			},
			each : function(data,callback){
				if(!(data instanceof Array)) return;
				for(var i = 0,len = data.length;i < len;i++){
					if(typeof callback == 'function'){
						if(callback(i,data[i]) == false) break;
					}
				}
			},
			$ : function(id){
				return document.getElementById(id);
			}
	};

	function TablesetTrFocus(obj,name,pid,E){
		E = E || window.event;
		var target = E.target;
		
		if(target.type == 'checkbox'){
			$(target).parent().parent().attr('class',$(target).attr('checked')?'dataGridTrFocus':'dataGridTr');
		}else{
			$(".dataGridTrFocus").removeClass().addClass('dataGridTr');
			$("input[type='checkbox'][name='"+ name +"']").attr('checked',false);
			var $cb = $(obj).find("input[type='checkbox'][name='"+ name +"']");
			$cb.attr('checked',!$cb.attr('checked'));
			$(obj).removeClass().addClass($cb.attr('checked')?'dataGridTrFocus':'dataGridTr');
		}
		if($("input[type='checkbox'][name='"+ name +"']:checked").size() == $("input[type='checkbox'][name='"+ name +"']").size()) $("#" + pid).attr('checked',true);
		else $("#" + pid).attr('checked',false);
	}

	function TableselectAll(obj,name){
		$("input[type='checkbox'][name='"+ name +"']").attr('checked',obj.checked).each(function(){$(this).parent().parent().removeClass().addClass(obj.checked?'dataGridTrFocus':'dataGridTr');});
	}
	
	window.Chasonx.Table = function(options){
		return new table(options);
	};
	window.TablesetTrFocus = TablesetTrFocus;
	window.TableselectAll = TableselectAll;
	
})(window);