define(function (require, exports,module) {
    var i8ui=require('../../common/i8ui.js');
    var city=require('./cityconfig.js').city;
    var selectrender=template(require('./tpl/select.tpl'));
    /*build(remove.start)*/
    require('../i8scrollbar/css/mscrollbar.css');
    /*build(remove.end)*/
    var initProvince=function(key){
        var keyval=[];
        var lev1code=city.lev1code;
        var lev1name=city.lev1name;
        for(var i=0;i<lev1code.length;i++){
            keyval.push({
                value:lev1code[i],
                key:lev1name[i]
            })
        }
        var key=key||lev1name[0];
        var index=getIndex(key,lev1name);
        var provinceSelect=$('#provinceSelect');
        provinceSelect.html(selectrender({list:keyval}));
        provinceSelect.setKey(lev1name[index]);
        initCity(index,key);
    }

    var initCity=function(index,key){
        var keyval=[];
        var lev2code=city.lev2code[index];
        var lev2name=city.lev2name[index];
        for(var i=0;i<lev2code.length;i++){
            keyval.push({
                value:lev2code[i],
                key:lev2name[i]
            })
        }
        var citySelect=$('#citySelect');
        citySelect.html(selectrender({list:keyval}));

        require.async('../i8scrollbar/mscrollbar.js',function(){
            $('.i8-sel-options').mCustomScrollbar({//添加滚动条功能
                scrollButtons: {
                    enable: true
                },
                set_height:258,
                theme: "dark-thin"
            }).on('click','.mCSB_dragger_bar',function(){
                return false;
            });
        });
        if(index==0){
            citySelect.setKey(key);
        }
    }
    var getIndex=function(value,list){
        for(var i=0;i<list.length;i++){
            if(list[i]==value){
                return i;
            }
        }
        return 0;
    }
    exports.init=function(key){
        $('#provinceSelect').setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked',
            cbk:function(dom){
                var lev1name=city.lev1name;
                initCity(getIndex($(dom).html(),lev1name));
            }
        });

        $('#citySelect').setSelect({
            newi8select:'newi8-select fw_left m-r10',
            dropstyle: 'newselecti',
            ckedstyle: 'newselectcked'
        });
        initProvince(key);
    }
    exports.getSelect=function(){
        var provinceSelect=$('#provinceSelect');
        var citySelect=$('#citySelect');
        return {
            provinceCode:provinceSelect.getValue(),
            provinceName:provinceSelect.getKey(),
            cityCode:citySelect.getValue(),
            cityName:citySelect.getKey()
        }
    }
});