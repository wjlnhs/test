define(function(require,exports){
    var i8ui = require('../common/i8ui.js');
    var fileuploader = require('../plugins/qiniu_uploader/qiniu_i8uploader');
    var defaultImg = 'https://dn-i8res.qbox.me/public/platform/group/banner-bg/bg-02.jpg';
    /*build(remove.start)*/
    require('../common/jquery-ui.min');
    /*build(remove.end)*/
    var uploader=null;
    function upfile(){
        //文件上传按钮
        var options = {'button':"js_upfile_btn",//按钮ID
            'fileContainerId':'uploaderul',//装文件容器
            'btnContainerId':'js_upfile_btn_box',//按钮ID容器
            'tokenUrl':'/platform/uptoken',
            'flashUrl':'/default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
            'beforeUpload':function(){
                //var _html= $("#js_upfile_btn").get(0).outerHTML
                $("#js_upfile_btn").attr("class","loading32").html("上传中...");
            },
            'uploadProgress':function(up){
                console.log(up)
                $('#js_upfile_btn').attr("class","loading32").html('上传中'+up.percent+'%');
                //console.log(up)
                //console.log(8888)
            },
            'fileUploaded':function(up, file, info){
                $("#js_upfile_btn").attr("class","loading32").html("完成加载中...");
                var file=uploader.getUploadFiles();
                $.ajax({
                    url: i8_session.ajaxHost+'webajax/group/upqiniu',
                    type: 'get',
                    dataType: 'json',
                    data: {attachment: file},
                    cache: false,
                    success: function(result){
                        console.log(result)
                        if(result.result){
                            $('.set-img_mask').hide();
                            //$("#js_upfile_btn").remove();
                            $("#js_img_yulan").unbind('load').attr("src",result.data[0].url+"?imageView2/2/w/1200").load(function(){$(this).css('width','auto');$(this).width($(this).width()*0.666666);$(this).css('top',0);$(this).attr('defualtWidth',$(this).width()).attr('m_oldwidth',$(this).width());$('.iscover').removeClass('checked')}).draggable({axis:"y"});
                            $('.iscover').parent().show();
                            uploader.uploaderReset();
                            $("#js_upfile_btn").removeClass('loading32').html("<div class='set-img-up-btn yahei'>上传图片</div>");
                            //$('#js_set_img_type2 .loadImg').remove();
                        }else{
                            i8ui.error('上传失败');
                            uploader.uploaderReset();
                        }
                    },
                    error: function(e1,e2,e3){
                        i8ui.error("系统出错！");
                    }
                });
            }
        };
        uploader=fileuploader.i8uploader(options);
        return uploader;
    }


    function getQiNiuParm(url){
        var json={};
        var urlArr=[];
        url=url.split('?')[1] || '';
        urlArr=url.split('/');
        urlArr.shift();
        for(var i=0;i<urlArr.length;i++){
            json[urlArr[i++]]=urlArr[i];
        }
        return json;
    }
    function joinQiNiuParm(json,qiNiufnStr){
        var url=qiNiufnStr || '';
        for(var i in json){
            url+='/'+i+'/'+json[i]
        }
        return url;
    }

    function showBox(json,callback){
        var tpl = require("./template/setimg.tpl");
        var tmp = template(tpl);
        var setImgBox = i8ui.showbox({
            title:"上传封面图",
            cont: tmp({})

        });
        var _current=$(setImgBox).find('img[src="'+json.oldImg+'"]').parent().addClass('current');
        var _top=0;
        function resetSrc(src){
            //?imageView2/2/w/1200
                //?imageMogr2/thumbnail/1200x/crop/!1200xa0a94
            var imgparm=getQiNiuParm(json.oldImg)
            _top=parseInt(imgparm.top);
            src=src.split('?')[0]+'?imageView2/2/w/1200';
            return src
        }

        //$("#js_img_yulan").attr("src",(json.oldImg&&_current.length==0) ? resetSrc(json.oldImg) : defaultImg);
        if(json.oldImg&&_current.length==0){
            var imgparm=getQiNiuParm(json.oldImg)
            $('.set-img_mask').hide();
            $("#js_img_yulan").attr({"src": resetSrc(json.oldImg)}).css({'position':'relative'}).draggable({axis:"y"});
            console.log(imgparm)
            if(imgparm.iscover!=="true"){
                if(imgparm.m_oldwidth){
                    $("#js_img_yulan").attr('defualtWidth',imgparm.m_oldwidth).attr('m_oldwidth',imgparm.m_oldwidth).width(imgparm.m_oldwidth).css('top',imgparm.m_top+"px")
                }else{
                    $(document).on('click','.set-img-hd .current',function(){
                        $("#js_img_yulan").load(function(){
                            var $this=$(this);
                            if(!$this.attr('defualtWidth')){
                                $this.attr('defualtWidth',$this.width()).attr('m_oldwidth',$this.width());
                            }
                            $this.width($this.attr('defualtWidth')*0.666666)
                        })
                        $("#js_img_yulan").trigger('load')
                    })
                }
            }else{
                if(imgparm.m_width){
                    $("#js_img_yulan").width(imgparm.m_width).attr('m_oldwidth',imgparm.m_oldwidth)
                }
                if(imgparm.m_top){
                    $("#js_img_yulan").css('top',imgparm.m_top+"px").attr('m_oldwidth',imgparm.m_oldwidth)
                }
                $('.iscover').addClass('checked');
            }


        }else{
            $("#js_img_yulan").attr("src", defaultImg)
            $('.iscover').parent().hide();
        }
        var upbox = upfile();
        //取消弹层
        $(setImgBox).on("click","span.btn-gray96x32",function(){
            setImgBox.close();
        });
        //确定保存
        $(setImgBox).on("click","span.btn-blue96x32",function(){
            var files = upbox.getUploadFiles();
            json.box = setImgBox;
            if(json){
                if(document.getElementById("js_set_img_type1").style.display == "none"){
                    json.setImgUrl = $("#js_img_yulan").attr("src");
                }else{
                    json.setImgUrl = $("#js_set_img_type1").find("span.current").find("img").attr("src");
                }
            }
            callback(json);
        });
        //切换选择事件
        $(setImgBox).find("div.set-img-list").on("click","span",function(){
            var $spans = $(setImgBox).find("div.set-img-list span");
            $spans.removeClass("current");
            $(this).addClass("current");
        });
        //切换选择事件
        $(setImgBox).find("div.set-img-hd").on("click","span",function(){
            var $spans = $(setImgBox).find("div.set-img-hd span");
            $spans.removeClass("current");
            $(this).addClass("current");
            if($(this).html() == "模板"){
                $("#js_set_img_type1").show();
                $("#js_set_img_type2").hide();
            }else{
                $("#js_set_img_type2").show();
                $("#js_set_img_type1").hide();
            }
        });


    }

    exports.showBox = showBox;
    exports.getQiNiuParm=getQiNiuParm;
    exports.joinQiNiuParm=joinQiNiuParm;
});