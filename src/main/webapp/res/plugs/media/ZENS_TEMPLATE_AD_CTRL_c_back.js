
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
            P.$video.pause();
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
            var i = 0;
            var _data = eval('('+ P.data+')');
			
            var parent = P.$obj, elem = document.createElement('img');
            elem.setAttribute('src',_data[i].fullUri);
            elem.setAttribute('width', P.w );
            elem.setAttribute('height', P.h );
            elem.setAttribute('title',(_data[i].title || ''));
            elem.setAttribute('onclick', 'location.href=\''+ (_data[i].url || '#') + '\';');
            parent.innerHTML = '';
            parent.appendChild(elem);
           // parent.removeChild(P.$obj);
            setInterval(function () {
                i++;
                elem.src = _data[(i +_data.length) % _data.length].fullUri;
                elem.setAttribute('onclick', 'location.href= \''+ (_data[i % _data.length].url || '#') + '\';');
            }, 3 *1000);
            return this;
        },
        init : function(){
            this.Handler();
        },
    };

    window.addEventListener("load", function(){new $ZENS_AD_CTRL(ZENS_TEMPLATE_AD);}, false);
