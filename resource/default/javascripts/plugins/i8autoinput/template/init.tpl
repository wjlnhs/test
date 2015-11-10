<div class="autoinput_ksntxtbox"  style="width:{width}px;min-width:inherit">
    <div class="fw_ksninput ">
        {if data}
            {each data as item Index}
                <span class="fw_ksninput_slted" dataid="{item.ID}" dataname="{item.Name}"><em>{item.Name}</em><a class="inputdelete"></a></span>
            {/each}
        {/if}
        <span class="wordlength" style="display:none"></span>
        <input id="js_invite_gp_txt" class="igroup-input" type="text" style="width: 10px;">
    </div>
    <div class="fw_sboxer autoinput_ksntxtbox_alert_ico"></div>
    <div class="autoinput_agtlist hide">
        <dl>
        </dl>
    </div>
    <div class="autoinput_boxerContainer hide" style="position: absolute; z-index: 9999;right:0;top: 33px;">
        <div class="list_tab"><span id="tab_span_org_select" style="left:0px" class="activetab">{=controlName}</span></div>
        <div class="bcon_center">
             <div class="bcc_left">
                <div class="bcl_list" id="bcl_list">
                    <ul class="outputitem list_details">
                         {each datasource as item Index}
                            <li class="dataitem" dataid="{item.ID}" dataname="{item.Name}">{item.Name}</li>
                         {/each}
                    </ul>
                </div>

             </div>
             <div class="bcc_ctr"><input type="button"  class="btn_add_item disable_add"></div>
             <div class="bcc_right">
                <div class="bccr_selectedItem" id="selectItems">
                </div>
             </div>
             <div class="bcon_footer"><input type="button" class="btn_submit_select" value="确定">　<a class="btn_cancel_select">取消</a></div>
        </div>
</div>
