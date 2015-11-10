{each parentPowerArr}
{if $isNotEmptyScope($value.ScopeEntitys)}
<li class="parent_power_item">
    <span class="app-checkbox v--4 m-r15 {$setParentCheckBox($value.PmtStatus)} inherit-checkbox"></span>
    <div class="parent-names-box">{$setParentTxt($value.ViewScopeEntitys)}</div>
    <select class="scope-em" id="parentSel{$index}"  style="width: 150px">

    </select>
</li>
{/if}
{/each}