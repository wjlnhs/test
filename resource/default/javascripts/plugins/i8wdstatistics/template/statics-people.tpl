{each ReturnObject.Items as item}
<tr class="data-row">
                        <th style="padding-left:5px;">
                            {item.Name}
                        </th>
                        <td>
                            {item.SubmitCount}
                        </td>
                        <td>
                            {item.OnTimeCount}
                        </td>
                        <td>
                            {item.AvgScore}
                        </td>
                    </tr>
{/each}