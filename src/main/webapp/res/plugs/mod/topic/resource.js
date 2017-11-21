
var ResDialog = {
	  PageNumber : 0,
	  PageSize : 12,
	  Data : null,
	  JSONP : 'UAMS_Callback',
	  list : function(){
		  Chasonx.Wait.Show('正在努力加载媒资列表，请稍后...');
		  new Chasonx({
				 title : '资源列表',
				 html : '<div style="text-align:center;"><input id="dialogVideoTitle" type="text" class="inputText"/><input type="button" class="button blue" value="查找" onclick="ResDialog.query()"/></div><div id="romateResItems">\
					     </div><div id="pagePanel" ></div>',
				 width : 800,height:600,
				 modal : true,
				 success : function(){
					 ResDialog.state = false;
					 
					 return ResDialog.chose(function(item){
						 var vd = ResDialog.Data[item.val()];
						 ResDialog.mediaMessDraw(vd);
					 });
				 }
			});
		  
		  Chasonx.Ajax({
				 url:DefConfig.UAMS.getMediaList,
				 PageNumber:this.PageNumber,
				 PageSize:this.PageSize,
				 data :{'sifter':'number:State@1'},
				 dataType : 'jsonp',
				 jsonp : ResDialog.JSONP,
				 before : function(op){
					 op.PageNumber = Math.round((~~op.PageNumber + ~~op.PageSize)/~~op.PageSize);
					 return op;
				 },
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,ResDialog.PageSize,this.PageNumber,this,function(d){ ResDialog.show(d);});	
					 ResDialog.show(d);
					 Chasonx.Wait.Hide();
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 	Chasonx.Wait.Hide();
				 }
			});
	  },
	  query : function(){
		  //this.list($("#dialogVideoTitle").val());
		  Chasonx.Wait.Show('正在努力加载媒资列表，请稍后...');
		  Chasonx.Ajax({
				 url:DefConfig.UAMS.getMediaList,
				 PageNumber:this.PageNumber,
				 PageSize:this.PageSize,
				 data :{'sifter':'string:Title@' + $("#dialogVideoTitle").val()},
				 dataType : 'jsonp',
				 jsonp : ResDialog.JSONP,
				 before : function(op){
					 op.PageNumber = Math.round((~~op.PageNumber + ~~op.PageSize)/~~op.PageSize);
					 return op;
				 },
				 success : function(d){	
					 Chasonx.Page.init('pagePanel',d.totalRow,ResDialog.PageSize,this.PageNumber,this,function(d){ ResDialog.show(d);});	
					 
					 ResDialog.Data = d.list;
					 ResDialog.show(d);
					 Chasonx.Wait.Hide();
				 },
				 error:function(e){
				 	Chasonx.Hint.Faild({text:'错误：' + e});
				 	Chasonx.Wait.Hide();
				 }
			});
	  },
	  update : function(){
		  var guid = $("#videoGuid").val();
		  if(StrKit.isBlank(guid)) return Chasonx.Hint.Faild('缺少关键参数，不能更新');
		  Chasonx.Wait.Show('正在更新影片信息，请稍后...');
		  $.ajax({
			 url :  DefConfig.UAMS.getMediaEntity,
			 type : 'get',
			 dataType : 'jsonp',
			 jsonp : ResDialog.JSONP,
			 data : {'GUID':guid},
			 success : function(d){
				 Chasonx.Wait.Hide();
				 Chasonx.Hint.Success('影片信息已同步，请保存');
				 ResDialog.mediaMessDraw(d);
			 },
			 error : function(e){
				 Chasonx.Wait.Hide();
			 }
		  });
	  },
	  show : function(d){
//		  if($("#romateResItems")[0] == undefined){ 
//			  
//		  }
		  this.Data = d.list;
		  this.draw(d);
	  },
	  mediaMessDraw : function(D){
		  if(D == null || D == undefined) return;
		  var vd = D;
		  $(".videoDetailBox > .poster > img").attr('src', SyncUrl.UAMS + vd.PosterUrl);
			 $(".videoDetailBox > .btnBox > font").html(vd.Title);
			 $(".videoDetailBox > .mess").html('<p>导演：'+ getString(vd.Director) +'</p>\
					 							<p>演员：'+ getString(vd.Actor) +'</p>\
					 							<p>标签：'+ getString(vd.Tag) +'</p>\
					 							<p>地区：'+ getString(vd.Region) +'</p>\
					 							<p>年代：'+ getString(vd.Years) +'</p>\
					 							<p>来源：'+ getString(vd.Provider) + '</p>\
					 							<p>类型：'+ getString(vd.Type) +'</p>\
					 							<p>大小：'+ fileSizeForamt(vd.VideoSize || 0) +'</p>\
					 							<p>发布时间：' + getString(vd.CreateTime) + '</p>\
					 							<p>简介：'+ getString(vd.Desc) +'</p>');
			 $(".videoDetailBox > .grade").html('评分：' + getString(vd.Grade));
			 
			 if($("#ftitle").val() == '') $("#ftitle").val(vd.Title);
			 $("#videoGuid").val(vd.GUID);
			 $("#flable").val(vd.Tag.replace(/[ ]/g,''));
			 $("#videoGrade").val(vd.Grade);
			 $("#fsource").val(vd.Provider);
			 $("#fsummary").val(vd.Desc);
			 $("#fthumbnail").val(vd.PosterUrl);
			 $("#fthumbnailPrewImg").attr('src',SyncUrl.UAMS + vd.PosterUrl);
			 $("#videoMessUrl").val(SyncUrl.UAMS + vd.VideoUrl);
			 $("#videoDetailJson").val(JSON.stringify(vd));
			 $("#videoRegion").val(vd.Region?vd.Region.replace(/[ ]/g,''):'');
			 $("#videoYears").val(vd.Years);
	  },
	  draw : function(d){
		  var line = '',page = '';
		  $.each(d.list,function(i,u){
			  line += '<div class="videoDialogItems"><img src="'+ SyncUrl.UAMS + u.PosterUrl +'" onerror="this.src=\'/UCGS/res/skin/images/posterDef.png\';" /><p>'+ u.Title +'<br><font color="blue">Tag:'+ u.Tag +'</font></p><input type="checkbox" value="'+ i +'" name="videoitem"/></div>';
		  });
		  
//		  for(var i = 1;i <= d.totalPage; i++){
//			  page += '<a href="javascript:void(0)" '+ (this.PageNumber != i?'onclick="ResDialog.list('+ i +')"':'style="color:#000;background:#ddd;"') + ' >'+ i + '</a>';
//		  }
//		  
//		  line += '<div class="voideItemPagePanel"><font>共找到：'+ d.totalRow +' 条</font><span>'+ page +'</span></div>';
		  
		  $("#romateResItems").html(line);
		  this.checkboxLive();
	  },
	  checkboxLive : function(){
		  $(".videoDialogItems").live('click',function(){
			  $('input[type="checkbox"][name="videoitem"]:checked').attr('checked',false);
			  $(this).find('input[type="checkbox"][name="videoitem"]').attr('checked',true);
		  });
	  },
	  chose : function(callback){
		  var item = $("input[type='checkbox'][name='videoitem']:checked");
		  if(item.size() > 0){
			  callback(item);
			  return true;
		  }else{
			  Chasonx.Hint.Faild('请选择一项后操作');
			  return false;
		  }
	  }
};