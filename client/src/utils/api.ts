import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth";

const baseURL = "https://api.spotify.com/v1";
const axiosInstance = axios.create({
  baseURL,
});
const config: AxiosRequestConfig = {};

const handleRequestError = async (error: any) => {
  const status = error.response.status;
  if (status === 429) {
    const retryAfter = error.response.headers["retry-after"];
    const retryAfterMs = parseInt(retryAfter) * 1000;
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
    return {
      retry: true,
    };
  } else if (status === 401) {
    const authStore = useAuthStore();
    const newAccessToken = await authStore.refreshAccessToken();
    return {
      retry: true,
      newAccessToken,
    };
  } else {
    console.log(error);
    return {
      retry: false,
    };
  }
};

const get: any = async (token: string, endpoint: string) => {
  try {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(endpoint, config);
    return response.data;
  } catch (error) {
    const { retry, newAccessToken } = await handleRequestError(error);
    if (retry) {
      if (newAccessToken) {
        token = newAccessToken;
      }
      return get(token, endpoint);
    }
    return null;
  }
};

const getNext: any = async (token: string, next: string) => {
  try {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(next, config);
    return response.data;
  } catch (error) {
    const { retry, newAccessToken } = await handleRequestError(error);
    if (retry) {
      if (newAccessToken) {
        token = newAccessToken;
      }
      return getNext(token, next);
    }
    return null;
  }
};

const post: any = async (token: string, endpoint: string, body: any) => {
  try {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.post(endpoint, body, config);
    return response.data;
  } catch (error) {
    const { retry, newAccessToken } = await handleRequestError(error);
    if (retry) {
      if (newAccessToken) {
        token = newAccessToken;
      }
      return post(token, endpoint, body);
    }
    return null;
  }
};

export const getCurrentUser = async (token: string) => {
  return get(token, "/me");
};

export const getCurrentUserPlayback = async (token: string) => {
  return get(token, "/me/player");
};

export const getCurrentUserPlaylists = async (token: string, i: number) => {
  const limit = 50;
  const offset = i * limit;
  const endpoint = `/me/playlists?limit=${limit}&offset=${offset}`;
  return get(token, endpoint);
};

export const getCurrentUserSavedTracks = async (token: string, i: number) => {
  const limit = 50;
  const offset = i * limit;
  const endpoint = `/me/tracks?limit=${limit}&offset=${offset}`;
  return get(token, endpoint);
};

export const getPlaylistItems = async (
  token: string,
  playlistId: string,
  i: number
) => {
  const limit = 100;
  const offset = i * limit;
  const endpoint = `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;
  return get(token, endpoint);
};

export const getNextPlaylistItems = async (token: string, next: string) => {
  return getNext(token, next);
};

export const createPlaylist = async (
  token: string,
  userId: string,
  name: string
) => {
  const endpoint = `/users/${userId}/playlists`;
  const body = {
    name,
    description: "Created with Utils for Spotify",
  };

  return post(token, endpoint, body);
};

export const addItemsToPlaylist = async (
  token: string,
  playlistId: string,
  uris: string[]
) => {
  const endpoint = `/playlists/${playlistId}/tracks`;
  let pos = 0;

  while (pos < uris.length) {
    const body = {
      uris: uris.slice(pos, pos + 100),
    };
    await post(token, endpoint, body);
    pos += 100;
  }

  return;
};

export const searchForItem = async (
  token: string,
  query: string,
  type: string
) => {
  const endpoint = `/search?q=${query}&type=${type}`;
  return get(token, endpoint);
}