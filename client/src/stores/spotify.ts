import { defineStore } from "pinia";

export const useSpotifyStore = defineStore("spotify", {
  state: () => ({
    user: {
      id: "",
      name: "",
      images: [],
    },
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    setUser(token: string) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.user = {
            id: data.id,
            name: data.display_name,
            images: data.images,
          };
        });
    },
  },
  persist: true,
});
