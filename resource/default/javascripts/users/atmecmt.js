/**
 * Created by kusion on 2015/1/16.
 */
define(function(require,exports){

    function loadList(appid){
        var tagHash=location.hash||"#blog-list";
        $(".atme-tab-a").removeClass("active");
        $("a.nav-item[hashTag='"+tagHash+"']").addClass("active");
        $('.header-all[type='+tagHash+']').show();
        var type="";
        if(tagHash=="#blog-list"){
            location.hash="#blog-list";
            type="atmeblog";
            //@我的侃侃
            updatetips('a04bf0a9-488a-439d-b723-01f4ebd2848d');
        }else if(tagHash=="#cmt-list"){
            location.hash="#cmt-list";
            type="atmecmt";
            //@我的评论
            updatetips('78b9e6e7-d9d3-430c-8acb-bd934feee940');
        }
        $("#blog_list").off();
        var kankanlist=require('../plugins/i8bloglist/i8blogs');
        var showKankan=kankanlist({container:"#blog_list",listType:type,listHeader:false,appid:appid});
        showKankan.init();
    }
    $(".atme-tab-a").click(function(){
        var hashTag=$(this).attr("hashTag");
        $(".atme-tab-a").removeClass("active");
        $('.header-all').hide();
        $("#app-filter-tabName").text("全部");
        location.hash=hashTag;
        loadList();
    });
    loadList();
    $("#cmt-filter-app").on("click","dd",function(){
        $("#app-filter-tabName").text($(this).attr("tabname"));
        var appid=$(this).attr("appid");
        loadList(appid);
    })
});