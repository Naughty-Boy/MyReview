<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-input placeholder="请输入搜索内容" v-model="inputSearch" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <!-- 订单表格 -->
            <el-table
              border
              stripe
              :data="orderList"
              style="width: 100%">
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                prop="order_number"
                label="订单编号">
              </el-table-column>
              <el-table-column
                prop="order_price"
                label="订单价格">
              </el-table-column>
              <el-table-column
                prop="pay_status"
                label="是否付款">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.pay_status==0" type="danger">未付款</el-tag>
                    <el-tag  v-else  type="success">已付款</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                prop="is_send"
                label="是否发货">
                </el-table-column>
                <el-table-column
                prop="create_time"
                label="下单时间">
                <template slot-scope="scope">
                    {{scope.row.create_time | dateFormat}}
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="showAdressDialog(scope.row)"></el-button>
                    <el-button type="primary" icon="fa fa-map-marker" @click="showExpressDialog(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页栏工具 -->
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
        <!-- 修改地址弹话框 -->
        <el-dialog
          title="修改地址"
          :visible.sync="addressDialogVisible"
          width="40%"
          :before-close="handleClose">
          <!-- 内容区域 -->
          <el-form ref="form" :model="addressForm" :rules="addressRules" label-width="100px">
            <el-form-item label="省市/区县">
              <el-cascader
                  expand-trigger="hover"
                  :options="cityData.provinces"
                  v-model="addressForm.cityData"
                  :props="addressConfig"
                  @change="handleAddressChange">
                </el-cascader>
            </el-form-item>
             <el-form-item label="详细地址" prop="detail">
              <el-input v-model="addressForm.detail" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-form>
          <!-- 按钮组 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addressDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 物流弹话框 -->
        <!-- 修改地址弹话框 -->
        <el-dialog
          title="查看物流"
          :visible.sync="expressDialogVisible"
          width="40%"
          :before-close="handleExpressClose">
          <!-- 内容区域 -->
          <!-- 时间线组件 -->
          <el-timeline :reverse="reverse">
              <el-timeline-item
                v-for="(item, index) in expressInfo"
                :key="index"
                :timestamp="item.time">
                {{item.context}}
              </el-timeline-item>
            </el-timeline>
          <!-- 按钮组 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="expressDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="expressDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
// 导入城市数据 cityList
import json from './city.js'
export default {
    created(){
        this.getOrderList();
        // console.log(cityList)
    },
    data(){
        return {
            // 输入框数据
            inputSearch:"",
            //查询数据
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            // 信息总数
            total:0,
            orderList:[],
            //城市数据
            cityData:json,
            //修改地址弹话框显示与隐藏
            addressDialogVisible:false,
            // 物流信息弹话框显示与隐藏
            expressDialogVisible:false,
            // 地址表单form对象
            addressForm:{
                cityData:[],
                detail:""
            },
            //表单验证的规则
            addressRules:{
                detail:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                    { min: 6, max: 26, message: '长度在 6 到 26 个字符', trigger: 'blur' }
                ]
            },
            // 级联选择器数据配置
            addressConfig:{
                label:'name',
                children:'cities',
                value:'name'
            },
            // 存放物流信息
            expressInfo:[]
        }
    },
    methods:{
        //获取订单列表
        async getOrderList(){
            let {data: result}=await this.$http.get('orders',{params:this.queryInfo});
            console.log(result)
            //获取失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'获取失败',
                    type:'error'
                });
                return;
            }
            //获取成功
            this.orderList=result.data.goods;
            this.total=result.data.total;
        },
        //页面尺寸发生变化
        handleSizeChange(val){
            this.queryInfo.pagesize=val;
            this.getOrderList();
        },
        // 当前页码发生变化
        handleCurrentChange(val){
            this.queryInfo.pagenum=val;
            this.getOrderList();
        },
        //地址级联选择器选中后
        handleAddressChange(val){

        },
        // 地址弹话框关闭时触发
        handleClose(){
            this.addressDialogVisible=false;
        },
        //表格中编辑按钮点击后
        showAdressDialog(row){
            this.addressDialogVisible=true;
        },
        //物流弹话框关闭时
        handleExpressClose(){
            this.expressDialogVisible=false;
        },
        //查看物流按钮被点击
        async showExpressDialog(row){
            // console.log(row)
            // 查询物流信息
            let {data:result} = await this.$http.get('/kuaidi/1106975712662');
            if(result.meta.status!=200){
                this.$alert({
                    message:'请求失败',
                    type:'error'
                });
                return;
            }
            this.expressInfo=result.data;
            this.expressDialogVisible=true;
        }
    }
}
</script>
<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
    }
    .el-input {
        width: 300px;
    }
</style>
