<div class="cate-part-tt cl000 p-b15"><i class="cate-gth"></i>i8小时允许您用邮箱或手机作为登录账号</div>
<div class="cate-row">
    {{if pEmail}}
        <div class="black l-h30 m-b15">
            您当前的邮箱账号：
            <span>{{pEmail}}</span>
            <a class="update-email m-l10 m-r10 bold">修改</a>
            {{if isCancel}}
                <span>|</span>
                <a class="cancel-email m-l10 m-r10 bold">取消邮箱账号</a>
            {{/if}}
        </div>
    {{else}}
        <div class="black l-h30 m-b15">
            您当前的邮箱账号：
            <span>您尚未设置邮箱账号</span>，可
            <a class="add-email m-l10 m-r10 bold">新增</a>
            <span>邮箱账号！</span>
        </div>
    {{/if}}
    {{if pMobile}}
        <div class="black l-h30">
            您当前的手机账号：
            <span>{{pMobile}}</span>
            <a class="update-mobile m-l10 m-r10 bold">修改</a>
            {{if isCancel}}
                <span>|</span>
                <a class="cancel-mobile m-l10 m-r10 bold">取消手机账号</a>
            {{/if}}
        </div>
    {{else}}
        <div class="black l-h30">
            您当前的手机账号：
            <span>您尚未设置手机账号</span>，可
            <a class="add-mobile m-l10 m-r10 bold">新增</a>
            <span>手机账号！</span>
        </div>
    {{/if}}
</div>