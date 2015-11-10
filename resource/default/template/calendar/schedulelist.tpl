{if loading}
<tr>
    <td colspan="7">
        <div class="ld-64-write" ></div>
    </td>
</tr>
{else if error}
 <tr>
     <td colspan="7">
         <div >{error}</div>
     </td>
 </tr>
{else if noresult}
 <tr>
       <td colspan="7">
           <div class="noresult">
                      <div class="no-resulticon noresult-icon"></div>
                      <div class="noresult-title">没有日程/会议信息~</div>
               </div>
       </td>
   </tr>
{else}
{each ReturnObject as item Index}
    {each item as subitem subIndex}
        {if subIndex==0}
        <tr>
        <td style="border:1px solid #dfdfdf;background:#fff;" rowspan="{item.length}">{subitem.ScheduleStartDay} {subitem.ScheduleStartWeek}</td>
                     <td style="padding-left:15px">{subitem.ScheduleStartTime} {subitem.ScheduleEndTime}</td>
                     <td>{subitem.Title}</td>
                     <td>{subitem.AppTypeStr}</td>
                     <td>{subitem.Place}</td>
                     <td>{subitem.CreaterName.join(' ')}</td>
                     <td>{subitem.JoinNames.join(' ')}</td>
        </tr>
        {else}
        <tr>
             <td>{subitem.ScheduleStartTime} {subitem.ScheduleEndTime}</td>
             <td>{subitem.Title}</td>
             <td>{subitem.AppTypeStr}</td>
             <td>{subitem.Place}</td>
             <td>{subitem.CreaterName.join(' ')}</td>
             <td>{subitem.JoinNames.join(' ')}</td>
        </tr>
        {/if}
    {/each}
{/each}
{/if}