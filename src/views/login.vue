<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" :loading="loading" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">请输入用户名和密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
 import util from '@/libs/util'
let url={
    login:'/user/login'
}
export default {
    data () {
        return {
            form: {
                userName: 'admin',
                password: ''
            },
            loading:false,
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loading=true
                    util.ajax(this).post(url.login,{a_login:this.form.userName,a_password:this.form.password}).then((res) => {
                        this.loading=false
                        let r=res.data
                        if(r.code){
                            Cookies.set('user', this.form.userName,{ expires:1 });
                            Cookies.set('password', this.form.password,{ expires:1 });
                            Cookies.set('a_api_token', r.data,{ expires:1 });
                            this.$router.push({
                                name: 'record_index'
                            });                            
                        }
                    })

                }
            });
        }
    }
};
</script>

<style>

</style>
