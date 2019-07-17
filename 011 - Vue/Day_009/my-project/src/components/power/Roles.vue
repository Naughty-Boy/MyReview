<template>
    <div class="container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 表格 -->
            <el-table
              border
              stripe
              ref="rolesTable"
              :data="rolesTree"
              highlight-current-row>
              <!-- 展开栏 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 一级权限 -->
                    <el-row class="promiseRow" v-for="(item1,index1) in scope.row.children" :key="index1">
                      <el-col :span="4">
                          <el-tag closable @close="handleClose(scope.row,scope.row,index1)">{{item1.authName}}</el-tag>
                          <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="20">
                          <!-- 二级权限 -->
                          <el-row class="promiseRow2" v-for="(item2,index2) in item1.children" :key="index2">
                              <el-col :span="4">
                                <el-tag type="success" closable @close="handleClose(scope.row,item1,index2)">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                              </el-col>
                              <el-col class="promiseRow3" :span="20">
                                  <!-- 三级权限标签 -->
                                  <el-tag closable @close="handleClose(scope.row,item2,index3)" type="warning" v-for="(item3,index3) in item2.children" :key="index3">{{item3.authName}}</el-tag>
                              </el-col>
                          </el-row>
                      </el-col>
                    </el-row>
                </template>
              </el-table-column>
              <el-table-column
                type="index">
              </el-table-column>
              <el-table-column
                property="roleName"
                label="角色名称">
              </el-table-column>
              <el-table-column
                property="roleDesc"
                label="角色描述">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <!-- 操作按钮组 -->
                    <!-- 修改用户信息 -->
                    <el-button size="mini" type="primary" icon="fa fa-pencil-square-o" @click="editRoles(scope.row)">编辑</el-button>
                    <!-- 删除用户信息 -->
                    <el-button size="mini" type="danger" icon="fa fa-trash">删除</el-button>
                    <el-button size="mini" type="warning" icon="fa fa-cubes" @click="assignHandler(scope.row)">权限分配</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-card>
        <!-- 权限分配弹话框 -->
        <el-dialog
          title="提示"
          :visible.sync="assignDialogVisible"
          width="30%">
          <!-- 弹框内容区域 -->
          <!-- 权限的节点树 -->
          <el-tree
           default-expand-all
           show-checkbox 
           ref="promiseTree"
            node-key="id"
           :data="promiseList"
           :props="treeFormat"
           :default-checked-keys="defaultChecked"></el-tree>
          <!-- 弹框按钮区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="assignDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleCheckChange">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 角色编辑谈话框 -->
        <el-dialog
          title="提示"
          :visible.sync="editDialogVisible"
          width="36%">
          <!-- 内容区域 -->
        <el-form label-width="100px" :model="editingRoles">
            <el-form-item label="当前用户:">
                {{editingRoles.roleName}}
            </el-form-item>
            <el-form-item label="当前角色:">
                {{editingRoles.roleDesc}}
            </el-form-item>
            <el-form-item label="分配新角色:">
                <el-select v-model="editResultRolesId" placeholder="请选择">
                  <el-option
                    v-for="item in rolesTree"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
        </el-form>
          <!-- 按钮区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sureEditRoles()">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import { URLSearchParams } from 'url';
export default {
    data(){
        return{
            // 角色树形数据
            rolesTree:[],
            //分配权限弹话框
            assignDialogVisible:false,
            //编辑角色谈话框
            editDialogVisible:false,
            //权限列表
            promiseList:[],
            //弹框解析格式对象
            treeFormat:{
                children:'children',
                label:'authName'
            },
            //树状图默认选中数组
            defaultChecked:[],
            // 当前即将分配权限的用户ID
            rolesId:"",
            //待编辑的用户
            editingRoles:{},
            //编辑结果用户ID
            editResultRolesId:""
        }
    },
    created(){
        this.getRolesTree();
    },
    methods:{
        async getRolesTree(){
            let {data:result}=await this.$http.get('/roles');
            // console.log(result);
            //请求失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'请求失败',
                    type:'error'
                })
                return;
            }
            this.rolesTree=result.data;
        },
        // 权限标签删除操作
        async handleClose(roles,parent,index) {
            //删除用户权限
            let {data: result}=await this.$http.delete('roles/'+roles.id+'/rights/'+parent.children[index].id)
            //请求失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'请求失败',
                    type: 'error'
                });
                return;
            }
            this.$alert({
                message:'删除成功',
                type:'success'
            });
            //delete请求的返回值
            this.rolesTree.children=result.data;
            parent.children.splice(index,1);
        },
        async assignHandler(roles){
            // 暂存当前用户ID
            this.rolesId=roles.id;
            // 获取权限列表
            let {data:result}=await this.$http.get('rights/tree');
            // console.log(result);
            //获取失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'获取权限列表失败',
                    type: 'error'
                })
                return;
            }
            // 获取成功
            this.promiseList=result.data;
            //使用迭代将获取用户已存在的三级权限存入defaultChecked
            //先清空数组
            this.defaultChecked=[];
            this.getRolesPromise(roles,this.defaultChecked);
            // 分配权限弹框开启
            this.assignDialogVisible=true;
        },
        //权限树状图勾选事件
        async handleCheckChange(roles) {
            // 获取用户勾选的权限
            let arr=[...this.$refs['promiseTree'].getCheckedKeys(),...this.$refs['promiseTree'].getHalfCheckedKeys()]
            // 创建表单数据
            // let usp=new URLSearchParams();
            // usp.append('rids',arr.join(','));
            // 发起修改权限请求
            let {data:result}=await this.$http.post('roles/'+this.rolesId+'/rights',{
                rids:arr.join(',')
            });
            // console.log(usp)
            //请求失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'请求失败',
                    type:"error"
                });
                return;
            }
            //请求成功
            this.$alert({
                message:'请求成功',
                type:'success'
            });
            //重新获取用户的权限列表
            this.getRolesTree();
            //关闭谈话框
            this.assignDialogVisible=false;
        },
        //递归遍历
        getRolesPromise(node,arr){
            if(!node['children']&&!Array.isArray(node)){
                arr.push(node.id);
                return arr;
            }
            node.children.forEach(item => {
                this.getRolesPromise(item,arr);
            });
        },
        //编辑用户，设置角色
        editRoles(roles){
            //暂存角色
            this.editingRoles=roles;
            //显示谈话框
            this.editDialogVisible=true;
        },
        // 用户确定编辑结果
        async sureEditRoles(){
            // 如果为空的话
            if(!this.editResultRolesId){
                this.$alert({
                    message:'请选择参数',
                    type:'error'
                });
                return;
            }
            let {data:result}=await this.$http.put('users/'+this.editingRoles.id+'/role',{
                rid:this.editResultRolesId
            });
            console.log(result)
        }
    }
}
</script>
<style lang="less" scoped>
    .container {
        min-width: 950px;
    }
    .el-breadcrumb {
        margin-bottom: 15px;
    }
    .promiseRow,
    .promiseRow2 {
        border-bottom: 1px solid rgb(214, 206, 206);
        padding: 10px;
        // 垂直居中
        display: flex;
        align-items: center;
        &:first-of-type {
            border-top: 1px solid rgb(216, 210, 210);
        }
    }
    .promiseRow2 {
        &:first-of-type {
            padding-top: 0;
            border-top: 0;
        }
        &:last-of-type {
            padding-bottom: 0;
            border-bottom: 0;
        }
    }
    .promiseRow3 {
        padding-top: none;
        padding-bottom: none;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-content: space-between;
        &>.el-tag {
            margin-left: 10px;
            margin-right: 10px;
        }
    }
</style>
