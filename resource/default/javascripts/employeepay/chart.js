define(function (require, exports,modules) {
    var i8ui=require('../../javascripts/common/i8ui');
    var util=require('../../javascripts/common/util');
    var ajax=require('./ajax');


    var chart_tab=$('#chart_tab').on('click','li',function(){
        $('.chartcontainer').hide();
        chart_tab.find('li').removeClass('current');
        $('#'+$(this).addClass('current').attr('type')).show();
    })

    var formatData=function(retobj){
        var data1={
            series:[{
                name: '员工宝',
                data: [],
                color:'#47c7ea',
                marker:{
                    radius:6,
                    fillColor:'#fff',
                    lineColor:'#47c7ea',
                    lineWidth:2,
                    symbol: 'circle'
                }
            },{
                name: '某宝',
                data: [],
                color:'#e6ab38',
                marker:{
                    radius:6,
                    fillColor:'#fff',
                    lineColor:'#e6ab38',
                    lineWidth:2,
                    symbol: 'circle'
                }
            }],
            categories:[],
            container:'chartcontainer1',
            unit:'%',
            title:{
                text: '',
                x: -20 //center
            }
        }
        var data2={
            series:[{
                name: '员工宝',
                data: [],
                color:'#47c7ea',
                marker:{
                    radius:6,
                    fillColor:'#fff',
                    lineColor:'#47c7ea',
                    lineWidth:2,
                    symbol: 'circle'
                }
            },{
                name: '某宝',
                data: [],
                color:'#e6ab38',
                marker:{
                    radius:6,
                    fillColor:'#fff',
                    lineColor:'#e6ab38',
                    lineWidth:2,
                    symbol: 'circle'
                }
            }],
            categories:[],
            container:'chartcontainer2',
            unit:'元',
            title:{
                text: '',
                x: -20 //center
            }
        }
        retobj=retobj||[];
        for(var i=retobj.length-1;i>=0;i--){
            var randval=(Math.random()*0.1+0.9);
            data1.series[0].data.push({
                marker:{
                    radius:6,
                    fillColor:'#47c7ea',
                    symbol: 'circle'
                }
                ,y:retobj[i]['IncomeRate']
            });
            data1.series[1].data.push({
                marker:{
                    radius:6,
                    fillColor:'#e6ab38',
                    symbol: 'circle'
                }
                ,y:retobj[i]['VirtualIncomeRate']
            });
            data2.series[0].data.push({
                marker:{
                    radius:6,
                    fillColor:'#47c7ea',
                    symbol: 'circle'
                }
                ,y:retobj[i]['PreIncome']
            })
            data2.series[1].data.push({
                marker:{
                    radius:6,
                    fillColor:'#e6ab38',
                    symbol: 'circle'
                }
                ,y:retobj[i]['VirtualPreIncome']
            })
            var dateid=retobj[i]['DateID']||''
            var showdate=dateid.substr(4,2)+'-'+dateid.substr(6,2)
            data1.categories.push(showdate);
            data2.categories.push(showdate);
        }
        return [data1,data2];
    }

    var formatMyIncome=function(retobj){
        var data={
            series:[{
                name: '我的收益',
                data: [],
                color:'#daf4fb',
                marker:{
                    radius:6,
                    fillColor:'#ffffff',
                    lineColor:'#47c7ea',
                    lineWidth:2,
                    symbol: 'circle'
                }
            }],
            categories:[],
            container:'chartcontainer3',
            unit:'元',
            title:{
                text: '近一周收益（元）',
                x: -250 ,//center
                y:10,
                style:{
                    color:'#000',
                    fontSize:'12px',
                    fontWeight:'bold'
                }
            },
            fillColor:'#ffffff',
            lineWidth:0,
            height:400,
            width:630,
            seriestype:'area'
        }
        retobj=retobj||[];
        for(var i=retobj.length-1;i>=0;i--){
            data.series[0].data.push({
                marker:{
                    radius:6,
                    fillColor:'#47c7ea',
                    symbol: 'circle'
                }
                ,y:parseFloat(retobj[i]['sy'])
            })
            data.categories.push(util.dateformat(retobj[i]['date'],'MM-dd'));
        }
        return data;
    }

    var getReport=function(){
        ajax.getData({},function(data){
            if($.type(data)=='object'&&data.Result){
                var arr=formatData(data.ReturnObject);
                for(var i=0;i<arr.length;i++){
                    initChart(arr[i])
                }
            }else{

            }
        },'getreport');
    }

    var getMyIncomeByDate=function(){
        var date=new Date();
        var endDate=util.dateformat(date,'yyyy-MM-dd');
        var startDate=util.dateformat(new Date(date.getFullYear(),date.getMonth(),date.getDate()-7),'yyyy-MM-dd');
        var options={
            startDate:startDate,
            endDate:endDate,
            pageIndex:1,
            pageSize:7
        }
        ajax.getData(options,function(data){
            if($.type(data)=='object'&&data.Result){
                if(data.ReturnObject){
                    //console.log(data.ReturnObject)
                    initChart(formatMyIncome(data.ReturnObject));
                }
            }else{

            }
        },'getmyincomebydate');
    }

    getMyIncomeByDate()
    getReport();

    Highcharts.setOptions({
        global:{

        }
    })
    var initChart=function(obj){
        if($('#'+obj.container).length==0){
            return;
        }
        return new Highcharts.Chart({
            exporting:false,
            chart: {
                renderTo: obj.container,
                defaultSeriesType: obj.seriestype||'line',
                height:obj.height||310,
                width:obj.width||630
            },
            title: obj.title,
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                categories:obj.categories
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +' '+obj.unit;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: obj.series
        });
    }



    //exports.initChart=initChart;
});