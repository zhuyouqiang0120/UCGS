
var FormatDimensionData = {
	treeJSON:'',
	data : null,
	selectArr : new Array(),
	childArr : new Array(),
	format : function(data){
		try{
			this.data = data;
			this.treeJSON = '';
			this.treeJSON += '[';
			$.each(this.data,function(i,u){
				if(u.level == 1){
					FormatDimensionData.treeJSON += '{ "id" : "' + u.id +'","guid":"'+ u.guid +'","value":"'+ u.value +'","envalue":"'+ u.envalue +'","text":"'+ u.value +'['+ u.envalue +']&nbsp;&nbsp;'+ u.remark +'","icon":"'+ u.icon +'","iconCls":"'+ (u.state == 0?"icon-no":"") +'","state":"open","attributes":{"level":"'+ u.level +'",\
													"state":"'+ u.state +'","type":"'+ u.type +'",\
													"remark":"'+ u.remark +'","parentid":"'+ u.parentGuid +'",\
													"ext":"'+ (u.extdata != null?u.extdata.replace(/["]/g,"'"):'') +'"},"children":[';
					FormatDimensionData.formatChild(u.guid);
					FormatDimensionData.treeJSON += ']},';
				}
			});
			this.treeJSON = this.treeJSON.substring(0,this.treeJSON.length > 2? this.treeJSON.length - 1:this.treeJSON.length);
			this.treeJSON += ']';
			this.treeJSON = eval('('+ this.treeJSON +')');
		}catch(e){
			console.debug(e);
		}
		return this.treeJSON;
	},
	formatChild : function(parentid){
		$.each(this.data,function(i,u){
			if(u.parentGuid == parentid){
				
				FormatDimensionData.getChild(u.guid);
				if(FormatDimensionData.selectArr.length > 0){
					FormatDimensionData.treeJSON += '{ "id" : "' + u.id +'","guid":"'+ u.guid +'","value":"'+ u.value +'","envalue":"'+ u.envalue +'","text":"'+ u.value +'['+ u.envalue +']&nbsp;&nbsp;'+ u.remark +'","icon":"'+ u.icon +'","iconCls":"'+ (u.state == 0?"icon-no":"") +'","state":"open","attributes":\
					  {"level":"'+ u.level +'","fstate":"'+ u.state +'","type":"'+ u.type +'",\
							"remark":"'+ u.remark +'","parentid":"'+ u.parentGuid +'",\
							"ext":"'+ (u.extdata != null?u.extdata.replace(/["]/g,"'"):'') +'"},"children":[';
					FormatDimensionData.formatChild(u.guid);
					FormatDimensionData.treeJSON += ']},';
				}else{
					FormatDimensionData.treeJSON += '{"id":"'+ u.id +'","guid":"'+ u.guid +'","value":"'+ u.value +'","envalue":"'+ u.envalue +'","text":"'+ u.value +'['+ u.envalue +']&nbsp;&nbsp;'+ u.remark +'","icon":"'+ u.icon +'","iconCls":"'+ (u.state == 0?"icon-no":"") +'","attributes":{"level":"'+ u.level +'","fstate":"'+ u.state +'",\
					"type":"'+ u.type +'","remark":"'+ u.remark +'","parentid":"'+ u.parentGuid +'",\
					"ext":"'+ (u.extdata != null?u.extdata.replace(/["]/g,"'"):'') +'"}},';
				}
			}
		});
	},
	getChild : function(pid){
		this.selectArr.length = 0;
		$.each(this.data,function(i,u){
			if(u.parentGuid == pid)
				FormatDimensionData.selectArr.push(u);
		});
	}
};