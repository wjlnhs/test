/*global Qiniu */
/*global plupload */
/*global FileProgress */
/*global hljs */


//表示全局唯一标识符 (GUID)。

function Guid(g){

    var arr = new Array(); //存放32位数值的数组



    if (typeof(g) == "string"){ //如果构造函数的参数为字符串

        InitByString(arr, g);

    }

    else{

        InitByOther(arr);

    }

    //返回一个值，该值指示 Guid 的两个实例是否表示同一个值。

    this.Equals = function(o){

        if (o && o.IsGuid){

            return this.ToString() == o.ToString();

        }

        else{

            return false;

        }

    }

    //Guid对象的标记

    this.IsGuid = function(){}

    //返回 Guid 类的此实例值的 String 表示形式。

    this.ToString = function(format){

        if(typeof(format) == "string"){

            if (format == "N" || format == "D" || format == "B" || format == "P"){

                return ToStringWithFormat(arr, format);

            }

            else{

                return ToStringWithFormat(arr, "D");

            }

        }

        else{

            return ToStringWithFormat(arr, "D");

        }

    }

    //由字符串加载

    function InitByString(arr, g){

        g = g.replace(/\{|\(|\)|\}|-/g, "");

        g = g.toLowerCase();

        if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1){

            InitByOther(arr);

        }

        else{

            for (var i = 0; i < g.length; i++){

                arr.push(g[i]);

            }

        }

    }

    //由其他类型加载

    function InitByOther(arr){

        var i = 32;

        while(i--){

            arr.push("0");

        }

    }

    /*

     根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。

     N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

     D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

     B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

     P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)

     */

    function ToStringWithFormat(arr, format){

        switch(format){

            case "N":

                return arr.toString().replace(/,/g, "");

            case "D":

                var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20,32);

                str = str.replace(/,/g, "");

                return str;

            case "B":

                var str = ToStringWithFormat(arr, "D");

                str = "{" + str + "}";

                return str;

            case "P":

                var str = ToStringWithFormat(arr, "D");

                str = "(" + str + ")";

                return str;

            default:

                return new Guid();

        }

    }

}

//Guid 类的默认实例，其值保证均为零。

Guid.Empty = new Guid();

//初始化 Guid 类的一个新实例。

Guid.NewGuid = function(){

    var g = "";

    var i = 32;

    while(i--){

        g += Math.floor(Math.random()*16.0).toString(16);

    }

    return new Guid(g);

}



    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '100mb',
        flash_swf_url: i8_session.resHost+'default/javascripts/plugins/qiniu_uploader/plupload/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url:'/platform/uptoken',// $('#uptoken_url').val(),
        //domain:'http://i8xiaoshi.qiniudn.com/', //$('#domain').val(),
        // downtoken_url: '/downtoken',
        // unique_names: true,
        // save_key: true,
        //x_vars: {
        //    // 'id': '1234',
        // //   'key':'chentao',
        //     'time': function(up, file) {
        //         var time = (new Date()).getTime();
        //         // do something with 'time'
        //         return time;
        //     }
        //},
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                $('.filelist').show();
                $('#success').hide();
                plupload.each(files, function(file) {

                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);

            },
            'UploadComplete': function() {
                $('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            },'CancelUpload':function(){

            },
            'Key': function(up, file) {

                console.log(up);
                console.log(file);
                var _fileName = Guid.NewGuid().ToString();
                return 'attachment/test/'+ _fileName;//file.name;
                 //var key = "";
                 // do something with key
                // return key
            }
        }
    });

    uploader.bind('FileUploaded', function() {
        console.log('hello man,a file is uploaded');
        $('.filelist').show();
    });
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });



    $('#show_code').on('click', function() {
        $('#myModal-code').modal();
        $('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    });

    $('.filelist').on('click','.cancel',function(){
        $(this).parents('li').remove();
    })

    $('body').on('click', 'table button.btn', function() {
        $(this).parents('tr').next().toggle();
    });


    var getRotate = function(url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };

    $('#myModal-img .modal-body-footer').find('a').on('click', function() {
        var img = $('#myModal-img').find('.modal-body img');
        var key = img.data('key');
        var oldUrl = img.attr('src');
        var originHeight = parseInt(img.data('h'), 10);
        var fopArr = [];
        var rotate = getRotate(oldUrl);
        if (!$(this).hasClass('no-disable-click')) {
            $(this).addClass('disabled').siblings().removeClass('disabled');
            if ($(this).data('imagemogr') !== 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }
        } else {
            $(this).siblings().removeClass('disabled');
            var imageMogr = $(this).data('imagemogr');
            if (imageMogr === 'left') {
                rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
            } else if (imageMogr === 'right') {
                rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
            }
            fopArr.push({
                'fop': 'imageMogr2',
                'auto-orient': true,
                'strip': true,
                'rotate': rotate,
                'format': 'png'
            });
        }

        $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

            var watermark = $(this).data('watermark');
            var imageView = $(this).data('imageview');
            var imageMogr = $(this).data('imagemogr');

            if (watermark) {
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                    dissolve: 100,
                    gravity: watermark,
                    dx: 100,
                    dy: 100
                });
            }

            if (imageView) {
                var height;
                switch (imageView) {
                    case 'large':
                        height = originHeight;
                        break;
                    case 'middle':
                        height = originHeight * 0.5;
                        break;
                    case 'small':
                        height = originHeight * 0.1;
                        break;
                    default:
                        height = originHeight;
                        break;
                }
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: parseInt(height, 10),
                    q: 100,
                    format: 'png'
                });
            }

            if (imageMogr === 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': 0,
                    'format': 'png'
                });
            }
        });

        var newUrl = Qiniu.pipeline(fopArr, key);

        var newImg = new Image();
        img.attr('src', 'loading.gif');
        newImg.onload = function() {
            img.attr('src', newUrl);
            img.parent('a').attr('href', newUrl);
        };
        newImg.src = newUrl;
        return false;
    });

