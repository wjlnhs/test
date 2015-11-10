<div class="statistics">
        <div class="statistics-head">
            <div class="statistics-select" id="selectMonth">
                <a class="prev-month"><</a><span class="year">{year}</span>年<span class="month">{month}月</span><a class="next-month">></a></div>
        </div>
        <div class="statistics-content">
            <div class="statistics-left" id="s_left">
                <table cellpadding="0" cellspacing="0" width="100%">
                    <thead>
                    <tr><th colspan="4">&nbsp;</th></tr>
                    <tr>
                        <th >
                            姓名
                        </th>
                        <td>
                            总数<br/>(日报)
                        </td>
                        <td>
                            按时<br/>(日报)
                        </td>
                        <td>
                            均分<br/>(周报)
                        </td>
                    </tr>
                    </thead>
                    <tbody id="data_people">

                    </tbody>
                </table>
            </div>
            <div class="statistics-right" id="s_right">
                <div id="toleft" class="weekdailypng-bg toleft hide"></div>
                <div id="toright" class="weekdailypng-bg toright hide"></div>
                <div class="day-panel" >
                    <table cellpadding="0" cellspacing="0">
                    <thead>
                    <tr>
                        {each getdates.retweeks.beginTime as begin Index}
                                <th colspan=7 class="head-title">第{getdates.retweeks.week_name[Index]}周</th>
                        {/each}
                    </tr>
                    <tr class="day-title">
                        {each getdates.days as item Index}
                            {if Index==0}
                                {if item.isprev||item.isnext}
                                <td style="border:none;padding-left:1px; color:#999">{item.date}</td>
                                {else}
                                <td style="border:none;padding-left:1px;color:#000;">{item.date}</td>
                                {/if}
                            {else}
                            {if item.isprev||item.isnext}
                            <td style="color:#999">{item.date}</td>
                            {else}
                            <td style="color:#000">{item.date}</td>
                            {/if}
                            {/if}
                        {/each}
                    </tr>
                    </thead>
                    <tbody id="data_body">

                    </tbody>
                </table>
                </div>
            </div>
        </div>

    </div>
    <div class="ld-128-gray hide" id="load_data"></div>
    <a id="see_more" class="seemore" style="display:none">查看更多</a>
    <div class="noresult hide" id="no_result">
               <div class="no-resulticon noresult-icon"></div>
               <div class="noresult-title">没有人将周日报分享给我~</div>
           </div>