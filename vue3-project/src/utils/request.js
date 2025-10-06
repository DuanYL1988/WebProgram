import axios from 'axios'
const instance = axios.create({baseURL:"/api"});// 

// 添加响应拦截器
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('vue_jwt_token')
        if(token) {
            config.headers.Authorization = token;
        }
        console.log("拦截器:"+config.headers.Authorization)
        return config
    },
    error => {
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    result=>{
        return result.data;
    },
    err=>{
        console.error(err);
        return Promise.reject(err); // 异步的状态转化为失败的状态
    }
)

export default instance;