<div class="p20 cl000" style="width:402px;">
    <dl class="up-part-dl">
        {{if email}}
            <dt>当前登录邮箱</dt>
            <dd>{{email}}</dd>
        {{else}}
            <dt>当前登录手机</dt>
            <dd>{{mobile}}</dd>
        {{/if}}
    </dl>
    <dl class="up-part-dl">
        <dt>当前登录密码</dt>
        <dd><input id="js_password" class="up-part-txt" type="password" /></dd>
    </dl>
    <div class="tright m-t10">
        <span isemail="{{email}}" class="cancel-part m-r10 blue96x32">保存</span>
        <span class="gray96x32">取消</span>
    </div>
</div>