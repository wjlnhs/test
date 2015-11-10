<div class="detail-page">
<div class="app-header rel">
    <div class="app-header-main show">
        <div class="head-panel">
            <div class="head-l">
                <i class="task-icon task-detail-logo"></i>
                <span class="detail-page-title">任务详情</span>
                <span class="blue">{Name}</span>
            </div>
            <div class="head-r" style="margin-right:18px;">
                {$getBtns(Status,uid,ReviewID,OwnerID,CreaterID)}
            </div>
            <div id="closeWindow" class="commonwindow_top_off"></div>
        </div>
    </div>
</div>
<div class="p-t15 p-b15">
    <div class="app-content">
        <div class="task-cont-l">
            <a class="task-detail-nav">任务详情</a>
            <a class="task-check-nav">子任务</a>
            <a class="task-attach-nav">附件</a>
            <a class="task-comment-nav">评论 </a>
            <a class="task-process-nav">进展</a>
        </div>
        <div class="task-cont-r i8-form">
            <div class="task-cont-r-head" >
                {$getStatusCont(Status,Score,OwnerName,ReviewName,ReviewNote)}
                {if IsFavor}<a class="btn-yellow-h36 focus-task isfocus-task rt"><i class="task-icon icon-eye"></i> 取消关注</a>{else}
                <a class="btn-yellow-h36 focus-task rt"><i class="task-icon icon-eye"></i> 关注任务</a>
                {/if}
            </div>
            <div class="cate-row task-detail-row">
                <div class="cate-title">
                    <i class="task-icon task-detail-icon"></i>任务详情
                    {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'delBtn')}
                </div>
                <div class="cate-body">
                    <dl class="lt w-350">
                        <dt>负责人</dt>
                        <dd class="stopedit owner-box">
                            <input oldid="{OwnerID}" class="people-sel" id="owner" owner_id="{OwnerID}" classify="ownerID" />
                            {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'ownerBtn')}
                            <div class="clear"></div>
                        </dd>
                        <dt>评审人</dt>
                        <dd class="stopedit review-box">
                            <input oldid="{ReviewID}" class="people-sel" id="review" review_id="{ReviewID}" classify="reviewID"/>
                            {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'reviewBtn')}
                            <div class="clear"></div>
                        </dd>
                    </dl>
                    <dl class="rt w-460">
                        <dt>发起人</dt>
                        <dd class="stopedit">
                            <input class="people-sel" id="promoter" promoter_id="{CreaterID}" />
                            <div class="clear"></div>
                        </dd>
                        <dt>执行时间</dt>
                        <dd class="execution-time timestopedit" id="execution_time">
                            <div class="time-show-box lt"><span id="start_time_txt" class="m-l10 m-r10" >{BeginTime}</span>至<span id="end_time_txt" class="m-l10 " >{EndTime}</span></div>
                            <div class="time-edit-box lt">
                                <input class="time-sel time-input" id="start_time" value="{BeginTime}" /> 至
                                <input class="time-sel time-input" id="end_time" value="{EndTime}"/>
                            </div>
                            {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'timerBtn')}
                            <div class="clear"></div>
                        </dd>
                    </dl>
                    <div class="clear"></div>
                    <dl class="perc-100">
                        <dt>参与人</dt>
                        <dd class="stopedit participants-box">
                            <input class="people-sel" id="participants" participants_ids="{JoinerIDs.toString()}"  classify="joinIDs"/>
                            {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'joinerBtn')}
                            <div class="clear"></div>
                        </dd>
                        <dt>任务描述</dt>
                        <dd class="stopedit {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'desBtn')}" id="des_box" style="padding-left:60px;">
                            <div id="des_txt" class="l-h36" style="min-height:36px;">
                                <span>{if Description}{Description}{else} 点击添加任务描述..{/if}</span>
                            </div>
                            <textarea id="des_input" style="width:796px;resize:none;height:80px;" class="normal-input">{Description}</textarea>
                        </dd>
                    </dl>
                    <div class="clear"></div>
                    <dl class="lt" style="width:400px">
                        <dt>提醒设置</dt>
                        <dd class="blue l-h36 stopedit {$hasEditBtn(Status,uid,CreaterID,ReviewID,OwnerID,JoinerIDs,'tipBtn')}" id="reminding_setting">
                            <span class="m-l5" id="time_delay_txt">{$getAlertHtml(AlertBefore)}</span>
                            <div id="delay_time_box" class="lt">
                                <input id="delay_time" class="lt m-r15" value="{$getAlertNum(AlertBefore)}" style="width: 120px">
                                <div class="select-gray-box2 rt time-em-box" style="width: 200px">
                                    <select id="time_em" style="height: 34px;width:200px;">
                                        <option>分钟</option>
                                        <option>小时</option>
                                        <option>天</option>
                                    </select>
                                </div>
                            </div>
                            <div class="clear"></div>
                        </dd>
                    </dl>
                </div>
            </div>
            <div class="clear"></div>
            <div class="cate-row task-check-row">
                <div class="cate-title">
                    <i class="task-icon task-check-icon"></i>子任务
                </div>
                <div class="cate-body">
                    <div class="add-blue-box">
                        <input placeholder="负责人" id="child_ownername"/>
                        <input placeholder="点击添加子任务" style="width:710px;height:32px!important;margin-top:1px;" id="add_child_input"><i class="icon icon_add_gray" id="add_btn"></i>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
            <div class="cate-row task-attach-row">
                <div class="cate-title" id="myuploaderbtn_outbox">
                    <i class="task-icon task-attach-icon"></i>附件
                    <span id="myuploaderbtn" class="blue-button m-l20 attachment-btn">添加附件</span>

                </div>
                <div class="cate-body" id="attachmentlist_box">
                    <div class="add-attachmentlist">
                        <div>
                            <ul class="queueList"><ul id="uploader" class="filelist"></ul></ul>
                        </div>
                    </div>
                    <div id="detailqueueList" class="show-attachmentlist"></div>
                </div>
            </div>
            <div class="cate-row task-comment-row">
                <div class="cate-title">
                    <i class="task-icon task-comment-icon"></i>评论
                </div>
                <div class="cate-body">
                    <div class="task-comments-ls" id="task-comments">

                    </div>
                </div>
            </div>
            <div class="cate-row task-process-row">
                <div class="cate-title">
                    <i class="task-icon task-process-icon"></i>进展
                    <div class="process-items">
                        <div class="process-item-close">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 关闭任务"视频拍摄（十一之前确认脚本编写、联系好供应商、并和参与拍摄的客户 确定好拍摄时间）"，得分"8"分</span>
                        </div>
                        <div class="process-item-restart">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 重启了任务"完成帮助文档的准备工作（十一之前完成确认完所有帮助内容）</span>
                        </div>
                        <div class="process-item-finish">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 关闭任务"视频拍摄（十一之前确认脚本编写、联系好供应商、并和参与拍摄的客户 确定好拍摄时间）"，得分"8"分</span>
                        </div>
                        <div class="process-item-see">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 看过了任务</span>
                        </div>
                        <div class="process-item-comment">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 评审了任务</span>
                        </div>
                        <div class="process-item-peoplechange">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 人员变更</span>
                        </div>
                        <div class="process-item-timechange">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 时间变化</span>
                        </div>
                        <div class="process-item-updatafile">
                            <i class="task-icon"></i>
                            <span class="time blue">09:00</span>
                            <img class="user-pic" src="https://dn-i8res.qbox.me/public/platform/defhead.png?imageView2/1/w/32/h/32" alt="">
                            <span class="ft12"><span class="blue">爱因斯坦</span> 上传了附件<span class="blue">我爱毛主席.txt</span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
    </div>
</div>
</div>