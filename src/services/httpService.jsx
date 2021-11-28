import axios from 'axios'
import config from '../config.json'
import auth from './authService'

let isRefreshCalled = false

axios.defaults.baseURL = config.apiUrl
// axios.defaults.headers.common['Authorization'] = config.jwtPrefix + AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

axios.interceptors.request.use(
    async request => {
        if (!auth.getCurrentUser()) localStorage.removeItem(config.tokenKey)

        const token = localStorage.getItem(config.tokenKey)
        /*
        if (token) {
            request.headers['Authorization'] = config.jwtPrefix + token
        }

        let originalRequest = request
        /*
        const tokenIsExpired = auth.IsTokenAboutToExpired()

        if (tokenIsExpired &&  !isRefreshCalled) {
            try {
                isRefreshCalled = true
                const response = await auth.issueToken()
                localStorage.setItem('token', response.data.token)
                originalRequest.headers['Authorization'] = config.jwtPrefix + response.data.token

                return Promise.resolve(originalRequest)
            } catch (error) {
                return Promise.reject(error)
            }
        }
        */

        return request
    },
    error => {
        // Do something with request error
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(null, error => {
    const expectedError = error.response && error.response.status >= 400 && error.response.status < 500
    if (!expectedError) {
        console.log("Error::",expectedError);
        alert('An Unexpected error Occurred')
        console.log('An Unexpected error Occurred')
    }

    return Promise.reject(error)
})

export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    patch: axios.patch
    // setJwt
}
