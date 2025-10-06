<script setup>
import { ref, onMounted } from 'vue'
import request from '@/utils/request'
var menuList = ref({})
// 初期
onMounted(async function(){
    console.log("取得menu list")
    let result = await request.post("/getMenuList");
    console.log(result)
    if(200 == result?.code){
        menuList.value = result.data["menuGroup"]
    }
})
</script>

<template>
    <div id="leftMenu">
    <el-menu class="el-menu-vertical-demo">
        <el-sub-menu :key="`pmenu`+index" :inded="`pmenu`+index" v-for="(childList, parentMenu, index) in menuList">
            <template #title>
                <el-icon></el-icon>
                <span>{{ parentMenu }}</span>
            </template>
            <template :key="`cmenu`+jndex" v-for="(menu,jndex) in childList">
                <el-menu-item>
                    <router-link :to="`/mainFrame`+menu.vueUrl">{{ menu.menuName }}</router-link>
                    <!-- 
                        <router-link :to="menu.vueUrl">{{ menu.menuName }}</router-link>
                        <div class="defLinkIcon">
                        <img :src="menu.icon"></img>
                        <el-link class="childMenu" :href="menu.vueUrl">{{menuName}}</el-link>
                    </div> -->
                </el-menu-item>
            </template>
        </el-sub-menu>
        <el-sub-menu >
            <template #title>
                <el-icon></el-icon>
                <span>Test</span>
            </template>
            <el-menu-item>
                <router-link to="/mainFrame/management/FIREEMBLEM_HERO1122">Firemenblem121</router-link>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
    
    </div>
</template>

<style scoped>
#leftMenu {width: 200px;height: 94vh;background: #ffffffed;position: fixed;}
.childMenu {width:100%;text-align:left}
</style>