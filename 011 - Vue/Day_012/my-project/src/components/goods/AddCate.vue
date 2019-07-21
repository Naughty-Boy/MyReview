<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <el-alert
              title="添加商品信息"
              type="info"
              center
              :closable="false"
              show-icon>
            </el-alert>
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
              <el-step title="基本信息"></el-step>
              <el-step title="商品参数"></el-step>
              <el-step title="商品属性"></el-step>
              <el-step title="商品图片"></el-step>
              <el-step title="商品内容"></el-step>
              <el-step title="完成"></el-step>
            </el-steps>
            <!-- tab切换栏 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
              <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                <el-tab-pane label="基本信息" name="0">
                  <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addForm.goods_name"></el-input>
                  </el-form-item>
                  <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="addForm.goods_price" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addForm.goods_weight" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addForm.goods_number" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品分类" prop="goods_cat">
                    <!-- 级联选择器 -->
                    <el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="addForm.goods_cat" @change="handleChange">
                    </el-cascader>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                  <!-- 渲染表单的Item项 -->
                  <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                    <!-- 复选框组 -->
                    <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                  <!-- 填写商品属性表单 -->
                  <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                  <!-- 图片上传 -->
                  <el-upload
                    :headers="headerObj"
                    class="upload-demo"
                    action="http://localhost:8888/api/private/v1/upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    list-type="picture">
                    <el-button size="small" type="info">点击上传</el-button>
                  </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                  <!-- 富文本编辑器 -->
                  <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                  <el-button @click="add" type="primary">提交</el-button>
                </el-tab-pane>
              </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览弹话框 -->
        <el-dialog
          width="40%"
          title="图片预览"
          :visible.sync="previewVisible">
          <!-- 绑定图片路径 -->
          <img :src="previewPath" style="width: 100%;" alt="">
        </el-dialog>
    </div>
</template>
<script>
// 导入lodash
import _ from 'lodash'
export default {
    created(){
      // 获取商品列表
      this.getCateList();
    },
    data(){
        return {
            activeIndex:"0",
            // 添加商品表单数据
            addForm: {
              goods_name: '',
              goods_price: 1000,
              goods_weight: 100,
              goods_number: 1111,
              // 商品所属的分类数组
              goods_cat: [],
              // 存放上传图片的数组
              pics:[],
              // 商品的富文本编辑内容
              goods_introduce:'',
              attrs:[]
            },
            // 表单验证规则
            addFormRules: {
              goods_name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' }
              ],
              goods_price: [
                { required: true, message: '请输入商品价格', trigger: 'blur' }
              ],
              goods_weight: [
                { required: true, message: '请输入商品重量', trigger: 'blur' }
              ],
              goods_number: [
                { required: true, message: '请输入商品数量', trigger: 'blur' }
              ],
              goods_cat: [
                { required: true, message: '请选择商品分类', trigger: 'blur' }
              ]
            },
            // 商品分类列表
            catelist: [],
            cateProps: {
              label: 'cat_name',
              value: 'cat_id',
              children: 'children'
            },
            // 动态参数列表数据
            manyTableData: [],
            // 静态属性列表数据
            onlyTableData: [],
            // 图片预览
            previewPath:"",
            //上传图片请求头
            headerObj:{
              Authorization:window.sessionStorage.getItem('token')
            },
            // 预览弹框的显示与隐藏
            previewVisible:false,
          }
    },
    methods:{
      // 获取商品列表
      async getCateList() {
        const { data: result } = await this.$http.get('categories')

        if (result.meta.status !== 200) {
          return this.$alert.error('获取商品分类数据失败！')
        }

        this.catelist = result.data
      },
      // 级联选择器选中项变化
      handleChange() {
        console.log(this.addForm.goods_cat)
        if (this.addForm.goods_cat.length !== 3) {
          this.addForm.goods_cat = []
        }
      },
      beforeTabLeave(activeName, oldActiveName) {
        // console.log( oldActiveName,activeName)
        if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
          this.$alert.error('请选择商品分类')
          return false
        }
      }, 
      async tabClicked() {
        // 验证是否在访问动态参数面板
        // console.log(this.activeIndex)
        if (this.activeIndex === '1') {
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'many' }
            }
          )

          if (res.meta.status !== 200) {
            return this.$alert.error('获取动态参数列表失败请重试')
          }

          console.log(res.data)
          res.data.forEach(item => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
          })
          this.manyTableData = res.data
        } else if (this.activeIndex === '2') {
          const { data: res } = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: { sel: 'only' }
            }
          )

          if (res.meta.status !== 200) {
            return this.$alert.error('静态属性获取失败')
          }

          console.log(res.data)
          this.onlyTableData = res.data
        }
      } ,
      // 图片预览
      handlePreview(file){
        console.log(file)
        //将图片路径保存到previewPath中
        this.previewVisible=true;
        this.previewPath=file.response.data.url;
      },
      // 删除上传的图片
      handleRemove(file,fileList){
        // console.log(file)
        // console.log(fileList)
        // 拿到要删除的文件虚拟路径
        const filePath=file.response.data.tmp_path;
        //拿到要删除的索引值
        const index=this.addForm.pics.findIndex((item)=>{
          if(item.pic==filePath){
            return true;
          }
        })
        // 删除
        this.addForm.pics.splice(index,1);
      },
      handleSuccess(response,file,fileList){
        console.log(response);
        // 创建一个图片信息对象
        const picInfo={
          pic:response.data.tmp_path
        }
        // 将该对象放到pics数组中
        this.addForm.pics.push(picInfo);
      },
      add(){
        //添加表单数据
        this.$refs.addFormRef.validate((val)=>{
          //验证不通过
          if(!val){
            this.$alert({
              message:'表单验证不通过',
              type:'error'
            });
            return;
          }
          // 验证通过
          //因为接口需要的goods_cat接收的是一个字符串而不是一个数组，所以需要更改表单数据类型
          //使用lodash深拷贝一个对象来操作，因为原来对象的goods_cat必须是一个数据，级联组件绑定
          const form = _.cloneDeep(this.addForm);
          form.goods_cat=form.goods_cat.join(',');
          // 将动态参数和静态参数只作为解析需要的格式
          this.manyTableData.forEach((item)=>{
            //创建一个对象作为单个数据
            const obj={
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            //当前表单添加新数据
            this.addForm.attrs.push(obj);
          })
          //静态参数
          this.onlyTableData.forEach((item)=>{
            const obj = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            //同样的作为addForm的attrs数据
            this.addForm.attrs.push(obj)
          })

          //将整合好的数据放到form上
          form.attrs=this.addForm.attrs;
          //发起添加请求
          this.$http.post('goods',form).then((result)=>{
            // console.log(result)
            this.$alert({
              message:'添加成功',
              type:'success'
            });
            //清空表单
            this.$refs.addFormRef.resetFields();
            //跳转到商品列表页面
            this.$router.push('/goods')
          }).catch((err)=>{
            this.$alert({
              message:'请求失败',
              type:'error'
            })
          })
        })
      }
    },
    computed: {
      cateId() {
        // 通过计算属性获取级联选择器中的商品ID
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2]
        }
        return null
      }
    }
}
</script>
<style lang="less" scoped>
    .el-steps {
        margin: 20px auto;
    }
</style>
