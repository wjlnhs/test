/**
 * Created by jialin on 2014/12/19.
 */
define(function (require, exports) {
    template.openTag='{{';
    template.closeTag='}}';
    window.addgrowthIndex=1;
    template.helper('$creatguid',function(ID){
        return ID || addgrowthIndex;
    })
    template.helper('$dateFormat',function(date,formatStr){
        date=date.replace(/\-/g,'/');
        return new Date(date).format(formatStr);
    })
    template.helper('$simpleDateFormat',function(date){
        return date.split(' ')[0];
    })
    var jobInfoTemp=require('./template/jobInfo.tpl');
    var render=template.compile(jobInfoTemp);


})