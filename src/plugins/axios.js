import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API_URL,
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('jwt'),
  },
})

api.interceptors.request.use(
  async (config) => {
    const token = await localStorage.getItem('jwt')
    //console.log(token)
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
      //console.log(config.headers.Authorization)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
