<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告提示 -->
            <el-row>
                <el-alert
                  title="注意：只允许为第三级分类设置参数!"
                  type="warning"
                  show-icon
                  :closable="false">
                </el-alert>
            </el-row>
            <!-- 级联选择器 -->
            <el-row>
                <span>选择商品分类：</span>
                <el-cascader
                  expand-trigger="hover"
                  :options="cateList"
                  :props="selConf"
                  v-model="selectResult"
                  @change="handleChange">
                </el-cascader>
            </el-row>
            <!-- tab切换栏 -->
            <el-row>
                <el-tabs v-model="activeName" @tab-click="handleTabClick">
                    <!-- 添加动态参数面板 -->
                  <el-tab-pane label="动态参数" name="many">
                      <el-button type="primary" :disabled="isBtnDisable"  @click="addMany">添加参数</el-button>
                        <!-- 动态参数表格 -->
                           <el-table
                                border
                              :data="manyTableData"
                              style="width: 100%">
                              <el-table-column type="expand">
                                  <!-- 展开列 -->
                                  <template slot-scope="scope">
                                    <el-tag type="success" @close="inputClosed(index,scope.row)" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                    <el-input
                                      class="input-new-tag"
                                      v-if="scope.row.inputVisible"
                                      v-model="scope.row.inputValue"
                                      ref="saveTagInput"
                                      size="small"
                                      @keyup.enter.native="handleInputConfirm(scope.row)"
                                      @blur="handleInputConfirm(scope.row)"
                                    >
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                  </template>
                              </el-table-column>
                              <el-table-column
                                type="index">
                              </el-table-column>
                              <el-table-column
                                prop="attr_name"
                                label="参数名称">
                              </el-table-column>
                              <el-table-column
                                label="操作">
                               <template slot-scope="scope">
                                    <el-button class="fa fa-pencil-square-o" type="primary" @click="editInfo(scope.row)">编辑</el-button>
                                    <el-button class="fa fa-trash-o" type="danger" @click="removeCate(scope.row)">删除</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                  </el-tab-pane>
                  <!-- 添加静态属性面板 -->
                  <el-tab-pane label="静态属性" name="only">
                      <el-button type="primary" :disabled="isBtnDisable" @click="addOnly">添加属性</el-button>
                        <!-- 静态属性表格 -->
                        <!-- 动态参数表格 -->
                           <el-table
                                border
                              :data="onlyTableData"
                              style="width: 100%">
                              <el-table-column type="expand">
                                  <!-- 展开列 -->
                                  <template slot-scope="scope">
                                    <el-tag type="success" closable v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                                    <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                    >   
                                    </el-input>
                                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                  </template>
                              </el-table-column>
                              <el-table-column
                                type="index">
                              </el-table-column>
                              <el-table-column
                                prop="attr_name"
                                label="属性名称">
                              </el-table-column>
                              <el-table-column
                                label="操作">
                                <template slot-scope="scope">
                                    <el-button class="fa fa-pencil-square-o" type="primary" @click="editInfo(scope.row)">编辑</el-button>
                                    <el-button class="fa fa-trash-o" type="danger" @click="removeCate(scope.row)">删除</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                  </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-card>
        <!-- 添加参数或者属性弹话框 -->
        <el-dialog
          :title="this.activeName=='many'?'添加参数':'添加属性'"
          :visible.sync="addDialogVisible"
          width="40%"
          :before-close="handleClose">
          <!-- 内容区域 -->
            <el-form :model="addForm" ref="addForm" :rules="addFormRules" label-width="100px" class="demo-form-inline">
              <el-form-item prop="attr_name" :label="this.activeName=='many'?'参数名称：':'属性名称：'">
                <el-input v-model="addForm.attr_name"></el-input>
              </el-form-item>
            </el-form>
          <!-- 按钮区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="commitAdd">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 编辑弹话框 -->
        <el-dialog
          :title="this.activeName=='many'?'编辑参数':'编辑属性'"
          :visible.sync="editDialogVisible"
          width="40%"
          :before-close="editDialogClose">
          <!-- 内容区域 -->
            <el-form :model="editForm" ref="editForm" :rules="editFormRules" label-width="100px" class="demo-form-inline">
              <el-form-item prop="attr_name" :label="this.activeName=='many'?'参数名称：':'属性名称：'">
                <el-input v-model="editForm.attr_name"></el-input>
              </el-form-item>
            </el-form>
          <!-- 按钮区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogClose">取 消</el-button>
            <el-button type="primary" @click="commitEdit">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    created(){
        this.getCateList();
    },
    data(){
        return {
            // 存放商品列表
            cateList:[],
            //级联选择器绑定的数组
            selectResult:[],
            // 级联选择器配置对象
            selConf:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // tab展示页
            activeName:"many",
            // 表格数据
            manyTableData:[],
            onlyTableData:[],
            // 添加参数/属性弹话框显示与隐藏
            addDialogVisible:false,
            // 添加属性/参数数据对象
            addForm:{
                attr_name:''
            },
            //添加表单的验证规则
            addFormRules:{
                attr_name:[
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ]
            },
            // 编辑弹话框显示与隐藏
            editDialogVisible:false,
            // 编辑表单数据对象
            editForm:{
                attrId:'',
                attr_name:''
            },
            //编辑表单验证规则
            editFormRules:{
                attr_name:[
                    { required: true, message: '请输入内容', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        async getCateList(){
           let {data:result}=await this.$http.get('categories');
           //请求失败
           if(result.meta.status!=200){
               this.$alert({
                   message:'请求失败',
                   type:'error'
               });
               return;
           }
           this.cateList=result.data;
           console.log(result)
        },
        // 级联选择器选择后传入val值
        handleChange(val){
            // console.log(val)
            // 判断val数组的长度，禁止选中二级分类
            if(val.length<3){
                // 清空级联选择器的值
                this.selectResult=[];
                return;
            }
            this.getCateInfo();
        },
        //公用的获取产品信息
        async getCateInfo(){
            // 发起请求
            let {data:result}=await this.$http.get('categories/'+this.cateId+'/attributes',{
                params:{
                    sel:this.activeName
                }
            })
            if(result.meta.status!=200){
                // 获取失败
                this.$alert({
                    message:'获取数据失败',
                    type:'error'
                });
                return;
            }
            // 将接口返回的结果数据，进行字符串分割
            result.data.forEach(item => {
                //添加tag的显示与隐藏属性
                item.inputVisible=false;
                // 添加用于tag绑定的数据
                item.inputValue="";
                item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[];
            });
            //判断信息是哪一个面板的，对应进行赋值
            if(this.activeName=='many'){
                this.manyTableData=result.data;
            }else{
                this.onlyTableData=result.data;
            }
        },
        // tab切换处理
        handleTabClick(){
            console.log(this.activeName)
            this.getCateInfo();
        },
        //弹话框关闭之前处理
        handleClose(){
            //清空表单内容
            this.$refs.addForm.resetFields();
            this.addDialogVisible=false;
        },
        editDialogClose(){
            this.editDialogVisible=false;
            this.$refs.editForm.resetFields();
        },
        // 添加参数按钮
        addMany(){
            this.addDialogVisible=true;
        },
        // 添加属性按钮
        addOnly(){
            this.addDialogVisible=true;
        },
        // 表单提交按钮
        commitAdd(){
            //验证是否通过
            this.$refs.addForm.validate(async val=>{
                // 验证不通过
                if(!val)return;
                // 验证通过
                let {data:result}=await this.$http.post('categories/'+this.cateId+'/attributes',{
                    attr_name:this.addForm.attr_name,
                    attr_sel:this.activeName,
                })
                console.log(result)
                if(result.meta.status!=201){
                    this.$alert({
                        message:'添加失败',
                        type:'error'
                    });
                    return;
                }
                this.$alert({
                        message:'添加成功',
                        type:'success'
                    });
                this.getCateInfo();
                this.addDialogVisible=false;
            })
        },
        // 表格的编辑按钮
        editInfo(info){
            // console.log(info)
            // 记录当前参数的id
            this.editForm.attrId=info.attr_id;
            this.editForm.attr_name=info.attr_name;
            // 显示编辑弹话框
            this.editDialogVisible=true;
        },
        // 提交编辑表单
        commitEdit(){
            //验证是否通过
            this.$refs.editForm.validate(async val=>{
                // 验证不通过
                if(!val)return;
                // 验证通过
                let {data:result}=await this.$http.put('categories/'+this.cateId+'/attributes/'+this.editForm.attrId,{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName,
                })
                console.log(result)
                if(result.meta.status!=200){
                    this.$alert({
                        message:'修改失败',
                        type:'error'
                    });
                    return;
                }
                this.$alert({
                        message:'修改成功',
                        type:'success'
                    });
                this.getCateInfo();
                this.editDialogVisible=false;
            })
        },
        // 删除商品分类
        removeCate(info){
            let infoId=info.attr_id;
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              let {data:result}=await this.$http.delete('categories/'+this.cateId+'/attributes/'+infoId)
              if(result.meta.status!=200){
                  this.$alert({
                      message:'删除失败',
                      type:'error'
                  });
                  return;
              }
              this.$alert({
                type: 'success',
                message: '删除成功!'
              });
              this.getCateInfo();
            }).catch(() => {
              this.$alert({
                type: 'info',
                message: '已取消删除'
              });          
            });
        },
        // 鼠标离开tag中的输入框
        async handleInputConfirm(row){
            if(row.inputValue.trim().length==0){
                row.inputVisible=false;
                row.inputValue="";
                return;
            }
            row.attr_vals.push(row.inputValue);
            row.inputVisible=false;
            row.inputValue="";
            // 提交到服务器
            let {data:result}=await this.$http.put('categories/'+this.cateId+'/attributes/'+row.attr_id,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            if(result.meta.status!=200){
                this.$alert({
                    message:'添加失败',
                    type:'error'
                });
                return ;
            }
            this.$alert({
                message:'添加成功',
                type:'success'
            })
        },
        // 展示tag中的输入框
        showInput(row){
            row.inputVisible=true;
            //文本框自动获取焦点
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async inputClosed(index,row){
            row.attr_vals.splice(index,1);
            // 提交到服务器
            let {data:result}=await this.$http.put('categories/'+this.cateId+'/attributes/'+row.attr_id,{
                attr_name:row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            if(result.meta.status!=200){
                this.$alert({
                    message:'删除失败',
                    type:'error'
                });
                return ;
            }
            this.$alert({
                message:'删除成功',
                type:'success'
            })
        }
    },
    computed:{
        // 计算属性判断按钮是否被启用
        isBtnDisable(){
            if(this.selectResult.length!=3){
                return true;
            }
            return false;
        },
        // 根据级联选择器返回id
        cateId(){
            if(this.selectResult.length==3){
                // 直接返回索引为2的id
                return this.selectResult[2];
            }
            return null;
        }
    }
}
</script>
<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
    }
    .el-tag {
        margin: 5px;
    }
    .el-input {
        width: 100px;
    }
</style>
