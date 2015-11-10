define(function (require, exports,modules) {
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    require('../../javascripts/common/changeCNAMoney_cmd.js')
    var ajax=require('./common').common.ajax;
    var page=$('#page');
    var $infobox=$('#infobox');
    var LICENSETYPEARR=['组织机构代码证','营业执照','行政机关','社会团体','军队','武警','下属机构(具有主管单位批文号)','基金会','其他']//证件类型
    var $success1=$('#success1')//申购成功弹出框
    var $success2=$('#success2')//赎回成功弹出框
    var deal=function(json){
        var dielog1=json.dielog1;
        var title=json.title;
        var type=json.type;
        var _html=$(dielog1).html();//赎回html
        var _html2=$('#confirm_dielog').html();//赎回或者申购确认单
        var dielog=i8ui.showbox({
            title:title,
            cont:_html
        })
        var $moneyInput=$(dielog).find('input');
        var $confirmBtn=$(dielog).find('.confirm');//第一个弹出框确认按钮
        //var $subbtn=$(dielog).find('.confirm');
        $(dielog).on('input propertychange','input',function(){
            var $this=$(this);
            var money= $.trim($this.val()) || 0;
            if(!$.isNumeric(money)){
                $('.cna-money').addClass('red').text('您输入的金额格式不合法');
                return false;
            }else if(money.toString().length>13){
                $('.cna-money').addClass('red').text('您输入的金额超过最大位数');
                $this.val($this.val().substr(0,13));
                return false;
            }else{
                $('.cna-money').removeClass('red').text(changeCNAMoney($moneyInput.val().replace(/^0+/,'')));
                //$('#peopleerror').text('')
            }
        })
        $(dielog).on('click','.cancel',function(){
            dielog.close();
        })
        $confirmBtn.on('click',function(){
            if(!$.trim($('.money-input').val())){
                i8ui.error('金额不能为空')
                return false;
            }
            if($('.cna-money').hasClass('red')){
                i8ui.error($('.cna-money').text())
                return false;
            }
            $(dielog).hide();
            var dielog2=i8ui.showbox({
                title:title+'确认单',
                cont:_html2
            })
            var $subbtn=$(dielog2).find('.confirm');//提交按钮
            var $backbtn=$(dielog2).find('.cancel');//返回按钮
            var $colsebtn=$(dielog2).find('.ct-close')//x按钮
            $colsebtn.on('click',function(){
                dielog.close();
            })
            $backbtn.on('click',function(){
                $(dielog).show();
                dielog2.close();
            })
            $subbtn.on('click',function(){
                ajax.postDataSuccess({model:{FundCode:FundCode,Type:type,Amount:parseFloat($moneyInput.val())}},function(data){
                    if(data.Result){
                        var successDielog=null;
                        if(type==1){
                            successDielog=i8ui.showbox({
                                cont:$success2.html()
                            })
                            var shuhuiriqi=new Date(new Date().setDate(new Date().getDate()+2)).format('MM月dd日')//到帐日期
                            $(successDielog).find('.shuhuiriqi').text(shuhuiriqi);
                        }else{
                            successDielog=i8ui.showbox({
                                cont:$success1.html()
                            })
                        }
                        $(successDielog).find('.confirm').on('click',function(){
                            successDielog.close();
                        })
                        dielog2.close();
                        dielog.close();
                    }
                },'saveapply',$subbtn);
            })
            ajax.getDataSuccess({fundCode:FundCode},function(data){
                if(!data.Result){
                    $(dielog2).html(data.Description);
                    return;
                }
                if(!data.ReturnObject){
                    $(dielog2).html('您还未开通企业宝');
                    return;
                }
                var _data=data.ReturnObject;
                $('#CompanyName').text(_data.CompanyName);
                $('#LicenseType').text(LICENSETYPEARR[_data.LicenseType]);
                $('#TransactionAccountID').text(_data.TransactionAccountID);
                $('#LicenseNo').text(_data.LicenseNo);
                $('#FundCode').text(_data.FundCode);
                $('#inorout').text(title);
                $('#deal_money').text(parseFloat($('.money-input').val())+' '+$('.cna-money').text());
            },'getcompanyinfo');
        })
    }
    //获取收益
    var init=function(){
        ajax.getDataSuccess({fundCode:FundCode},function(data){
            console.log(data)
        },'getcmppayincome');
        $('.turnin').on('click',function(){
            var $this=$(this);
            if($this.hasClass('avoid')){
                i8ui.error('现在不是交易时间！');
                return false;
            }
            deal({
                dielog1:'#turnin_dielog'//输入框弹出框,
                ,title:'申购'//类型
                ,type:0//1赎回0申购
            });

        })

        //赎回
        $('.turnout').on('click',function(){
            var $this=$(this);
            if($this.hasClass('avoid')){
                i8ui.error('现在不是交易时间！');
                return false;
            }
            deal({
                dielog1:'#turnout_dielog'//输入框弹出框,
                ,title:'赎回'//类型
                ,type:1//1赎回0申购
            });
        })
    }
    var chartInit=function(){
        var today=new Date();
        var endDate=today.format('yyyy-MM-dd');
        var startDate=new Date(today.setDate(today.getDate()-6)).format('yyyy-MM-dd');
        ajax.getDataSuccess({},function(data){
            console.log(data)
            var $container=$('#chartcontainer3');
            if(!data.Result){
                $container.html(data.Description);
                return;
            }
            if(!data.ReturnObject){
                $container.html('0');
                return;
            }
            var timeArr= _.map(data.ReturnObject,function(item){
                return item.DateID.substr(4,2)+'-'+item.DateID.substr(-2);
            })
            var moneyArr= _.map(data.ReturnObject,function(item){
                return item.IncomeRate;
            })
            console.log(timeArr)
            $container.highcharts({
                chart: {
                    type: 'area'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: timeArr.reverse(),
                    labels: {
                        formatter: function() {
                            return this.value; // clean, unformatted number for year
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            return this.value+'%';
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        return ''+ this.x +' <br/><b>'+this.y+'%</b>';
                    },
                    crosshairs: true
                },
                plotOptions: {
                    area: {
                        marker: {
                            symbol: 'circle',
                            radius: 5,
                            states: {
                                hover: {
                                    enabled: true,
                                    fillColor: '#ffffff',
                                    lineColor: '#47c7ea'
                                }
                            },
                            fillColor: '#47c7ea',
                            lineColor: '#47c7ea',
                            lineWidth: 1
                        },
                        color:'#daf4fb'
                    }
                },
                series: [{
                    name: '企业宝',
                    data: moneyArr.reverse(),
                    symbol: 'circle',
                    zIndex: 1,
                    marker: {
                        fillColor: '#47c7ea',
                        lineWidth: 2
                    }
                }]
            });
        },'getreport');
    }
    init();
    chartInit();
});