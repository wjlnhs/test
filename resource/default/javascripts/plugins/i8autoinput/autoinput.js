define(function(require,exports){
    exports.init=function(elem,setting){
        var datasource=setting.datasource;
        require('./css/style.css');
        var initrender=template(require('./template/init.tpl'));
        var itemrender=template(require('./template/getitem.tpl'));
        var elem=$(elem);
        var html=$(initrender(setting));
        var wordlength=html.find('.wordlength');//占位文字
        var agtlist=html.find('.autoinput_agtlist');//联想框
        var ksninput=html.find('.fw_ksninput');//选择存储
        var autoinput_boxerContainer=html.find('.autoinput_boxerContainer');//弹出框
        var btn_add_item=autoinput_boxerContainer.find('.btn_add_item');//选择
        var bccr_selectedItem=autoinput_boxerContainer.find('.bccr_selectedItem');//弹出框选择容器
        var outputitem=autoinput_boxerContainer.find('.outputitem .dataitem');//弹出框数据源容器

        var getItems=function(val){
            var arr=[];
            if(!val){
                return arr;
            }
            for(var i=0;i<datasource.length;i++){
                if(datasource[i].Name.search(val)>=0){
                    arr.push(datasource[i]);
                }
            }
            return arr;
        }

        html.on('click','a',function(){
            var _this=$(this);
            _this.parents('.item_slted,.fw_ksninput_slted').remove();
            if(_this.hasClass('inputdelete')){
                setting.callback&&setting.callback(getSelectDataItem('.fw_ksninput_slted'));
            }
        });

        html.on('click','.autoinput_ksntxtbox_alert_ico',function(){
            var selectarr=getSelectDataItem('.fw_ksninput_slted');
            bccr_selectedItem.html(itemrender({arr:selectarr}));
            autoinput_boxerContainer.toggleClass('hide');

        });

        html.on('click','.fw_ksninput',function(){
            html.find('input.igroup-input').trigger('focus');
        });

        html.on('focus','input.igroup-input',function(){
            html.addClass('ksner-focus');
        });
        html.on('blur','input.igroup-input',function(){
            html.removeClass('ksner-focus');
        });


        agtlist.on('click','dd',function(){
            var input=html.find('input.igroup-input');
            var _dd=$(this);
            input.val('');
            agtlist.hide();
            if(getSelectItemStr('.fw_ksninput_slted').search(';'+_dd.attr('dataid')+';')>=0){
                return;
            }
            input.before('<span class="fw_ksninput_slted" dataname="'+_dd.attr('dataname')+'" dataid="'+_dd.attr('dataid')+'"><em>'+_dd.attr('dataname')+'</em><a></a></span>')
            setting.callback&&setting.callback(getSelectDataItem('.fw_ksninput_slted'));
        });

        html.on('input propertychange','input.igroup-input',function(){
            var _this=$(this);
            var _val= $.trim(_this.val());
            wordlength.html(_val);
            _this.css('width',wordlength.width()>10?wordlength.width()+'px':'10px');
            var _arr=getItems(_val);
            var htmlarr=[' <dt>检索</dt>'];
            for(var i=0;i<_arr.length;i++){
                htmlarr.push('<dd dataname="'+_arr[i].Name+'" dataid="'+_arr[i].ID+'">'+_arr[i].Name+'</dd>')
            }
            if(htmlarr.length>1){
                agtlist.show();
            }else{
                agtlist.hide();
            }
            agtlist.html('<dl>'+htmlarr.join('')+'</dl>');
        });

        html.on('click','.dataitem',function(){
            $(this).toggleClass('selected');
            var selectitem=getSelectDataItem('.outputitem li.selected');
            if(selectitem.length>0){
                btn_add_item.removeClass('disable_add');
            }else{
                btn_add_item.addClass('disable_add');
            }
        });

        elem.parent().html(html);

        autoinput_boxerContainer.on('click','.btn_cancel_select',function(){
            autoinput_boxerContainer.addClass('hide');
        })

        autoinput_boxerContainer.on('click','.btn_submit_select',function(){
            var selectarr=getSelectDataItem('.item_slted');
            ksninput.html(itemrender({type:1,arr:selectarr}))
            autoinput_boxerContainer.addClass('hide');
            setting.callback&&setting.callback(selectarr);
        })

        autoinput_boxerContainer.on('click','.btn_add_item:not(.disable_add)',function(){
            var selectarr=getSelectDataItem('.outputitem li.selected');
            var selectStr=getSelectItemStr('.item_slted');
            var newarr=[];
            selectarr.map(function(item,i){
                if(selectStr.search(';'+item.dataid+';')<0){
                    newarr.push(item);
                }
            });
            btn_add_item.addClass('disable_add');
            outputitem.removeClass('selected');
            bccr_selectedItem.append(itemrender({arr:newarr}));
        });


        var getSelectItemStr=function(className){
            var selectarr=[';'];
            html.find(className).each(function(i,item){
                var _item=$(item);
                selectarr.push(_item.attr('dataid'));
            });
            return selectarr.join(';')+';';
        }
        var getSelectDataItem=function(className){
            var selectarr=[];
            html.find(className).each(function(i,item){
                var _item=$(item);
                selectarr.push({
                    dataid:_item.attr('dataid'),
                    dataname:_item.attr('dataname')
                });
            });
            return selectarr;
        }
        return new function(){
            this.getSelectItems=function(){
                return getSelectDataItem('.fw_ksninput_slted');
            }
        }
    }
});