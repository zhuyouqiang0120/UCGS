/***
 * 依赖jquery
 * @M required(id,[typeNames]) <br>
 * @M requiredByAttr(id,[typeNames]); <BR>
 * @M clearInput(id,[typeNames]); <br>
 * @M validata(T,obj) T=1:字母或数字5-20位  T=2：邮箱 T=3：电话号码 <br>
 * @M checkPwd(firstId,currObj); <br>
 * @M getFormData(id,[typeNames]);
 */
var FormData = {
	 required : function(id,typeOption){
		 return this.requiredByAttr(id, typeOption);
	 },
	 requiredByAttr : function(id,typeOption){
		 var result = true;
		 for(var i = 0;i < typeOption.length;i++){
			 $.each($("#" + id).find(typeOption[i] + ':visible'),function(j,k){
				 if($(this).attr('req') == "true" && $(this).val().trim() == ''){
					 result = false;
					 if($(this).next('font').html() != undefined){
						 $(this).next('font').html('<i>必填</i>');
					 }else{
						 $(this).after('<font color="red" size="2"><i>必填</i></font>');
					 }
				 }else if($(this).attr('req') == "true"){
					 if($(this).next('font').html() != undefined) $(this).next('font').html('');
					 
				 }
			 });
		 }
		 return result;
	 },
	 clearInput : function(id,typeOption){
		 for(var i = 0;i < para.length;i ++){
			 $.each($("#" + id).find(para[i]),function(j,k){
				 if($(this).attr('type') != 'button')
					 $(this).val('');
			 });
		 }
	 },
	 /**
	  * T=1:字母或数字5-20位  T=2：邮箱 T=3：电话号码
	  * @param T
	  * @param obj
	  */
	 validata : function(T,obj){
		 var patrn = /^([a-zA-Z0-9]|[._]){5,20}$/ig;
		 var pemail = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/ig;
		 var phone = /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/ig;
		 
		 if((T == 1 && !patrn.test(obj.value)) ||
			(T == 2 && !pemail.test(obj.value))	||
			(T == 3 && !phone.test(obj.value))) obj.value = "";
	 },
	 checkPwd : function(id,obj){
		 if(typeof(obj) != 'object') obj = $("#" + obj)[0];
		 
		 var res = true;
		 if(obj.value != $("#" + id).val()){
			 obj.value = '';
			 if($(obj).next('font').html() != undefined){
				 $(obj).next('font').html('<i>*两次密码输入不一致</i>');
			 }else{
				 $(obj).after('<font color="red" size="2"><i>*两次密码输入不一致</i></font>');
			 }
			 res = false;
		 }else{
			 if($(obj).next('font').html() != undefined) $(obj).next('font').html('');
		 }
		 return res;
	 },
	 getFormData : function(id,typeOption){
		 var data = {};
		 for(var i = 0;i < typeOption.length;i++){
			 $.each($("#" + id).find(typeOption[i] + ':visible'),function(j,k){
				 if($(this).attr('type') != 'button'){
					 data[$(this).attr('id')] = $(this).val();
				 }
			 });
		 }
		 return data;
	 }
};
