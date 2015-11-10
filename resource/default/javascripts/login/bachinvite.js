/**
 * Created by chenshanlian on 2015/3/4.
 */
jQuery.extend({
    createUploadIframe: function(id, uri)
    {
        //create frame
        var frameId = 'jUploadFrame' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
        if(window.ActiveXObject)
        {
            if(typeof uri== 'boolean'){
                iframeHtml += ' src="' + 'javascript:false' + '"';

            }
            else if(typeof uri== 'string'){
                iframeHtml += ' src="' + uri + '"';

            }
        }
        iframeHtml += ' />';
        jQuery(iframeHtml).appendTo(document.body);

        return jQuery('#' + frameId).get(0);
    },
    createUploadForm: function(id, fileElementId,data)
    {
        //create form
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        var oldElement = jQuery('#' + fileElementId);
        var newElement = jQuery(oldElement).clone();
        jQuery(oldElement).attr('id', fileId);
        jQuery(oldElement).before(newElement);
        jQuery(oldElement).appendTo(form);

        /*****    增加参数的支持   *****/
        if (data) {
            for (var i in data) {
                $('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
            }
        }

        //set attributes
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-1200px');
        jQuery(form).css('left', '-1200px');
        jQuery(form).appendTo('body');
        return form;
    },

    ajaxFileUpload: function(s) {
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();
        // ADD  s.data
        var form = jQuery.createUploadForm(id, s.fileElementId, s.data);
        var io = jQuery.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        // Watch for a new set of requests
        if ( s.global && ! jQuery.active++ )
        {
            jQuery.event.trigger( "ajaxStart" );
        }
        var requestDone = false;
        // Create the request object
        var xml = {}
        if ( s.global )
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function(isTimeout)
        {
            var io = document.getElementById(frameId);
            try
            {
                if(io.contentWindow)
                {
                    xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
                    xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;

                }else if(io.contentDocument)
                {
                    xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
                    xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
                }
            }catch(e)
            {
                jQuery.handleError(s, xml, null, e);
            }
            if ( xml || isTimeout == "timeout")
            {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if ( status != "error" )
                    {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData( xml, s.dataType );
                        // If a local callback was specified, fire it and pass it the data
                        if ( s.success )
                            s.success( data, status );

                        // Fire the global callback
                        if( s.global )
                            jQuery.event.trigger( "ajaxSuccess", [xml, s] );
                    } else
                        jQuery.handleError(s, xml, status);
                } catch(e)
                {
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if( s.global )
                    jQuery.event.trigger( "ajaxComplete", [xml, s] );

                // Handle the global AJAX counter
                if ( s.global && ! --jQuery.active )
                    jQuery.event.trigger( "ajaxStop" );

                // Process result
                if ( s.complete )
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function()
                {	try
                {
                    jQuery(io).remove();
                    jQuery(form).remove();

                } catch(e)
                {
                    jQuery.handleError(s, xml, null, e);
                }

                }, 100)

                xml = null

            }
        }
        // Timeout checker
        if ( s.timeout > 0 )
        {
            setTimeout(function(){
                // Check to see if the request is still happening
                if( !requestDone ) uploadCallback( "timeout" );
            }, s.timeout);
        }
        try
        {

            var form = jQuery('#' + formId);
            jQuery(form).attr('action', s.url);
            jQuery(form).attr('method', 'POST');
            jQuery(form).attr('target', frameId);
            if(form.encoding)
            {
                jQuery(form).attr('encoding', 'multipart/form-data');
            }
            else
            {
                jQuery(form).attr('enctype', 'multipart/form-data');
            }
            jQuery(form).submit();

        } catch(e)
        {
            jQuery.handleError(s, xml, null, e);
        }

        jQuery('#' + frameId).load(uploadCallback	);
        return {abort: function () {}};

    },

    /** handleError 方法在jquery1.4.2之后移除了，此处重写改方法 **/
    handleError: function( s, xhr, status, e ) {
        // If a local callback was specified, fire it
        if ( s.error ) {
            s.error.call( s.context || s, xhr, status, e );
        }

        // Fire the global callback
        if ( s.global ) {
            (s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
        }
    },

    uploadHttpData: function( r, type ) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if ( type == "script" ){
            jQuery.globalEval( data );
        }

        // Get the JavaScript object, if JSON is used.
        if ( type == "json" ){
            /*** 如果返回的是字符串(JSON格式字符串)，下面会报错，导致无法走入sucess方法 加上\"  ***/
                // eval( "data = " + data );
            eval("data = \" "+data+" \" ");
        }
        // evaluate scripts within html
        if ( type == "html" ){
            jQuery("<div>").html(data).evalScripts();
        }


        return data;
    }
});
//上传文件
$("#js_file").live("change",function(){
    if($(this).val() != ""){
        $.ajaxFileUpload({
            url:i8_session.ajaxHost+'webajax/login/pubExcel',
            secureuri:false,
            fileElementId:'js_file',
            dataType: 'text',
            success: function(response){
                var data = eval('('+response+')');
                var rightcount = 0;
                var errorcount = 0;
                var rightHtml = '';
                var errorHtml = '';
                for(var key in data.ReturnObject){
                    if(data.ReturnObject[key] == 0){
                        rightcount++;
                        rightHtml += '<tr><td style="width:100px;">'+ key +'</td></tr>';
                    }else{
                        errorcount++;
                        errorHtml += '<tr><td style="width:100px;">'+ key +'</td><td><span style="color: red;">'+ data.ReturnObject[key] +'</span></td></tr>';
                    }
                }
                errorcount = errorcount + data.ErrorArray.length;
                for(var i=0; i<data.ErrorArray.length; i++){
                    errorHtml += '<tr><td style="width:100px;">'+ data.ErrorArray[i].Passport +'</td><td><span style="color: red;">'+ data.ErrorArray[i].errTxt +'</span></td></tr>';
                }
                $("#com_set_import_after").show();
                $("#com_set_import_prev").hide();
                $("#js_import_success_num").html(rightcount);
                $("#js_import_error_num").html(errorcount);
                $("#js_show_success_lists").html(rightHtml);
                $("#js_show_error_lists").html(errorHtml);
                $("#js_file").val("");
            },
            error: function(data,status,e){
                //print error
                i8ui.error("文件上传失败，请检查文件格式！");
                $("#js_file").val("");
            }
        });
    }
});
$("#js_upfile_btn_span").click(function(){
    $("#com_set_import_prev").show();
    $("#com_set_import_after").hide();
});
