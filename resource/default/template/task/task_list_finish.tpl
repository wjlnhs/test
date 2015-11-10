{each ReturnObject}
    <tr id="{$value.ID}">
        <td><a target="_blank" href="task/detail/{$value.ID}">{$value.Name}</a></td>
        <td>{$value.OwnerName}</td>
        <td>{$getStatusContForList($value.Status,$value.ReviewName,$value.ReviewID)}</td>
        <td><span class="{$setRed($value.EndTime)}">{$value.EndTime}</span></td>
    </tr>
{/each}
