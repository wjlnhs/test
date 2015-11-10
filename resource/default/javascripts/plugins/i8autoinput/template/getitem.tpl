{if type==1}
{each arr as item Index}
      <span class="fw_ksninput_slted" dataid="{item.dataid}" dataname="{item.dataname}"><em>{item.dataname}</em><a class="inputdelete"></a></span>
{/each}
<span class="wordlength hide"></span>
<input id="js_invite_gp_txt" class="igroup-input" type="text" style="width: 10px;">
{else}
 {each arr as item Index}
   <span class="item_slted" dataid="{item.dataid}" dataname="{item.dataname}"><em>{item.dataname}</em><a></a></span>
{/each}
{/if}
