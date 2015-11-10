/**
 * Created by jialin on 2015/3/19.
 */
/// <summary>
    /// 创建
    /// </summary>
//Create = 0,
    /// <summary>
    /// 查看
    /// </summary>
    //View = 1,
    /// <summary>
    /// 完成
    /// </summary>
    //Finish = 2,
    /// <summary>
    /// 评审
    /// </summary>
    //Review = 3,
    /// <summary>
    /// 重启
    /// </summary>
    //Redo = 4,
    /// <summary>
    /// 关闭
    /// </summary>
    //Close = 5,
    /// <summary>
    /// 终止
    /// </summary>
    //Abort = 6,
    /// <summary>
    /// 文件添加
    /// </summary>
    //FileAdd = 7,
    /// <summary>
    /// 文件删除
    /// </summary>
    //FileDel = 8,
    /// <summary>
    /// 任务项添加
    /// </summary>
    //ItemAdd = 9,
    /// <summary>
    /// 任务项删除
    /// </summary>
    //ItemDel = 10,
    /// <summary>
    /// 时间段更改
    /// </summary>
    //EditTime = 11,
    /// <summary>
    /// 人员更改
    /// </summary>
    //EditPerson = 12,
    /// <summary>
    /// 无操作
    /// </summary>
    //None = 20

define(function (require, exports, module) {
    var ajaxHost = i8_session.ajaxHost;
    /*build(remove.start)*/
    require('./../../stylesheets/process.css');
    /*build(remove.end)*/
    var seeFile=require('../../javascripts/common/seefile.js')
    var process={
        getCnAction:function(action){
            var _action='';
            switch (action){
                case 0:
                    _action='创建了'
                    break;
                case 1:
                    _action='查看了'
                    break;
                case 2:
                    _action='完成了'
                    break;
                case 3:
                    _action='评审了'
                    break;
                case 4:
                    _action='重启了'
                    break;
                case 5:
                    _action='关闭了'
                    break;
                case 6:
                    _action='终止了'
                    break;
                case 7:
                    _action='添加了附件'
                    break;
                case 8:
                    _action='删除了附件'
                    break;
                case 9:
                    _action='添加了任务项'
                    break;
                case 10:
                    _action='删除了任务项'
                    break;
                case 11:
                    _action='时间段更改'
                    break;
                case 12:
                    _action='人员更改'
                    break;
                case 13:
                    _action='退回了任务'
                    break;
                case 20:
                    _action='无操作'
                    break;
                default:
                    _action=''
                    break;
            }
            return _action;
        }
        ,getIconClass:function(action){
            var _iconClass='';
            switch (action){
                case 0:
                    _action='process-item-creat'
                    break;
                case 1:
                    _action='process-item-see'
                    break;
                case 2:
                    _action='process-item-finish'
                    break;
                case 3:
                    _action='process-item-comment'
                    break;
                case 4:
                    _action='process-item-restart'
                    break;
                case 5:
                    _action='process-item-close'
                    break;
                case 6:
                    _action='process-item-close'
                    break;
                case 7:
                    _action='process-item-creat'
                    break;
                case 8:
                    _action='process-item-close'
                    break;
                case 9:
                    _action='process-item-creat'
                    break;
                case 10:
                    _action='process-item-close'
                    break;
                case 11:
                    _action='process-item-timechange'
                    break;
                case 12:
                    _action='process-item-peoplechange'
                    break;
                case 13:
                    _action='process-item-reback'
                    break;
                case 20:
                    _action='无操作'
                    break;
                default:
                    _action=''
                    break;
            }
            return _action;
        }
        ,renderTime:function(date,formatStr){
            return new Date(date.replace(/\-/g,'/')).format(formatStr);
        }
        ,renderProcess:function(feed,box){
            template.helper('setContent',function(content,action){
                try
                {
                    var jsonarr=$.parseJSON(content);
                    var cnAction=process.getCnAction(action);
                    //var fileHtml=(seeFile.ks.getSimpleHtml(jsonarr,null,true));

                    var fileHtml='';
                    if(jsonarr){
                        for(var i=0;i<jsonarr.length;i++){
                            fileHtml+='<span class="blue m-l5">'+jsonarr[i].FileName+'</span>';
                        }
                    }
                    //seeFile.ks.bindImgClick($('.process-items'));
                    var _html='<span>'+cnAction+fileHtml+'</span>';
                    return _html;
                }
                catch(e)
                {
                    return content;
                }
            });
            template.helper('setIconClass',function(action){
                var iconClass=process.getIconClass(action);
                return iconClass;
            });
            template.helper('$renderTime',process.renderTime);
            var process_item_tpl=require('../../template/task/process_item.tpl');
            var process_item_render=template(process_item_tpl);
            //排序
            if(feed.feed.length>0){
                feed.feed=feed.feed.sort(function(a,b){
                    return (new Date(b.CreateTime.replace(/\-/g,'/')).getTime())-(new Date(a.CreateTime.replace(/\-/g,'/')).getTime())
                })
            }
            //console.log(feed)
            var process_item_html=process_item_render(feed);
            if(box){
                $(box).html(process_item_html);
            }else{
                return '<div class="process-items">'+process_item_html+'</div>'
            }
        }
    }
    module.exports=process;
})
