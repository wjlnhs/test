{if noresult}
<div class="no-report">
                    <div class="weekdailypng-bg unsubmit">
                        <span >没有人分享周日报给我~</span>
                    </div>
</div>
{else}
<div class="date-yearmonth ui-datepicker-header">
    <span class="yearmonth">{year} {month}月</span>
    <a class="ui-datepicker-prev"><</a>
    <a class="ui-datepicker-next">></a>
</div>
<table class="ui-datepicker ui-datepicker-calendar">
<thead>
    <tr>
        <th class="calendar-first"></th>
        <th>一</th>
        <th>二</th>
        <th>三</th>
        <th>四</th>
        <th>五</th>
        <th>六</th>
        <th>日</th>
    </tr>
    </thead>
    <tbody>
    {if days}
    {each days as day Index}
        {if Index%7==0}
        <tr>
            {if WeeklyStates[Index/7]==0}
            <td class="calendar-first weekdailypng-bg all"></td>
            {else if WeeklyStates[Index/7]==1}
            <td class="calendar-first weekdailypng-bg nosubmitall"></td>
            {else}
            <td class="calendar-first weekdailypng-bg noall"></td>
            {/if}
        {/if}
         {if day.isprev==true||day.isnext==true}
            { if day.istoday}
            <td><a ><b>{day.date}</b></a></td>
            {else}
            <td><a >{day.date}</a></td>
            {/if}
            {else}
             {if day.dailystates==0}
                 <td ><a class="weekdailypng-bg submit">{day.date}</a></td>
                 {else if day.dailystates==1}
                 <td ><a class="weekdailypng-bg paysubmit">{day.date}</a></td>
                 {else if day.dailystates==2&&isLagerThenToday(year,month,day.date,day.isprev,day.isnext)}
                 <td ><a class="weekdailypng-bg nosubmit">{day.date}</a></td>
                 {else}
                  { if day.istoday}
                             <td><a ><b>{day.date}</b></a></td>
                             {else}
                             <td><a >{day.date}</a></td>
                             {/if}
             {/if}
         {/if}
        {if Index%7==6}
        </tr>
        {/if}
    {/each}
    {else}
        <tr><td colspan=8><div class="ld-64-write"></div></td></tr>
    {/if}
    </tbody>
</table>
{/if}