/***
 * @author
 * @desc 
 * @time
 */
ChasonxTScaler.plugins("buttonWidget",{
	text   : '下一页',
	classes: 'icon-keyboard_arrow_right',
	eleType: 'button',
	clear  : true,
    css    : 'border:0px dashed #c00', 
	attr   : {
		width : 120,
		height: 32,
        bgImg : '/UCGS/files/upload/default_nextpage.png'
	},
	customAttr : {
		UCGS_Class : 'CMS_ContentPager_Next'
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute('style',this.getStyle());
        ele.setAttribute('onclick',"if(CmsExt_Content)CmsExt_Content.Pager.pageTo('>')");
		this.appendToDraw(ele);
	}
});
