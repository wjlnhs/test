<i class="i8-select-drop newselecti"></i>
<span class="i8-select-cked newselectcked" value="{list[0].value}">{list[0].key}</span>
<span class="i8-sel-options" style="top: 35px; display: none;">
{each list as item Index}
    <em value="{item.value}">{item.key}</em>
{/each}
</span>
