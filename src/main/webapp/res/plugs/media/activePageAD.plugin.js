/**
 * Created by L.lawliet on 2017/5/15.
 */

var $ActivePageADLoader = function ()
{
	this.P2O   = function( str )  // 将参数转换为对象
    {
        var ps = str.replace('?','').split('&'),
            po, pk, pv , o = {};

        for( var i = 0 ; i < ps.length; i++ )
        {
            po = ps[i].split('=');
            pk = po[0];
            pv = po[1];
            try
            {
                o[pk] = eval('('+ pv +')');
            }
            catch (e)
            {
                o[pk] = pv;
            }
        }

        return o;
    }

    this.P2S   = function( param )  // 将参数转为字符串
    {
        var _param = '';

        for( var i in param )
        {
            _param += i + '=' + ( typeof( param ) == 'object' ? JSON.stringify( param[i] ) : param[i] ) + '&' ;
        }

        return _param.substr( 0 , _param.length - 1 );
    }

	this.ajax = function( P )
	{
		with( this )
		{
			var query = P.query || '';

			if( typeof(query) == "object" )
			{
				query = P2S( query );
			}

			var url = P.url + '?' + query;

			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

			if( xhr )
			{
				xhr.onreadystatechange = function () 
				{
					switch (xhr.readyState) 
					{
						case 4: 
							if( xhr.status == 200 )
							{
								P.success && P.success( xhr.responseText );
							}
						break;
					}
				}

				xhr.open( 'get' , url , true );

				xhr.send(null);
			}
		}
	},

	this.request = function( dataUrl , fn )
	{
		with( this )
		{
			ajax({
				url : dataUrl,
				success : fn
			});
		}
	}

	this.init = function( dataUrl)
	{
		with( this )
		{
			request(dataUrl , function( data ){
				data = JSON.parse( data );
				data = data.data[0];
				ADLoader( document.querySelectorAll('zapperAD') , data );
			});
		}
	}

	this.ADLoader = function( elems , data )
	{
		with( this )
		{
			for( var i = 0 ; i < elems.length; i++ )
			{
				var ad_key  = elems[i].getAttribute('ad-key');

				var ad_data = data[ ad_key ];

				if( ad_data ) ADFiller( elems[i], ad_data.plan );
			}
		}
	}

	this.ADFiller = function( elem , plans )
	{
		with( this )
		{
			var items = validity( plans );

			for( var i = 0 ; i < items.length; i++ )
			{
				var item = items[i];

				if( item.state == 'use' )
				{
					fillAD( elem , item.plan );
				}
			}
		}
	}

	this.fillAD = function( elem , plan , index )
    {
        with( this )
        {        	
            var elem = elem;
            var plan = plan;
            var key  = key;

            elem.innerHTML = '';
            
            if( !plan ) return this;

            var queue = plan.queue;

            if( !queue ) return this;

            index = index || 0;

            index = index < queue.length ? index : 0; 

            var item  = queue[ index ];

            if( !item ) return this;

            var host = '';

            switch( item.type )
            {
            	case 'image' : elem.innerHTML = '<img src="' + host + item.resource.Url + '" style="width:100%;height:100%">'; break;
                case 'video' : elem.innerHTML = '<video src="' + host + item.resource.Url + '" style="width:100%;height:100%"></video>'; break;
            }


            if( item.option.duration && queue.length > 1 )
            {
            	var delay = 
                {
                    second : 1000,
                    minute : 1000 * 60,
                    hour   : 1000 * 60 * 60
                }

                delay = item.option.duration * delay[ item.option.unit ];

                setTimeout( (function( elem ){ return function(){ fillAD( elem , plan , index + 1); } })( elem ) , delay );
            }

            return this;
        }
    }

	// 有效期检测
    this.validity = function( plans )
    {
        with( this )
        {
            var items = [];
            var today = new Date().toLocaleString();

            for( var i = 0 ; i < plans.length; i++ )
            {
                items.push( { plan : plans[i] , state : '' } );
            }

            var state_invalid  = 'invalid'; // 失效（ 过期 ）
            var state_uneffective = 'uneffective'; // 未生效
            var state_valid    = 'valid'; // 有效（ 普通 ，长期有效 ）
            var state_use      = 'use'; // 正在使用 （ 有效 ）

            var terms  = []; // 有期限项目组
            var nterms = []; // 无期限项目组
            var valids = [];    // 有效项目组
            var invalids = [];  // 无效项目组
            var effectives = [];    // 生效项目组 （ 即 今天 在 生效期至结束期 内 的所有项目 ）
            var neffectives = [];   // 未生效项目组

            // 在项目中过滤 过滤 期限项目 和 无期限项目
            for( var i = 0; i < items.length; i++ )
            {
                var item = items[i];

                if( item.plan.startDate && item.plan.endDate ) { terms.push( item );} // 期限项目
                else { nterms.push( item ); item.state = state_valid; } // 无期限项目  默认为 有效
            }

            // 在期限项目组中 过滤  有效项目 和 失效项目
            for( var i = 0 ; i < terms.length; i++ )
            {
                var term = terms[i];

                if( Date.parse( term.plan.endDate ) > Date.parse( today ) ) { valids.push( term ); }// 有效项目
                else { invalids.push( term ); term.state = state_invalid; }  // 已失效项目
            }

            // 在有效项目组中 过滤  生效项目 和 未生效项目
            for( var i = 0 ; i < valids.length ; i++ )
            {
                var valid = valids[i];

                if( Date.parse( valid.plan.startDate ) <= Date.parse( today ) ) {effectives.push( valid ); }// 生效项目
                else { neffectives.push( valid ); valid.state = state_uneffective; } // 未生效项目
            }

            // 在生效项目组中 找到 正在使用的项目  （ 注意！  过滤条件为 生效日期 离 今天 最近的项目 为正在使用项目  如 今天 : 05-09  ,  a { 生效日期 : 05-04 } , b { 生效日期 : 05-07 }, 则当前使用 b 项目 ）

            effectives = effectives.length ? effectives : nterms; // 若无生效项目  则在 永久项目中查找

            var __effectives = effectives.sort(function( a , b ){
                return Date.parse( a.plan.startDate ) - Date.parse( b.plan.startDate );
            });

            if( __effectives.length )
            {
                for( var i = 0 ; i < __effectives.length - 1; i++ )
                {
                    var __effective = __effectives[i];
                    __effective.state = state_valid;
                }

                __effectives[ __effectives.length - 1 ].state = state_use;
            }

            return items;
        }
    }
}

var $activePageADLoader = new $ActivePageADLoader();


