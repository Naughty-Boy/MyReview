<template>
    <div>
        <h2>我是Home组件</h2>
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return {}
    },
    methods:{
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
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>