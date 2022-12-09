import axios, { AxiosInstance } from 'axios'
import { IAxiosRequestConfig, IAxiosResponse } from './utils/types'
import { handleRequest } from './utils/helpers'
import httpStatus from './utils/http-status'
export { httpStatus }
import { merge } from 'lodash'

export class HttpRequest {
  private static _instance: HttpRequest
  private static $axios: AxiosInstance
  private static isSetDefaults = false
  private static isSetInterceptorsRequest = false
  private static isSetInterceptorsResponse = false

  constructor() {
    this.init()
  }

  init() {
    HttpRequest.$axios = axios.create()
  }

  static get instance() {
    HttpRequest._instance = HttpRequest._instance ?? new HttpRequest()
    return HttpRequest._instance
  }

  setDefaults(config: IAxiosRequestConfig) {
    if (HttpRequest.isSetDefaults) return
    HttpRequest.isSetDefaults = true
    HttpRequest.$axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    HttpRequest.$axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
    HttpRequest.$axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'
    HttpRequest.$axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded'

    merge(HttpRequest.$axios.defaults, config)
  }

  setInterceptorsRequest(
    onFulfilled?: (
      value: IAxiosRequestConfig,
    ) => IAxiosRequestConfig | Promise<IAxiosRequestConfig>,
    onRejected?: (error: any) => any,
  ) {
    if (HttpRequest.isSetInterceptorsRequest) return
    HttpRequest.isSetInterceptorsRequest = true
    HttpRequest.$axios.interceptors.request.use(onFulfilled, onRejected)
  }

  setInterceptorsResponse(
    onFulfilled?: (value: IAxiosResponse<any>) => any | Promise<any>,
    onRejected?: (error: any) => any,
  ) {
    if (HttpRequest.isSetInterceptorsResponse) return
    HttpRequest.isSetInterceptorsResponse = true
    HttpRequest.$axios.interceptors.response.use(onFulfilled, onRejected)
  }

  get<T = any>(
    url: string,
    params?: { params: object },
    config?: object,
  ): Promise<IAxiosResponse<T>> {
    return handleRequest(HttpRequest.$axios, 'get', url, params, config)
  }

  post<T = any>(
    url: string,
    params?: { data?: object; params?: object },
    config?: any,
  ): Promise<IAxiosResponse<T>> {
    return handleRequest(HttpRequest.$axios, 'post', url, params, config)
  }

  put<T = any>(
    url: string,
    params?: { data?: object; params?: object },
    config?: any,
  ): Promise<IAxiosResponse<T>> {
    return handleRequest(HttpRequest.$axios, 'put', url, params, config)
  }

  patch<T = any>(
    url: string,
    params?: { data?: object; params?: object },
    config?: any,
  ): Promise<IAxiosResponse<T>> {
    return handleRequest(HttpRequest.$axios, 'patch', url, params, config)
  }

  delete<T = any>(
    url: string,
    params?: { data?: object; params?: object },
    config?: any,
  ): Promise<IAxiosResponse<T>> {
    return handleRequest(HttpRequest.$axios, 'delete', url, params, config)
  }

  export<T = any>(
    url: string,
    params?: { params: object },
    config?: object,
  ): Promise<IAxiosResponse<T>> {
    return handleRequest(HttpRequest.$axios, 'export', url, params, config)
  }
}

const httpRequest = HttpRequest.instance

export default httpRequest
