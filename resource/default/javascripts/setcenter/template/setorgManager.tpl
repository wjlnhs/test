<div style="width:380px; padding: 10px 30px 20px 30px;">
    <div class="sbox-tr">
        <div class="sbox-td fz13">
            <label class="set-mg-lb m-r50">
                <input id="js_set_mg_ck1" type="radio" value="js_set_type1" checked name="set-mgtype" />从同事中选择
            </label>
            <label class="set-mg-lb">
                <input type="radio" value="js_set_type2" name="set-mgtype" />从已有兼职角色中选择
            </label>
        </div>
    </div>
    <div id="js_set_type1" class="sbox-tr p5-0 set-type-cont">
        <div class="sbox-td">
            <div class="lt">负责人：</div>
            <div class="lt">
                <input id="js_set_mgtxt" type="text" />
                <div id="js_set_mgtps" class="set-org-mg-cbk m-t10 hide" style="width: 304px;">
                    <p class="">[Name]当前归属在【[OrgName]】，您可以选择：</p>
                    <div class="m-l20">
                        <label class="set-mg-label"><input id="js_set_mg_cktype1" checked name="set-manager-type" type="radio"/>从<span>【[OrgName]】</span>移入到当前部门</label>
                        <label class="set-mg-label m-b5">
                            <input name="set-manager-type" type="radio"/>仍归属在<span>【[OrgName]】</span>，设置兼职属性：
                        </label>
                        <p class="fz12 l-h20 m-l20">兼职名称：<input id="js_part_txt_name" style="height: 25px; width:110px; padding: 0px 5px;" value="[partName]" type="text" /></p>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    <div id="js_set_type2" class="sbox-tr p5-0 set-type-cont hide">
        <div class="sbox-td" id="js_setmg_part_div">
            <div class="lt">兼&nbsp;职：</div>
            <div class="lt">
                <select id="js_set_mgpart" style="height:32px;">
                </select>
            </div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="tright m-t15">
        <span class="gray96x32 m-r10">取消</span>
        <span class="blue96x32">保存</span>
    </div>
</div>