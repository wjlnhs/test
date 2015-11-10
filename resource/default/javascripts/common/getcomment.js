var fw_request = function (paras) {
    var url = location.href.indexOf("#") > 0 ? location.href.substring(0, location.href.indexOf("#")) : location.href;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {}
    for (i = 0; j = paraString[i]; i++) {
        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if (typeof (returnValue) == "undefined") {
        return "";
    } else {
        return returnValue;
    }
}
var ajax=function(callback){
    $.ajax({
        url: fw_request('domain')+'/webajax/login/getcomment',
        type: 'get',
        dataType: 'json',
        data:{options:{pageIndex:1,pageSize:10,blogID:fw_request('blogid')}},
        cache: false,
        success: function(data){
            callback(data)
        },error:function(error){
            callback(error)
        }
    })
}
ajax(function (data) {
    initBlog&&initBlog(data);
});