 {if loading}
<tr>
    <td colspan="4">
        <div class="ld-64-write" ></div>
    </td>
</tr>
{else if error}
<tr>
    <td colspan="4">
        <div >{Description||'请求空闲会议室超时，请重试！'}</div>
    </td>
</tr>
{else if ReturnObject.length==0}
 <td colspan="4">
    <div class="noresult">
           <div class="no-resulticon noresult-icon"></div>
           <div class="noresult-title">该时间段没有空闲会议室~</div>
    </div>
 </td>
{else}
{each ReturnObject as item}
 <tr>
   <td>
      {if selectRoomID==item.ID}
      <span class="design-bg-icons3 app-radio checked v--7" rid="{item.ID}"></span>
      {else}
      <span class="design-bg-icons3 app-radio v--7" rid="{item.ID}"></span>
      {/if}
      <span>{item.Name}</span>
   </td>
   <td>{item.Galleryful}</td>
   <td>{item.Place}</td>
    <td>
       {item.Remark}
    </td>
 </tr>
 {/each}
 {/if}