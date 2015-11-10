{each ReturnObject as item}
<tr>
    <td>{item.Title}</td>
    <td>{item.CreateTime}</td>
    <td>{item.TradeNum}</td>
    <td><span class="cl-cz">{item.Money}</span></td>
    <td>{item.PayType}支付宝</td>
</tr>
{/each}