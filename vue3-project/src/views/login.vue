<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      title: "DuanYL",
      registFlag: false,
      user: {
        username: "admin",
        password: "1",
        telphone: "",
      },
      errormessage: "",
    };
  },
  methods: {
    login: async function (type) {
      let result = {};
      // 登录处理
      if (!this.registFlag) {
        // 请求前移除保存的token信息
        localStorage.removeItem("vue_jwt_token");
        result = await request.post("/login", this.user);
      } else if (0 == type) {
        // result = await request.get("/userRegist", this.user)
      }
      // 结果判断
      console.log(result);
      if (200 == result?.code) {
        localStorage.setItem("vue_jwt_token", result.data.token);
        this.registFlag = true
        this.$router.push({name: "mainFrame", query: {msg: 'new'}})
      } else {
        this.errormessage = result?.message;
      }
    },
    routeMenu: function () {
      
    },
  },
};
</script>

<template>
  <div id="context" style="padding-top: 200px">
    <div class="card" style="width: 40%; background-color: #868e95a8">
      <el-form
        :model="user"
        label-width="120px"
        style="margin-top: 50px; width: 90%"
      >
        <div v-if="errormessage !== ``">
          <label style="color: red">{{ errormessage }}</label>
        </div>
        <el-form-item label="用户名">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="user.password"></el-input>
        </el-form-item>
        <template v-if="registFlag">
          <el-form-item label="手机号">
            <el-input v-model="user.telphone"></el-input>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" @click="login()" v-if="!registFlag">登录</el-button>
          <el-button type="primary" @click="routeMenu()">静态html</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: solid 1px aquamarine;
  border-radius: 10px;
}
</style>
