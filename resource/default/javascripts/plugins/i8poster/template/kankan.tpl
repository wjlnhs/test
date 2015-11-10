<div class="kk-tab">
            <div class="kk-body">
                <div class="kk-content rel">
                    <textarea class="kk-content-text" id="kk-content-{kkConfig.kid}" placeholder="{kkConfig.kkplaceholder}"></textarea>
                    <i class="icon headofarrow" ></i>
                </div>
                <div class="kk-footer">
                    <ul class="functions-btns-left">
                        {if kkConfig.attachment}
                            <li class="s-icon attachment-btn" id="{kkConfig.attabtnContainer}">
                                <span class="btn btn-default btn-lg " id="{kkConfig.attachid}"><span class="kk-poster-att-btn">附件</span></span>
                                <!--<div id="{kkConfig.attachid}"></div>-->
                             </li>
                        {/if}
                        {if kkConfig.gift}
                            <li class="s-icon gift-btn">礼物</li>
                        {/if}
                        {if kkConfig.face}
                            <li class="s-icon expression-btn">表情 {=kkConfig.faceitem}</li>
                        {/if}
                        {if kkConfig.topic}
                            <li class="s-icon topic-btn">话题</li>
                        {/if}
                    </ul>

                    <a class="btn-blue-h32 kk-sub post-btn-disabled">发布</a>
                    {if kkConfig.scope}
                    <div class="release-scope" scope-value="scope-null">
                        <div class="release-scope-title s-icon"><span class="scope-txt-title">请选择发布范围</span><i class="icon"></i></div>
                        <ul class="release-scope-group">
                            {if kkConfig.scopeukk}<li class="s-icon enterprise-community-btn">企业社区</li>{/if}
                            <li class="s-icon only-visible-btn">仅@可见</li>
                            <li class="icon new-group-btn">创建新群组</li>
                        </ul>
                    </div>
                    {/if}
                    <div class="clear"></div>
                     <ul  id="{kkConfig.attaContainer}" class="filelist">

                     </ul>
                     <!--<div id="{kkConfig.attaContainer}">
                            <div class="queueList"></div>
                     </div>-->
                     {if kkConfig.gift}
                        <div class="gifts-list">
                           <span class="giftitem gift-01" gid="gift-01" title="送你一双暖暖的手套，愿它能从手指尖暖到你心里！"><i></i></span>
                           <span class="giftitem gift-02" gid="gift-02" title="拆礼物的姿势永远最赞，愿这个礼物盒为你带去幸运和快乐！"><i></i></span>
                           <span class="giftitem gift-03" gid="gift-03" title="祝你生活甜蜜美好！"><i></i></span>
                           <span class="giftitem gift-04" gid="gift-04" title="送你小糖果，甜过初恋的滋味！"><i></i></span>
                           <span class="giftitem gift-05" gid="gift-05" title="你是我的小呀小苹果，各种爱你都不嫌多！"><i></i></span>
                           <span class="giftitem gift-06" gid="gift-06" title="鲜花，礼物，都不及我对你的祝福！"><i></i></span>
                           <span class="giftitem gift-07" gid="gift-07" title="送一只满满的蛋糕，祝一辈子满满的甜蜜！"><i></i></span>
                           <span class="giftitem gift-08" gid="gift-08" title="爱咋吃就咋吃，祝吃货生涯美好一辈子！"><i></i></span>
                           <span class="giftitem gift-09" gid="gift-09" title="有钱，任性！送啥都没金币来得实在！"><i></i></span>
                        </div>
                     {/if}
                </div>
                <div class="clear"></div>
            </div>
            <div class="attachment-tip abs">
                最多5个文件，单个文件不超过30M 支持格式：图片、doc、xls、ppt、txt、rar、pdf
                <i class="icon headofarrow"></i>
            </div>
        </div>