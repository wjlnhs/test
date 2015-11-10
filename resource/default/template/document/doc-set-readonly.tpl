<div class="admin-folder-cont i8-form readonly-power-cont" style=" width: 575px">
    <dl>
        <dt class="rel">文件夹名称</dt>
        <dd>{Name}</dd>
        <dt class="rel">上级文件夹</dt>
        <dd>
            <div class="select-gray-box2" style="width: 495px">
                {if IDPathName.substring(0,IDPathName.lastIndexOf('>'))}
                    {IDPathName.substring(0,IDPathName.lastIndexOf('>'))}
                    {else}
                     无
                {/if}
            </div>
        </dd>
        <dt class="rel">
            管理员
        </dt>
        <dd class="folder_admin_box">

        </dd>
        <dt class="powerhide rel" style="display: block;">
            用户权限
        <div class="user-help-txt">
            只读 &lt; 上传
        </div>
        </dt>

    </dl>
    <div class="app-table-list l-h40 powertable powerhide" style="display: inline-block;">
        <div class="parent-scope" {if level==0}style="display:none"{/if}>
            <div class="scope-title">上级文件夹权限：</div>
            <div class="parent-scope-box">
                <ul>

                </ul>
            </div>
            <ul>

            </ul>
        </div>

        <div class="cu-scope">
            <div class="scope-title" {if level==0}style="display:none"{/if}>其他用户权限：</div>
            <ul class="user-power" {if level==0}style="padding-left:0px;"{/if}>

            </ul>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
    </div>
</div>