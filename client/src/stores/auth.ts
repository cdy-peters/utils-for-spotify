import { defineStore } from "pinia";

const client_id = "91c14e269ed8424484de48b50ee701bb";
const client_redirect_uri = "http://localhost:5173/callback";
const server_url = "http://localhost:3080";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: "",
    refreshToken: "",
    expiresIn: 0,
  }),
  getters: {
    getAccessToken: (state) => state.accessToken,
    getRefreshToken: (state) => state.refreshToken,
    getExpiresIn: (state) => state.expiresIn,
  },
  actions: {
    isLoggedIn() {
      return this.accessToken !== "";
    },
    login() {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${client_redirect_uri}`;
    },
    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      this.expiresIn = 0;
    },
    async setAccessToken(code: string) {
      const response = await fetch(
        `${server_url}/get-access-token?code=${code}`
      );
      const data = await response.json();

      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.expiresIn = data.expires_in;
    },
  },
  persist: true,
});
