/***
 * @author
 * @desc 
 * @time
 */
ChasonxTScaler.plugins("dataWidget",{
	text   : '当前栏目',
	classes: 'icon-short_text',
	eleType: 'div',
	clear  : true,
	attr   : {
		width : 420,
		height: 160,
        fontColor : 'ffffff'
	},
	customAttr : {
		guid : '',
		state : '',
		status : ''
	},
	append : function(){
		var ele = this.creatEle();
		ele.setAttribute('style',this.getStyle());
        ele.innerHTML = '{%$当前栏目%}';
		this.appendToDraw(ele);
	}
});
