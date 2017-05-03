
var PubDimension = {
		list : function(id,callback){
			 getAjaxData(DefConfig.Root + '/main/dimension/getAllDimensions',null,function(d){
				 PubDimension.gennerTree(d,id,callback);
			  });
		},
		gennerTree : function(d,id,fn){
			$("#" + id).tree({
				data:FormatDimensionData.format(d),
				onClick:function(node){
					if(typeof fn == 'function') fn(node);
				}
			});
		}
};