define(function(require){
    function getBegin() {
        if (i8_session) {
            $('#js-my-heading').attr('src', cpi8_sessionimage30);
            $('#js-my-name').html(cpeci8_sessionme);
            $('#js-my-bumen').html(cpec_si8_sessionme);
        }
    }
    function getActiveGroup(){
        $.ajax({
            url: i8_session.ajaxHost+'webajax/group/existGroupNameParam',
            type: 'get',
            dataType: 'json',
            success: function(result){
                console.log(result);
                if(result.Result){
                }
            },
            error: function(e1,e2,e3){
            }
        });
    }
    getActiveGroup();
    getBegin();
});