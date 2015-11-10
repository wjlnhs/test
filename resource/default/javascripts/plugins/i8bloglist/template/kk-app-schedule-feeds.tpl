<div class="app-feeds">
    <div class="feeds-left">
            <b class="app-ico schedule"></b>
    </div>
    <div class="feeds-right">
        <div class="schedule-Info">
            <p>
                时间点：{StartTime}    <br/>
                地点：{Place}     <br/>
                参加人：{each Joins}<a href="users/{$index}">{$value}</a> {/each}    <br/>
            </p>
        </div>
    </div>
</div>


