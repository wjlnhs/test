<div class="cate-row b-gray-sty1 mobile">
    <div class="cate-title lt"><i class="icon icon-mobile m-r20 m-t10"></i>账号修改</div>
    <div class="editing">
        <span class="intro" id="mobile_title">{{Mobile}}</span>
        <a class="edit">&nbsp;<i class="icon icon-down-solid"></i>展开</a>
    </div>
    {{if Mobile}}
    <a class="btn-yellow-h36 deletemobile  rt">&nbsp;<i class="icon icon-del v--4"></i>&nbsp;&nbsp;&nbsp;取消该账号&nbsp;&nbsp;</a>
    {{/if}}
    <div class="clear"></div>
    {{if Mobile}}
    <div class="cate-body">
        <div class="preview m-l40">
        </div>
        <div class="cate-body b-blue-sty1 m-l40">
            <div class="cate-row m-b15 h33 l-h30">
                <div class="black lt w-85">当前帐号</div>
                <span class="blue" id="current_mobile">{{Mobile}}</span>
            </div>
            <div class="cate-row m-b15">
                <div class="black lt w-85 l-h30">新手机号</div>
                <input class="w-830" id="new_mobile" i8formtype="mobile" value="" type="text" placeholder="请输入新手机号" />
            </div>
            <div class="cate-row m-b15">
                <div class="black lt w-85 l-h30">密码</div>
                <input class="w-830" id="current_mobile_psw"  i8formtype="psw" type="password" placeholder="请输入当前登录密码" />
            </div>
            <div class="cate-row m-b15 h-40">
                <div class="black lt w-85 l-h40">手机验证码</div>
                <input class="w-682" id="mobile_v_code" i8formtype="yzm" type="text" placeholder="短信中六位验证码" />
                <span class="btn-blue-h32 m-l10" id="mobile_v_code_btn">&nbsp;&nbsp;获取验证码&nbsp;&nbsp;</span>
            </div>
            <div class="clear"></div>
            <div class="sub tcenter m-t15 ">
                <span class="btn-blue-empty-h32 cancel">&nbsp;取 消&nbsp;</span>
                <span class="btn-blue-h32 confirm m-l20">&nbsp;确 定&nbsp;</span>
            </div>
        </div>
    </div>
    {{else}}
    <div class="cate-body">
            <div class="preview m-l40">
            </div>
            <div class="cate-body b-blue-sty1 m-l40">
                <div class="cate-row m-b15">
                    <div class="black lt w-85 l-h30">新手机号</div>
                    <input class="w-830" id="new_mobile" i8formtype="mobile" value="" type="text" placeholder="请输入新手机号" />
                </div>
                <div class="clear"></div>
                <div class="sub tcenter m-t15 ">
                    <span class="btn-blue-h32 confirm m-l20">&nbsp;确 定&nbsp;</span>
                    <span class="btn-blue-empty-h32 cancel">取 消</span>
                </div>
            </div>
        </div>
    {{/if}}
</div>