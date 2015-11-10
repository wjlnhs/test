<div style="width:350px; padding: 10px 30px 20px 30px;">
    <div class="sbox-tr" style="padding: 0px;">
        <div class="sbox-tt lt tright" style="width:80px;">姓&nbsp;&nbsp;名：</div>
        <div class="sbox-td bold lt">
            {Name}
        </div>
        <div class="clear"></div>
    </div>
    <div class="sbox-tr m-b5" style="">
        <div class="sbox-tt lt tright" style="width:80px;"><span class="red m-r5">*</span>{title}：</div>
        <div class="sbox-td lt">
            <input id="js_passport_txt" class="passport-txt" type="text" />
        </div>
        <div class="clear"></div>
    </div>
    {if isEdit == "编辑"}
        <div class="sbox-tr" style="">
            <div class="sbox-tt lt tright" style="width:80px;">登录密码：</div>
            <div class="sbox-td lt">
                <input id="js_password_txt" class="passport-txt" placeholder="8-20个非空字符，不填写则系统随机生成" type="password" />
            </div>
            <div class="clear"></div>
        </div>
    {/if}
    <div class="tright m-t15">
        <span class="blue96x32 m-r10">确定</span>
        <span class="gray96x32">取消</span>
    </div>
</div>