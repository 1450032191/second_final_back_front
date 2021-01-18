import axios from 'axios';
import { MessageBox, Message } from 'element-ui'
const instance = axios.create({
    baseURL:'http://localhost:8081/final/'
})



instance.interceptors.response.use(
    response => {
        const res = response.data
        if (!res.code) {
            Message({
                message: res.errmsg || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            return res
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)


export default instance;
