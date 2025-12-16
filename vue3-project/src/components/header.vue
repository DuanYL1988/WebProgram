<script setup>
const userInfo = localStorage.getItem("userinfo")
const faceImg = userInfo
function logout() {
  // 这里放登出逻辑
  console.log('logout')
  localStorage.removeItem('userinfo')
  // 可以发事件或路由跳转
}
</script>

<template>
  <header class="app-header">
    <div class="left">
      <div class="logo">FE</div>
      <div class="brand">
        <div class="title">管理面板</div>
        <div class="subtitle">控制与监控中心</div>
      </div>
    </div>

    <div class="center">
      <div class="search">
        <input type="search" placeholder="搜索菜单、用户或功能…" />
        <button aria-label="search" class="search-btn">🔍</button>
      </div>
    </div>

    <div class="right">
      <button class="icon-btn" title="通知">
        <span class="bell">🔔</span>
        <span class="badge">3</span>
      </button>

      <button class="icon-btn" title="设置">⚙️</button>

      <div class="user" @click="toggleMenu" :aria-expanded="showMenu">
        <img :src="faceImg" alt="avatar" class="avatar"/>
        <div class="user-info">
          <div class="name">userName</div>
          <div class="role">管理员</div>
        </div>

        <div v-if="showMenu" class="dropdown" @click.stop>
          <button class="dd-item" @click="() => { /* profile */ }">个人资料</button>
          <button class="dd-item" @click="() => { /* settings */ }">设置</button>
          <div class="dd-sep"></div>
          <button class="dd-item danger" @click="logout">退出登录</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header{
  height: 100px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-sizing: border-box;
  background: linear-gradient(90deg,#071330 0%, #042a4a 60%);
  color: #e6f6ff;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  position: relative;
  z-index: 40;
}

/* left */
.left {
  display:flex;
  align-items:center;
  gap:12px;
  min-width: 220px;
}
.logo{
  width:48px;
  height:48px;
  border-radius:10px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg,#06b6d4,#3b82f6);
  color:#052635;
  font-weight:800;
  box-shadow: 0 8px 26px rgba(59,130,246,0.12);
  font-size:18px;
}
.brand .title { font-weight:700; font-size:16px; color:#f8fbff }
.brand .subtitle { font-size:14px; color: #9fc3ea; margin-top:2px }

/* center search */
.center { flex:1; display:flex; justify-content:center; }
.search {
  width: 580px;
  max-width: 70%;
  display:flex;
  align-items:center;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.04);
  padding:6px 8px;
  border-radius:10px;
  gap:8px;
}
.search input {
  flex:1;
  background: transparent;
  border: none;
  outline: none;
  color: #eaf6ff;
  font-size:14px;
  padding:6px;
}
.search::placeholder { color: rgba(230,238,248,0.4) }
.search-btn{
  background: linear-gradient(90deg,#06b6d4,#3b82f6);
  border: none;
  color: #042b4a;
  padding:6px 10px;
  border-radius:8px;
  cursor:pointer;
  font-weight:700;
}

/* right actions */
.right { display:flex; align-items:center; gap:12px; min-width: 260px; justify-content:flex-end; position:relative; }
.icon-btn {
  position:relative;
  background: transparent;
  border: none;
  color: #dff6ff;
  padding:8px;
  border-radius:8px;
  cursor:pointer;
  font-size:18px;
}
.icon-btn:hover { background: rgba(43, 42, 39, 0.02) }
.badge {
  position:absolute;
  top:6px;
  right:6px;
  background:#ff5a5f;
  color:#fff;
  font-size:11px;
  padding:2px 6px;
  border-radius:12px;
}

/* user */
.user {
  display:flex;
  align-items:center;
  gap:10px;
  padding:6px 8px;
  border-radius:10px;
  cursor:pointer;
  position:relative;
  background: rgba(220, 219, 224, 0.01);
}
.user:hover { background: rgba(255,255,255,0.02) }
.avatar { width:60px; height:60px; border-radius:10px; object-fit:cover; border: 1px solid rgba(255,255,255,0.03) }
.user-info { display:flex; flex-direction:column; line-height:1; color:#e6f6ff }
.user-info .name { font-weight:600; font-size:16px }
.user-info .role { font-size:14px; color:#9fc3ea }

/* dropdown */
.dropdown {
  position: absolute;
  right: 0;
  top: 68px;
  min-width:160px;
  background: linear-gradient(180deg,#0b2236,#042d4a);
  border: 1px solid rgba(255,255,255,0.04);
  box-shadow: 0 10px 30px rgba(2,6,23,0.6);
  border-radius:8px;
  padding:8px;
  display:flex;
  flex-direction:column;
  gap:6px;
  z-index: 60;
}
.dd-item{
  background: transparent;
  border: none;
  color: #dff6ff;
  text-align:left;
  padding:8px;
  border-radius:6px;
  cursor:pointer;
}
.dd-item:hover { background: rgba(255,255,255,0.02) }
.dd-sep { height:1px; background: rgba(255,255,255,0.03); margin:4px 0 }
.dd-item.danger { color:#ffb3b3 }

/* responsive */
@media (max-width: 980px) {
  .center { display:none }
  .brand .subtitle { display:none }
  .left { min-width: 160px }
}
</style>