/***
 * @author
 * @desc 
 * @time
 */
ChasonxTScaler.plugins("dataWidget",{
	text   : '栏目路径',
	classes: 'icon-sort',
	eleType: 'div',
	clear  : true,
	attr   : {
		width : 400,
		height: 120,
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
        ele.innerHTML = '{%$栏目路径-1%} > {%$当前栏目%}';
		this.appendToDraw(ele);
	}
});
