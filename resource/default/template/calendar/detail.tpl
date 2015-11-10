{if loading}
        <div class="ld-128-write" ></div>
{else if error}
<div class="noresult">
    <div class="no-resulticon noresult-icon"></div>
    <div class="noresult-title">{error}</div>
</div>
{else}
<!--
<div class="r-title">
    <img src="{getOwner(JoinIDs,JoinNames,JoinHeadImages).img.length==1?getOwner(JoinIDs,JoinNames,JoinHeadImages).img[0]:resHost+'default/images/persons.png'}?imageView2/1/w/60/h/60" />
    <span class="blue">{getOwner(JoinIDs,JoinNames,JoinHeadImages).name.join(',')}</span> 的{Type==1?'日程':'会议'}
</div>-->
<div class="r-line">
     <div class="l-title">开始时间</div>
     <div class="l-content" style="width:300px">{StartTime}</div>
     <div class="l-title">结束时间</div>
     <div class="l-content" style="width:300px">
              {EndTime}
      </div>
</div>
</div>
<div class="r-line">
    {if IsCycle}
     <div class="l-title">重复循环</div>
     <div class="l-content" style="width:300px">

         {if CycleType==1}
                 <span>每天</span>
          {if IsIncludeWeekend}
                包含周末
          {else}
             不包含周末
          {/if}
         {else}
               <span>每周<span>
               {getWeekName(CycleValues)}
         {/if}

     </div>
     {/if}
      <div class="l-title">地点</div>
           <div class="l-content" style="width:300px">
                     {MettingRoomName||Place}
           </div>
</div>
<div class="r-line">
    <div class="l-title">发起人</div>
         <div class="l-content" style="width:300px">
              <div class="person-panel">
                   <!--<img src="{CreaterHeadImage}?imageView2/1/w/60/h/60" />-->
                   <span>{CreaterName} </span>
              </div>
    </div>
    <div class="l-title">提醒</div>
         <div class="l-content" style="width:300px">
                    提前{BeforeTime}
                    {if BeforeTimeType==0}
                    分钟
                    {else if BeforeTimeType==1}
                    小时
                    {else if BeforeTimeType==2}
                    日
                    {else}
                    周
                    {/if}
         </div>
</div>
<div class="r-line">

</div>
<div class="r-line">
       <div class="l-title">参加人</div>
       <div class="l-content">
                {each JoinNames as join Index}
                    <div class="person-panel">
                         <!-- <img src="{JoinHeadImages[Index]}?imageView2/1/w/60/h/60" />-->
                            <span>{join} </span>
                     </div>
                 {/each}
        </div>
</div>
<div class="r-line">
       <div class="l-title">知会人</div>
       <div class="l-content">
                {each NotifyNames as notify Index}
                    <div class="person-panel">
                         <!-- <img src="{JoinHeadImages[Index]}?imageView2/1/w/60/h/60" />-->
                            <span>{notify} </span>
                     </div>
                 {/each}
        </div>
</div>
<div class="r-line">
      <div class="l-title">详细内容</div>
      <div class="l-content">{Content}</div>
</div>

<div class="r-line hide" id="attFile">
       <div class="l-title">上传附件</div>
       <div class="l-content">
               <div id="btn_containerDetail">
                 <a class="btn-attachment" id="uploaderbtnDetail" >
                                          附件
                                      </a>
               </div>

               <div class="hide">
                            <ul id="uploaderDetail" class="filelist hide" ></ul>
               </div>
        </div>
</div>
<div class="r-line">
     <div class="l-title">附件列表</div>
     <div class="l-content" id="attList">
                {getAtt(FileList)}
     </div>
</div>
 {/if}