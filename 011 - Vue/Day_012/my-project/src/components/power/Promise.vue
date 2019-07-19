<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 表格 -->
             <el-table
              border
              stripe
              ref="promiseTable"
              :data="promiseList"
              highlight-current-row
              @current-change="handleCurrentChange">
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                property="authName"
                label="权限名称">
              </el-table-column>
              <el-table-column
                property="path"
                label="路径">
              </el-table-column>
              <el-table-column
                property="level"
                label="权限等级">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.level==0">等级一</el-tag>
                  <el-tag v-else-if="scope.row.level==1" type="success">等级二</el-tag>
                  <el-tag v-else-if="scope.row.level==2" type="warning">等级三</el-tag>
                </template>
              </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            // 用户权限列表
            promiseList:[]
        }
    },
    // 声明周期钩子
    created(){
        this.getPromiseList()
    },
    methods:{
        async getPromiseList(){
            let {data:result} = await this.$http.get('rights/list');
            //请求失败
            if(result.meta.status!=200){
                this.$alert({
                    message:"获取权限列表失败",
                    type:"error"
                })
                return;
            }
            //请求成功
            // console.log(result)
            this.promiseList=result.data;
        },
        handleCurrentChange(val) {
          console.log(val)
        }
    }
}
</script>
<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
    }
</style>
