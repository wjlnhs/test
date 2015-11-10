<div style=" padding:20px;">
    <table class="igroup-add-tb">
        <tr>
            <th>群组名称</th>
            <td><input id="js_add_gp_name" class="igroup-input" type="text" placeholder="请输入的群组名称最多30个字" /></td>
        </tr>
        <tr>
            <th>群组简介</th>
            <td>
                <textarea id="js_add_gp_intro" class="igroup-txt lt" type="text" placeholder="请输入群组简介最多40个字"></textarea>
            </td>
        </tr>
        <tr id="js_gp_add_tr" class="hide">
            <th>邀请同事</th>
            <td><input id="js_invite_gp_txt" class="igroup-input" type="text"/></td>
        </tr>
        <tr>
            <th>群组图标</th>
            <td>
                <div class="">
                    <img id="js_add_group_icon" class="lt igroup-img140" src="https://dn-i8res.qbox.me/public/platform/defgroup.png" />
                    <p class="fz14-weight cl000 p-t10">140*140 效果最佳</p>
                    <p>仅支持jpg、png、gif、jpeg格式，文件小于30M。</p>
                    <div id="js_upfile_div" class="m-t10 lt"><span id="js_upfile_btn" class="btn-blue96x32">上传</span></div>
                    <div id="js_upfile_lists" class="im-hide"></div>
                </div>
            </td>
        </tr>
        <tr>
            <th>群组类型</th>
            <td id="js_add_gp_type">
                <div class="igroup-type-op cl000 ck">
                    <label><input value="0" type="radio" checked name="group_type" />公开</label><span class="igroup-type-tps"><i>◆<em>◆</em></i>公司所有员工可以自由加入</span>
                </div>
                <div class="igroup-type-op cl000">
                    <label><input value="2" type="radio" name="group_type" />限制</label><span class="igroup-type-tps"><i>◆<em>◆</em></i>在群组列表中显示，但需要申请才能加入</span>
                </div>
                <div class="igroup-type-op cl000">
                    <label><input value="1" type="radio" name="group_type" />不公开</label><span class="igroup-type-tps"><i>◆<em>◆</em></i>不在群组列表中显示，只能通过管理员邀请加入</span>
                </div>
            </td>
        </tr>
        <tr>
            <th></th>
            <td>
                <span id="js_addedit_grp_btn" class="igroup-c-btn">创建新群组</span>
            </td>
        </tr>
    </table>
</div>