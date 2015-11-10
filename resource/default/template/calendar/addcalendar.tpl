<div class="edit-schedule-cont black" >
                    <div class="i8-form i8-form{ver}">
                        <dl>
                            <dt>主题</dt>
                            <dd>
                                <input id="schedule_title{ver}" value="{Title}" class="w-724" placeholder="主题" />
                            </dd>
                            <dt>类型</dt>
                            <dd>
                                <div class="select-gray-box w-724">
                                    <select id="selectType{ver}" class="w-724">
                                        <option value="2">会议</option>
                                        <option value="1">日程</option>
                                    </select>
                                </div>
                            </dd>
                            <dt>时间</dt>
                            <dd>
                                <div class="select-gray-box w-724">
                                    <span class="fw_left w-400 m-r15"><input readonly="readonly" id="addDate{ver}" value="{addDate||dateformat(StartTime,'yyyy-MM-dd')}" ></span>
                                     <select choose="{addStartTime||dateformat(StartTime,'hh:mm')}" id="addStartTime{ver}">
                                            <option value=00:00>00:00</option><option value=00:30>00:30</option><option value=01:00>01:00</option><option value=01:30>01:30</option><option value=02:00>02:00</option><option value=02:30>02:30</option><option value=03:00>03:00</option><option value=03:30>03:30</option><option value=04:00>04:00</option><option value=04:30>04:30</option><option value=05:00>05:00</option><option value=05:30>05:30</option><option value=06:00>06:00</option><option value=06:30>06:30</option><option value=07:00>07:00</option><option value=07:30>07:30</option><option value=08:00>08:00</option><option value=08:30>08:30</option><option value=09:00>09:00</option><option value=09:30>09:30</option><option value=10:00>10:00</option><option value=10:30>10:30</option><option value=11:00>11:00</option><option value=11:30>11:30</option><option value=12:00>12:00</option><option value=12:30>12:30</option><option value=13:00>13:00</option><option value=13:30>13:30</option><option value=14:00>14:00</option><option value=14:30>14:30</option><option value=15:00>15:00</option><option value=15:30>15:30</option><option value=16:00>16:00</option><option value=16:30>16:30</option><option value=17:00>17:00</option><option value=17:30>17:30</option><option value=18:00>18:00</option><option value=18:30>18:30</option><option value=19:00>19:00</option><option value=19:30>19:30</option><option value=20:00>20:00</option><option value=20:30>20:30</option><option value=21:00>21:00</option><option value=21:30>21:30</option><option value=22:00>22:00</option><option value=22:30>22:30</option><option value=23:00>23:00</option>
                                     </select>
                                      <select choose="{addEndTime||dateformat(EndTime,'hh:mm')}" id="addEndTime{ver}">
                                             <option value=00:30>00:30</option><option value=01:00>01:00</option><option value=01:30>01:30</option><option value=02:00>02:00</option><option value=02:30>02:30</option><option value=03:00>03:00</option><option value=03:30>03:30</option><option value=04:00>04:00</option><option value=04:30>04:30</option><option value=05:00>05:00</option><option value=05:30>05:30</option><option value=06:00>06:00</option><option value=06:30>06:30</option><option value=07:00>07:00</option><option value=07:30>07:30</option><option value=08:00>08:00</option><option value=08:30>08:30</option><option value=09:00>09:00</option><option value=09:30>09:30</option><option value=10:00>10:00</option><option value=10:30>10:30</option><option value=11:00>11:00</option><option value=11:30>11:30</option><option value=12:00>12:00</option><option value=12:30>12:30</option><option value=13:00>13:00</option><option value=13:30>13:30</option><option value=14:00>14:00</option><option value=14:30>14:30</option><option value=15:00>15:00</option><option value=15:30>15:30</option><option value=16:00>16:00</option><option value=16:30>16:30</option><option value=17:00>17:00</option><option value=17:30>17:30</option><option value=18:00>18:00</option><option value=18:30>18:30</option><option value=19:00>19:00</option><option value=19:30>19:30</option><option value=20:00>20:00</option><option value=20:30>20:30</option><option value=21:00>21:00</option><option value=21:30>21:30</option><option value=22:00>22:00</option><option value=22:30>22:30</option><option value=23:00>23:00</option><option value=23:30>23:30</option>
                                      </select>
                                      <div class="l-h30 repeat-checkbox">
                                           <span class="design-bg-icons3 app-checkbox v--4" id="isrepeat{ver}"></span>
                                           重复循环
                                      </div>
                                </div>
                                <!--<div class="select-gray-box start-time">
                                    <select choose="{addStartTime||dateformat(StartTime,'hh:mm')}" id="addStartTime{ver}">
                                        <option value=00:00>00:00</option><option value=00:30>00:30</option><option value=01:00>01:00</option><option value=01:30>01:30</option><option value=02:00>02:00</option><option value=02:30>02:30</option><option value=03:00>03:00</option><option value=03:30>03:30</option><option value=04:00>04:00</option><option value=04:30>04:30</option><option value=05:00>05:00</option><option value=05:30>05:30</option><option value=06:00>06:00</option><option value=06:30>06:30</option><option value=07:00>07:00</option><option value=07:30>07:30</option><option value=08:00>08:00</option><option value=08:30>08:30</option><option value=09:00>09:00</option><option value=09:30>09:30</option><option value=10:00>10:00</option><option value=10:30>10:30</option><option value=11:00>11:00</option><option value=11:30>11:30</option><option value=12:00>12:00</option><option value=12:30>12:30</option><option value=13:00>13:00</option><option value=13:30>13:30</option><option value=14:00>14:00</option><option value=14:30>14:30</option><option value=15:00>15:00</option><option value=15:30>15:30</option><option value=16:00>16:00</option><option value=16:30>16:30</option><option value=17:00>17:00</option><option value=17:30>17:30</option><option value=18:00>18:00</option><option value=18:30>18:30</option><option value=19:00>19:00</option><option value=19:30>19:30</option><option value=20:00>20:00</option><option value=20:30>20:30</option><option value=21:00>21:00</option><option value=21:30>21:30</option><option value=22:00>22:00</option><option value=22:30>22:30</option><option value=23:00>23:00</option>
                                    </select>
                                    <input readonly="readonly" id="addStartTime{ver}" value="{addStartTime||dateformat(StartTime,'hh:mm')}" >
                                </div>-->
                                <!-- <div class="select-gray-box end-time">
                                 <select choose="{addEndTime||dateformat(EndTime,'hh:mm')}" id="addEndTime{ver}">
                                          <option value=00:30>00:30</option><option value=01:00>01:00</option><option value=01:30>01:30</option><option value=02:00>02:00</option><option value=02:30>02:30</option><option value=03:00>03:00</option><option value=03:30>03:30</option><option value=04:00>04:00</option><option value=04:30>04:30</option><option value=05:00>05:00</option><option value=05:30>05:30</option><option value=06:00>06:00</option><option value=06:30>06:30</option><option value=07:00>07:00</option><option value=07:30>07:30</option><option value=08:00>08:00</option><option value=08:30>08:30</option><option value=09:00>09:00</option><option value=09:30>09:30</option><option value=10:00>10:00</option><option value=10:30>10:30</option><option value=11:00>11:00</option><option value=11:30>11:30</option><option value=12:00>12:00</option><option value=12:30>12:30</option><option value=13:00>13:00</option><option value=13:30>13:30</option><option value=14:00>14:00</option><option value=14:30>14:30</option><option value=15:00>15:00</option><option value=15:30>15:30</option><option value=16:00>16:00</option><option value=16:30>16:30</option><option value=17:00>17:00</option><option value=17:30>17:30</option><option value=18:00>18:00</option><option value=18:30>18:30</option><option value=19:00>19:00</option><option value=19:30>19:30</option><option value=20:00>20:00</option><option value=20:30>20:30</option><option value=21:00>21:00</option><option value=21:30>21:30</option><option value=22:00>22:00</option><option value=22:30>22:30</option><option value=23:00>23:00</option><option value=23:30>23:30</option>
                                 </select>
                                   <input readonly="readonly" id="addEndTime{ver}" value="{addEndTime||dateformat(EndTime,'hh:mm')}" >
                                </div>-->
                            </dd>
                            <dt></dt>
                            <dd class="repeat-box">
                                <div class="repeat-panel hide">
                                    <div class="repeat-cont">
                                        <div class="l-h30">
                                            日程时间&nbsp;
                                            <span id="starttime{ver}">{addStartTime||dateformat(StartTime,'hh:mm')}</span>-<span id="endtime{ver}">{addEndTime||dateformat(EndTime,'hh:mm')}</span>
                                        </div>
                                        <div class="l-h30" id="repeat_radio{ver}">
                                            循环周期
                                            &nbsp;<span type="2" class="design-bg-icons3 app-radio v--7 "></span>每周
                                            &nbsp;<span type="1" class="design-bg-icons3 app-radio v--7 checked"></span>每日
                                        </div>
                                    </div>
                                    <input class="repeat-start" value="{CycleStartDate?dateformat(CycleStartDate,'yyyy-MM-dd'):''}" id="repeat_startTime{ver}" />
                                    <input class="repeat-end" id="repeat_endTime{ver}" value="{CycleEndDate?dateformat(CycleEndDate,'yyyy-MM-dd'):''}" />
                                    <div class="every-week-checkboxs hide" id="repeat_checkbox{ver}">
                                        <span class="design-bg-icons3 app-checkbox v--4" type="1"></span>
                                        周一
                                        <span class="design-bg-icons3 app-checkbox v--4 " type="2"></span>
                                        周二
                                        <span class="design-bg-icons3 app-checkbox v--4 " type="3"></span>
                                        周三
                                        <span class="design-bg-icons3 app-checkbox v--4 " type="4"></span>
                                        周四
                                        <span class="design-bg-icons3 app-checkbox v--4 " type="5"></span>
                                        周五
                                        <span class="design-bg-icons3 app-checkbox v--4 " type="6"></span>
                                        周六
                                        <span class="design-bg-icons3 app-checkbox v--4" type="7"></span>
                                        周日
                                    </div>
                                    <div class="every-week-checkboxs" id="hasweekend{ver}">
                                          <span class="design-bg-icons3 app-checkbox {IsIncludeWeekend?'checked':''} v--4"></span>
                                                包含周末
                                    </div>
                                </div>
                            </dd>
                            <dt>参加人</dt>
                            <dd>
                                <input id="choosePerson{ver}" />
                            </dd>
                            <dt>知会人</dt>
                            <dd>
                                <input id="chooseNotify{ver}" />
                            </dd>
                            <div id="meettingRoom{ver}" class="hide">
                                <dt>会议室</dt>
                                <dd>
                                    <div class="select-gray-box w-724">

                                        {if MettingRoomID=='00000000-0000-0000-0000-000000000000'&&Type==2}
                                            <select id="selectPlace{ver}" class="w-724 smallselectmeet">
                                            </select>
                                            <input id="meetplace{ver}" value="{Place}" class="meetplace" placeholder="请输入会议地点" />
                                        {else}
                                            <select id="selectPlace{ver}" class="w-724">
                                            </select>
                                            <input id="meetplace{ver}" class="meetplace hide" placeholder="请输入会议地点" />
                                        {/if}
                                    </div>
                                    <div class="app-table-list m-t15 free-meeting-room">
                                        <a  class="search-free-meeting-room hide" id="searchfreeroom{ver}">查看空闲会议室详情</a>
                                        <table id="freeroom{ver}" class="m-t15 hide">
                                            <thead>
                                            <tr>
                                                <td class="perc-20 p-l-50">会议室名称
                                                </td>
                                                <td class="perc-20">容纳人数
                                                </td>
                                                <td class="perc-20">地点
                                                </td>
                                                <td class="perc-20">备注
                                                </td>
                                            </tr>
                                            </thead>
                                            <tbody >

                                            </tbody>
                                        </table>
                                        <div id="freeroompage{ver}"></div>
                                    </div>
                                </dd>
                            </div>
                            <div id="place{ver}" class="hide">
                                <dt>地点</dt>
                                <dd>
                                <input value="{Place}" class="w-724" placeholder="地点" />
                                <a id="chooseplace{ver}" class="chooseplace"></a>
                                    <div  class="placecont hide">
                                           <div class="app-table-list place-panel" >
                                            <table>
                                                <thead>
                                                <tr>
                                                    <td class="perc-80">地点
                                                    </td>
                                                    <td >操作
                                                    </td>
                                                </tr>
                                                </thead>
                                                <tbody >

                                                </tbody>
                                            </table>
                                                <div class="m-t10 placepage"></div>
                                               <div class="m-t10">
                                                <input class="w-305-h36 placeval"  placeholder="请输入地点并新增到选项" />
                                                    <a class="addplace blue-button m-l20">新增</a>
                                                </div>
                                                <div class="m-t10 oflow">
                                                    <span class="btn-gray96x32  rt">取消</span>
                                                    <span class="btn-blue96x32 m-r10 rt">确定</span>
                                                </div>
                                           </div>

                                    </div>

                                </dd>
                            </div>
                            <a id="retract{ver}" class="l-30"><i class="icon icon-down-solid"></i>更多设置</a>
                            <div class="more-box" id="morebox{ver}">
                                <dt>到期提醒</dt>
                                <dd>
                                    到期前
                                    <input id="remind_text{ver}" value="{BeforeTime||'15'}" class="expire-remind" placeholder="15" />
                                    <div class="select-gray-box expire-remind-unit">
                                        <select id="selectunit{ver}" class="w-343">
                                            <option value="0">分钟</option>
                                            <option value="1">小时</option>
                                            <option value="2">天</option>
                                        </select>
                                    </div>
                                </dd>
                                <dt>详细内容</dt>
                                <dd>
                                    <textarea id="detail_text{ver}" class="detail" placeholder="显示详情" />{Content}</textarea>
                                </dd>
                                <dt class="attach-line">上传</dt>
                                <dd class="attach-line attach-cont fw_left">
                                    <div id="btn_calendarcontainer{ver}">
                                        <a class="btn-attachment" id="uploaderbtncalendar{ver}" >
                                            附件
                                        </a>
                                    </div>


                                       <div >
                                                     <ul id="uploadercalendar{ver}" class="filelist"></ul>
                                                 </div>
                                </dd>
                                <div class="clear"></div>
                        </div>
                        </dl>
                    </div>
                    <div class="h-45 clear">
                        <span class="btn-gray96x32  rt">取消</span>
                        <span class="btn-blue96x32 m-r10 rt">保存</span>
                    </div>
                    <div class="clear"></div>
                </div>
                <i class="icon headofarrow"></i>