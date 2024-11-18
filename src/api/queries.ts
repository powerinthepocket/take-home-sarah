import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { API_KEY, API_URL } from "./apis";
import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface QueryConfig {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
}

const DEFAULT_CONFIG: QueryConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
};

async function fetchData<T>(endpoint: string): Promise<T> {
  const response = await axios.get<T>(
    `${API_URL}/${endpoint}?apikey=${API_KEY}`
  );
  return response?.data;
}

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then((state: NetInfoState) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isConnected,
  };
}

export function useGetData<T = any>(
  endpoint: string,
  config: QueryConfig = DEFAULT_CONFIG
): UseQueryResult<T, AxiosError> {
  const { isConnected } = useNetworkStatus();

  return useQuery<T, AxiosError>({
    queryKey: ["myData", endpoint],
    queryFn: () => fetchData<T>(endpoint),
    ...config,
    enabled: config.enabled !== false && isConnected === true,
  });
}
