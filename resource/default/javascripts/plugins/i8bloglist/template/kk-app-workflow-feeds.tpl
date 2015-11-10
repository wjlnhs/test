<div class="app-feeds">
    <div class="app-actionlist {if ActionList.length>5}action-has-more{/if}">
        <ul class="actions-ls">
            {each ActionList}
                    <li class="act-row {ActionList.length==($index+1)?'last':''} {if $index>4}row-extp-line{/if}">
                        <div class="w-ico-time">
                            {if $value.Action=="Create"}
                                <b class="w-action-ico ico-Create"></b>
                            {else if $value.Action=="同意"}
                                <b class="w-action-ico ico-Agree"></b>
                            {else if $value.Action=="加签"}
                               <b class="w-action-ico ico-Add"></b>
                            {else if $value.Action=="转签"}
                                  <b class="w-action-ico ico-Forward"></b>
                            {else if $value.Action=="退回"}
                                  <b class="w-action-ico ico-Goback"></b>
                             {else if $value.Action=="拒绝"}
                                  <b class="w-action-ico ico-Goback"></b>
                            {else if $value.Action=="执行"}
                                  <b class="w-action-ico ico-Execute"></b>
                            {/if}
                            <span class="w-a-time">{$shortime($value.CreateTime)}</span>
                        </div>
                        <div class="w-uheader"><img src="{$value.Approver.ImgPath}?imageView2/1/w/32/h/32" class="u-head-img"/></div>
                        {if $value.Action=="Create"}
                            <div class="w-desc"><b>{$value.Approver.Name}发起了流程</b></div>
                        {else if $value.Action=="同意"}
                            <div class="w-desc"><b>{$value.Approver.Name}同意</b>：{$removeBr($value.Comment)}</div>
                        {else if $value.Action=="加签"}
                           <div class="w-desc"><b>{$value.Approver.Name}加签给{$value.ActionDesc}</b>：{$removeBr($value.Comment)}</div>
                        {else if $value.Action=="转签"}
                           <div class="w-desc"><b>{$value.Approver.Name}转签给{$value.ActionDesc}</b>：{$removeBr($value.Comment)}</div>
                        {else if $value.Action=="退回"}
                           <div class="w-desc"><b>{$value.Approver.Name}退回流程</b>：{$removeBr($value.Comment)}</div>
                        {else if $value.Action=="拒绝"}
                            <div class="w-desc"><b>{$value.Approver.Name}拒绝流程</b>：{$removeBr($value.Comment)}</div>
                        {else if $value.Action=="执行"}
                           <div class="w-desc"><b>{$value.Approver.Name}执行该流程</b>：{$removeBr($value.Comment)}</div>
                        {/if}
                        <br class="clear"/>
                    </li>
            {/each}
        </ul>
    </div>
    {if ActionList.length>5}
    <div class="extp-action">
        <a class="extp-act-btn">展开查看更多</a>
    </div>
    {/if}
</div>