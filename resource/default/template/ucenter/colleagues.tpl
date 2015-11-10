
            {each List}
            <a  href="{getTeamUrl($value.PassportID)}" class="rt-team-ops lt">
                <img class="my-headimg" src="{$value.HeadImage}?imageView2/1/w/60/h/60"/>
                {$value.Name}
            </a>
            {/each}
            <div class="clear"></div>