
// var ajax = function( R ){
    // if(!R.url || typeof(R.url) != 'string') return false;

    // var method 	= 	R.method	|| 'GET',
        // async 	= 	R.async		|| true ,
        // url		=	R.url	,
        // onSuccess =	R.onSuccess || function(){console.log('Request Success');},
        // onFail	= 	R.onFail	|| function(){console.log('Request Fail');}	,
        // xmlHttpRequest;
    // if(window.ActiveXObject)
    // {
        // xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    // }
    // else if(window.XMLHttpRequest)
    // {
        // xmlHttpRequest = new XMLHttpRequest();
    // }

    // if(null != xmlHttpRequest)
    // {
        // xmlHttpRequest.open( method , url , async);
        // xmlHttpRequest.onreadystatechange = function()
        // {
            // if(xmlHttpRequest.readyState == 4)
            // {
                // if(xmlHttpRequest.status == 200)
                // {
                    // var responseText = xmlHttpRequest.responseText;
                    // var responseJson;
                    // try{
                        // eval('responseJson=' + responseText);
                    // }catch(e){
                        // console.log("not json");
                        // responseJson = responseText;
                    // }
                    // var responseJson = eval("false||" + responseText);
                    // onSuccess(responseJson);
                    // return responseJson;
                // }
                // else
                // {
                    // onFail();
                // }
            // }
        // }
        // xmlHttpRequest.send(null);
    // }
// };

    function $ZENS_AD_CTRL( ADC ){
		
        if(!ADC)return false;
        this.adc = null;
        this.adap = null;
        this.tag = [];
        //this.requestUrl = '';
        //this.requestUrl = 'json/opaio-AdContentInfo.json'
        //this.requestADC( GUID );
        this.$ADC(ADC);
        this.init();
    };

    $ZENS_AD_CTRL.prototype = {
        requestADC : function (GUID) {
            var me = this;
            ajax({
                url : me.requestUrl + '?guid=' + GUID,
                onSuccess : function(_json){
                    me.$ADC(_json);
                    me.init();
                }
            });
        },
        //requestADAP : function () {
        //    var me = this;
        //    ajax({
        //        url : 'json/opaio-MetaContentInfo.json',
        //        onSuccess : function(_json){
        //            me.$ADAP(_json);
        //            me.requestADC();
        //        }
        //    });
        //},
        $ADC : function ( ADC ) {
            ADC = ADC ? ADC : 0;
            if(!ADC) return false;
            this.adc = ADC;
            return this.adc;
        },
        //$ADAP : function ( ADAP ) {
        //    ADAP = ADAP ? ADAP : 0;
        //    if(!ADAP) return false;
        //    this.adap = ADAP;
        //    return this.adap;
        //},
        $ADC_Info : function () {
            return this.adc.metaInfo;
        },
        //$ADAP_Info : function () {
        //    return this.adap.metaInfo;
        //},
        $ADC_IT : function () {
            return this.adc.items;
        },
        //$ADAP_IT : function () {
        //    return this.adap.adap.items;
        //},
        $ADC_version : function () {
            return this.adc.version;
        },
        //$ADAP_version : function () {
        //    return this.adap.version;
        //},
        $ADC_protocol : function () {
            return this.adc.adc.protocol;
        },
        $ : function (id) {
            return document.getElementById(id);
        },
        //$ADAP_protocol : function () {
        //    return this.adap.adap.protocol;
        //},
        searcher : function () {
            //var _iframe = document.getElementsByTagName('iframe');
            $video = document.getElementsByTagName('video');
            var all = document.getElementsByTagName('*');
            var _iframe = [];
            var ADvideo = [];
            var video = [];
            var _item = {};
			
            for( var i = 0; i < all.length; i++)
            {
                if(all[i].getAttribute('OPG_MR_TYPE') == 'Image')
                {
                    _iframe.push(all[i]);
                }
                if(all[i].getAttribute('OPG_MR_TYPE') == 'Video')
                {
                    ADvideo.push(all[i]);
                }
               
            }
			for(var j = 0 ; j < $video.length; j++)
			{
				if(!$video[j].getAttribute('OPG_MR_TYPE'))
                {
                    video.push($video[j]);
                }
			}
            _item.img = _iframe;
            _item.ADvideo = ADvideo;
            _item.video = video;
            return _item;
        },
        //ADC_searcher : function ( alias ) {
        //    for(var i = 0; i < this.$ADC_IT().length; i++){
        //        if(this.$ADC_IT()[i].alias == alias){
        //            return this.$ADC_IT()[i];
        //        }
        //    }
        //    return false;
        //},
        //Handler : function () {
        //    var _item = [] , _adc;
        //    for(var i = 0 ; i < this.$ADAP_IT().length; i++)
        //    {
        //        _adc = this.ADC_searcher(this.$ADAP_IT()[i].alias);
        //        if(!_adc) continue;
        //        _item[i] = {};
        //        _item[i].id = this.$ADAP_IT()[i].id;
        //        _item[i].alias = this.$ADAP_IT()[i].alias;
        //        _item[i].type = this.$ADAP_IT()[i].type;
        //        _item[i].adc = _adc;
        //    }
        //    if(_item.length)this.playAD(_item);
        //    return this;
        //},
        Handler : function () {
            //var _item = [] , _adc;
            //for(var i = 0 ; i < this.$ADC_IT().length; i++)
            //{
            //    _adc = this.$ADC_IT()[i];
            //    if(!_adc) continue;
            //    _item[i] = {};
            //    _item[i].id = _adc.id;
            //    _item[i].adc = _adc;
            //}
            if(this.$ADC_IT())this.playAD(this.$ADC_IT());
            return this;
        },
        playAD : function ( P ) {
			var items = this.searcher();
            var $ADvideo = items['ADvideo'], $video = items['video'] , $img = items['img'];
			var v = 0 ; m = 0; 
            for(var i = 0 ; i < P.length; i++){
                //if(!P[i].id || !this.$(P[i].id))continue;
				
                if(P[i].type == 'Video'){
                    this.videoHandler({ $ADvideo : this.getItemObj($ADvideo,P[i].name) , $video : $video[v], data : P[i].data , w : P[i].width , h : P[i].height});
					v++;
                }else if(P[i].type == 'Image'){
                    this.imgHandler({ $obj : this.getItemObj($img,P[i].name) , data : P[i].data , w : P[i].width , h : P[i].height});
					m++;
                }
            }
  
            return this;
        },
		getItemObj : function(arr,name){
			var _obj = null;
			for(var i = 0,len = arr.length;i < len;i++){
				if(arr[i].getAttribute("OPG_MR_NAME") == name){
					_obj = arr[i];
					break;
				}
			}
		    return _obj;
		},
        videoHandler : function ( P , t) {
            if(!P.data)return this;
            var _data = eval('('+ P.data+')');
            t = t || 0;
            var me = this;
            try{
            	P.$video.pause();
            }catch(e){}
            P.$ADvideo.src = _data[t].fullUri;
			P.$ADvideo.controls = "controls";
            P.$ADvideo.autoplay = 'autoplay';
            P.$ADvideo.style.width = P.w ;
            P.$ADvideo.style.height = P.h ;
            P.$ADvideo.onended = function() {
               // t++;
                //t < 1 ? me.videoHandler(P,t) : playVideo(); // false
				P.$video.play();
				//playVideo();
            };
			function playVideo()
			{
				P.$ADvideo.style.display = 'none';
				P.$video.style.display = 'block';
				//P.$video.play();
			}
          //  P.$obj.setAttribute("onclick",'location.href = "http://www.baidu.com";');
            return this;
        },
        imgHandler : function ( P ) {
			
            if(!P.data)return this;
			
            var _data = eval('('+ P.data+')'),slider = [],$imgObjArray = [],_posi = '';
			
            var parent = P.$obj,elem;   
				parent.style.position = 'relative';
				parent.style.overflow = 'hidden';
				_posi = parent.getAttribute('position');
				childItem = [];
				childA = [];
				childP = [];
				
				if(_posi != 'hotLive' && _posi != 'hotVideo'){
					parent.innerHTML = '';
					parent.style.height = P.h;
				}else{
					childItem = parent.getElementsByTagName('img');
					if(_posi == 'hotVideo'){
						childA = parent.getElementsByTagName('a');
						childP = parent.getElementsByTagName('p');
					}
				} 
				
			for(var i = 0,_len = _data.length;i < _len;i++){
				if(_posi != 'hotLive' && _posi != 'hotVideo'){
					elem = document.createElement('img');
					elem.setAttribute('src',_data[i].fullUri);
					elem.setAttribute('width', P.w );
					elem.setAttribute('height', P.h );
					elem.setAttribute('title',(_data[i].title || ''));
					elem.setAttribute('onclick', 'location.href=\''+ (_data[i].url || '#') + '\';');
					if(_len > 1){
					  elem.style.position = "absolute";
					  elem.style.top = "0px";
					  elem.style.zIndex = (_len - i);
					}
					
					parent.appendChild(elem);
					$imgObjArray.push(elem);
					slider.push({url:_data[i].fullUri});
				}else{
					childItem[i].setAttribute('src',_data[i].fullUri);
					childItem[i].setAttribute('onclick', 'location.href=\''+ (_data[i].url || '#') + '\';');
					
					if(_posi == 'hotVideo'){
						childA[i].setAttribute('href',(_data[i].url || '#'));
						childP[i].innerHTML = _data[i].title;
					}
				}
			}
			
			if(slider.length > 1){
				new ChasonxSlider({imgData:slider,box : parent,type : 'left',imgObjArray :$imgObjArray });
			}
					
           // parent.removeChild(P.$obj);
           /* setInterval(function () {
                i++;
                elem.src = _data[(i +_data.length) % _data.length].fullUri;
                elem.setAttribute('onclick', 'location.href= \''+ (_data[i % _data.length].url || '#') + '\';');
            }, 3 *1000);*/
            return this;
        },
        init : function(){
            this.Handler();
        },
    };
	
	function ChasonxSlider(option){
  	 if(!option.imgData || option.imgData.length == 0) return;
  	 this.imgData = option.imgData;
  	 this.timer = option.timer || 3000;
  	 this.size = option.imgData.length;
  	 this.box = option.box;
  	 this.type = option.type || 'top';
  	 this.speed = option.speed || 60;
	 this.imgObjArray = option.imgObjArray || [];
  	 this.init();
  }
  ChasonxSlider.prototype = {
  	  init : function(){
  	  	  this._W = this.box.clientWidth;
  	  	  this._H = this.box.clientHeight;
          
		  if(this.imgObjArray.length == 0){
			  var img;
			  for(var i = 0,_len = this.imgData.length;i < _len;i++){
				  img = document.createElement("img");
				  img.src = this.imgData[i].url;
				  img.style.width = '100%';
				  img.style.height = '100%';
				  img.style.border = 'none';
				  img.style.top =  '0px';
				  img.style.zIndex = (_len - i);
				  img.style.position = 'absolute';
				  this.box.appendChild(img);
				  this.imgObjArray.push(img);
			  }
		  }
          this.slideRun(this.imgObjArray);
  	  },
  	  slideRun : function($imgArray){
  	  	  var i = 0,_this = this,pImg,nImg,forTimer;
  	  	  var running = function(){
  	  	  	  pImg = $imgArray[i];
  	  	  	  nImg = $imgArray[((i + 1) == $imgArray.length?0:i+1)];
  	  	  	  _this.animate(pImg,nImg);
  	  	  	  i++;
  	  	  	  if(i == $imgArray.length) i = 0;
  	  	  	  forTimer();
  	  	   };
 	      forTimer = function(){ 
 	      	setTimeout(function(){
 	      		running();
 	         },_this.timer); 
 	      }; 
 	      forTimer();
  	  },
  	  animate : function(imgObj,nimgObj){
  	  	  var top,_this = this,t = 0,b = 0,d = 60;
  	  	  var timer = setInterval(function(){
  	  	  		if(_this.type == 'top'){
  	  	  			top = _this.tween(t,b,-_this._H,d);
  	  	  			imgObj.style.top = top + 'px';
  	  	  			nimgObj.style.top = (top + _this._H) + 'px';
  	  	  		}else{
  	  	  			top = _this.tween(t,b,-_this._W,d);
  	  	  			imgObj.style.left = top + 'px';
  	  	  			nimgObj.style.left = (top + _this._W) + 'px';
  	  	  		}
  	  	  		imgObj.style.zIndex = '100';
  	  	  		nimgObj.style.zIndex = '10';
  	  	  		t += 1;
  	  	  		if(t > d){
  	  	  			clearInterval(timer);
  	  	  			if(_this.type == 'top')  	imgObj.style.top = _this._H + 'px';
  	  	  			else imgObj.style.left = _this._W + 'px';
  	  	  		} 
  	  	  },1000 / this.speed);
  	  },
  	  tween : function(t,b,c,d){
  	  	 return -c*(t/=d)*(t-2) + b;
  	  }
   };

    window.addEventListener("load", function(){new $ZENS_AD_CTRL(ZENS_TEMPLATE_AD);}, false);
