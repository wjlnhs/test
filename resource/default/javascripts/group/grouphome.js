/**
 * Created by kusion on 2015/1/15.
 */
define(function(require,exports){
    $(function(){
        $(".ta-home-menu span.ta-tt").click(function(){
            $(".ta-home-menu span.ta-tt").removeClass("current");
            $(this).addClass("current");
            if(this.id=="state-group"){//群组动态

            }else if(this.id=="member-group"){//群组成员

            }else if(this.id=="docs-group"){//群组文档

            }
        })
    })
})
