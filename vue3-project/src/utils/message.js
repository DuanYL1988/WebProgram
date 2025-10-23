import { ElMessage } from 'element-plus'
const alertMessage = (messageStr,typeStr) => {
    ElMessage({
        message: messageStr,
        type:typeStr
    })
}

export default alertMessage;