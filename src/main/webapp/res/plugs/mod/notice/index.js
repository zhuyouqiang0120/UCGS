;(function(win,$){
	
	var Notice = {
			publish : function(){
				var _id = 'noticeTab',_ipt = ['input','textarea'];
				if(FormData.requiredByAttr( _id, _ipt )){
					var data = FormData.getFormData(_id, _ipt);
					
					Chasonx.Wait.Show('正在发布...');
					getAjaxData(DefConfig.Root + '/main/notice/publish',{content : JSON.stringify(data)},function(d){
						if(~~d > 0){
							Chasonx.Hint.Success('已发布');
							FormData.clearInput(_id, _ipt);
						}else{
							Chasonx.Hint.Faild('发布失败');
						}
						Chasonx.Wait.Hide();
					});
				}
			},
			list : function(){
				getAjaxData(DefConfig.Root + '/main/notice/list',{pageNumber : 1,pageSize : 10},function(data){
					console.debug(data);
					var line = '';
					$.each(data.list,function(i,u){
						u.fvalue = JSON.parse(u.fvalue);
						line += '<div class="noticeItem">\
								  <div class="title">'+ u.fvalue.title +'</div>\
								  <div class="content">'+ u.fvalue.content +'</div>\
							    </div>';
					});
					$("#noticeListTab").html(line);
				});
			}
	};
	
	win.onload = function(){
		Chasonx.Frameset({
			  main : 'mainPanel',
		      window : {
		          top : { id : 'topPanel', height : '70px',border:false,bgColor : false},
		          right:{ id:'centerPanel', width : '100%' ,bgColor : false,border : false}
		      }
		});
		
		Chasonx.Tab({
		   	id : 'centerPanel',
		   	bHeight : 30,
		   	bWidth : 150,
		   	fontColor : '#969696',
		   	fontBlurColor : '#a7a7a7',
		   	itemGroup :[
		   	      {  
		   	    	  position : 'top|left',
					  items :[{
					   		title : '公告发布',
					   		focusColor : '#383737',
					   		blurColor : '#464646',
					   		panelId : 'noticeTab',
					   		handler : function(){
					   			
					   		}
					   	},
					   	{
					   		title : '公告历史',
					   		focusColor : '#383737',
					   		blurColor : '#464646',
					   		panelId : 'noticeListTab',
					   		handler : function(){
					   			Notice.list();
					   		}
					   	}]
		   	      	}
		   	    ]
		});
		
		$("#publishNotice").live('click',function(){
			Notice.publish();
		});
		
		$(".noticeItem > .title").live('click',function(){
			if($(this).attr('openItem') == 'true'){
				$(this).next().attr('style','height:0px;padding:0px;');
				$(this).attr('openItem','false');
			}else{
				$(this).attr('openItem','true');
				$(this).next().attr('style','height:auto !important;padding:15px;');
			}
		});
	};
	
})(window,$);