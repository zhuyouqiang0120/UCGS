/**
*文件列表
*/
var FileList = {
		siteGuid : null,
		getFileList : function(){
			if(this.siteGuid == null) return;
			
			var del = ($("#resourceDel").val() != undefined?$("#resourceDel").val():0);
			Chasonx.Wait.Show();
			Chasonx.Ajax({
				 url:DefConfig.Root + '/main/resource/listData',
				 PageNumber:0,
				 PageSize:10,
				 data :{'siteGuid':this.siteGuid,'sType':$("#resourceType").val(),'del':del,'startTime':$("#startTime").val(),'endTime':$("#endTime").val()},
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,10,1,this,function(d){ FileList.drawHtml(d);});	
					 FileList.drawHtml(d);
					 Chasonx.Wait.Hide();
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 	Chasonx.Wait.Hide();
				 }
			});
		},
		drawHtml : function(d){
			var html = '';
			if(d.list.length > 0){
				$(".fileItemsPanel").html('');
				var html = [],zoom;
				
				$.each(d.list,function(i,u){
					zoom = Math.min( Math.min( 140 / u.fwidth,1),Math.min(180 / u.fheight,1) );
					html.push('<div class="item"><img src="' + DefConfig.Root + u.fpath +'" data="'+ DefConfig.Root + u.fpath +'" width="'+ u.fwidth * zoom +'" height="'+ u.fheight * zoom +'" />\
							<div><p>'+ u.fassetname +'</p>\
							<p>'+ fileSizeForamt(u.fsize) +' , '+ u.fwidth + ' * ' + u.fheight +'</p>\
							<p>'+ getString(u.fremark) +'</p>\
							<p>'+ u.fuploadtime +'</p></div>\
							<input type="checkbox" value="'+ u.id +'" name="fileItem"/></div>');
						
				});
				html.push('<div style="clear:both;"></div>');
				$(".fileItemsPanel").html(html.join(''));
				FileList.setItemWidth();
			}else{
				html += '<div style="text-align:center;">暂无数据</div>';
				$(".fileItemsPanel").html(html);
			}
			
		},
		setItemWidth : function(){
			var w = ($(".fileItemsPanel").width() - 50)/6;
			$(".fileItemsPanel > .item").bind('click',function(){
				var ckObj = $(this).find("input[type='checkbox'][name='fileItem']");
				ckObj.attr('checked',!ckObj.attr('checked'));
			}).css('width',~~w + 'px');
		},
		del : function(D){
			this.chooose(function(ck){
				var s = '';
				switch(D){
				case 0: s = '确定恢复吗？';break;
				case 1: s = '确定删除到回收站吗？';break;
				case 2: s = '确定要彻底删除吗？';break;
				}
				
				var idStr = '';
				ck.each(function(){
					idStr += ';' + $(this).val();
				});
				
				Chasonx.Alert({
					alertType : 'warning',
					html : s,
					modal:true,
					success : function(){
						getAjaxData(DefConfig.Root + '/main/resource/del',{'id':idStr,'delete':D},function(d){
							console.debug(d);
							if(d > 0){
								Chasonx.Hint.Success('已成功删除');
								FileList.getFileList();
							}
						});
						
						return true;
					}
				});
			});
		},
		chooose:function(cb){
			var cks = $("input[type='checkbox'][name='fileItem']:checked");
			if(cks.size() > 0){
				cb(cks);
				return true;
			}else{
				return Chasonx.Hint.Faild('请选择一项后再操作');	
			}
		}
};

function fileDialogHtml(siteGuid,callback){
	if(siteGuid == '') return Chasonx.Hint.Faild('请先选择网站');
	
	var html = '<select id="resourceType" class="inputText select" style="width:10%;" onchange="FileList.getFileList();" ><option value="0">主题资源</option><option value="1">模版资源</option></select>\
				<input id="startTime"  type="text" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',realFullFmt:\'%Date\'})" class="inputText Wdate" style="width:120px;"/>至\
				<input id="endTime" type="text" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\',realFullFmt:\'%Date\'})" class="inputText Wdate" style="width:120px;"/>\
				<input type="button" class="button blue" onclick="FileList.getFileList();" value="查询" />';
	new Chasonx({
		title : '资源列表',
		html : '<div style="height:100%;" class="global_bg_c">' + html + '<div class="fileItemsPanel"></div><div  id="pagePanel"></div></div>',
		width:800,height:700,
		success : function(){
			FileList.chooose(function(ck){
				callback(ck);
			});
			return true;
		},
		modal : true
	});
	
	FileList.siteGuid = siteGuid;
	FileList.getFileList();
}


function btnCtrl(v){
	if(v == 1){
		$("#delBtn").show();
		$("#recBtn").show();
	}else{
		$("#delBtn").hide();
		$("#recBtn").hide();
	}
	
	FileList.getFileList();
}

