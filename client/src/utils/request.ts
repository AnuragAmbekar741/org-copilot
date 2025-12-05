import { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { apiClient } from "@/utils/global.client";

type ErrorPayload = { message?: string; error?: string };

const unwrap = <TResponse>(
  promise: Promise<AxiosResponse<TResponse>>
): Promise<TResponse> =>
  promise
    .then((r) => r.data)
    .catch((err: AxiosError<ErrorPayload>) => {
      const message =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Request failed";
      throw new Error(message);
    });

export const get = <TResponse>(url: string, config?: AxiosRequestConfig) =>
  unwrap<TResponse>(apiClient.get<TResponse>(url, config));

export const post = <TResponse, TData>(
  url: string,
  data: TData,
  config?: AxiosRequestConfig
) => unwrap<TResponse>(apiClient.post<TResponse>(url, data, config));

export const patch = <TResponse, TData>(
  url: string,
  data: TData,
  config?: AxiosRequestConfig
) => unwrap<TResponse>(apiClient.patch<TResponse>(url, data, config));

export const del = <TResponse>(url: string, config?: AxiosRequestConfig) =>
  unwrap<TResponse>(apiClient.delete<TResponse>(url, config));
