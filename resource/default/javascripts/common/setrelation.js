define(function (require, exports, modules) {
    var ajaxHost = i8_session.ajaxHost;
    var funs = {
        /// <summary>
        /// 获取设置的关系列表
        /// </summary>
        /// <param name="accountID"></param>
        /// <param name="appID">应用ID</param>
        /// <param name="passportID">当前登录人ID</param>
        /// <param name="relationType">关系类型：1-谁可以查看我的（客体查看主体的），2-我可以查看谁的（主体查看客体的）</param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="totalCount"></param>
        /// <param name="noReportRelation">是否不需要汇报关系：true-不需要，false-需要（默认需要汇报关系）</param>
        /// <returns></returns>
        getAppsSetRelations: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/getappssetrelations',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },

        /// <summary>
        /// 删除设置关系，同时从设置中的最终分享人中删除对应人员
        /// </summary>
        /// <param name="accountID"></param>
        /// <param name="appID">应用ID</param>
        /// <param name="passportID">当前登录人的帐号ID</param>
        /// <param name="relationID"></param>
        /// <returns></returns>
        deleteAppsSetRelations: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/deleteappssetrelations',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },
        /// <summary>
        /// 保存共享给他人的、申请查看他人的，同意他人的申请、拒绝他人的申请
        /// </summary>
        /// <param name="accountID"></param>
        /// <param name="appID">应用ID</param>
        /// <param name="passportID">当前登录人的帐号ID</param>
        /// <param name="rsRelation"></param>
        /// <returns></returns>
        saveAppsSetRelations: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/saveappssetrelations',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },
        /// <summary>
        /// 获取APPset
        /// </summary>
        /// <param name="appID">应用ID</param>
        getAppSet: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/getappset',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },
        /// <summary>
        /// 获取默认要分享的人
        /// </summary>
        /// <param name="accountID"></param>
        /// <param name="appID">应用ID</param>
        /// <param name="passportID"></param>
        /// <returns></returns>
        getDefaultShareUser: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/getdefaultshareuser',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },
        /// <summary>
        /// 获取分享给指定帐号的设置项集合
        /// </summary>
        /// <param name="accountID"></param>
        /// <param name="appID">应用ID</param>
        /// <param name="passportID"></param>
        /// <returns></retur
        getSharebyPersonId: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/getsharebypersonid',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },

        saveAppsSet: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/saveappsset',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        },
        /// <summary>
        /// 保存默认Tab设置
        /// </summary>
        /// <param name="accountID"></param>
        /// <param name="passportID"></param>
        /// <param name="appID">应用ID</param>
        /// <param name="defaultTab">默认显示的Tab页</param>
        /// <param name="showOrderType">显示的排序类型</param>
        saveDefaultTab: function (options, callback) {
            $.ajax({
                url: ajaxHost + 'webajax/setrelation/savedefaulttab',
                type: 'get',
                dataType: 'json',
                cache: false,
                data: {options: options},
                success: function (data) {
                    callback(data);
                }, error: function (error) {
                    callback(error)
                }
            });
        }
    }
    modules.exports=funs;
});