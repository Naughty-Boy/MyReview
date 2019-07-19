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
                      <!-- 修改用户信息 -->
                      <el-button size="mini" type="primary" icon="fa fa-pencil-square-o" @click="editUserInfo(scope.row.id)"></el-button>
                      <!-- 删除用户信息 -->
                      <el-button size="mini" type="danger" icon="fa fa-trash" @click="deleteUser(scope.row.id)"></el-button>
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
        <!-- 添加用户谈话框 -->
        <el-dialog
          title="添加用户信息"
          width="50%"
          :visible.sync="dialogVisible"
          :before-close="addUserFormClosed"
        >
          <!-- 内容 -->
          <!-- 添加用户表单 -->
            <el-form label-width="80px"  :model="addUserForm" :rules="addUserRules" ref="addUserForm"
            >
                <!-- 绑定验证规则 -->
                <el-form-item prop="username" label="用户名">
                    <el-input prefix-icon="fa fa-user-o" v-model="addUserForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password" label="密码">
                    <el-input prefix-icon="fa fa-unlock-alt" v-model="addUserForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input prefix-icon="fa fa-envelope-o" v-model="addUserForm.email"></el-input>
                </el-form-item>
                <el-form-item prop="mobile" label="手机">
                    <el-input prefix-icon="fa fa-mobile" v-model="addUserForm.mobile"></el-input>
                </el-form-item>
            </el-form>
          <!-- 谈话框按钮组 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addUserFormClosed">取 消</el-button>
            <el-button type="primary" @click="addUserFormSure('addUserForm')">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户谈话框 -->
        <el-dialog
          title="修改用户信息"
          width="50%"
          :visible.sync="editDialogVisible"
          :before-close="editUserFormClosed"
        >
         <el-form :model="editUser" status-icon :rules="editUserRules" ref="editUserForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名">
            <el-input type="text" v-model="editUser.username" disabled auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="editUser.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input type="text" v-model="editUser.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
          <!-- 谈话框按钮组 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editUserFormClosed">取 消</el-button>
            <el-button type="primary" @click="editUserFormSure('editUserForm')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        //自定义密码验证方式
        var validateEmail = (rule, value, callback) => {
            // 邮箱正则表达式
        const regEmail=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        // 邮箱合法
        if (regEmail.test(value)) {
          callback();
          return;
        }
        // 邮箱不合法
        callback(new Error('请输入正确的邮箱'));
      };
      var validateMobile = (rule, value, callback) => {
            // 手机号正则表达式
        const regMobile=/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
        // 手机号合法
        if (regMobile.test(value)) {
          callback();
          return;
        }
        // 手机号不合法
        callback(new Error('请输入正确的手机号'));
      };
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
            //存放被修改的用户
            editUser:{},
            //谈话框的显示与隐藏
            dialogVisible:false,
            //编辑用户弹话框显示与隐藏
            editDialogVisible:false,
            // 添加用户的表单信息
            addUserForm:{},
            addUserRules:{
                username:[ // 非空验证
                        { required: true, message: '请输入用户名称', trigger: 'blur'},
                        // 字符长度验证
                        { min: 5, max: 12, message: '用户名长度在 5-12 个字符', trigger: 'blur' }
                        ],
                        // 非空验证
                password:[{ required: true, message: '请输入用户名称', trigger: 'blur'},
                        // 字符长度验证
                        { min: 5, max: 12, message: '用户名长度在 5-12 个字符', trigger: 'blur' }
                        ],
                email:[ // 自定义验证方式
                        { required: true,validator: validateEmail, trigger: 'blur' },
                        ],
                mobile:[ // 自定义验证方式
                        { required: true,validator: validateMobile,  trigger: 'blur' },
                        ]
            },
            //编辑用户验证
            editUserRules:{
                email:[
                        { min: 0, max: 20, message: '用户邮箱长度在 20 个字符以内', trigger: 'blur' }
                        ],
                mobile:[
                        // 字符长度验证
                        { min: 0, max: 11, message: '用户手机号长度在 5-12 个字符', trigger: 'blur' }
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
            // console.log(result)
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
        },
        // 谈话框关闭，清空表单数据
        addUserFormClosed(){
            
            //关闭弹话框
            this.dialogVisible = false
            //通过$refs找到表单并且清空
            this.$refs['addUserForm'].resetFields();
        },
        // 添加用户表单确定添加按钮
        addUserFormSure(formName) {
        this.$refs[formName].validate(async (valid) => {
            // 如果验证失败不通过
            if(!valid)return;
            //通过后发起请求
            // 使用表单数据
            let usp=new URLSearchParams();
            usp.append('username',this.addUserForm.username);
            usp.append('password',this.addUserForm.password);
            usp.append('email',this.addUserForm.email);
            usp.append('mobile',this.addUserForm.mobile);
            let {data:result}=await this.$http.post('users',usp);
            //失败操作
            if(result.meta.status!=201){
                     this.$alert({
                         message:'添加用户失败',
                         type:'error'
                     })
                     return;
                 }
            //成功操作
            this.$alert({
                message:"添加用户成功",
                type:'success'
            })
            // 关闭谈话框
            this.dialogVisible=false;
            //重新获取用户列表数据
            this.getUserList();
            //通过$refs找到表单并且清空
            this.$refs['addUserForm'].resetFields();
        });
      },
    //   列表的编辑按钮
      editUserInfo(id){
        //   显示编辑弹话框
          this.editDialogVisible=true;
        //   根据编辑按钮的事件拿到对应的用户id，forEach遍历拿到该用户
          let user=this.userlist.filter((item)=>{
              if(item.id==id){
                  return item
              }
          })[0];
        //   将当前被点击的用户暂存早editUser
          this.editUser=user;
      },
      //取消修改用户信息按钮
      editUserFormClosed(){
          //关闭谈话框
          this.editDialogVisible=false;
      },
      editUserFormSure(info){
          //验证表单数据
          this.$refs[info].validate(async (value)=>{
              //如果验证不通过取消操作
              if(!value) return;
              //创建表单格式数据
              let usp = new URLSearchParams();
              usp.append('id',this.editUser.id);
              usp.append('email',this.editUser.email);
              usp.append('mobile',this.editUser.mobile);
              console.log(this.editUser)
              //验证通过发起请求更新数据
                let {data:result} = await this.$http.put('users/'+this.editUser.id,usp);
                console.log(result);
                //更新失败提示
                if(result.meta.status!=200){
                    //失败提示
                    this.$alert({
                        message:'更新失败',
                        type:'error'
                    })
                    return ;
                }
                //更新成功
                this.$alert({
                    message:'更新成功',
                    type:'success'
                })
                //关闭弹框
                this.editDialogVisible=false;
                //重新获取用户列表数据
                this.getUserList();
          })
      },
            deleteUser(id){
                let user=this.userlist.filter((item)=>{
                    if(item.id==id){
                        return item;
                    }
                })[0];
                //confirm谈话框，判断用户是否确定该操作
                this.$confirm('确认删除该用户？','用户:'+user.username,{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //用户点击了确认
                    // 发起删除用户请求
                    let {data:result}=await this.$http.delete('users/'+id);
                    console.log(result);
                    //请求失败
                    if(result.meta.status!=200){
                        this.$alert({
                            message:'删除请求发送失败',
                            type:'error'
                        })
                        return;
                    }
                    //请求成功
                  this.$alert({
                    type: 'success',
                    message: '删除成功!'
                  });
                //   获取用户列表
                this.getUserList();
                }).catch(() => {
                    // 用户点击了取消
                  this.$alert({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
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

