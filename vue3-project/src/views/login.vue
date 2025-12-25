<script>
import Utils from "@/utils/request";
export default {
  data() {
    return {
      title: "DuanYL",
      registFlag: false,
      userList:[],
      user: {
        username: "admin",
        password: "Saber@74189632",
        telphone: "",
      },
      errormessage: "",
    };
  },
  mounted() {
    // 请求前移除保存的token信息
    localStorage.removeItem("vue_jwt_token");
    localStorage.removeItem("userinfo");
    Utils.request.get("/initUser").then((response) => {
      if (200 == response?.code) {
        this.userList = response.data.accountList;
      }
    });
  },
  methods: {
    login: async function (type) {
      let result = {};
      // 登录处理
      if (!this.registFlag) {
        console.log(this.user);
        result = await Utils.request.post("/login", this.user);
      } else if (0 == type) {
        // result = await request.get("/userRegist", this.user)
      }
      if (200 == result?.code) {
        localStorage.setItem("vue_jwt_token", result.data.token);
        localStorage.setItem("userinfo", result.data.user.user.faceUrl);
        this.registFlag = true
        this.$router.push({name: "mainFrame", query: {msg: 'new'}})
      } else {
        this.errormessage = result?.message;
      }
    },
    routeMenu: function () {
    },
    test:function(){
      Utils.alertMessage("success", "testMsg")
    }
  },
};
</script>

<template>
  <div class="page">
    <div class="auth">
      <div class="brand">
        <div class="logo">FE</div>
        <h1>欢迎回到管理面板</h1>
        <p class="sub">请输入你的账户信息以继续</p>
      </div>

      <form class="form" @submit.prevent="onSubmit">
        <el-form :model="user" label-position="top" :label-width="0">
			<div v-if="errormessage !== ``">
				<label style="color: red">{{ errormessage }}</label>
			</div>
			<el-form-item label="用户名">
				<el-select class="imgSelect" v-model="user.username">
				<el-option class="center" v-for="master in userList" :value="master.loginName" :label="master.username" :key="master.loginName">
				  <img v-if="''!==master.faceUrl" class="selectIcon" :src="master.faceUrl"/>{{master.username}}
				</el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="密码">
			  <el-input v-model="user.password"></el-input>
			</el-form-item>
			<template v-if="registFlag">
			  <el-form-item label="手机号">
				<el-input v-model="user.telphone"></el-input>
			  </el-form-item>
			</template>

          <!-- 自行添加其它输入项 -->

          <el-form-item>
            <el-button type="primary" :loading="loading" native-type="submit" style="width:100%" @click="login()">登录</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit" style="width:100%" @click="test()">TEST</el-button>
          </el-form-item>
        </el-form>

        <div class="footer">
          <a @click.prevent="onForgot">忘记密码?</a>
          <span> • </span>
          <a @click.prevent="onRegister">注册账户</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

.page{
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  padding: 24px;
  box-sizing: border-box;
}

.auth{
  width: 420px;
  background: rgb(168 189 104 / 56%);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 8px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
  backdrop-filter: blur(6px) saturate(120%);
  color: #e6eef8;
  border: 1px solid rgba(255,255,255,0.06);
}

.brand{
  text-align:center;
  margin-bottom: 18px;
}
.logo{
  width:64px;
  height:64px;
  margin:0 auto 10px;
  border-radius:10px;
  background: linear-gradient(135deg,#06b6d4,#3b82f6);
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  color:#042b4a;
  box-shadow: 0 6px 18px rgba(59,130,246,0.18);
  font-size:20px;
}
.brand h1{
  margin:6px 0 4px;
  font-size:18px;
  color:#f8fafc;
}
.brand .sub{
  margin:0;
  color: #a8c0da;
  font-size:13px;
}

/* 表单风格覆盖 Element 默认以适配暗色背景 */
::v-deep(.el-input__inner) {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(226, 214, 214, 0.082);
}
::v-deep(.el-input__inner::placeholder) {
  color: rgba(230,238,248,0.45);
}
::v-deep(.el-button--primary) {
  background: linear-gradient(90deg,#06b6d4,#3b82f6) !important;
  border: none;
  box-shadow: 0 8px 20px rgba(59,130,246,0.18);
}

/* 页面内的布局 */
.form {
  margin-top: 6px;
}
.footer{
  margin-top: 12px;
  display:flex;
  justify-content:center;
  gap:8px;
  color: #93b1d9;
  font-size:13px;
}
.footer a{ color: #93b1d9; cursor: pointer; text-decoration: none }
.footer a:hover{ color: #dbeafe; text-decoration: underline }

/* 响应式 */
@media (max-width: 520px) {
  .auth { width: 92%; padding:20px; }
  .logo { width:56px; height:56px; font-size:18px; }
}
</style>