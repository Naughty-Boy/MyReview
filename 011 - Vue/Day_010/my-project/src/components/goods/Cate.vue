<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcom' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-button type="primary" @click="showAddDialog">添加分类</el-button>
            </el-row>
            <!-- 带树形的列表 -->
            <zk-table
            border
            show-index
            index-text="#"
            :expand-type="false"
            :selection-type="false"
            :data="cateList"
            :columns="columns">
                <!-- 查看分类是否有效列 -->
              <template slot="valiable" slot-scope="scope">
                 <i v-if="scope.row.cat_deleted==false" style="color:lightgreen;" class="el-icon-success"></i>
                 <i v-else style="color: red;" class="el-icon-error"></i>
              </template>
              <!-- 等级列 -->
              <template slot="order" slot-scope="scope">
                 <el-tag v-if="scope.row.cat_level==0">等级一</el-tag>
                 <el-tag v-else-if="scope.row.cat_level==1" type="success">等级二</el-tag>
                 <el-tag v-else type="warning">等级三</el-tag>
              </template>
              <!-- 操作列 -->
              <template slot="contrl" slot-scope="scope">
                 <el-button class="fa fa-pencil-square-o" type="primary">编辑</el-button>
                 <el-button class="fa fa-trash-o" type="danger">删除</el-button>
              </template>
            </zk-table>
        </el-card>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryConf.pagenum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryConf.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!-- 添加分类弹话框 -->
        <el-dialog
          title="添加分类"
          :visible.sync="addDialogVisible"
          width="40%"
          @close="addCateFormClosed"
          >
          <!-- 内容区域 -->
          <!-- 分类名称表单 -->
            <el-form :model="addCateForm" status-icon :rules="addFormRules" ref="addCateForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="分类名称" prop="cat_name">
                <el-input type="text" v-model="addCateForm.cat_name" auto-complete="off"></el-input>
              </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="父级分类">
              <el-cascader
                expand-trigger="hover"
                :props="selectConf"
                :options="parentCateList"
                v-model="selectResult"
                clearable
                change-on-select
                separator="-">
              </el-cascader>
            </el-form-item>
            </el-form>
          <!-- 按钮组区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="commitAddResult">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            // 查询配置
            queryConf:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            //数据条数
            total:0,
            //商品分类列表
            cateList:[],
            props:{},
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },{
                label:'是否有效',
                type:'template',
                template:'valiable'
            },{
                label:'排序',
                type:'template',
                template:'order'
            },{
                label:'操作',
                type:'template',
                template:'contrl'
            }],
            //添加分类弹话框是否显示
            addDialogVisible:false,
            // 添加分类表单对象
            addCateForm:{
                // 当前分类的上一级id
                cat_pid:0,
                // 分类名称
                cat_name:"",
                // 选中的分类等级
                cat_level:0
            },
            // 添加表单验证规则对象
            addFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
                ]
            },
            // 父级分类数据
            parentCateList:[],
            // 级联选择器选中的结果
            selectResult:[],
            selectConf:{
                    label:'cat_name',
                    value:'cat_id',
                    children:'children'
            }
        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        // 当前页发生变化时
        async handleCurrentChange(val){
            this.queryConf.pagenum=val;
            this.getCateList();
        },
        //列表条数发生变化时
        async handleSizeChange(val){
            this.queryConf.pagesize=val;
            this.getCateList();
        },
        async getCateList(){
            let {data:result}=await this.$http.get('categories',{params:this.queryConf});
            // console.log(result)
            //请求失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'获取商品列表失败',
                    type:'error'
                });
                return;
            }
            //请求成功
            this.cateList=result.data.result;
            this.total=result.data.total;
        },
        // 显示添加谈话框
        async showAddDialog(){
            this.addDialogVisible=true;
            // 获取父级分类的数据
            let {data:result}=await this.$http.get('categories',{params:{type:2}});
            // console.log(result)
            //请求失败
            if(result.meta.status!=200){
                this.$alert({
                    message:'获取商品列表失败',
                    type:'error'
                });
                return;
            }
            //请求成功
            this.parentCateList=result.data;
            // console.log(result)
        },
        //添加分类等级选择
        async commitAddResult(){
            this.$refs.addCateForm.validate(value=>{
                // 验证不通过
                if(!value){
                    this.$alert({
                        message:'请输入分类名称',
                        type:'error'
                    });
                    return;
                }
            })
            // 如果选中的结果数组长度大于零，说明选中了分类
            if(this.selectResult.length>0){
                this.addCateForm.cat_pid=this.selectResult[this.selectResult.length-1];
                this.addCateForm.cat_level=this.selectResult.length;
            }else{
                // 反之默认为0
                this.addCateForm.cat_pid=0;
                this.addCateForm.cat_level=0;
            }
            //发送添加分类请求
            let {data:result}=await this.$http.post('/categories',this.addCateForm);
            // console.log(result);
            //请求失败
            if(result.meta.status!=201){
                this.$alert({
                    message:'请求失败',
                    type:'error'
                });
                return;
            }
            //请求成功
            this.$alert({
                    message:'操作成功',
                    type:'success'
                });
            this.getCateList();
            this.addDialogVisible=false;
        },
        //添加表单关闭
        addCateFormClosed(){
            this.$refs.addCateForm.resetFields();
            this.addCateForm.cat_pid=0;
            this.addCateForm.cat_level=0;
            this.selectResult=[];
            this.addDialogVisible=false;
        }
    }
}
</script>
<style lang="less" scoped>
    .el-breadcrumb {
        margin-bottom: 15px;
    }
    .el-cascader {
        width: 100%;
    }
</style>
