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

const query = async (token: string, endpoint: string) => {
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

const nextQuery = async (token: string, next: string) => {
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

export const getCurrentUser = async (token: string) => {
  return query(token, "/me");
};

export const getCurrentUserPlayback = async (token: string) => {
  return query(token, "/me/player");
};

export const getCurrentUserPlaylists = async (token: string, i: number) => {
  const limit = 50;
  const offset = i * limit;
  const endpoint = `/me/playlists?limit=${limit}&offset=${offset}`;
  return query(token, endpoint);
};

export const getCurrentUserSavedTracks = async (token: string, i: number) => {
  const limit = 50;
  const offset = i * limit;
  const endpoint = `/me/tracks?limit=${limit}&offset=${offset}`;
  return query(token, endpoint);
};

export const getPlaylistItems = async (
  token: string,
  playlistId: string,
  i: number
) => {
  const limit = 100;
  const offset = i * limit;
  const endpoint = `/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`;
  return query(token, endpoint);
};

export const getNextPlaylistItems = async (token: string, next: string) => {
  return nextQuery(token, next);
};
