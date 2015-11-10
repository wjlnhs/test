/**
 * Created by chent696 on 2015/4/12.
 */
define(function (require, exports) {

    var fw_page=require('../common/fw_pagination.js');

   var vacationUnit,dayHours;
    var templateHtml = '<table><thead><tr>\
        {headData}\
    </tr>\
    <tr class="no-blod">\
        {rowData}\
    </tr></thead>\
    <tbody><tr>{userData}</tr></tbody></table>';
    var vacationTypeArr = ['流程申请','单项调整',
        '',
        '单人调整',
        '',
        ''];
    var dataHtml = '<tr>\
        <td>{userName}</td>\
        <td>{createTime}</td>\
        <td>{itemName}</td>\
        <td><span class="vacation-type-switch" originalvalue="{amount}">{amount}</span></td>\
    <td>{updateType}</td>\
    <td>{description}</td>\
    <td>{folio}</td>\
    </tr>';

    var headerHtml = '<thead><tr><td>申请人</td><td>申请时间</td><td>假期类型</td><td>假期数量</td><td>调整类型</td><td>调整原因</td><td>对应流程</td></tr></thead>';


    var fnGetVacationUnit =  function(option,callback){

        $.ajax({
            url:i8_session.ajaxHost+'webajax/ucenter_ajax/ajaxGetVacationUnit',
            type: 'get',
            dataType: 'json',
            async:false,
            success: function (data) {
                // console.log(data);
                if($.isFunction(callback)) {
                    callback(data);
                }
            }
        });
    }

    var fnGetSummaryByUser = function(option,callback){

        $.ajax({
            url:i8_session.ajaxHost+'webajax/ucenter_ajax/ajaxGetSummaryByUser',
            type: 'get',
            dataType: 'json',
            data:(option||{}),
            // async:false,
            success: function (data) {
                // console.log(data);
                if($.isFunction(callback)) {
                    callback(data);
                }
            }
        });

    }

    var fnGetVacationInfoOfHe = function() {

        var _href = location.href;
        var _userId = _href.substr(_href.lastIndexOf('/')+1).split('?')[0];
        var _data = {};
        _data.userids = _userId;
        _data.pageindex = 1;
        _data.pagesize = 1;
        _data.itemid = '';
        //fnGetSummaryByUser(_data, function (data) {
        //
        //    var _data = data || {};
        //    var _json = _data.ReturnObject.Item2;
        //    //templateHtml
        //    var _html = '';
        //    var _userName = $('.fw_ksntxtbox').find('em').text();
        //    var _headData = '', _rowData = '', _userData = '';
        //    // _headData += '<td>'+_userName+'</td><td></td>';
        //
        //    var _showSurplus = '', _showActual = '';
        //
        //    for (var i = 0, len = _json.length; i < len; i++) {
        //
        //        _headData += '<td colspan="2">' + _json[i].ItemName + '</td>';
        //        _rowData += '<td>已用</td><td>可用</td>';
        //        _showSurplus = _json[i].Surplus;
        //        _showActual = _json[i].Actual;
        //        //if (vacationUnit == '天') {
        //        //    _showActual = _showActual / dayHours;
        //        //    _showSurplus = _showSurplus / dayHours;
        //        //}
        //        _userData += '<td originalvalue="' + _json[i].Actual + '"><span class="vacation-type-switch">' + (_showActual || 0).toFixed(2) + '</span></td><td originalvalue="' + _json[i].Surplus + '"><span class="vacation-type-switch">' + (_showSurplus || 0).toFixed(2) + '</span></td>';
        //    }
        //   // _userData = '<td>' + _userName + '</td><td></td>' + _userData;
        //
        //    _html = templateHtml.replace('{headData}', _headData).replace('{rowData}', _rowData).replace('{userData}', _userData);
        //
        //    $('#ta_vacation_data').html(_html);
        //});

        fnGetSummaryByUser(_data,function(data){

            var _data = data || {};
            var _retData = _data.ReturnObject.Item2;
            //templateHtml
            var _html = '';
            var _userName = $('.fw_ksntxtbox').find('em').text();
            var _headData = '',_rowData = '',_userData = '',_json;
            // _headData += '<td>'+_userName+'</td><td></td>';

            var _showSurplus = '',_showActual = '';

            for(var j= 0,length=_retData.length;j<length;j++) {

                _json = _retData[j].Items;
                _headData = '',_rowData = '',_userData = '';
                for (var i = 0, len = _json.length; i < len; i++) {
                    if(j==0) {
                        _headData += '<td colspan="2">' + _json[i].ItemName + '</td>';
                        _rowData += '<td>已用</td><td>可用</td>';
                    }
                    _showSurplus = _json[i].Surplus;
                    _showActual = _json[i].Actual;
                    //if (vacationUnit == '天') {
                    //    _showActual = _showActual / dayHours;
                    //    _showSurplus = _showSurplus / dayHours;
                    //}
                    _userData += '<td ><span class="vacation-type-switch" originalvalue="' + _json[i].Actual + '">' + (_showActual || 0).toFixed(2) + '</span></td><td ><span class="vacation-type-switch" originalvalue="' + _json[i].Surplus + '">' + (_showSurplus || 0).toFixed(2) + '</span></td>';
                }
                //_userData = '<td>' + _retData[j].UserName + '</td><td>'+_retData[j].OrgName+'</td>' + _userData;

                _html += templateHtml.replace('{userData}', _userData);
            }

            _html =  templateHtml.replace('{headData}', _headData).replace('{rowData}', _rowData).replace('{userData}', _userData);;//headHtml.replace('{headData}', _headData).replace('{rowData}', _rowData) + _html;
            $('#ta_vacation_data').html(_html);
            $('#ta_vacation_data_timeset').find('a').each(function(){
                if($(this).text() == vacationUnit){
                    $(this).trigger('click');
                }
            });

        });
    }();

    var fnInitVacationTypeEvent = function(){

        $('.vacation-vacationtype').on('click','.app-checkbox-text,.app-checkbox',function(){

            var _$me = $(this);
            var _$checkBox = _$me.parent('span').find('.app-checkbox');
            var _className = _$me.attr('class');
            //if(_className.indexOf(''))
            var _isCheckBoxText = _className.indexOf('app-checkbox-text')>-1,_isCheckBox = _className.indexOf('app-checkbox')>-1;

            //是否是全选
            if(_$me.parent('span').attr('class').indexOf('checkbox-checkall')>-1){

                if(_$checkBox.hasClass('checked')){
                    _$me.parent().parent().find('.app-checkbox').each(function(){
                        $(this).removeClass('checked');
                    });
                }else{
                    _$me.parent().parent().find('.app-checkbox').each(function(){
                        $(this).addClass('checked');
                    });
                }
                return;
            }

            _$me.parent().find('.app-checkbox').toggleClass('checked');

        })
    }


    var fnGenerateVacationTypeHtml = function(data){

        var _data = data ||[];
        var _$container = $('.vacation-vacationtype');
        var _template = ' <span class="m-r25 {className}">\
            <span class="design-bg-icons3 app-checkbox v--4" data-id="{id}" dataid="{id}"></span>\
        <span class="app-checkbox-text" >{data}</span>\
        </span>';

        var _html = '';
        //全部
        _html += _template.replace('{className}','checkbox-checkall').replace('{data}','全部').replace('{id}','').replace('{id}','');

        for(var i= 0,len=_data.length;i<len;i++){
            //vacation-vacationtype
            _html += _template.replace('{className}','').replace('{data}',_data[i].Text).replace('{id}',_data[i].ID).replace('{id}',_data[i].ID);
        }
    _html = '<table><tr> <td style="vertical-align: top;width:68px;">假期类型:</td> <td>'+_html+'</td></tr></table>';
        _$container.append(_html);
        fnInitVacationTypeEvent();

    }

    var fnGetVacationList = function(option,callback){

        //ajaxGetVacationDetailList
        $.ajax({
            url:i8_session.ajaxHost+'webajax/ucenter_ajax/ajaxGetVacationDetailList',
            type: 'get',
            dataType: 'json',
            data:(option||{}),
            // async:false,
            success: function (data) {
                // console.log(data);
                if($.isFunction(callback)) {
                    callback(data.ReturnObject);
                }
            }
        });
    }

    var fnGetVacationType= function(callback){

        $.ajax({
            url:i8_session.ajaxHost+'webajax/ucenter_ajax/ajaxGetVacationType',
            type: 'get',
            dataType: 'json',

            // async:false,
            success: function (data) {
                // console.log(data);
                if($.isFunction(callback)) {
                    data.ReturnObject=data.ReturnObject || {};
                    callback(data.ReturnObject.Items);
                }
            }
        });
    }

    fnGetVacationType(fnGenerateVacationTypeHtml);

    $('#app_table_data_timeset').on('click','a',function(){

        $('#app_table_data_timeset').find('.selected').removeClass('selected');
        $(this).addClass('selected');

        var _thisVacationUnit = $.trim( $(this).text());
       // vacationUnit = $.trim($(this).text());
        var originalvalue = '';
        $('#app_table_data').find('.vacation-type-switch').each(function(){
            originalvalue = parseFloat($(this).attr('originalvalue')||'0')||0;
            if(_thisVacationUnit == '天'){
                $(this).text((originalvalue/dayHours).toFixed(2));
            }else{
                $(this).text(originalvalue.toFixed(2));
            }
        });



        //$('.vacation-type-switch').each(function(){
        //    originalvalue = $(this).parent('td').attr('originalvalue');
        //    if(vacationUnit == '天'){
        //        $(this).text((originalvalue/dayHours).toFixed(2));
        //    }else{
        //        $(this).text(originalvalue);
        //    }
        //});
    });

    $('#ta_vacation_data_timeset').on('click','a',function(){

        $('#ta_vacation_data_timeset').find('.selected').removeClass('selected');
        $(this).addClass('selected');
        var _thisVacationUnit = $.trim( $(this).text());
        var originalvalue = '';
        $('#ta_vacation_data').find('.vacation-type-switch').each(function(){
            originalvalue = parseFloat($(this).attr('originalvalue')||'0')||0;
                if(_thisVacationUnit == '天'){
                    $(this).text((originalvalue/dayHours).toFixed(2));
                }else{
                    $(this).text(originalvalue.toFixed(2));
                }
        });
        //vacationUnit = $.trim($(this).text());


        //$('.vacation-type-switch').each(function(){
        //    originalvalue = $(this).parent('td').attr('originalvalue');
        //    if(vacationUnit == '天'){
        //        $(this).text((originalvalue/dayHours).toFixed(2));
        //    }else{
        //        $(this).text(originalvalue);
        //    }
        //});
    })

    var fnQueryData = function(pageIndex){

        var _pageIndex = pageIndex || 1;

        var _href = location.href;
        var _selectedId = _href.substr(_href.lastIndexOf('/')+1);
        var _data = {};
        var  _vacationTypeArr = [];

        $('.vacation-vacationtype').find('.checked').each(function(){

            var _$me = $(this);
            var _dataId = _$me.attr('dataid');
            if(!!_dataId){

                _vacationTypeArr.push(_dataId);
            }
        });

        var _adjustTypeArr = [];

        //$('.vacation-adjusttype').find('.checked').each(function(){
        //
        //    var _$me = $(this);
        //    var _updateType = _$me.attr('adjusttype');
        //    if(!!_updateType) {
        //        _adjustTypeArr.push(_updateType);
        //    }
        //
        //});


        _data={'applyid':_selectedId,'vacationtype':_vacationTypeArr.join(','),'updatetype':_adjustTypeArr.join(','),'pageindex':_pageIndex,'pagesize':10};
        _data.begindate=$('#txt_StartTime').val();
        _data.enddate = $('#txt_EndTime').val();

        var _callback = function(data){

            var _retObj = data || {};
            var _jsonData = _retObj.Item3 || [];

            var _templateHtml = '',_html = '';
            for(var i= 0,len=_jsonData.length;i<len;i++){

                _templateHtml = dataHtml.replace('{userName}',(_jsonData[i].UserName||''));
                _templateHtml = _templateHtml.replace('{itemName}',_jsonData[i].ItemName);
                _templateHtml = _templateHtml.replace('{updateType}',vacationTypeArr[_jsonData[i].UpdateType]);
                _templateHtml = _templateHtml.replace('{createTime}',_jsonData[i]['CreateTime']);
                _templateHtml = _templateHtml.replace('{description}',(_jsonData[i].Description||'')).replace(/\{amount\}/g,parseFloat(_jsonData[i].Amount||'0').toFixed(2));
                if(!!_jsonData[i].ViewURL){
                    _templateHtml = _templateHtml.replace('{folio}','<a target="_blank"  href="'+(i8_session.wfbaseHost||'').slice(0,-1)+_jsonData[i].ViewURL+'">'+_jsonData[i].Folio+'</a>');
                }else{
                    _templateHtml = _templateHtml.replace('{folio}','');
                }

                _html += _templateHtml;
            }
            $('#app_table_data').html('<table>'+headerHtml+_html+'</table>');

            $('#app_table_data_timeset').find('a').each(function(){
                if($(this).text() == vacationUnit){
                    $(this).trigger('click');
                }
            });

            fw_page.pagination({
                ctr: $('.pagination'),
                totalPageCount: _retObj.Item1,
                pageSize: 10,
                current: _pageIndex||1,
                fun: function (new_current_page, containers) {
                    fnQueryData(new_current_page);
                }, jump: {
                    text: '跳转'
                }
            });

        }

        fnGetVacationList(_data,_callback);



    }



    fnGetVacationUnit({},function(data){

        var retData   = data.ReturnObject ||{};
        vacationUnit = retData.Unit ||'';
        dayHours = retData.DayHours ||8;
        $('.vacation-hour').removeClass('selected');
        $('.vacation-day').removeClass('selected');

        if(vacationUnit == '小时'){
            $('.vacation-hour').addClass('selected');
        }else{
            $('.vacation-day').addClass('selected');
        }
        //$('.vacation-setting-defaultUnit').text(vacationUnit);
        // $('.vacation-setting-defaultHour').text((retData.DayHours || ''));
    });

    $('#query').on('click',function(){

        fnQueryData();
    })

})