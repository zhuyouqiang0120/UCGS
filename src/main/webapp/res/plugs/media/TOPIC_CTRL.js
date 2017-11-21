
var CmsExt_Content = {
	Pager : {
		pageTo : function(type){
			ArtPage.goPage(type);
		}
	}
}


var ArtPage = {
	 currPage : 1,
	 prevID :'CMS_ContentPager_Prev',
	 nextID : 'CMS_ContentPager_Next',
	 init : function(){
		 this.handlerKeyBoard();
		 ArtPage.showOrhide(ArtPage.prevID,0);
		 ArtPage.showOrhide(ArtPage.nextID,0);
	 	 if($CMS_Content_PageNum != null && $CMS_Content_PageNum != undefined){
	 		 
	 		ArtPage.delayShowContent();	 		 
	 	 	ArtPage.currPagination();
	 	 	if($CMS_Content_PageNum > 1){
		 		ArtPage.showOrhide(ArtPage.nextID,1);
		 		ArtPage.byAttrName('UCGS_Class',ArtPage.nextID).focus();
		 	}
	 	 }
	 },
	 delayShowContent : function(){
		var D = document.getElementsByTagName("div");
		var _d = this.byAttrName('UCGS_Class','CmsComp_Text_Content'); 
		var html = _d.innerHTML || '';
		if( html.indexOf('&nbsp;&nbsp;&nbsp;&nbsp;') > 0 ){
		    html = html.replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, '<span style="display:inline-block;width:53px;"></span>');
		    _d.innerHTML = html;
		}
		
		_d.style.display = 'none';
		setTimeout(function(){
			_d.style.display = 'block';
		}, 200);
	 },
	 goPage : function(type){
	 	if( ArtPage.currPage == $CMS_Content_PageNum && ArtPage.currPage == 1 ){

	 	}else{
	 		ArtPage.contentShowOrHide('CMS_Content_' + (ArtPage.currPage - 1),0);
		 	if(type == '>')
		 		ArtPage.currPage ++;
		 	else
		 		ArtPage.currPage --;
		 	
		 	ArtPage.contentShowOrHide('CMS_Content_' + (ArtPage.currPage - 1),1);
		 	ArtPage.pageBtnState(type);
		 	ArtPage.currPagination();
	 	}
	 },
	 pageBtnState : function( type ){
	 	if(ArtPage.currPage < $CMS_Content_PageNum && ArtPage.currPage > 1){
	 		ArtPage.showOrhide(ArtPage.prevID,1);
		 	ArtPage.showOrhide(ArtPage.nextID,1);
		 	if(type == '>') ArtPage.byAttrName('UCGS_Class',ArtPage.nextID).focus();
		 	else ArtPage.byAttrName('UCGS_Class',ArtPage.prevID).focus();
	 	}else if(ArtPage.currPage == 1){
	 		ArtPage.showOrhide(ArtPage.prevID,0);
		 	ArtPage.showOrhide(ArtPage.nextID,1);
		 	ArtPage.byAttrName('UCGS_Class',ArtPage.nextID).focus();
	 	}else if(ArtPage.currPage == $CMS_Content_PageNum){
	 		ArtPage.showOrhide(ArtPage.prevID,1);
		 	ArtPage.showOrhide(ArtPage.nextID,0);
		 	ArtPage.byAttrName('UCGS_Class',ArtPage.prevID).focus();
	 	}
	 },
	 showOrhide : function(id, type){
		 ArtPage.byAttrName('UCGS_Class',id).style.display = (type == 1?'block':'none');
	 },
	 contentShowOrHide : function(id,type){
		 ArtPage.ele(id).style.display =  (type == 1?'block':'none');
	 },
	 currPagination : function(){
		 ArtPage.byAttrName('UCGS_Class','CmsComp_Ctrl_Pagination').innerHTML = ArtPage.currPage + '  / ' + $CMS_Content_PageNum;
	 },
	 ele : function(id){
	 	return document.getElementById(id);
	 },
	 byAttrName : function(attr,value){
		 var D = document.all;
		 var _d = null; 
		 for(var i = 0,len = D.length; i < len;i ++){
			if(D[i].getAttribute(attr) == value){
				_d = D[i];
				break;
			}
		 } 
		 return _d;
	 },
	 handlerKeyBoard : function(){
		 document.onkeydown = function(e){
			e = e || event;
				switch(e.keycode||e.which)
				{
					case 8:
					case 340:
					case 399:
					case 4096:
						e.preventDefault();
						window.history.back();
						break;
				}
		}
	 }
}

function CMS_PageLoad(){
	ArtPage.init();
}
