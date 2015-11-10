{each ReturnObject.Result}
<li>
                <a href="{getTeamUrl($value.ColleagueID)}" class="m-r5 lt">
                    <img class="my-headimg" src="{$value.ColleagueHeadImg}?imageView2/1/w/60/h/60"/>
                </a>
                <p class="rt-yinx-name"><a  href="{getTeamUrl($value.ColleagueID)}" class="fz14-weight cl000">{$value.ColleagueName}</a></p>
                <p class="rt-yinx-cont rel"><i class="spbg1 sprite-73"></i>{$value.Impress}</p>
            </li>
{/each}