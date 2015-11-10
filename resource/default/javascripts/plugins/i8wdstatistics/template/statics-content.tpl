{each ReturnObject.Items as item Index}
<tr class="data-row">
    {each item.days as day dIndex}
        {if day.day==1}
            <th colspan=7 class="head-title">
                <table  cellpadding="0" cellspacing="0">
                     <tr>
                        <td colspan=7 class="tcenter ">
                             {if getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyState==0}
                                 <div class="tcenter top-rowborder">
                                     <a target="_blank" href={getUrl(getWeekStatus(item.WeeklyStatInfos,dIndex).ReportID)}>周报已提交
                                       {if getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyScore==0}
                                             未评分
                                       {else}
                                       {getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyScore}分
                                       {/if}
                                     </a>
                                 </div>
                             {else if getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyState==1}
                              <div class="tcenter top-rowborder">
                                      <a target="_blank" href={getUrl(getWeekStatus(item.WeeklyStatInfos,dIndex).ReportID)}>周报已补交
                                             {if getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyScore==0}
                                                                          未评分
                                             {else}
                                             {getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyScore}分
                                             {/if}
                                      </a>
                               </div>
                             {else if getWeekStatus(item.WeeklyStatInfos,dIndex).WeeklyState==2&&isLagerThenToday(year,month,day.date+5,day.isprev,day.isnext)}
                                <div class="tcenter top-rowborder yellow">
                                      <a>周报未提交</a>
                                </div>
                             {else}
                              <div class="tcenter top-rowborder yellow" style="border-color:#ECECEC;background-color: #ECECEC; color: #999;">
                                     -
                              </div>
                             {/if}
                            </td>
                        </tr>
                        <tr>
        {/if}
            {if dIndex>=0}
                <td day="{day.day}" dIndex="{dIndex}">
                     {if day.dailystates==0}
                        <div class="daliyicon d-submit">已交</div>
                     {else if day.dailystates==1}
                        <div class="daliyicon d-paysubmit">补交</div>
                     {else if day.dailystates==2&&isLagerThenToday(year,month,day.date,day.isprev,day.isnext)}
                         <div class="daliyicon d-unsubmit">未交</div>
                     {else }
                       <div class="daliyicon d-unsubmit" style="background-color: #ECECEC; color: #999;">-</div>
                     {/if}
                 </td>
             {/if}
        {if day.day==0}
            </tr>
            </table>
            </th>
        {/if}
    {/each}
</tr>
{/each}