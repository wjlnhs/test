<div class="blogs-container">
        {if listHeader}
            <div class="blogs-header">
                <div class="list-nav">
                    <ul class="nav-tabs">
                        <li class="tabBlog-all hover"><a>所有</a><i class="ds3"></i></li>
                        <li class="tabBlog-kk" style="width:162px">
                            <a class="app-kk-tabName">侃侃</a>
                            <i class="ds3"></i>
                            <span class="filter-ico"></span>
                            <dl class="grp-filter">
                                <dd class="app-workflow kktab-filter"><a>加载中...</a></dd>
                            </dl>
                        </li>
                        <li class="tabBlog-app" >
                            <a class="app-filter-tabName">应用</a>
                            <span class="filter-ico"></span>
                            <dl class="apps-filter">
                                <dd class="app-workflow kktab-filter" appid="4b1e7570-15dd-4a4f-88ca-af4c9cc87f99" tabname="工作流"><a>工作流</a></dd>
                                <dd class="app-schedule kktab-filter" appid="92af1586-4fc4-4f79-a908-269a6c904fc5" tabname="日程"><a>日程</a></dd>
                                <dd class="app-task kktab-filter" appid="1a289157-8af2-4379-94e0-2b04b1b5395d" tabname="任务"><a>任务</a></dd>
                                <dd class="app-daily kktab-filter" appid="568d9564-09e0-40e6-945b-db2bd86854dd" tabname="周日报"><a>周日报</a></dd>
                                <dd class="app-knowlage kktab-filter" appid="47bfcb77-8640-433c-b482-70b81ec18a0a" tabname="企业文档"><a>企业文档</a></dd>
                            </dl>
                            <i class="ds3"></i>
                        </li>
                        <br class="clear"/>
                    </ul>
                </div>
                <div class="warn-weather">
                    <div class="date-info">
                    </div>
                    <div class="location-city">
                        <a class="city-name"></a>
                    </div>
                </div>
            </div>
        {/if}
            <div class="blogs-list-body">
                <div class="blogs-list-body-mask"></div>
                <div class="blogs-loading"></div>
                <div class="blogs-nocontent">
                    <span class="no-content-info">{noConentText}</span>
                </div>
                <ul class="blogs-list-items">
                    <li class="latest-kankan"><a class="a-loadlatest-blogs">有<span id="txt-latest-num">0</span>条最新动态，点击查看</a></li>
                </ul>
                <div class="load-moreBlogs">
                    <span>加载更多</span>
                </div>
            </div>
        </div>