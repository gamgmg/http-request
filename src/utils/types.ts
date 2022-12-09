import { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface IAxiosResponse<D = null> extends AxiosResponse {
  status: number
  msg: string
  data: D
  config: IAxiosRequestConfig
}

export interface CustomParams {
  errAlert?: boolean
  successAlert?: boolean
  json?: boolean
}

export interface IAxiosRequestConfig<T = CustomParams> extends AxiosRequestConfig {
  customParams?: T
  [propName: string]: any
}

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'export'
