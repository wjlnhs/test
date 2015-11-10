<div class="new-folder-cont i8-form readonly-power-cont" style=" width: 575px">
    <dl>
        <dt class="rel"><i class="icon-required">*</i>文件夹名称</dt>
        <dd><input class="foldername"></dd>
        <dt class="rel save-position-title"><i class="icon-required">*</i>上级文件夹</dt>
        <dd>
            <div class="select-gray-box2 rt" style="width: 495px">
                <input readonly="readonly" class="save_position" placeholder="" ><i class="icon icon_select_gray save_position_arrow"></i>
                <div id="document_tree" class="sel_folder ztree"></div>
            </div>
            <div class="clear"></div>
        </dd>
        <dt class="rel folder_admin_title">
            <i class="icon-required">*</i>管理员<i class="icon icon-help admin-help"></i>
        <div class="admin-help-txt">
            <p>1.管理员权限是继承到子文件夹的。</p>
            <p>2.管理员拥有该文件夹的完全控制权限，可读可编辑可删除。</p>
        </div>
        </dt>
        <dd class="folder_admin_box">
            <span class="folder-admin-parent"></span>
            <input class="folder-admin" id="folder_admin">
        </dd>
        <dt class="powerhide rel power-lev1-title" style="display: block;">
            <i class="icon-required inherit-checkbox" parentid=""></i>
            用户权限<i class="icon icon-help user-powerhelp"></i>
        <div class="user-help-txt">
            只读 < 上传
        </div>
        </dt>

    </dl>
    <div class="app-table-list l-h40 powertable powerhide" style="display: block;">
        <div class="parent-scope" >
            <div class="scope-title">上级文件夹用户权限：</div>
            <div class="parent-scope-box"></div>
            <ul>

            </ul>
            <div class="clear"></div>
        </div>

        <div class="cu-scope">
            <div class="scope-title">其他用户权限：</div>
            <ul class="user-power">

            </ul>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
    </div>
</div>
<div class="m-l15 m-r15">
    <div class="h-45 m-t15">
        <span class="btn-blue96x32 rt confirm">确定</span>
        <span class="btn-gray96x32 m-r10 rt cancel">取消</span>
    </div>
    <div class="clear"></div>
</div>