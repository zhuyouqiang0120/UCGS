
/**
*WorkFlow Test
*/
Chasonx.WorkFlow = {
	   move : false,
	   canvas : null,
       ctx : null,
       chooseIdx : 0,
       attr : {
       	   defWidth : 100,
       	   defHeight: 35,
       	   defRadius: 5,
       	   itemBg : '#09b2ef',
       	   actItemBg : '#f99d09',
       	   focusItemBg : '#80cbf7',
       	   actfocusItemBg : '#f9c763',
       	   fontColor : '#FFFFFF',
       	   select : 'width: 100%;font-size: 15px;height: 30px;border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;'
       },
       itemsContainer : [],
       target : null,
       _chasonx : null,
	   init : function(id){
	   	   this.canvas = document.getElementById(id);
	   	   this.ctx = this.canvas.getContext('2d');
	   	   this._chasonx = new Chasonx();
	   	   var winSize = ChasonTools.getWindowSize();

	   	   WorkFlowDrag(this.canvas);
	   	   this.canvas.addEventListener('click',function(evt){
	   	   		evt = evt || window.event;
				var position = Chasonx.WorkFlow.getPosition(evt);
				chooseTarget(position[0],position[1]);
				showDetail();
	   	   },false);

	   	   var _this = this;
	   	   this.canvas.oncontextmenu = function(e){ return false;};
	   	   this.canvas.addEventListener('mouseup',function(evt){
	   	   		evt = evt || window.event;
	   	   		if(evt.button == 2){
	   	   			var position = Chasonx.WorkFlow.getPosition(evt),_mouse = Chasonx.ContextMenu.mouseCoords(evt),X,Y;
	   	   			X = (_mouse.x - 50);
					Y = (_mouse.y - 50);
					if((winSize[2] - X) < 200) X -= 200;

	   	   			chooseTarget(position[0],position[1]);

	   	   			if(Chasonx.WorkFlow.target == null) return;
	   	   			
	   	   			var contextMenu = $e("_chasonxWorkFlowContextMenuPanel_");
	   	   			if(contextMenu != null) ChasonTools.RemoveEle(contextMenu);

	   	   			contextMenu = ChasonTools.createEle({type:'div',css:Chasonx.ContextMenu.attr.css.items + 'left:' + X + 'px;top:' + Y + 'px;'});
					contextMenu.setAttribute('id','_chasonxWorkFlowContextMenuPanel_');
					contextMenu.oncontextmenu = function(e){return false;};

					var _items = _this.itemsContainer,item;
					var _menuItems = [{text:'<font color="#fff">清除连线</font>',todo:function(){ Chasonx.WorkFlow.clearLine();ChasonTools.RemoveEle(contextMenu); }},
									  {hr:true},
									  {text:'<select id="_chasonxWorkFlowChildMenuNode_" style="'+ _this.attr.select +'"></select>'},
									  {text:'<font color="#fff">关闭</font>',todo : function(){ ChasonTools.RemoveEle(contextMenu);}}];
					
					for(var i = 0,len = _menuItems.length;i < len;i++){
						if(_menuItems[i].hr){
							item = ChasonTools.createEle({type:'div',css:Chasonx.ContextMenu.attr.css.hr});
						}else{
							item = ChasonTools.createEle({type:'div',css:Chasonx.ContextMenu.attr.css.item});
						 	item.innerHTML =  '<div style="'+ Chasonx.ContextMenu.attr.css.icon +'"></div><div style="'+ Chasonx.ContextMenu.attr.css.text +'">'+ _menuItems[i].text +'</div>';
							
							ChasonTools.addEventHandler(item,'mouseover',function(){	
								this.setAttribute('style', Chasonx.ContextMenu.attr.css.item + Chasonx.ContextMenu.attr.css.itemhover);
							});

							ChasonTools.addEventHandler(item,'mouseout',function(){
								this.setAttribute('style', Chasonx.ContextMenu.attr.css.item);
							});
							if(typeof(_menuItems[i].todo) == 'function')	ChasonTools.addEventHandler(item,'click',_menuItems[i].todo);
						}
						contextMenu.appendChild(item);
					}

					ChasonTools.AppendToBody(contextMenu);
					Chasonx.WorkFlow._chasonx.Show(contextMenu);

					var option_html = '<option value="">---选择节点---</option>',selectObj = $e('_chasonxWorkFlowChildMenuNode_');

					for(var i = 0;i < _this.itemsContainer.length;i++){
						if(i != Chasonx.WorkFlow.chooseIdx)
							option_html += '<option value="'+ i +'">'+ _this.itemsContainer[i].S +'</option>';
					}
					selectObj.innerHTML = option_html;
					ChasonTools.addEventHandler(selectObj,'change',function(){
						if(this.value != ''){
							CheckLineArray(~~this.value);
							ChasonTools.RemoveEle(contextMenu);
							Chasonx.WorkFlow.reflash();
						}
					});
	   	   		}
	   	   },false);

	   	   Logger.s('Canvas init complete');
	   },
	   addItem : function(T){
	   	   try{
	   		var item = document.createElement('canvas'),itemCtx = item.getContext('2d'),_bgcolor = T == 1?this.attr.itemBg:this.attr.actItemBg,
	   		_bgText = T == 1?'新建步骤':'新建动作';
	   		item.setAttribute('width',this.attr.defWidth + this.attr.defRadius*2);
	   		item.setAttribute('height',this.attr.defHeight + this.attr.defRadius*3);
	   		item.setAttribute('draggable',true);

	   		var _itemData = {C : _bgcolor,X : 10,Y : 10, S : _bgText, Type : T ,Remark : '',L : []};
	   		this.drawIitem(itemCtx,_itemData);
			this.ctx.drawImage(item,10,10);

			_itemData.I = item;
			this.itemsContainer.push(_itemData);
			Logger.s('Item add complete');
			}catch(e){
				Logger.e(e);
			}
	   },
	   updateItem : function(){
		    if(this.itemsContainer.length == 0) return;
	   		this.itemsContainer[this.chooseIdx].S = $e('wf_name').value;
	   		this.itemsContainer[this.chooseIdx].Remark = $e('wf_remark').value;
	   		this.reflash();
	   },
	   removeItem : function(){
	   		if(this.target == null) return;
	   		this.itemsContainer.splice(this.chooseIdx,1);
	   		this.chooseIdx = null;
	   		this.target = null;
	   		this.move = false;
	   		this.reflash();
	   },
	   drawIitem : function(itemCtx,option,focusBg){
	   		itemCtx.fillStyle = focusBg || option.C;
	   		itemCtx.shadowBlur = 4;
	   		itemCtx.shadowColor = 'black';
	   		DrawRdius(itemCtx,this.attr.defWidth,this.attr.defHeight,this.attr.defRadius);
			itemCtx.fill();

			itemCtx.beginPath();
			itemCtx.fillStyle = this.attr.fontColor;
			itemCtx.font = '15px 微软雅黑';
	   		itemCtx.textAlign = 'center';
	   		itemCtx.textBaseline = 'middle';
	   		itemCtx.fillText(option.S,this.attr.defWidth/2 + this.attr.defRadius, this.attr.defHeight/2 + this.attr.defRadius);
	   },
	   clearLine : function(){
	   		this.itemsContainer[this.chooseIdx].L = [];
	   		this.reflash();
	   },
	   lineToItem : function(i,itemCtx,X,Y,W,H,L){
	   		var targetItem,toX,toY,angle,arrow_r_X,arrow_r_Y,arrow_l_x,arrow_l_y,_x,_y;

	   		for(var idx = 0;idx < L.length;idx++){

	   			_x = X + W/2;
	   			_y = Y;
		   		targetItem = Chasonx.WorkFlow.itemsContainer[L[idx]];
		   		if(!targetItem) break;

		   		toX = targetItem.X + targetItem.I.width/2;
		   		toY = targetItem.Y;

		   		if(_y > (targetItem.Y + targetItem.I.height)) toY = targetItem.Y + targetItem.I.height;
		   		else if((_y + H) >= targetItem.Y && _y <= (targetItem.Y + targetItem.I.height)){
		   			toY = targetItem.Y + targetItem.I.height/2;
		   			_y = Y + H/2;

		   			if(X > (targetItem.X + targetItem.I.width)){
		   				_x = X;
		   				toX = targetItem.X + targetItem.I.width;
		   			} 
		   			if((X + W) < targetItem.X){
		   				_x = X + W;
		   				toX = targetItem.X;
		   			} 
		   		} 
		   		else _y += Chasonx.WorkFlow.itemsContainer[i].I.height;


		   		angle = ~~(Math.atan2(toY - _y,toX - _x)/Math.PI*180);
		   		arrow_r_X = toX - parseInt(10 * Math.cos(Math.PI/180*(angle - 30)));
				arrow_r_Y = toY - parseInt(10 * Math.sin(Math.PI/180*(angle - 30)));
				arrow_l_x = toX - parseInt(10 * Math.cos(Math.PI/180*(angle + 30)));
				arrow_l_y = toY - parseInt(10 * Math.sin(Math.PI/180*(angle + 30)));

		   		itemCtx.beginPath();
		   		itemCtx.moveTo(_x,_y);
		   		itemCtx.strokeStyle = '#5f635a';
		   		itemCtx.lineWidth = 2;
		   		itemCtx.lineTo(toX,toY);
		   		itemCtx.lineTo(arrow_r_X,arrow_r_Y);
		   		itemCtx.moveTo(toX,toY);
		   		itemCtx.lineTo(arrow_l_x,arrow_l_y);
		   		itemCtx.stroke();
	   		}
	   },
	   reflash : function(){
	   		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	   		var _ctx,_canvas,_item;
	   		for(var i = 0;i < this.itemsContainer.length;i++){
	   			_item = this.itemsContainer[i];
	   			_canvas = _item.I;
	   			_ctx = _canvas.getContext('2d');
	   			_ctx.clearRect(0,0,_canvas.width,_canvas.height);
	   			_ctx.fillStyle = _item.C;
	   			DrawRdius(_ctx,this.attr.defWidth,this.attr.defHeight,this.attr.defRadius);
	   			_ctx.fill();
	   			_ctx.beginPath();
				_ctx.fillStyle = this.attr.fontColor;
				_ctx.font = '15px 微软雅黑';
	   			_ctx.textAlign = 'center';
	   			_ctx.textBaseline = 'middle';
	   			_ctx.fillText(this.itemsContainer[i].S,this.attr.defWidth/2 + this.attr.defRadius, this.attr.defHeight/2 + this.attr.defRadius);

	   			this.ctx.drawImage(this.itemsContainer[i].I,this.itemsContainer[i].X,this.itemsContainer[i].Y);
	   			if(_item.L.length > 0)	this.lineToItem(i,this.ctx,_item.X,_item.Y,_canvas.width,_canvas.height,_item.L);
	   		}	
	   },
	   getPosition : function(evt){
	   		var bRect = this.canvas.getBoundingClientRect();
	   		return [evt.clientX-bRect.left,evt.clientY-bRect.top];
	   }
	};

function DrawRdius(ctxz,w,h,r){
	ctxz.beginPath();
	ctxz.moveTo(2*r,r);
	ctxz.lineTo(w,r); 
	ctxz.arcTo(w + r,r,w + r,r * 2,r); 
	ctxz.lineTo(w + r,h + r);
	ctxz.arcTo(w + r,h + r*2,w,h + r*2,r);
	ctxz.lineTo(2*r,h + r*2);
	ctxz.arcTo(r,h + 2*r,r,h + r,r);
	ctxz.lineTo(r,h);
	ctxz.arcTo(r,r,2*r,r,r);
}

function CheckLineArray(idx){
	var lines = Chasonx.WorkFlow.target.L,add = true;
	
	for(var i = 0;i < lines.length;i++){
		if(lines[i] == idx){
			add = false;
			break;
		} 
	}
	if(add)	Chasonx.WorkFlow.itemsContainer[Chasonx.WorkFlow.chooseIdx].L.push(idx);
}

/**
*选择被选取的canvas对象
*/
function chooseTarget(evtX,evtY){
	var items = Chasonx.WorkFlow.itemsContainer,
	    ctx = Chasonx.WorkFlow.ctx,
	    canvas = Chasonx.WorkFlow.canvas,
	    itemCtx,_w,_h,_canv,focus = false;
	ctx.clearRect(0,0,canvas.width,canvas.height);
	for(var i = items.length - 1; i >= 0 ; i--){
		_canv = items[i].I;
		itemCtx = _canv.getContext('2d');
		itemCtx.clearRect(0,0,_canv.width,_canv.height);
		_w = evtX - items[i].X,_h = evtY - items[i].Y;
		if(_w > 0 && _h > 0 && _w  <= _canv.width && _h <= _canv.height && !focus){

			Chasonx.WorkFlow.drawIitem(itemCtx,items[i],items[i].Type == 1?Chasonx.WorkFlow.attr.focusItemBg:Chasonx.WorkFlow.attr.actfocusItemBg);

			Chasonx.WorkFlow.target = items[i];
			Chasonx.WorkFlow.move = true;
			Chasonx.WorkFlow.chooseIdx = i;
			focus = true;
		}else{
			itemCtx.lineWidth = 0;
			Chasonx.WorkFlow.drawIitem(itemCtx,items[i]);
		}
		ctx.drawImage(_canv,items[i].X,items[i].Y);

		if(items[i].L.length > 0)	Chasonx.WorkFlow.lineToItem(i,ctx,items[i].X ,items[i].Y,_canv.width,_canv.height,items[i].L);
	}
}
//show 
function showDetail(){
	var tar = Chasonx.WorkFlow.target;

	if(tar == null){
		$e("wf_type").value = '';
		$e("wf_name").value = '';
		$e("wf_x").value = '';
		$e("wf_y").value = '';
		$e("wf_size").value = '';
		$e("wf_remark").value = '';
		return;
	} 

	$e("wf_type").value = tar.Type == 1?'步骤':'动作';
	$e("wf_name").value = tar.S;
	$e("wf_x").value = tar.X;
	$e("wf_y").value = tar.Y;
	$e("wf_size").value = tar.I.width + '*' + tar.I.height;
	$e("wf_remark").value = tar.Remark;
}

function rgbToHex(r,g,b){
		r = r.toString(16);
		g = g.toString(16);
		b = b.toString(16);
		if(r.length == 1) r = '0' + r;
		if(g.length == 1) g = '0' + g;
		if(b.length == 1) b = '0' + b;
		return ("#" + r + g + b).toUpperCase();
	}

var Logger = {
	  s : function(s){
	  	 console.log('%cSuccess :' + s,'color:#10ad0d');
	  },
	  e : function(s){
	  	 console.log('%cError :' + s,'color:#ff0000');
	  }
};

function WorkFlowDrag(O,T){
    T = T || O;
	O.onmousedown = function(evt){
		var d = document,evt = evt || window.event;
        if(evt.button == 2 || Chasonx.WorkFlow.itemsContainer.length == 0) return;
         Chasonx.WorkFlow.target = null;
         Chasonx.WorkFlow.move = false;
       
        if(O.setCapture) {
              O.setCapture();
        }else if(window.captureEvents) {
              window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
        }
	   	   		
	   	var canvas = Chasonx.WorkFlow.canvas;
   		// var bRect = canvas.getBoundingClientRect(); 
   		// var dx = evt.clientX-bRect.left,dy = evt.clientY-bRect.top; 
		//var _imgdata = Chasonx.WorkFlow.ctx.getImageData(dx,dy,1,1).data;
		// var currColor = rgbToHex(_imgdata[0],_imgdata[1],_imgdata[2]); 
		var position = Chasonx.WorkFlow.getPosition(evt);
		chooseTarget(position[0],position[1]);

		if(Chasonx.WorkFlow.target == null) return;

        var _itemsContainer,ctx = Chasonx.WorkFlow.ctx,target = Chasonx.WorkFlow.target.I,_position;
        d.onmousemove = function (evt) {      
        	if(!Chasonx.WorkFlow.move) return;

        	 showDetail();
        	 _position = Chasonx.WorkFlow.getPosition(evt);
			 var dx = _position[0],dy = _position[1];   
			 var tLeft = target.width/2,tTop = target.height/2,left = 0,top = 0;
           	 if((dx - tLeft) > 0) 	left = (dx - tLeft);
           	 if((dx - tLeft) > (canvas.width - target.width)) left = canvas.width - target.width;
           	 if((dy - tTop) > 0) top = (dy - tTop);
           	 if((dy - tTop) > (canvas.height - target.height)) top = canvas.height - target.height;

           	 Chasonx.WorkFlow.target.Y = top;
           	 Chasonx.WorkFlow.target.X = left;

           	 _itemsContainer = Chasonx.WorkFlow.itemsContainer;
           	 ctx.clearRect(0,0,canvas.width,canvas.height);
           	 for(var i = 0;i < _itemsContainer.length;i ++){
           	 	if(_itemsContainer[i].I == target){
           	 		ctx.drawImage(target,left,top);
           	 		Chasonx.WorkFlow.itemsContainer[i].X = left;
           	 		Chasonx.WorkFlow.itemsContainer[i].Y = top;
           	 	}else{
           	 		ctx.drawImage(_itemsContainer[i].I,_itemsContainer[i].X,_itemsContainer[i].Y);
           	 	}

           	 	if(_itemsContainer[i].L.length > 0)	Chasonx.WorkFlow.lineToItem(i,ctx,_itemsContainer[i].X,_itemsContainer[i].Y,_itemsContainer[i].I.width,_itemsContainer[i].I.height,_itemsContainer[i].L);
           	 }
        };
        d.onmouseup = function () {
             if(O.releaseCapture) {
                 O.releaseCapture();
             }else if (window.releaseEvents){
                window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
             }
             d.onmousemove = null;
             d.onmouseup = null;
		};
	};
};
