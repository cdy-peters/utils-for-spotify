import axios from "axios";

const baseURL = "https://api.spotify.com/v1";

const query = async (token: any, endpoint: string) => {
  try {
    const url = `${baseURL}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async (token: any) => {
  return query(token, "/me");
};

export const getUserPlayback = async (token: any) => {
  return query(token, "/me/player");
};
