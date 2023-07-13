import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL = "https://api.spotify.com/v1";
const axiosInstance = axios.create({
  baseURL,
});
const config: AxiosRequestConfig = {};

const handleRequestError = async (error: any) => {
  if (error.response.status === 429) {
    const retryAfter = error.response.headers["retry-after"];
    const retryAfterMs = parseInt(retryAfter) * 1000;
    await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
    return Promise.reject(error);
  } else {
    console.log(error);
    return null;
  }
};

const get = async (token: string, endpoint: string) => {
  try {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(endpoint, config);
    return response.data;
  } catch (error) {
    return handleRequestError(error);
  }
};

const getNext = async (token: string, next: string) => {
  try {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.get(next, config);
    return response.data;
  } catch (error) {
    return handleRequestError(error);
  }
};

const post = async (token: string, endpoint: string, body: any) => {
  try {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axiosInstance.post(endpoint, body, config);
    return response.data;
  } catch (error) {
    return handleRequestError(error);
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
