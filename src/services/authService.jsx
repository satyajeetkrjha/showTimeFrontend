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
            const response = http.post('refresh/token', {
                token: localStorage.getItem(tokenKey)
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
    if (exp - currDate <= 1200 && exp - currDate >= 0) {
        return true
    }
    return false
}

export default {
    getCurrentUser,
    issueToken,
    IsTokenAboutToExpired
}
