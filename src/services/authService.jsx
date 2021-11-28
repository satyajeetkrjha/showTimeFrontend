import jwtDecode from 'jwt-decode'
import http from './httpService'

const tokenKey = 'token'

function getCurrentUser() {
    try {
        const jwt = localStorage.getItem(tokenKey);
        const jwtDecoded = jwtDecode(jwt)
        const currDate = new Date().getTime() / 1000

        if (jwtDecoded.exp < currDate) {
            localStorage.clear()
            return null
        }
        return jwtDecoded
    } catch (ex) {
        return null
    }
}

function issueToken() {
    return new Promise((resolve, reject) => {
        try {
            let refreshToken = localStorage.getItem('refreshToken');
            let username=localStorage.getItem('username');
            const response = http.post('auth/refresh/token', {
                refreshToken: localStorage.getItem('refreshToken'),
                username:localStorage.getItem('username')
            })
            resolve(response)
        } catch (ex) {
            reject(ex)
        }
    })
}

function IsTokenAboutToExpired() {
    const jwt = getCurrentUser()
    if (jwt === null) return false

    const exp = jwt.exp
    const currDate = new Date().getTime() / 1000

    //Refresh Token if tokenLive remains 30 min only
    console.log("exp",exp);
    console.log("currDate ",currDate);
    console.log("diff ",exp-currDate);

    if (exp - currDate >= 1200000 ) {
        return true
    }
    return false
}

export default {
    getCurrentUser,
    issueToken,
    IsTokenAboutToExpired
}
