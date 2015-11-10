/**
 * Created by jialin on 2014/12/11.
 */
//define(function (require, exports,module) {
    var builtNav= function(navdoms,addclassName){
        var addclassName=addclassName || "current";
        var _location = window.location.href;
        $(navdoms).removeClass(addclassName).each(function(index,item){
            var navkeyword=$(item).attr('navkeyword');
            if(navkeyword && _location.indexOf(navkeyword)>0){
                $(item).addClass(addclassName);
            }
        })
    }
   // exports.builtNav=builtNav;
//})