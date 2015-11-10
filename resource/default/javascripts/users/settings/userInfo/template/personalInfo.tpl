<div class="cate-title lt"><i class="icon icon-data m-r20 m-t5"></i>个人资料</div>
<div class="editing" >
    <span class="intro">{{Name}}</span>
    <a class="edit">&nbsp;<i class="icon icon-down-solid"></i>展开</a>
</div>
<a class="rt retract">&nbsp;<i class="icon icon-up"></i>收起</a>
<a class="rt m-r10 reedit">&nbsp;<i class="icon btn-edit-one"></i>编辑</a>
<div class="clear"></div>
<div class="cate-body">
    <div class="preview m-l40" style="display:block;">
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">姓名</div>
            <span class="w-365 m-r30 in-bl l-hh36">{{Name}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">生日</div>
            <span class="w-365 in-bl l-hh36">{{if Birthday}}{{$dateFormat(Birthday,'yyyy-MM-dd')}}{{/if}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">英文名</div>
            <span class="w-365 m-r30 in-bl l-hh36">{{EnName}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">座机</div>
            <span class="w-365 in-bl l-hh36">{{Tel}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">籍贯</div>
            <span class="w-365 m-r30 in-bl l-hh36">{{BirthLocationTxT}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">手机</div>
            <span class="w-365 in-bl l-hh36">{{MPhone}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">部门</div>
            <span class="w-365 m-r30 in-bl l-hh36">{{OrgName}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">邮箱</div>
            <span class="w-365 in-bl l-hh36">{{Email}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">职位</div>
            <span class="w-365 m-r30 in-bl l-hh36">{{Position}}</span>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">Q Q</div>
            <span class="w-365 in-bl l-hh36">{{QQ}}</span>
        </div>
        <div class="cate-row m-b15 lt m-r30 l-h30">
            <div class="black lt w-85">性别</div>
            <div class="w-365 lt">
                <div class="cate-line lt w-85">
                    <span class="black cate">{{if Gender}} 男{{else}}女 {{/if}}</span>
                </div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">一句话介绍</div>
            <div class="w-830 on-words">{{Comment}}</div>
        </div>
        <div class="clear"></div>
    </div>
    <div class="cate-body b-blue-sty1 m-l40" style="display:none">
        <div class="cate-row m-b15 lt">
        <i class="icon-required">*</i>
            <div class="black lt w-85 l-h30">姓名</div>
            <input id="username" value="{{Name}}" defaultvalue="{{Name}}" class="w-365 m-r30" data-options='{"strmatch":"username","strfocus":"请输入您的姓名(2~15个字符)","strerror":"姓名必须输入(2~15个字符)"}' type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">生日</div>
            <input id="birthday" value="{{if Birthday}}{{$dateFormat(Birthday,'yyyy-MM-dd')}}{{/if}}" defaultvalue="{{if Birthday}}{{$dateFormat(Birthday,'yyyy-MM-dd')}}{{/if}}"  class="w-365" onclick='WdatePicker({ isShowClear: true, readOnly: true, dateFmt: "yyyy-MM-dd" })' type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">英文名</div>
            <input id="englishName" value="{{EnName}}" defaultvalue="{{EnName}}" class="w-365 m-r30" data-options='{"strmatch":"nametext","strfocus":"请输入您的英文名(50个字符内)","strerror":"英文名输入错误或英文名超长(50个字符内)","isNull":true,"maxLength":50}' type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">座机</div>
            <input id="telephone" value="{{Tel}}" defaultvalue="{{Tel}}" class="w-365" data-options='{"strmatch":"tel","strfocus":"请输入座机,例如:021-88888888-888","isNull":true,"strerror":"座机输入错误"}'  type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">籍贯</div>
            <div class="city-group w-365 m-r30 in-bl l-hh36 birthlocation" lev2code="{{BirthLocation}}">
                <input readonly="readonly" class="citylev1" placeholder="-请选择-" type="text" value="{{BirthLocationTxT_city1}}">
                <input readonly="readonly" class="citylev2 rt" placeholder="-请选择-" type="text" value="{{BirthLocationTxT_city2}}">
            </div>
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">手机</div>
            <input id="mobile" value="{{MPhone}}" defaultvalue="{{MPhone}}" class="w-365"  data-options='{"strmatch":"mobile","strfocus":"请输入您的手机号,例如:13888888888","strerror":"手机号输入错误","isNull":true}' type="text" placeholder="" />
        </div>
        {{if OrgName}}
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">部门</div>
            <span class="w-365 m-r30 in-bl l-hh36">{{OrgName}}</span>
        </div>
        <div class="cate-row m-b15 lt" style="display: none" id="Orgunable">
            <div class="black lt w-85 l-h30">部门</div>
            <input id="department" class="w-365 m-r30" value="{{OrgName}}" defaultvalue="{{OrgName}}" type="text" placeholder="" />
        </div>
        {{else}}
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">部门</div>
            <input {{if OrgName}}id="department"{{/if}} class="w-365 m-r30" value="{{OrgName}}" defaultvalue="{{OrgName}}" type="text" placeholder="" />
        </div>
        {{/if}}
        <div class="cate-row m-b15 lt">
        <i class="icon-required">*</i>
            <div class="black lt w-70 l-h30">邮箱</div>
            <input id="personalEmailtxt" value="{{Email}}" defaultvalue="{{Email}}" class="w-365" data-options='{"strmatch":"email","strfocus":"请输入您的邮箱,例如:email@yourDomain.com","strerror":"邮箱输入错误","isNull":true}'  type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-85 l-h30">职位</div>
            <input id="position" value="{{Position}}" defaultvalue="{{Position}}" class="w-365 m-r30" data-options='{"strmatch":"nametext","strfocus":"请填写您的职位名称,2-15个字之间","strerror":"职位名输入错误，2-15个字之间","isNull":true,"maxLength":15,"minLength":2}' type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt">
            <div class="black lt w-70 l-h30">Q Q</div>
            <input id="qq" value="{{QQ}}" defaultvalue="{{QQ}}" class="w-365" data-options='{"strmatch":"^[0-9]*$","strfocus":"请输入您的QQ号,只能输入数字","strerror":"QQ号输入错误,QQ号只能输入数字","isNull":true,"maxLength":15}' type="text" placeholder="" />
        </div>
        <div class="cate-row m-b15 lt m-r30">
            <div class="black lt w-85 l-h30">性别</div>
            <div class="w-365 lt">
                <div class="cate-line lt w-85">
                    <span class="design-bg-icons3 app-radio {{if Gender}} checked {{/if}} v--7" defaultvalue="{{if Gender}} checked {{/if}}"></span>
                    <span id="male" class="black cate">男</span>
                </div>
                <div class="cate-line lt w-85">
                    <span class="design-bg-icons3 app-radio {{if !Gender}} checked {{/if}} v--7" defaultvalue="{{if !Gender}} checked {{/if}}"></span>
                    <span id="female" class="black cate">女</span>
                </div>
            </div>
        </div>
        <div class="clear"></div>
        <div class="cate-row m-b15 lt introducebox">
            <div class="black lt w-85 l-h30">一句话介绍</div>
            <textarea id="introduce" value="{{Comment}}" defaultvalue="{{Comment}}" data-options='{"strmatch":"text","strfocus":"请用一句话介绍您自己(200字以内)","strerror":"介绍文字长度超长(200字以内)","isNull":true,"maxLength":200}' class="w-830 on-words">{{Comment}}</textarea>
        </div>
        <div class="clear"></div>
        <div class="sub tcenter m-t15">
            <span class="btn-blue-h32 confirm m-l20">&nbsp;确 定&nbsp;</span>
            <span class="btn-blue-empty-h32 cancel">取 消</span>
        </div>
    </div>
</div>