<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card class="box-card">
          <el-row :gutter="20">
              <el-col :span="8">
              <el-input placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList">
                  <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
              </el-col>
              <el-col :span="4">
                  <el-button type="primary" @click="showDialog">添加用户</el-button>
              </el-col>
          </el-row>
          <!-- 用户列表区域 -->
            <el-table 
                :border="true"
                stripe
                :data="userlist"
                style="width: 100%">
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column
                  prop="username"
                  label="姓名">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱">
                </el-table-column>
                <el-table-column
                  prop="mobile"
                  label="电话">
                  </el-table-column>
                <el-table-column
                  prop="role_name"
                  label="角色">
                </el-table-column>
                <el-table-column
                  prop="mg_state"
                  label="状态">
                  <!-- 作用域插槽 -->
                  <template slot-scope="scope">
                      <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                  </template>
                </el-table-column>
                <!-- 操作区域 -->
                <el-table-column
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                      <el-button size="mini" type="primary" icon="fa fa-pencil-square-o"></el-button>
                      <el-button size="mini" type="danger" icon="fa fa-trash"></el-button>
                     <el-tooltip :enterable="false" class="item" effect="dark" content="Top Center 提示文字" placement="top">
                       <el-button size="mini" type="warning" icon="fa fa-cubes"></el-button>
                     </el-tooltip>
                  </template>
                </el-table-column>
            </el-table>
             <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,5,10]"
            :page-size="queryInfo.pagesize"
              layout="total,sizes,prev, pager, next,jumper"
              :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 谈话框 -->
        <el-dialog
          title="提示"
          width="50%"
          :visible.sync="dialogVisible"
        >
          <!-- 内容 -->
          <!-- 用户表单 -->
            <el-form label-width="80px"  :model="addUserForm" :rules="addUserRules" :ref="addUserForm">
                <!-- 绑定验证规则 -->
                <el-form-item prop="username" label="用户名">
                    <el-input prefix-icon="fa fa-user-o"></el-input>
                </el-form-item>
            </el-form>
          <!-- 谈话框按钮组 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            //用户列表接口所需参数
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                pagesize:2
            },
            // 存放用户列表数据
            userlist:[],
            total:0,
            //谈话框的显示与隐藏
            dialogVisible:false,
            // 添加用户的表单信息
            addUserForm:{},
            addUserRules:{
                username:[ // 非空验证
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        // 字符长度验证
                        { min: 5, max: 12, message: '用户名长度在 5-12 个字符', trigger: 'blur' }
                        ]
            }
        }
    },
    created(){
        // 请求用户列表
        this.getUserList();
    },
    methods:{
        async getUserList(){
            let {data:result} = await this.$http.get('users',{
                params:this.queryInfo
            });
            // 请求错误操作
            if(result.meta.status!=200){
                this.$alert({
                    message:'请求用户列表失败',
                    type:'error'
                })
                return;
            }
            // 后台数据存储到data中
            this.userlist=result.data.users;
            this.total=result.data.total;
            console.log(result)
        },
        //每页展示数量发生变化时
        handleSizeChange(newVal){
            this.queryInfo.pagesize=newVal;
            this.getUserList();
        },
        //当前页码发生变化时
        handleCurrentChange(newVal){
            this.queryInfo.pagenum=newVal;
            this.getUserList();
        },
        async userStateChange(info){
            // console.log(info)
            // 调用更新接口跟新用户的状态
            let {data:result}= await this.$http.put('/users/'+info.id+'/state/'+info.mg_state);
            if(result.meta.status!=200){
                // 如果失败，那么状态值返回原来的数据
                info.mg_state=!info.mg_state;
                // 失败提示
                this.$alert({
                    message:"更新失败",
                    type:'error'
                })
                return;
            }
            this.$alert({
                message:'更新成功',
                type:'success'
            })
        },
        // 添加用户谈话框显示
        showDialog(){
            this.dialogVisible=true;
        }
    }
}
</script>
<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
    }
    .el-card {
        box-shadow: 1px 1px 3px 1px gray;
    }
</style>

