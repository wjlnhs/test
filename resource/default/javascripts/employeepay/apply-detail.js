

define(function (require, exports,modules) {

    var i8ui=require('../../javascripts/common/i8ui');
    var seefile=require('../common/seefile');
    var ajax=require('./ajax');
    var util=require('../common/util');
    var commom=require('./common').common;
    var applyid=util.getLastUrlName();
    var convertUrlToJson=commom.convertUrlToJson;

    var urls={
        filelist1:{
            BusinessLicenseUrl:'营业执照',
            OrgCodeCertificateUrl:'组织机构代码证正本',
            TaxCertificateUrl:'税务登记证正本',
            CompanyOpeningPermitUrl:'开户许可证',
            CreditCodeCardUrl:'信用机构代码证',
            LPIDCardFrontUrl:'法定代表人身份证',
            ProtocolUrl:'代发协议',
            PowerOfAttorneyUrl :'授权委托书'
        },
        filelist2:{
            PayrollCardFormUrl:'代发工资开卡信息表',
            BusinessListUrl:'代发业务清单',
            BatchSMSUrl:'短信信息表',
            OPIDCardFrontUrl:'经办人身份证正反面复印件'
        },
        filelist3:{
            EbankProtocolUrl:'中信银行代发单位职工集中办理电子银行委托协议',
            EbankApprovalFormUrl:'个人网银集中办理信息登记审批表',
            EbankInfoFormUrl:'批量网银信息表',
            EbankNoticeUrl:'关于集中办理中信银行个人网银的公告'// 关于集中办理中信银行个人网银的公告
        }
    }


    $('#argue').on('click',function(){
         openWindow(1)
    });

    $('#refuse').on('click',function(){
        openWindow(2)
    });

    var openWindow=function(type){
         var showbox=$(i8ui.showbox({title:'请填写审批意见',cont:template('openwindow',{})}));
        showbox.on('click','.sure',function(){
            approve(applyid,type,$('#approveNote').val(),function(data){
                if($.type(data)=='object'&&data.Result){
                    i8ui.write('审批成功！');
                    showbox.find('.ct-close').trigger('click');
                    $(window.opener.document).find('#app_mapsite').find('a[type=2]')[0].click();
                    window.open('','_parent','');
                    window.close();
                    //window.location.href=i8_session.baseHost+'employeepay/review?type=2';
                }else{
                    i8ui.error('审批失败，'+(data.Description||'网络异常，请重试')+'!');
                }
            })
        })

        showbox.on('click','.cancel',function(){
            showbox.find('.ct-close').trigger('click');
        })
    }

    var approve=function(applyid,approveType,approveNote,callback){
        var options= {
            applyID:applyid,
            approveType:approveType,
            approveNote:approveNote
        }
        ajax.postData(options,function(data){
            callback(data);
        },'approve')
    }



    var init=function(){
        $('#closeWindow').on('click',function(){
            window.open('','_parent','');
            window.close();
        });

        if(data&&data.Result&&data.ReturnObject){
            var retobj=data.ReturnObject;
            for(var j in urls){
                var attachmentsArr=[]
                for(var i in urls[j]){
                    if(retobj[i]){
                        attachmentsArr.push(convertUrlToJson(retobj[i],urls[j][i]));
                    }
                }
                var fileslist=$('#'+j);
                if(fileslist.length>0){
                    fileslist.html(seefile.ks.getDocHtml(attachmentsArr,true,null,true));
                }

            }
            seefile.ks.bindImgClick($(document));
        }

        $('#reviewdetail').find('a').each(function(i,item){
            var item=$(item);
            var url=item.attr('url');

            if(!url){

            }else{
                var filearr=url.split('.');
                var filename=item.html();
                var ext=filearr[filearr.length-1]
                if(filearr.indexOf('jpg')>=0||filearr.indexOf('png')>=0){
                    item.attr('href',url+'?attname='+encodeURIComponent(filename)+'.'+ext);
                }else{
                    item.attr('href', location.protocol+"//"+location.host+i8_session.baseHost+'platform/get-file?imgurl='+encodeURIComponent(url)+'&attname='+encodeURIComponent(filename)+'.'+ext);
                }
            }


        })
    }
    init();
});