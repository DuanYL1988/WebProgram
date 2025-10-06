/** 该文件用于创建整个应用的路由器 */
import {createRouter,createWebHashHistory} from 'vue-router'
// 引入组件
import loginComp from '../views/login.vue'
import mainFrameComp from '../views/mainFrame.vue'
import managementComp from '../views/management.vue'

// 创建路由对象
const router = createRouter({
    // 对应浏览器中/#/
    mode: 'history',
    // 配置路由映射
    history : createWebHashHistory(),
    routes : [
        {path:'/',redirect:'/login'},
        {path:'/login' , component:loginComp},
        {path:'/mainFrame',name:'mainFrame',component:mainFrameComp
         ,children:[
            {path:'management/:tablename', component:managementComp, props:true}
         ]
        }
    ],
})

export default router
