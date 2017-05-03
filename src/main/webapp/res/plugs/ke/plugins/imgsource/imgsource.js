/**
 * 添加，上传图片 插件
 */
KindEditor.plugin('imgsource', function(K) {
        var editor = this, name = 'imgsource';
        // 点击图标时执行
        editor.clickToolbar(name, function() {
        	eval(editor.bindMethod + "()");
        });
});