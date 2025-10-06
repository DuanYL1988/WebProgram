<script setup>
import headerComp from '../components/header.vue'
import menuComp from '../components/menu.vue'
</script>

<template>
  <!-- 头部 -->
  <headerComp/>
  <!-- 左侧菜单 -->
  <menuComp/>
  <!-- 主内容 -->
  <el-container class="rightArea">
    <router-view/>
  </el-container>
</template>

<style scoped>
.rightArea {
    background: rgba(218, 218, 221, 0.856);
    width: 100%;height: 94vh;
    position: fixed;
    left: 200px;
}
</style>
