/***
 * @author
 * @desc 
 * @time
 */
ChasonxTScaler.plugins("imgWidget",{
	text   : '广告插件',
	classes: 'icon-stack',
	eleType: 'zapperAD',
	clear  : true,
	attr   : {
		width : 200,
		height: 300
	},
	customAttr : {
		'ad-key' : ''
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute('style',this.getStyle());
		this.appendToDraw(ele);
	}
});
