/**
 * Created by kusion on 2014/11/2.
 */
module.exports=function(grunt){
    Array.prototype.unique = function () { return this.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g, "$1$2$4").replace(/,,+/g, ",").replace(/,$/, "").split(","); };
    var transport=require('grunt-cmd-transport');
    var style = transport.style.init(grunt);
    var initConfig={};
    initConfig.pkg=grunt.file.readJSON('package.json');
    initConfig.transport={
        scriptRes:{
            option:{idleading:'/resource/'},
            files:{
                'build': ['fw_selector.js']
            }
        },
        styleRes:{
            options:{idleading:'/resource/',parsers:{'.css':[style.css2jsParser]}},
            files:{
                'build':['fw_selector.css']
            }
        }
    };
    grunt.initConfig(initConfig);
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.registerTask('default',['transport']);
}