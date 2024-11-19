import axios from "axios";

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
export const GET_ASSETS = "v1/assets";
export const GET_ALL_ASSETS = "v1/assets/:asset_id";
export const GET_EXCHANGERATE = "v1/exchangerate/";

export const headers = {
  Accept: "text/plain",
  "X-CoinAPI-Key": API_KEY,
};
