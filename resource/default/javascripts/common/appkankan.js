/**
 * Created by kusion on 2015/2/11.
 */
define(function(require,exports){
        var appKankan=function(_setting) {
            var setting= _.extend({app_id:"",holderText:"说点什么吧！",listType:"",others:{}},_setting);
            //群组侃侃及列表初始化
            var util = require('./util');
            var sourceid =setting.others.sourceid|| util.getUrlParam('pid');
            var app_id=setting.app_id;// = '4b1e7570-15dd-4a4f-88ca-af4c9cc87f99';
            var blogPoster = require('../plugins/i8poster/js/i8poster');
            var kankanlist = require('../plugins/i8bloglist/i8blogs');
            var showKankan = null;
            var postBloger = blogPoster({container: "#quick_post",
                header: {kankan: true, schedule: false, daily: false},
                enableHeader: false,
                kkConfig: {
                    ksnconfig: { "org": false, "user": true, "grp": false },
                    attachment: true,
                    gift: false,
                    face: true,
                    topic: true,
                    scope: true,
                    defalultScope: 2,
                    scopeukk: i8_session.ukankan,
                    appid: app_id,
                    attachid: "btn_attachment",
                    attaContainer: "upContainer",
                    kid: "ksn",
                    kkplaceholder: setting.holderText,
                    faceitem: ""
                },
                postCompleted: function (data) {
                    if (showKankan && _.isObject(data)) {
                        showKankan.appendBefore(data);
                    }
                    /* postBloger.addUser2Cache({ 'uid': groupDT.ID, 'uname': '@' + groupDT.Name,type:1 });
                     postBloger.defAddTxt2Box("@"+groupDT.Name+" ");
                     $(".only-visible-btn").trigger("click");*/
                    parent.document.all("iframe-kankan").style.height = document.body.scrollHeight + "px";
                },
                others: {sourceid: sourceid}
            });
            postBloger.init();
            $(".release-scope").click(function () {
                return false;
            })
            /* postBloger.addUser2Cache({ 'uid': groupDT.ID, 'uname': '@' + groupDT.Name,type:1 });
             postBloger.defAddTxt2Box("@"+groupDT.Name+" ");
             //侃侃展示*/
            showKankan = kankanlist({container: "#blog_list", listType:setting.listType , appid: app_id, sourceid: sourceid, listHeader: false, loadItemComplated: function () {
                parent.document.all("iframe-kankan").style.height = document.body.scrollHeight + "px";
            }});
            showKankan.init();
            $(document).click(function () {
                setInterval(function () {
                    parent.document.all("iframe-kankan").style.height = $('body').height() + "px";
                }, 200)
            })
        };
    return appKankan;
})