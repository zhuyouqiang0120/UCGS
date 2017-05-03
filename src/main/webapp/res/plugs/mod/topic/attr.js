
var TopicAttr = {
		classes : {
			data : [{v : 0,t : '常规'},{v : 1, t : '视频'},{v : 2,t :'图片'}],
			getText : function(v){
				var tt = '';
				for(var i = 0;i < this.data.length;i++){
					if(this.data[i].v === v){
						tt = this.data[i].t;
						break;
					}
				}
				return tt;
			}
		},
		types : {
			data : [
			    {v : 0, t : '新闻'},{v : 1, t : '财经'},{v : 2, t : '科技'},{v : 3, t : '体育'},
			    {v : 4, t : '娱乐'},{v : 5, t : '汽车'},{v : 6, t : '博客'},{v : 7, t : '视频'},
			    {v : 8, t : '房产'},{v : 9, t : '读书'},{v : 10, t : '教育'},{v : 11, t : '时尚'},
			    {v : 12, t : '城市'},{v : 13, t : '旅游'},{v : 14, t : '游戏'}
			],
			getText : function(v){
				var str = '';
				for(var i = 0;i < this.data.length; i++){
					if(this.data[i].v === v){
						str = this.data[i].t;
						break;
					}
				}
				return str;
			}
		},
		page : {
			data : [
			        {v : '',t : '默认'},
			        {v : '1280*720',t : '1280*720'},
			        {v : '480*800',t : '480*800'}
			       ]
		}
};