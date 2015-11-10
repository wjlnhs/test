        <div class="target-title">
                            <div class="t-left1"></div>
                            <div class="t-left2"></div>
                            <div class="t-right-text"><span class="fw_left m-l15 rel">本周工作目标
                            <i class="icon icon-help user-powerhelp"></i>
                            <div class="admin-help-txt icon-help-week-text tleft" style="left:110px">
                                <p style="line-height:61px;font-size:12px;font-weight: normal">您在上周周报中填写的计划会做为目标在这里展现</p>
                            </div>
                            </span> {beginTime} 至 {endTime} </div>
                        </div>
                        {if NextPlan}
                        {if NextPlan.length!=0}
                            {each NextPlan}
                            <div class="target-line" style="height:auto;overflow:hidden;">
                                <table>
                                    <tr>
                                        <td style="background:#f2f2f2;border-right:1px solid #dfdfdf">
                                            <div class="t-left1 weekdailypng-bg " style="border:0"></div>
                                        </td>
                                        <td style="background:#f2f2f2;border-right:1px solid #dfdfdf">
                                             <div class="t-left2" style="border:0"></div>
                                        </td >
                                        <td class="p-target-text">{$value}</td>
                                    </tr>
                                </table>
                            </div>
                            {/each}
                        {else}
                            <div class="target-line" >
                                    <div class="t-left1 weekdailypng-bg"></div>
                                    <div class="t-left2"></div>
                                    <div class="p-target-text">目标是上周周报的下期计划，<a class="adddaily" rptype="1" begintime="{addBeginTime}" endtime="{addEndTime}">立刻完善上周周报 ！</a></div>
                                </div>
                        {/if}
                        {else}
                            <div class="target-line">
                                                            <div class="t-left1 weekdailypng-bg"></div>
                                                            <div class="t-left2"></div>
                                                            <div class="p-target-text"><div class="ld-32-write"></div></div>
                            </div>
                        {/if}