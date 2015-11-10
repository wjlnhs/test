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
    {if date}
    {each date.days as day Index}
        {if Index%7==0}
        <tr>
            {if date.retweeks.weekport[Index/7]==true}
            <td class="calendar-first weekdailypng-bg all"></td>
            {else}
            <td class="calendar-first weekdailypng-bg noall"></td>
            {/if}
        {/if}
         {if day.isprev==true||day.isnext==true}
            <td><span>{day.date}</span></td>
            {else}
             {if day.SubmitState==0}
                 <td ><a class="weekdailypng-bg submit">{day.date}</a></td>
                 {else if day.SubmitState==1}
                 <td ><a class="weekdailypng-bg paysubmit">{day.date}</a></td>
                 {else}
                 <td ><a class="weekdailypng-bg nosubmit">{day.date}</a></td>
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