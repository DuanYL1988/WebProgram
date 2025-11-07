<script>
import Utils from "@/utils/request";
export default {
  data() {
    return {
      title: "DuanYL",
      registFlag: false,
      userList:[
        {label:"管理员", username: "admin",icon:"https://pic.mksucai.com/00/39/07/4e922ed1e63872de.webp"},
        {label:"火纹-管理员", username: "mikaya",icon:"https://static.wikia.nocookie.net/feheroes_gamepedia_en/images/a/a9/Icon_MiniUnit_Head_12.png"},
        {label:"火纹-游客", username: "kamila",icon:"https://static.wikia.nocookie.net/feheroes_gamepedia_en/images/a/a9/Icon_MiniUnit_Head_12.png"},
        {label:"FGO-管理员", username: "artoria",icon:"https://www.suruga-ya.jp/database/pics_light/game/871084251.jpg"},
        {label:"FGO-游客", username: "scathach",icon:"https://www.suruga-ya.jp/database/pics_light/game/871084251.jpg"},
        {label:"明日方舟", username: "artoria",icon:""},
        {label:"尘白禁区", username: "artoria",icon:""},
        {label:"鸣潮", username: "artoria",icon:""},
        {label:"原神", username: "artoria",icon:""},
        {label:"碧蓝幻想", username: "artoria",icon:"https://img9.doubanio.com/lpic/s29634535.jpg"},
        {label:"碧蓝航线", username: "artoria",icon:"https://styles.redditmedia.com/t5_k0cjy/styles/profileIcon_u2oc5vpdzv711.png"},
        {label:"农药", username: "artoria",icon:"https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183-smallskin-6.jpg"},
      ],
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
        localStorage.removeItem("userinfo");
        result = await Utils.request.post("/login", this.user);
      } else if (0 == type) {
        // result = await request.get("/userRegist", this.user)
      }
      // 结果判断
      // console.log(result);
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
          <el-select class="imgSelect" v-model="user.username">
            <el-option class="center" v-for="master in userList" :value="master.username" :label="master.label">
              <img v-if="''!==master.icon" class="selectIcon" :src="master.icon"/>{{master.label}}
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
        <el-form-item>
          <el-button type="primary" @click="login()" v-if="!registFlag">登录</el-button>
          <el-button type="primary" @click="routeMenu()">静态html</el-button>
          <el-button type="primary" @click="test()">TEST</el-button>
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
