
;(function(window,undefined){
	
	function ChasonxMove(sourObj,tId,callBack,css){
		if(sourObj == undefined || tId == '' || tId == undefined) return;
		this.sourObj = sourObj;
		this.tarId = tId;
		this.css = css || '';
		this.init(callBack);
	}
	
	ChasonxMove.prototype = {
		sourObj : null,
		tarId : null,
		css : null,
		init : function(callBack){
			var e = window.event;
			Chasonx.BodySelection(false);
			var preview = ChasonTools.createEle({type:'div',css:'position:absolute;z-index:1024;display:none;' + (this.css || '')});
			preview.innerHTML = this.sourObj.innerHTML;
			preview.style.width = this.sourObj.offsetWidth + 'px';
			preview.style.height = this.sourObj.offsetHeight + 'px';
			ChasonTools.AppendToBody(preview);
			
			var D = window.document,flag = 10,targetId = this.tarId;
			preview.style.display = "block";
			preview.style.left = (e.pageX + flag) + 'px';
			preview.style.top = (e.pageY + flag) + 'px';
			
			D.onmousemove = function(e){
				e = e || window.event;
				preview.style.left = (e.pageX + flag)  + 'px';
				preview.style.top = (e.pageY + flag) + 'px';
			};
			
			D.onmouseup = function(e){
				e = e || window.event;
				var target = e.target;
				
				Chasonx.BodySelection(true);
				ChasonTools.RemoveEle(preview);
				D.onmousemove = null;
				D.onmouseup = null;
				while(target){
					if(target.id == targetId && typeof(callBack) == 'function'){
						callBack();
						target = null;
					}else{
						target = target.parentNode;
					}
				}
			};
			
		}
	};
	/**
	 * @param e 移动的目标<br>
	 * @param id  目的地ID<br>
	 * @param fn   移动完毕后回调方法<br>
	 * @param css  移动时Tip框额外的样式
	 */
	window.Chasonx.FastMove = function(sourObj,tid,callBack,css){
		return new ChasonxMove(sourObj,tid,callBack,css);
	};
	
})(window);