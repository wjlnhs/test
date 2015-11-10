<div class="new-folder-cont i8-form" style="width:575px;">
        <div class="edit-file-item-tip">文档上传完毕，请完成下列信息填写。</div>
        <dl class="file-name-box">
            <dt class="rel"><i class="icon-required">*</i>主题</dt>
            <dd><input class="file-name"></dd>
            <dt class="rel">储存位置</dt>
            <dd>
                <div class="select-gray-box2 rt" style="width: 495px">
                    <input readonly="readonly" class="save_position"  placeholder=""><i class="icon icon_select_gray save_position_arrow"></i>
                    <div id="document_tree" class="sel_folder ztree"></div>
                </div>
                <div class="clear"></div>
            </dd>
            <dt class="rel"><i class="icon-required inherit-checkbox">*</i>权限</dt>
            <dd><span id="upload_inherit" class="app-checkbox v--4 m-r15 {if IsInherit}checked{/if}  inherit-checkbox"></span>和所在文件夹权限保持一致</dd>
        </dl>
        <div class="app-table-list l-h40 powertable">
            <table>
                <thead>
                <tr>
                    <td class="w-200">用户
                                        </td>
                                        <td class="w-80">只读
                                        </td>
                                        <td class="w-80">读写
                                        </td>
                                        <td class="w-80">管理
                                        </td>
                                        <td class="w-100">操作
                                        </td>
                </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
            <a href="#" class="longadd"><i class="icon icon-white-add"></i>&nbsp;添加</a>
        </div>
    </div>

    <div class="m-l15 m-r15">
        <div class="h-45 m-t15">
            <span class="btn-blue96x32 rt confirm">确定上传</span>
            <span class="btn-gray96x32 m-r10 rt cancel">取消</span>
        </div>
        <div class="clear"></div>
    </div>