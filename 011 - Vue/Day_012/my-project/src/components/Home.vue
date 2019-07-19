<template>
    <el-container class="container">
        <!-- 头部 -->
        <el-header>
            <div class="info">
                <img src="../assets/logo.png" alt="logo">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
           <!-- 侧边栏菜单 -->
           <el-menu :default-active="navInfo" :collapse="isCollapse" :collapse-transition="false" background-color="#222238" unique-opened text-color="white" open="handleOpen" active-text-color="skyblue" router>
              <!-- 菜单折叠按钮 -->
              <div class="toggleBtn" @click="toggleCollapse">|||</div>
              <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                <template slot="title">
                    <!-- 图标 -->
                  <i :class="iconsObj[item.id]" class="navIcon"></i>
                  <!-- 文本 -->
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                  <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavInfo('/'+subItem.path)">{{subItem.authName}}</el-menu-item>
              </el-submenu>
            </el-menu>           
        </el-aside>
        <el-main>
            <!-- 主体内容 -->
            <router-view></router-view>
        </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data(){
        return {
            // 左侧菜单列表
            menuList:[],
            // 菜单选项id所对应的图标
            iconsObj:{
                '125':'fa fa-users',
                '103':'fa fa-key',
                '101':'fa fa-archive',
                '102':'fa fa-barcode',
                '145':'fa fa-tasks'
            },
            // 菜单是否折叠
            isCollapse:false,
            // 用来保存路由信息
            navInfo:''
        }
    },
    //生命周期钩子
    created(){
        //获取侧边栏数据
        this.getMenuList();
        //获取保存的路由信息
        this.navInfo=window.sessionStorage.getItem('navInfo')
    },
    methods:{
        async getMenuList(){
            let {data: result}=await this.$http.get('menus');
            if(result.meta.status!=200){
                //失败弹框
                this.$alert({
                    message:'获取菜单失败',
                    type:'warning'
                })
                return ;
            }
            this.menuList=result.data;        
        },
        logout(){
            this.$confirm('确定退出登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'   
            }).then(() => {
                // 清除token并路由跳转
                window.sessionStorage.clear();
                this.$router.push('/login');
              this.$alert({
                type: 'success',
                message: '退出成功!'
              });
            }).catch(()=>{
                this.$alert({
                    message:"取消操作",
                    type:"info"
                })
            })
        },
        // 二级菜单开启和关闭
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        //   按钮点击后菜单的折叠与展开
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        // 保存导航信息
        saveNavInfo(info){
            // console.log(info)
            this.navInfo=info;
            window.sessionStorage.setItem('navInfo',info);
        }
    }
}
</script>
<style lang="less" scoped>
    .container {
        height: 100%;
    }
    .el-header {
        background-color: rgb(39, 40, 48);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            img {
                height: 100%;
                display: block;
            }
            span {
                color: white;
            }
        }
    }
    .el-aside {
        background-color: rgb(34, 34, 56);
        .toggleBtn {
            background-color: #4A5064;
            text-align: center;
            font-size: 10px;
            line-height: 24px;
            color: white;
            letter-spacing: .3rem;
            cursor: pointer;
        }
        .el-menu {
            border-right: none;
            .navIcon {
                color: white;
                padding-right: 10px;
            }
        }
    }
    .el-main {
        background-color: rgb(218, 218, 218);
    }
</style>