/***
 * @author
 * @desc 
 * @time
 */
ChasonxTScaler.plugins("dataWidget",{
	text   : '页码',
	classes: 'icon-looks_one',
	eleType: 'div',
	clear  : true,
	attr   : {
		width : 120,
		height: 40,
        fontColor : 'ffffff'
	},
	customAttr : {
		UCGS_Class : 'CmsComp_Ctrl_Pagination'
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute('style',this.getStyle());
        ele.innerHTML = '0 / 0';
		this.appendToDraw(ele);
	}
});
