const tokenKeyName = "accessToken";
export default class Session {
    getAccessToken() {
        return localStorage.getItem(tokenKeyName);
    }

    setAccessToken(token) {
        localStorage.setItem(tokenKeyName, token);
    }

    isConnected() {
        return Boolean(this.getAccessToken());
    }

    clear() {
        localStorage.removeItem(tokenKeyName);
    }
}