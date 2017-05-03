/**
*TableResizable 20170223
*Chasonx.TableResizable(id);
*/
;(function(window){
	function resizable(ID){
		this.id = ID;
		this.init();
	}
	resizable.prototype = {
		init : function(){
			this.table = document.getElementById(this.id);
			if(this.table == undefined) return ;
			if(this.table.rows.length == 0) return;

			this.tableLeft = this.getOffsetLeft( this.table);
			this.Row = this.table.rows[0];
			for(var i = 0,len = this.Row.cells.length;i < len;i ++){
				this.Row.cells[i].oldWidth = this.Row.cells[i].clientWidth;	
				if(i < (len - 1)) this.cellBind(this.Row.cells[i],this.Row.cells[i + 1]);
			}
		},
		cellBind : function(Cell){
			var _this = this,D = document,currentTd = null;
			var _move = function(E){
				E = E || window.event;
				if((Cell.clientWidth - E.offsetX) <= 4){
					Cell.style.cursor = 'col-resize';
					_this.tdDrag = true;
				}else{
					Cell.style.cursor = 'default';
					_this.tdDrag = false;
				} 
			};

			Cell.onmousedown = function(){
				if(_this.tdDrag == true){	
					var _temp = 0,_c_x,nidx;
					Chasonx.BodySelection(false);
					D.onmousemove = function(_E){
						_E = _E || window.event;
						_temp = 0;
						nidx = -1;	
						
						for(var i = 0,leng = _this.Row.cells.length;i < leng ; i++){			
							if(i >= (leng - 1))  break;
							if(_this.Row.cells[i] == Cell){
								_c_x  = (i == 0?_E.x - _this.tableLeft: _E.x - _this.tableLeft - _temp);
								if(_c_x > 10 && _c_x < (Cell.oldWidth + _this.Row.cells[i + 1].oldWidth - 10)){
								 	Cell.width = _c_x;
								 	nidx = i + 1;
								 	_this.Row.cells[nidx].width = _this.Row.cells[nidx].oldWidth + ( Cell.oldWidth - _c_x);
								 }
							}else{
								_temp += _this.Row.cells[i].oldWidth;
								if(i != nidx) _this.Row.cells[i].width = _this.Row.cells[i].clientWidth;
							} 
						}	
					};
				}
			};
			D.onmouseup = function(E){
				D.onmousemove = null;
				Chasonx.BodySelection(true);
				for(var i = 0,len = _this.Row.cells.length;i < len;i ++)
					_this.Row.cells[i].oldWidth = _this.Row.cells[i].clientWidth;	
			};

			Cell.onmousemove = _move;
		},
		getOffsetLeft : function(e){
			 var offset=e.offsetLeft; 
			 if(e.offsetParent !=null){
				 if(e.offsetParent.scrollLeft) offset -= e.offsetParent.scrollLeft;
				 offset += this.getOffsetLeft(e.offsetParent); 
			 }
			 return offset; 
		 }
	};

	window.Chasonx.TableResizable = function(id){
		return new resizable(id);
	};
})(window);