/**
 * Created by jialin on 2015/1/12.
 */
define(function(require,exports) {
    var getHashJson=function(key){
        var hash=window.location.hash;
        var hashjson={}
        if(hash.length>0){
            hash=hash.substring(1);
            var hasharr=hash.split('&');
            if(hasharr.length>0){
                for(var i= 0,len=hasharr.length;i<len;i++){
                    var temparr=hasharr[i].split('=');
                    if(temparr.length==2){
                        hashjson[temparr[0]]=temparr[1];
                    }
                }
            }
        }
        if(key){
            for(var i in hashjson){
                if(key==i){
                    return hashjson[i];
                    break;
                }
            }
            return null;
        }
        return hashjson;
    }
    var setHashJson=function(hash){
        if(!hash){
            window.location.hash="";
        }
        //var HashJson=getHashJson(window.location.hash);
        var newHash="";
        for(var i in hash){
            newHash+=i+'='+hash[i]+'&';
        }
        window.location.hash='#'+newHash;
    }
    exports.getHashJson=getHashJson;
    exports.setHashJson=setHashJson;
});