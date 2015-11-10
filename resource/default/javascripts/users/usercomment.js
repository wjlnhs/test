/**
 * Created by kusion on 2015/1/16.
 */
define(function(require,exports){
    function loadItemList(appid){
        var tagHash=location.hash||"#recieved";
        var type=(tagHash=="#recieved"?2:1);
        if(type == 2){
            //收到的评论
            updatetips('fa9384f0-d6d7-42e4-9d2a-9f3eb5c1867f');
        }
        $(".tab-cmt-a").removeClass("active");
        $("a.nav-item[hashTag='"+tagHash+"']").addClass("active");
        var kankanlist=require('../plugins/i8bloglist/i8blogs');
        var showKankan=kankanlist({container:"#blog_list",listType:"ucomment",cmtype:type,listHeader:false,appid:appid});
        showKankan.init();
    }
    $(".tab-cmt-a").click(function(){
        var hash=$(this).attr("hashTag");
        location.hash=hash;
        $("#app-filter-tabName").text("全部");
        $("#blog_list").off();
        loadItemList();
    });
    loadItemList();
    $("#cmt-filter-app").on("click","dd",function(){
        $("#app-filter-tabName").text($(this).attr("tabname"));
        var appid=$(this).attr("appid");
        loadItemList(appid);
    })
})