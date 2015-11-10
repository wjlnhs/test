
 <div class="day-left" >
      <div class="tabel-left fw_left" id="day_left">
       {each timezone as item Index}
         <div class="border-dfnoright b-tnone">{item.datetime} {weekarr[item.day]}</div>
       {/each}
      </div>
 </div>

 <div class="time-content" id="time_zone">
     <div class="table-content">
        <table cellpadding="0" cellspacing="0">
          <tbody>
          {each timezone as item Index}
          {if Index==0}
             <tr class="b-tnone" date={item.datetime}>
             {else}
             <tr date={item.datetime}>
             {/if}
                 {each timearr as arr}
                    <td date={item.datetime} time={arr}></td>
                 {/each}
             </tr>
             {/each}
         </tbody>
       </table>
     </div>
</div>