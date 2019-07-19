<template>
    <div>
        <!-- 绘制表格区域 -->
        <div id="main" style="width: 1000px;height:500px;"></div>
    </div>
</template>
<script>
//导入echarts
import Echarts from 'echarts';
import _ from 'lodash';
export default {
    // 组件渲染完毕
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = Echarts.init(document.getElementById('main'));
        //获取数据
        let {data:result}=await this.$http.get('reports/type/1');
            console.log(result)
            if(result.meta.status!=200){
                this.$alert({
                    message:'获取失败',
                    type:'error'
                });
                return;
            }
            const dataObj=_.merge(result.data,this.option)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(dataObj);
    },
    data(){
        return {
            // 指定图表的配置项和数据
         option :{
            title: {
                text: '销售额线形图'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        }
    }
}
</script>
<style lang="less" scoped>

</style>
