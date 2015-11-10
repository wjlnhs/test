define(function (require, exports) {
    require('../common/i8ui');
    $(function () {

        var temptemptemp='<div class="com_top_colleague">\
            <p>\
                <span class="com_top_suggestBox_srcObj">\
                搜同事:\
                </span>\
                <span class="com_top_suggestBox_more">\
                    <a href="search/contacter.aspx?keyword=%e6%b5%8b%e8%af%95&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956">\
                    更多&gt;&gt;\
                    </a>\
                </span>\
            </p>\
            <dl>\
                <dd>\
                    <a href="community/user/home.aspx?pid=445f608f-fe97-47d2-9598-d8161f43ca59&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956"\
                    target="_blank">\
                        <img src="/ResourceStore/HeadSmall/b25273fc-4a26-47aa-a669-a3e560f70aff.jpg" class="imgico" alt="">\
                            <div class="com_top_colleague_name highlight">\
                            孔强\
                            </div>\
                            <div class="com_top_colleague_department highlight">\
                            自动化\
                                <span style="color:red">\
                                测试\
                                </span>\
                            部门369\
                            </div>\
                        </a>\
                    </dd>\
                    <dd>\
                        <a href="community/user/home.aspx?pid=4e7da65e-e183-46ca-8435-50d8a69dae58&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956"\
                        target="_blank">\
                            <img src="/ResourceStore/HeadSmall/00000000-0000-0000-0000-000000000000.png"\
                            class="imgico" alt="">\
                                <div class="com_top_colleague_name highlight">\
                                易德文\
                                </div>\
                                <div class="com_top_colleague_department highlight">\
                                自动化\
                                    <span style="color:red">\
                                    测试\
                                    </span>\
                                部门369\
                                </div>\
                            </a>\
                        </dd>\
                    </dl>\
                </div>\
                <div class="com_top_dynamic">\
                    <p>\
                        <span class="com_top_suggestBox_srcObj">\
                        搜动态:\
                        </span>\
                        <span class="com_top_suggestBox_more">\
                            <a href="search/feed.aspx?keyword=%e6%b5%8b%e8%af%95&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956">\
                            更多&gt;&gt;\
                            </a>\
                        </span>\
                    </p>\
                    <dl>\
                        <dd>\
                            <a href="community/kankandetails.aspx?m_id=f8bc1418-67af-4ee9-a12d-bc97d7130dc5&amp;pid=f01a38a6-0c22-4baa-9292-94d566e5ae71&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956"\
                            target="_blank">\
                                <img src="/ResourceStore/HeadSmall/ad81c24c-f47d-42d8-8be3-93b98ead8253.jpg"\
                                class="imgico" alt="">\
                                    <div class="com_top_colleague_msg highlight">\
                                    卢方晖：自动化测..\
                                    </div>\
                                </a>\
                            </dd>\
                            <dd>\
                                <a href="community/kankandetails.aspx?m_id=3ab2e151-f44b-4245-9d01-44c5c45dd89d&amp;pid=04d5f614-e654-4ce3-b6ac-e80b72928d19&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956"\
                                target="_blank">\
                                    <img src="/ResourceStore/HeadSmall/676f3b2d-8610-490f-9817-ff0b3c87fe3c.jpg"\
                                    class="imgico" alt="">\
                                        <div class="com_top_colleague_msg highlight">\
                                        习大大：\
                                            <span style="color:red">\
                                            测试\
                                            </span>\
                                        </div>\
                                    </a>\
                                </dd>\
                            </dl>\
                        </div>\
                        <div class="com_top_document">\
                            <p>\
                                <span class="com_top_suggestBox_srcObj">\
                                搜文档:\
                                </span>\
                                <span class="com_top_suggestBox_more">\
                                    <a href="search/document.aspx?keyword=%e6%b5%8b%e8%af%95&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956">\
                                    更多&gt;&gt;\
                                    </a>\
                                </span>\
                            </p>\
                            <dl>\
                                <dd>\
                                    <a href="document/docdetail.aspx?docid=d5aff6de-9fe2-40e0-8b10-6c7e6d67d79d&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956"\
                                    target="_blank">\
                                        <span class="fw_icon_default fw_icon_xlsx">\
                                        </span>\
                                        <span class="com_top_colleague_desc">\
                                            <em>\
                                            习大大\
                                            </em>\
                                        上传了《\
                                            <span class="doctitle highlight">\
                                                <span style="color:red">\
                                                测试\
                                                </span>\
                                            用例 - i...\
                                            </span>\
                                        》\
                                        </span>\
                                    </a>\
                                </dd>\
                                <dd>\
                                    <a href="document/docdetail.aspx?docid=7e26b916-1d74-4292-aec9-f8c9f6a72cd3&amp;a=19041fa8-3524-4d1f-90d7-3bba16c9d956"\
                                    target="_blank">\
                                        <span class="fw_icon_default fw_icon_xlsx">\
                                        </span>\
                                        <span class="com_top_colleague_desc">\
                                            <em>\
                                            吴悠\
                                            </em>\
                                        上传了《\
                                            <span class="doctitle highlight">\
                                                <span style="color:red">\
                                                测试\
                                                </span>\
                                            用例-任务...\
                                            </span>\
                                        》\
                                        </span>\
                                    </a>\
                                </dd>\
                            </dl>\
                        </div>'
        var setval;
        var passportid = i8_session.uid;
        //$(document).ready(function () {
        if (i8_session.aname) {
            $(".app_company").html(i8_session.aname);
        }

        //搜索dom
        var searchBox=$('#global_search_box.search-box')



        //搜索click
        $("#js_header_search_btn").click(function () {
            var $searchInput = $(this).next();
            var searchTxt = $.trim($searchInput.val());
            if (searchTxt.length > 0) {
                window.location.href = '/search/feed.aspx?keyword=' + encodeURIComponent(searchTxt) + '&a=' + fw_request("a");
            }
            else {
                alert("请输入关键词");
                $searchInput.focus();
            }
        })
        $("#js_header_search_txt").focus(function () {
            var $searchInput = $("#js_header_search_txt");
            if ($.trim($searchInput.val()).length > 0) {
                $(".app_top_search").append($("#com_top_headdown_tempSuggestBox").html());
            }
        });

        $("#js_pinfo").delegate("li.app_system,li.app_myintro", "click", function () {
            $(this).find("div.app_top_hover_div").toggle();
        });
        $("#global_search_box input").i8searchEvent({
            content:"#global_search_box",
            callbacks:{
                onChange:searchRun,
                onEmptyInput:onEmptyInput
            }
        });
        $("#js_header_search_txt").click(function () { return false; });
        //});

        function onEmptyInput(){
            $("#global_search_box .com_top_suggestBox").slideUp(200,function(){
                //$(this).remove();
            });
        }
        document.onclick = function () { onEmptyInput() };
        function searchRun() {
            var sTxt = $.trim($("#js_header_search_txt").val());
                $.ajax({
                    url: "/ucenter/globalsearch?r=sa",
                    type: "get",
                    dataType: "json",
                    data: { "q": sTxt },
                    success: function (data) {
                        if (data.Result) {
                            $("#global_search_box  .com_top_suggestBox").html(temptemptemp).slideDown();
                            /*$(".app_top_search .com_top_suggestBox").remove();
                            $suggestBox = $("#com_top_headdown_tempSuggestBox");
                            $suggestBox.html(data.ReturnObject);
                            $.each($suggestBox.find(".com_top_document dd"), function (i, item) {
                                $msgItem = $(item).find(".doctitle");
                                $msgItem.text(com_top_substrB($msgItem.text(), 12, '...'));
                            });
                            $.each($suggestBox.find(".com_top_dynamic dd"), function (i, item) {
                                $msgItem = $(item).find(".com_top_colleague_msg");
                                //$msgItem.html(cpec.common.fTruncationStr($msgItem.html(), 16));
                                $msgItem.html(util.subString($msgItem.html(), 16));
                            });
                            $suggestBox.html(HighLightKeyword(sTxt, $suggestBox));
                            $(".app_top_search").append($("#com_top_headdown_tempSuggestBox").html());*/
                        }
                        else {
                            onEmptyInput();
                        }
                    },
                    error: function () {
                        ////alert('请求出错');
                    }
                });
        };
        function com_top_substrB(s, w, px) {
            var r = "";
            var a = s.split("");
            for (var i = 0; i < s.length && w > 0; i++) {
                if (a[i].charCodeAt(0) < 299) w--; else w -= 2;
                r += a[i];
            }
            return r == s ? r : r + px;
        }

        function HighLightKeyword(key, obj) {
            var reg = new RegExp(key, "g");
            if (obj.length > 0) {
                $.each(obj.find(".highlight"), function (i, item) {
                    var child = $(item);
                    child.html(child.text().replace(reg, "<span style='color:red'>" + key + "</span>"));
                });
            }
        }

        $("#js_header_search_txt").blur(function () {
            if ($.trim(this.value) == "") {
                $(this).next().show();
            }
        });

    });
})