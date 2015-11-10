{if loading}
<tr>
    <td colspan="6">
        <div class="ld-128-write" ></div>
    </td>
</tr>
 {else if noresult}
   <tr>
       <td colspan="6">
           <div class="noresult">
                      <div class="no-resulticon noresult-icon"></div>
                      <div class="noresult-title">没有会议室信息~</div>
               </div>
       </td>
   </tr>
 {else if error}
 <tr>
     <td colspan="6">
         <div >{error}</div>
     </td>
 </tr>
 {else}
 {if edit}
           <td class="p-t5 p-b5">{Code}</td>
           <td><input class="name w-150-h33" value="{Name}" /></td>
           <td><input  class="calleryful w-94-h33" value="{Galleryful}" /></td>
           <td><input  class="place w-150-h33" value="{Place}" /></td>
           <td><input  class="remark w-150-h33" value="{Remark}" /></td>
           <td roomid={ID}>
               <a class="btn-save">保存</a>
               <a class="btn-delete btn-cancel">取消</a>
           </td>
 {else if cancel}

           <td>{Code}</td>
           <td>{Name}</td>
           <td>{Galleryful}</td>
           <td>{Place}</td>
           <td>{Remark}</td>
           <td roomid={ID}>
           <a class="btn-edit">编辑</a>
           <a class="btn-delete deleteroom">删除</a>
           </td>
 {else}
 {each ReturnObject as item Index}
 <tr index={Index}>
                        <td>{item.Code}</td>
                        <td>{item.Name}</td>
                        <td>{item.Galleryful}</td>
                        <td>{item.Place}</td>
                        <td>{item.Remark}</td>
                        <td roomid={item.ID}>
                            <a class="btn-edit">编辑</a>
                            <a class="btn-delete deleteroom">删除</a>
                        </td>
                    </tr>
  {/each}
  {/if}
  {/if}