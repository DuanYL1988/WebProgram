<script setup>
import { ref, onMounted } from 'vue'
import Utils from '@/utils/request'
var menuList = ref({})
// 初期
onMounted(async function(){
    let result = await Utils.request.post("/getMenuList");
    if(200 == result?.code){
        menuList.value = result.data["menuGroup"]
        console.debug(menuList.value)
    }
})
</script>

<template>
    <div id="leftMenu">

    <el-menu class="menu-body" background-color="transparent" text-color="#9fbfe9" active-text-color="#fff" router>
      <!-- 期望父组件提供 menuList，格式示例：
           {
             "系统": [{ menuName: '仪表盘', vueUrl: '/dash', icon: '/icons/dash.svg' }, ...],
             "内容": [{ ... }]
           }
      -->
      <template v-for="(childList, groupName, gidx) in menuList" :key="`group-${gidx}`">
        <el-sub-menu :index="`group-${gidx}`">
          <template #title>
            <i class="group-dot"></i>
            <span class="group-title">{{ groupName }}</span>
          </template>

          <template v-for="(menu, midx) in childList" :index="`/mainFrame${menu.vueUrl}`" :key="menu.id ?? (`${gidx}-${midx}`)">
              <el-menu-item v-if="menu.disableFlag == `1`" class="menu-item">
                <router-link :to="`/mainFrame${menu.vueUrl}`" class="menu-link" >
                  <img v-if="menu.icon" :src="menu.icon" class="menu-icon" alt="" />
                  <i v-else class="el-icon-menu fallback-icon" aria-hidden="true"></i>
                  <span class="menu-name">{{ menu.menuName }}</span>
                </router-link>
              </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
    </div>
</template>

<style scoped>
#leftMenu {
    width: 200px;
    height: 94vh;
    background: linear-gradient(180deg, #1b364d 0%, #2d4763e0 100%);
    position: fixed;
}
.left-menu {
  color: #d9eefc;
  padding: 16px 12px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 4px 0 18px rgba(0,0,0,0.45);
}

.menu-body {
  flex: 1;
  overflow: auto;
  padding-top: 6px;
}

/* group title */
.group-title {
  font-size: 16px;
  color: #d9dfe6;
  font-weight: 600;
  margin-left: 3px;
}
.group-dot {
  display: inline-block;
  width:6px;
  height:6px;
  background:#cfe032;
  border-radius:50%;
  margin-right:8px;
  vertical-align: middle;
}

/* item */
.menu-item { padding: 2px 0; }
.menu-link {
  display:flex;

  width:100%;
  color:inherit;
  text-decoration:none;
}
.menu-icon {
  width:18px;
  height:18px;
  object-fit:cover;
  border-radius:4px;
}
.fallback-icon { font-size:16px; color:#9fc3ea; }

.menu-name {
  font-size:14px;
  color:#e6f6ff;
}
.menu-badge { margin-left: auto; }

/* 自定义滚动条 */
.menu-body::-webkit-scrollbar { width:8px; }
.menu-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius:8px; }

/* 响应式：窄屏时折叠为图标栏（父组件可控制 collapsed 状态） */
@media (max-width: 900px) {
  .left-menu { transform: translateX(0); position: fixed; z-index: 1200; }
}
</style>