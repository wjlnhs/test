{{each List}}
<div class="cate-body eduitem" style="display:block" cid="{{$value.ID}}">
    {{if !$value.fromadd}}
    <div class="gray-yellow l-h50">
        <span class="m-r50 m-l20 cate-title">{{$dateFormat($value.StartTime,'yyyy-MM')}} － {{$dateFormat($value.EndTime,'yyyy-MM')}}</span>
        <span class="m-r50 m-l20 cate-title mainname">{{$value.MainName}}</span>
        <a class="btn-fold rt arrow {{if $value.fromsub}}active{{/if}}"></a>
        <a class="btn-delete edit-icon rt">删除</a>
        <a class="btn-edit-one rt">编辑</a>
    </div>
    {{/if}}
    <div class="cate-item">
        <div class="preview m-l40" style="display: block;">
            <div class="app-table-list2 bw m-t10">
                <table>
                    <tbody>
                    <tr>
                        <td class="black">学校</td>
                        <td>{{$value.MainName}}</td>
                    </tr>
                    <tr>
                        <td class="black w-85">院系</td>
                        <td>{{$value.Position}}</td>
                    </tr>
                    <tr>
                        <td class="black">时间</td>
                        <td>{{$dateFormat($value.StartTime,'yyyy-MM')}} - {{$dateFormat($value.EndTime,'yyyy-MM')}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="app-table-list2 b-blue-sty1 bw m-t10 m-l40" style="display:none;">
            <table>
                <tbody>
                <tr>
                    <td class="black w-85 rel"><i class="icon-required">*</i>学校</td>
                    <td><input class="school" i8formtype="required:学校" type="text" placeholder="学校名称" defaultVal="{{$value.MainName}}" value="{{$value.MainName}}"></td>
                </tr>
                <tr>
                    <td class="black rel"><i class="icon-required">*</i>院系</td>
                    <td><input class="position" i8formtype="required:院系" type="text" placeholder="院系"  defaultVal="{{$value.Position}}" value="{{$value.Position}}"></td>
                </tr>
                <tr>
                    <td class="black">时间</td>
                    <td>
                        <div class="in-bl rel selecttime">
                            <input class="w-363-h36 start-year" i8formtype="required:时间" defaultVal="{{$dateFormat($value.StartTime,'yyyy')}}" value="{{$dateFormat($value.StartTime,'yyyy')}}" id="edit_StartTime_year_{{$creatguid($value.ID)}}" onfocus="WdatePicker({dateFmt:'yyyy'})" type="text" placeholder="">
                            <i class="icon icon_select_gray"></i>
                        </div>
                        <div class="in-bl rel selecttime m-r0">
                            <input class="w-363-h36 start-month" i8formtype="required:时间" defaultVal="{{$dateFormat($value.StartTime,'MM')}}" value="{{$dateFormat($value.StartTime,'MM')}}" id="edit_StartTime_month_{{$creatguid($value.ID)}}" onfocus="WdatePicker({dateFmt:'MM'})" type="text" placeholder="">
                            <i class="icon icon_select_gray"></i>
                        </div>
                        <span class="m-r10">----&nbsp;</span>

                        <div class="in-bl rel selecttime">
                            <input class="w-363-h36 end-year" i8formtype="required:时间" defaultVal="{{$dateFormat($value.EndTime,'yyyy')}}" value="{{$dateFormat($value.EndTime,'yyyy')}}" type="text" onfocus="WdatePicker({dateFmt:'yyyy'})" placeholder="">
                            <i class="icon icon_select_gray"></i>
                        </div>
                        <div class="in-bl rel selecttime">
                            <input class="w-363-h36 end-month" i8formtype="required:时间" defaultVal="{{$dateFormat($value.EndTime,'MM')}}" value="{{$dateFormat($value.EndTime,'MM')}}" type="text" onfocus="WdatePicker({dateFmt:'MM'})" placeholder="">
                            <i class="icon icon_select_gray"></i>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="sub tcenter m-t15 ">
                <span class="btn-blue-h32 confirm m-l20">&nbsp;确 定&nbsp;</span>
                <span class="btn-blue-empty-h32 cancel">取 消</span>
            </div>
        </div>
     </div>
</div>
{{/each}}
