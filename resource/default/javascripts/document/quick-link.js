define(function (require, exports, modules) {
    var ajaxHost = i8_session.ajaxHost;
    var resHost = i8_session.resHost;
    var fileuploader=require('../plugins/qiniu_uploader/qiniu_i8uploader');
    //var i8uploader = require('../plugins/i8uploader/fw_i8uploader.js');
    var fw_page=require('../common/fw_pagination.js');
    var i8ui = require('../common/i8ui');
    require('../plugins/i8ztree/treestyle.css');
    selector = require('../plugins/i8selector/fw_selector.js');
    var i8hash=require('../common/i8hash.js');
    var util=require('../common/util.js');
    var common = require('./common');
    var admin_ztree=admin_ztree || '';
    var sel_obj={};
    $('#new_file_link').on('click',function(){
        var quick_link_dielog_tpl=require('../../template/document/new_quick_link.tpl');
        i8ui.showbox({
            title:'添加自定义访问链接',
            cont:quick_link_dielog_tpl
        })
    })

});
