{if loading}
<tr>
    <td colspan="2">
        <div class="ld-64-write" ></div>
    </td>
</tr>
{else if error}
 <tr>
     <td colspan="2">
         <div >{error}</div>
     </td>
 </tr>
{else if noresult}
 <tr>
       <td colspan="2">
           <div class="noresult">
                      <div class="noresult-title">没有常用地点~</div>
               </div>
       </td>
   </tr>
{else}
{each ReturnObject as item Index}
<tr>

       <td >
            <span pname={item.Name} class="design-bg-icons3 app-radio v--7 {Index==0?'checked':''}"></span>
            <span>{item.Name}</span>
       </td>
       <td ><a class="example_bg_icon1 btn-delete" pid="{item.ID}">删除</a></td>
   </tr>
{/each}
{/if}