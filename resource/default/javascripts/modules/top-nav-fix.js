//滚动设置
define(function(require){
    $(window).scroll(function(){
        var topHeight = 62;
        var scrollsize = $(document).scrollTop();
        if(scrollsize >= 350){
            $("#js_left_fixed_div").css({top: topHeight, position: "fixed",zIndex: 99});
        }else{
            $("#js_left_fixed_div").css({top: 0, position:"static",zIndex:0});
        }
        if(scrollsize > 120){
            $("#js_head_nav").addClass("fixed");
        }else{
            $("#js_head_nav").removeClass("fixed");
        }
        var rtContDom = $("#js_home_rt_block");
        var blockDoms = $(rtContDom).find("div.rt-block");
        if(!rtContDom.length){
            return;
        }
        var rtTop = rtContDom.outerHeight();
        if(scrollsize >= rtTop){
            rtContDom.css({top: topHeight, position: "fixed"});
            blockDoms.hide();
            var calendarDom = document.getElementById("calendar");
            var taskrptDom = document.getElementById("taskrpt");
            var birthdayDom = document.getElementById("birthday");
            if(calendarDom){
                $(calendarDom).show();
            }
            if(taskrptDom){
                $(taskrptDom).show();
            }
            if(!calendarDom || !taskrptDom){
                if(birthdayDom){
                    $(birthdayDom).show();
                }
            }
            if(!calendarDom && !taskrptDom && !birthdayDom){
                $(blockDoms[0]).show()
            }

        }else{
            rtContDom.css({ position: "inherit",width:250});
            blockDoms.show();
        }
    });
});