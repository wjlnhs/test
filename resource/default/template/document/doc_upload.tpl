<div class="new-folder-cont i8-form" style="width:575px;">
    <div class="h-40 m-b10"><a style="width:112px;padding:0px;text-align:center;" class="btn-yellow-h36 bold lt" id="reupload" ><span style="width:112px;height:100%;display:inline-block;" id="reupload_btn">&nbsp;选择文件&nbsp;</span></a></div>
    <div id="upload_hide_div" class="my-doc-upload">
        <ul id="upload_hide_ul" class="queueList filelist"></ul>
        <ul id="upload_hide_ul2" class="queueList filelist"></ul>
    </div>
        <div class="edit-file-item-tip">文档上传完毕，请完成下列信息填写。</div>
        <dl>
            <dt class="rel"><i class="icon-required">*</i>文件名称</dt>
            <dd><input class="foldername"></dd>
            <dt class="rel"><i class="icon-required">*</i>储存位置</dt>
            <dd>
                <div class="select-gray-box2 lt" style="width: 495px">
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
            <dt class="powerhide rel" style="display: block;">
                <i class="icon-required inherit-checkbox" parentid=""></i>
                权限<i class="icon icon-help user-powerhelp"></i>
            <div class="user-help-txt file-user-help-txt">
                <p>1.新增用户权限：只读 < 下载 < 完全控制</p>
                 <p>2.文件只继承文件夹的只读权限</p>
                 <p>3.当所在文件夹权限不能满足需求时，不要勾选</p>
            </div>
            </dt>
        </dl>
        <div class="app-table-list l-h40 powertable powerhide" style="display: block;">
            <div class="parent-scope" >
                <div class="scope-title">所在文件夹权限：</div>
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

            <span class="rt to-kk" style="  float: none; margin-left: 200px;line-height: 35px;"><span class="app-checkbox v--4 m-r15 checked add-blog-info"></span>是否发送侃侃通知</span>
            <span class="btn-blue96x32 rt confirm">确定上传</span>
            <span class="btn-gray96x32 m-r10 rt cancel">取消</span>
        </div>
        <div class="clear"></div>
    </div>