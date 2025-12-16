<script setup>
import { ref, onMounted } from 'vue'
import Utils from '@/utils/request'
var menuList = ref({})
// 初期
onMounted(async function(){
    let result = await Utils.request.post("/getMenuList");
    if(200 == result?.code){
        menuList.value = result.data["menuGroup"]
    }
})
</script>

<template>
    <div id="leftMenu">
    <el-menu class="el-menu-vertical-demo">
        <el-sub-menu :key="`pmenu`+index" :index="`pmenu`+index" v-for="(childList, parentMenu, index) in menuList">
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
    </el-menu>
    
    </div>
</template>

<style scoped>
#leftMenu {width: 200px;height: 94vh;background: #ffffffed;position: fixed;}
.childMenu {width:100%;text-align:left}
</style>