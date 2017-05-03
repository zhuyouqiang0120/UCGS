
var FormatColumnData = {
	treeJSON:'',
	data : null,
	selectArr : new Array(),
	childArr : new Array(),
	format : function(data,siteData){
		this.data = eval(data);
		siteData = siteData || {};
		this.treeJSON = '[{"id":"0","guid":"'+ siteData.id +'","colname":"'+ siteData.name +'","text":"'+ siteData.name +'(主题/待审核/回收站)","iconCls":"icon-ok","state":"open","attributes":{"level":"0","fstate":"1","parentid":"0","fcdata":""},"children":';
		this.treeJSON += '[';
		var last = true,L,R;
		$.each(this.data,function(i,u){
			if(u.flevel == 1){
				FormatColumnData.getChild(u.id);
				if(FormatColumnData.selectArr.length > 0) last = false;
				
				L = R = '';
				if(u.frelationsiteguid != undefined && u.frelationsiteguid != ''){
					L = '<b style=\'color:#047AF7;\'>',R = '<i class=\'smallLink\'></i>'+u.frelationdefname+'</b>';
				}
				FormatColumnData.treeJSON += '{ "id" : "' + u.id +'","guid":"'+ u.fguid +'","colname":"'+ u.fservicename +'","text":"'+ L + u.fservicename + '('+ u.ftopicsize + '/' + u.ftopicchecksize + '/' + u.ftopicrecyclesize +')'+ R +'","icon":"'+ u.ficon +'","last":"'+last+'","iconCls":"'+ (u.fstate === 0?"icon-no":"") +'","state":"open","attributes":{"level":"'+ u.flevel +'",\
												"fstate":"'+ u.fstate +'","type":"'+ u.ftype +'","siteGuid":"'+ u.fsiteguid +'",\
												"remark":"'+ u.fremark +'","parentid":"'+ u.fparentuid +'","rsiteguid":"'+ u.frelationsiteguid +'",\
												"rcolguid":"'+ u.frelationcolguid +'","rname":"'+ u.frelationdefname +'","rischild":"'+ u.frelatitonischid +'","fadtactics":"'+ u.fadtactics +'","ext":"'+ (u.fextdata != null?u.fextdata.replace(/["]/g,"'"):'') +'"},"children":[';
				FormatColumnData.formatChild(u.fguid);
				FormatColumnData.treeJSON += ']},';
			}
		});
		this.treeJSON += ']}]';
		return eval('(' +this.treeJSON + ')');
	},
	formatChild : function(parentid){
		var L,R;
		$.each(this.data,function(i,u){
			if(u.fparentuid == parentid){
				L = R = '';
				if(u.frelationsiteguid != undefined && u.frelationsiteguid != ''){
					L = '<b style=\'color:#047AF7;\'>',R = '<i class=\'smallLink\'></i>'+u.frelationdefname+'</b>';
				}
				
				FormatColumnData.getChild(u.fguid);
				if(FormatColumnData.selectArr.length > 0){
					FormatColumnData.treeJSON += '{ "id" : "' + u.id +'","guid":"'+ u.fguid +'","colname":"'+ u.fservicename +'","text":"'+ L + u.fservicename + '('+ u.ftopicsize + '/' + u.ftopicchecksize + '/' + u.ftopicrecyclesize +')' + R +'","icon":"'+ u.ficon +'","last":"false","iconCls":"'+ (u.fstate === 0?"icon-no":"") +'","state":"open","attributes":\
					  {"level":"'+ u.flevel +'","fstate":"'+ u.fstate +'","type":"'+ u.ftype +'","siteGuid":"'+ u.fsiteguid +'",\
							"remark":"'+ u.fremark +'","parentid":"'+ u.fparentuid +'","rsiteguid":"'+ u.frelationsiteguid +'",\
							"rcolguid":"'+ u.frelationcolguid +'","rname":"'+ u.frelationdefname +'","rischild":"'+ u.frelatitonischid +'","fadtactics":"'+ u.fadtactics +'","ext":"'+ (u.fextdata != null?u.fextdata.replace(/["]/g,"'"):'') +'"},"children":[';
					FormatColumnData.formatChild(u.fguid);
					FormatColumnData.treeJSON += ']},';
				}else{
					FormatColumnData.treeJSON += '{"id":"'+ u.id +'","guid":"'+ u.fguid +'","colname":"'+ u.fservicename +'","text":"'+ L + u.fservicename + '('+ u.ftopicsize + '/' + u.ftopicchecksize + '/' + u.ftopicrecyclesize +')' + R +'","icon":"'+ u.ficon +'","last":"true","iconCls":"'+ (u.fstate === 0?"icon-no":"") +'","attributes":{"level":"'+ u.flevel +'","fstate":"'+ u.fstate +'",\
					"type":"'+ u.ftype +'","siteGuid":"'+ u.fsiteguid +'","remark":"'+ u.fremark +'","parentid":"'+ u.fparentuid +'","rsiteguid":"'+ u.frelationsiteguid +'",\
					"rcolguid":"'+ u.frelationcolguid +'","rname":"'+ u.frelationdefname +'","rischild":"'+ u.frelatitonischid +'","fadtactics":"'+ u.fadtactics +'","ext":"'+ (u.fextdata != null?u.fextdata.replace(/["]/g,"'"):'') +'"}},';
				}
			}
		});
	},
	getChild : function(pid){
		this.selectArr.length = 0;
		$.each(this.data,function(i,u){
			if(u.fparentuid == pid)
				FormatColumnData.selectArr.push(u);
		});
	}
};