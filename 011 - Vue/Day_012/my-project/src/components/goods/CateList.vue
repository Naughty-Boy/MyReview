<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getCateList" class="input-with-select">
                  <el-button slot="append" @click="getCateList" icon="el-icon-search"></el-button>
                </el-input>
                <el-button type="primary" @click="gotoAdd">添加商品</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table
                border
                stripe
              :data="cateList">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="goods_name"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="goods_price"
                label="商品价格(元)"
                width="120">
              </el-table-column>
              <el-table-column
                prop="goods_weight"
                label="商品重量"
                width="100">
              </el-table-column>
              <el-table-column
                label="创建时间"
                width="200">
                <template slot-scope="scope">
                    {{scope.row.add_time | dateFormat}}
                </template>
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" class="el-icon-edit"></el-button>
                    <el-button type="danger" class="el-icon-delete" @click="removeCate(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 20, 30, 50]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    created(){
        this.getCateList();
    },
    data(){
        return {
            cateList:[],
            //数据查询对象
            queryInfo:{
                query:"",
                pagenum:1,
                pagesize:5
            },
            // 数据总数
            total:0
        }
    },
    methods:{
        //获取商品列表
        async getCateList(){
            let {data:result} =await this.$http.get("/goods",{
                params:this.queryInfo
            });
            if(result.meta.status!=200){
                this.$alert({
                    message:'获取商品列表失败',
                    type:'error'
                });
                return;
            }
            this.total=result.data.total;
            this.cateList=result.data.goods;
        },
        handleSizeChange(val){
            this.queryInfo.pagesize=val;
            this.getCateList();
        },
        handleCurrentChange(val){
            this.queryInfo.pagenum=val;
            this.getCateList();
        },
        removeCate(row){
            this.$confirm('确认删除该商品吗？?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(async () => {
              let {data:result}=await this.$http.delete('goods/'+row.goods_id)
                if(result.meta.status!=200){
                    this.$alert({
                        message:'删除请求失败',
                        type:'error'
                    });
                    return;
                }
              this.$alert({
                type: 'success',
                message: '删除成功!'
              });
              this.getCateList();
            }).catch(() => {
              this.$alert({
                type: 'info',
                message: '已取消删除'
              });
            });
        },
        gotoAdd(){
            this.$router.push('/goods/add')
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
        margin-right: 50px;
    }
</style>
