import { defineStore } from "pinia";

const client_id = "348f256db39d4692be11233766433611";
const client_redirect_uri = "http://localhost:5173/callback";
const server_url = "http://localhost:3080";
const scopes = [
  "user-read-playback-state",
  "user-read-recently-played",
  "playlist-read-private",
  "user-library-read",
  "playlist-modify-public"
];

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
      const baseUrl = "https://accounts.spotify.com/authorize";
      const params = new URLSearchParams({
        client_id,
        response_type: "code",
        redirect_uri: client_redirect_uri,
        scope: scopes.join(" "),
      });
      const url = `${baseUrl}?${params.toString()}`;
      window.location.href = url;
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
