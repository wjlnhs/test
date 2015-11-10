<div class="edit-task-cont" style="width:796px;">
    <div class="i8-form">
        <dl>
            <dt>任务名称<i class="icon-required">*</i></dt>
            <dd>
                <input id="taskName" i8formtype="required:任务名称" class="w-724" placeholder="">
            </dd>
            <dt>负责人<i class="icon-required">*</i></dt>
            <dd id="ownerName">
                <input id="head" isSelector="true" />
            </dd>
            <dt>执行时间<i class="icon-required">*</i></dt>
            <dd>
                <input id="add_StartTime" i8formtype="required:任务时间" type="text" style="width: 335px;" class="time-input"> &nbsp;至&nbsp;
                <input id="add_EndTime" i8formtype="required:任务时间" type="text"  style="width: 334px;" class="time-input">
            </dd>
            <dt>参与人</dt>
            <dd class="participants">
                <input id="participants" class="first" isSelector="true"/>
            </dd>
            <dt></dt>
            <dd>
                <a class="blue more isup"><span class="up"><i class="icon icon-up"></i>收起更多选项</span><span class="down"><i class="icon icon-down-solid"></i>展开更多选项</span></a>
            </dd>
        </dl>
        <dl class="more-box task-more">
            <dt>附件</dt>
            <dd id="uploaderbtn_box">
                <a id="uploaderbtn" class="btn-attachment m-t5" style="width: 150px;">
                    点击添加附件
                </a>
                <div id="uploader">
                    <ul class="queueList"><ul id="queueList" class="filelist"></ul></ul>
                </div>
            </dd>
            <dt>任务描述</dt>
            <dd>
                <textarea id="task_des" class="detail" placeholder=""></textarea>
            </dd>
            <dt>评审人</dt>
            <dd id="review_name">
                <span class="lt m-t10 m-r15"><span class="app-checkbox add-review-name v--4"></span> &nbsp;任务需要评审</span><input  placeholder="请选择评审人" id="review_people" />
                <div class="clear"></div>
            </dd>
            <dt>任务提醒</dt>
            <dd>
                <span  class="lt m-t10 m-r15">任务提前到&nbsp;</span>
                <input id="delay_time" value="15" style="width: 308px">
                <div class="select-gray-box2 rt" style="width: 300px">
                    <select id="time_em" style="height: 34px;width:300px;">
                        <option>分钟</option>
                        <option>小时</option>
                        <option>天</option>
                    </select>
                </div>
            </dd>
        </dl>
    </div>
    <div class="clear"></div>
    <div class="h-45">
        <span class="btn-blue96x32 rt" id="save_task">保存</span>
        <span class="btn-gray96x32 m-r10 rt" id="cancel_task">取消</span>
    </div>
    <div class="clear"></div>
</div>