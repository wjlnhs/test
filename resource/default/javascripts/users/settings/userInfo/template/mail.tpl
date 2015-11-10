<div class="cate-row b-gray-sty1 mail">
    <div class="cate-title lt"><i class="icon icon-mail m-r20 m-t10"></i>邮件账号</div>
    <div class="editing">
        <span class="intro" id="mail_title">{{Email}}</span>
        <a class="edit">&nbsp;<i class="icon icon-down-solid"></i>展开</a>
    </div>
    {{if Email}}
    <a class="btn-yellow-h36 deletemail rt">&nbsp;<i class="icon icon-del v--4"></i>&nbsp;&nbsp;&nbsp;取消该账号&nbsp;&nbsp;</a>
    {{/if}}
    <div class="clear"></div>
    {{if Email}}
    <div class="cate-body">
        <div class="preview m-l40">
        </div>
        <div class="b-blue-sty1 m-l40">
            <div class="cate-row m-b15 h33 l-h30">
                <div class="black lt w-85">当前帐号</div>
                <span class="blue" id="current_mail">{{Email}}</span>
            </div>
            <div class="cate-row m-b15">
                <div class="black lt w-85 l-h30">新邮箱</div>
                <input id="chg_pass_new_passport" class="w-830" i8formtype="mail" type="text" placeholder="请输入新邮箱" />
            </div>
            <div class="cate-row m-b15">
                <div class="black lt w-85 l-h30">密码</div>
                <input id="chg_pass_passsword" class="w-830" i8formtype="psw" type="password" placeholder="请输入当前登录密码" />
            </div>
            <div class="cate-row m-b15 h-40">
                <div class="black lt w-85 l-h40">验证码</div>
                <input id="chg_pass_new_passport_yzm" i8formtype="yzm" class="w-682" type="text" placeholder="邮箱中六位验证码" />
                <span class="btn-blue-h32 m-l10" id="mail_v_code">&nbsp;&nbsp;获取验证码&nbsp;&nbsp;</span>
            </div>
            <div class="cate-row m-t15">
                <div class="black lt w-85 l-h30">&nbsp;</div>
                <span id="ckb_chg_pass_new_passport" class="design-bg-icons3 app-checkbox checked v--4"></span>
                <span class="blue cate">同时修改我在“上海汇明” 个人信息的邮箱</span>
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
            <div class="b-blue-sty1 m-l40">
                <div class="cate-row m-b15">
                    <div class="black lt w-85 l-h30">新邮箱</div>
                    <input id="chg_pass_new_passport" class="w-830" i8formtype="mail" type="text" placeholder="请输入新邮箱" />
                </div>
                <div class="clear"></div>
                <div class="sub tcenter m-t15 ">
                    <span class="btn-blue-empty-h32 cancel">&nbsp;取 消&nbsp;</span>
                    <span class="btn-blue-h32 confirm m-l20">&nbsp;确 定&nbsp;</span>
                </div>
            </div>
        </div>
    {{/if}}
</div>
