import axios from 'axios'
import { ElMessage } from 'element-plus'
const request = axios.create({baseURL:"/api"});// 

// 添加响应拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('vue_jwt_token')
        if(token) {
            config.headers.Authorization = token;
        }
        // console.log("拦截器:"+config.headers.Authorization)
        return config
    },
    error => {
        return Promise.reject(error);
    }
)

request.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        console.error(err);
        ElMessage({message:err.message, type:'error'})
        return Promise.reject(err); // 异步的状态转化为失败的状态
    }
)

const alertMessage = (messageStr,typeStr) => {
    ElMessage({
        message: messageStr,
        type:typeStr
    })
}

const successMsg = (messageStr) => {
    alertMessage(messageStr,"success")
}

const errorMsg = (messageStr) => {
    alertMessage(messageStr,"error")
}

const warningMsg = (messageStr) => {
    alertMessage(messageStr,"warning")
}

export default {request,alertMessage,successMsg,errorMsg,warningMsg};