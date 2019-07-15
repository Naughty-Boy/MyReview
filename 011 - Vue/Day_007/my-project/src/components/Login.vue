<template>
    <div class="container">
        <div class="loginContainer">
            <!-- 头像 -->
            <div class="userIcon">
                <img src="../assets/logo.png" />
            </div>
            <!-- 用户表单 -->
            <el-form label-width="0px" class="loginForm" :model="user" :rules="loginFormRules" :ref="loginForm">
                <!-- 绑定验证规则 -->
                <el-form-item prop="username">
                    <el-input v-model="user.username" prefix-icon="fa fa-user-o"></el-input>
                </el-form-item>
                <!--绑定验证规则-->
                <el-form-item prop="password">
                    <el-input v-model="user.password" prefix-icon="fa fa-lock"></el-input>
                </el-form-item>
                <div class="buttonGroup">
                    <el-button type="primary" @click="submitForm">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                // 用户表单绑定数据
                user:{
                    username:'',
                    password:''
                },
                // 用户表单验证规则
                loginFormRules:{
                    // 用户名验证规则
                    username: [
                        // 非空验证
                        { required: true, message: '请输入登录名称', trigger: 'blur' },
                        // 字符长度验证
                        { min: 5, max: 12, message: '用户名长度在 5-12 个字符', trigger: 'blur' }
                    ],
                    password:[
                        // 非空验证
                        { required: true, message: '请输入登录密码', trigger: 'blur' },
                        // 字符长度验证
                        { min: 5, max: 12, message: '密码长度在 5-12 个字符', trigger: 'blur' }
                    ]
                },
                loginForm:'loginForm'
            }
        },
        methods:{
            resetForm(){
                this.$refs[this.loginForm].resetFields();
            },
            submitForm(){
                this.$refs[this.loginForm].validate(async (result)=>{
                    // 验证结果，返回true/false
                    // console.log(result)
                    // 如果为false那么不执行网络请求
                    if(!result)return;
                    // 发起post验证请求
                    let usp = new URLSearchParams();
                    usp.append('username',this.user.username);
                    usp.append('password',this.user.password);
                    // 通过await拿到请求结果,并且解构
                    let {data}=await this.$http.post('login',usp);
                    console.log(data)
                    // 判断是否登录成功
                    if(data.meta.status==200){
                        this.$alert({
                            message: '登录成功',
                            type: 'success'
                        });
                        // 在登录成功时保存token值，存储在sessionStorage中
                        window.sessionStorage.setItem('token',data.data.token);
                        // 通过编程式导航跳转到Home组件
                        this.$router.push('/home');
                    }else{
                        this.$alert({
                            message:"登录失败",
                            type:'error'
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="less" scoped>
.container {
    background-color: #1e5d9c;
    height: 100%;
    width: 100%;
    .loginContainer {
        background-color: white;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 20px;
        height: 300px;
        width: 450px;
        .userIcon {
            height: 100px;
            width: 100px;
            border-radius: 50%;
            overflow: hidden;
            padding: 5px;
            box-shadow: 0 0 3px white;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            img {
                border-radius: 50%;
                background-color: rgba(155, 155, 155, .5);
                width: 100%;
                height: 100%;
            }
        }
        .loginForm {
            position: absolute;
            width: 100%;
            bottom: 0;
            padding: 20px;
            box-sizing: border-box;
            .buttonGroup {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}
</style>