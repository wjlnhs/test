{if type=='edit'}
<div class="addweekdaily-panel rel"  >
            <div class="weekdaily-line">
                <span class="weekdaily-line-title">报告类型</span>
                <span class="input-panel">
                    {if reportdata.RpType==1}
                            <span rpType="1" class="design-bg-icons3 app-radio v--7 checked"  ></span>
                            <label class="app-radio-label">周报</label>
                            <span rpType="0" class="design-bg-icons3 app-radio v--7" ></span>
                            <label class="app-radio-label">日报</label>
                        {else}
                            <span rpType="1" class="design-bg-icons3 app-radio v--7" ></span>
                            <label class="app-radio-label">周报</label>
                            <span rpType="0" class="design-bg-icons3 app-radio v--7 checked" ></span>
                            <label class="app-radio-label">日报</label>
                     {/if}
                </span>
            </div>
            <div class="weekdaily-line" style="height:37px">
                <span class="weekdaily-line-title">报告日期</span>
                <span class="input-panel m-r10"><input readonly="readonly" class="startDate w-267-h36" value="{dateformat(reportdata.StartTime,'yyyy-MM-dd')}" /></span>
                {if reportdata.RpType==1}
                <span id="checkendTime">
                    <span class="input-panel m-r10">  至  </span>
                    <span class="input-panel m-r10"><input readonly="readonly" class="endDate w-267-h36" value="{dateformat(reportdata.EndTime,'yyyy-MM-dd')}" /></span>
                </span>
                {/if}
                <a class="btn-blue-h32 getprevplan">获取上期计划</a>
            </div>
            <div class="addweekdaily-mask"></div>
            {if reportdata.Summarize.length>0}
            {each reportdata.Summarize as item Index}
                {if Index==0}
                <div class="weekdaily-line">
                    <span class="weekdaily-line-title">本期总结</span>
                    <span class="input-panel"><textarea class="summarize" placeholder="本期总结">{=item}</textarea>
                    <i class="design-bg-icons3 app_clear_txt_btn" style="display: inline;"></i>
                    </span>
                </div>
                {else}
                <div class="weekdaily-line">
                                    <span class="weekdaily-line-title">&nbsp;</span>
                                    <span class="input-panel"><textarea class="summarize" placeholder="本期总结" >{=item}</textarea>
                                    <i class="design-bg-icons3 app_clear_txt_btn" style="display: inline;"></i></span>
                                </div>
                {/if}

            {/each}
            <div class="weekdaily-line">
                          <span class="weekdaily-line-title">&nbsp;</span>
                          <span class="input-panel"><textarea class="summarize" placeholder="本期总结" ></textarea>
                          <i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i></span>
            </div>
            {else}
                <div class="weekdaily-line">
                <span class="weekdaily-line-title">本期总结</span>
                <span class="input-panel"><textarea class="summarize" placeholder="本期总结"></textarea>
                <i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i>
                </span>
                </div>
            {/if}
            {if reportdata.NextPlan.length>0}
            {each reportdata.NextPlan as item Index}
                {if Index==0}
                <div class="weekdaily-line">
                    <span class="weekdaily-line-title">下期计划</span>
                    <span class="input-panel"><textarea class="nextplan" placeholder="下期准备做点啥~" >{=item}</textarea>
                    <i class="design-bg-icons3 app_clear_txt_btn" style="display: inline;"></i>
                    </span>
                </div>
                {else}
                <div class="weekdaily-line">
                    <span class="weekdaily-line-title">&nbsp;</span>
                    <span class="input-panel"><textarea class="nextplan" placeholder="下期准备做点啥~" >{=item}</textarea><i class="" style="display: inline;"></i></span>
                </div>
                {/if}
            {/each}
            <div class="weekdaily-line">
                                <span class="weekdaily-line-title">&nbsp;</span>
                                <span class="input-panel"><textarea class="nextplan" placeholder="下期准备做点啥~" ></textarea>
                                <i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i>
                                </span>
            </div>
            {else}
                <div class="weekdaily-line">
                    <span class="weekdaily-line-title">下期计划</span>
                    <span class="input-panel"><textarea class="nextplan" placeholder="下期准备做点啥~" ></textarea>
                    <i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i>
                    </span>
                </div>
            {/if}

             <div class="weekdaily-line">
                  <span class="weekdaily-line-title">上传附件</span>
                  <span class="input-panel">
                            <div id="btn_containerreport" >
                               <a class="s-icon attachment-btn" id="uploaderbtnreport">附件</a>
                            </div>
                  </span>

             </div>
                <div  >
                                         <ul id="uploaderreport" class="filelist"></ul>
                                     </div>
            <div class="weekdaily-line">
                <span class="weekdaily-line-title">分享给同事</span>
                <span class="input-panel">
                    <input id="shareTo" class="w-698-h36"/>
                </span>
            </div>
            <div class="weekdaily-line">
                <a type="edit" class="btn-blue-h32 fw_right weekreport-publish">发布</a>
            </div>
        </div>
{else}
<div class="addweekdaily-panel">
            <div class="weekdaily-line">
                <span class="weekdaily-line-title">报告类型</span>
                <span class="input-panel">
                    <span rpType="1" class="design-bg-icons3 app-radio v--7 {rptype==1?'checked':''}" ></span>
                        <label class="app-radio-label">周报</label>
                        <span rpType="0" class="design-bg-icons3 app-radio v--7 {rptype==0?'checked':''}" ></span>
                        <label class="app-radio-label">日报</label>
                </span>

            </div>
            <div class="weekdaily-line" style="height:37px">
                <span class="weekdaily-line-title">报告日期</span>
                <span class="input-panel m-r10"><input readonly="readonly" class="startDate w-267-h36" value="{rptype==1?beginTime:nowTime}" /></span>
                <span id="checkendTime" class="{rptype==0?'hide':''}">
                    <span class="input-panel m-r10">  至  </span>
                    <span class="input-panel m-r10"><input readonly="readonly" class="endDate w-267-h36" value="{endTime}" /></span>
                </span>
                <a class="btn-blue-h32 getprevplan">获取上期计划</a>
            </div>
            <div class="weekdaily-line">
                <span class="weekdaily-line-title">本期总结</span>
                <span class="input-panel"><textarea class="w-698-h36 summarize" placeholder="本期总结"></textarea>
                <i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i>
                </span>
            </div>

            <div class="weekdaily-line">
                <span class="weekdaily-line-title">下期计划</span>
                <span class="input-panel"><textarea class="w-698-h36 nextplan" placeholder="下期准备做点啥~" ></textarea>
                <i class="design-bg-icons3 app_clear_txt_btn" style="display: none;"></i>
                </span>
            </div>

            <div class="weekdaily-line">
                <span class="weekdaily-line-title">上传附件</span>
                <span class="input-panel">
                    <div id="btn_containerreport" >
                        <a class="s-icon attachment-btn" id="uploaderbtnreport">附件</a>
                    </div>
                </span>
            </div>
            <div  >
                <ul id="uploaderreport" class="filelist"></ul>
            </div>
            <div class="weekdaily-line">
                <span class="weekdaily-line-title">分享给同事</span>
                <span class="input-panel">
                    <input id="shareTo" class="w-698-h36"/>
                </span>
            </div>
            <div class="weekdaily-line">
                <div class="btn-blue-h32 fw_right weekreport-publish">发布</div>
            </div>
        </div>
        <i class="icon headofarrow"></i>
{/if}