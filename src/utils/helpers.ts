import qs from 'qs'
import { merge } from 'lodash'
import { IAxiosResponse, RequestMethod } from './types'
import { Axios } from 'axios'

export function isFalsy(value: any, whitelist: any[]) {
  // whitelist 过滤白名单
  typeof value === 'string' && (value = value.trim())
  return whitelist.includes(value) ? false : !value
}

export function filterParams(object: any, whitelist: any[]) {
  const result = { ...object }
  Object.keys(result).forEach((key) => {
    const value = result[key]
    if (isFalsy(value, whitelist)) {
      delete result[key]
    }
  })
  return result
}

export function handleRequest(
  $axios: Axios,
  method: RequestMethod,
  url: string,
  params?: { data?: object; params?: object },
  config?: any,
): Promise<IAxiosResponse> {
  switch (method) {
    case 'get':
    case 'export':
      // 排除空值
      params?.params &&
        (params.params = filterParams(params.params, method === 'get' ? [0] : [0, '']))
      const requestOptions = {
        method,
        url,
        params: params?.params,
        headers: {
          'Content-Type': 'application/json',
        },
        customParams: { errAlert: true, successAlert: false },
      }
      if (method === 'get') return $axios.request(merge(requestOptions, config))
      if (method === 'export')
        return $axios.request(
          merge(
            Object.assign(requestOptions, { method: 'get', responseType: 'arraybuffer' }),
            config,
          ),
        )
    default:
      return $axios.request(
        merge(
          {
            method,
            url,
            params: params?.params,
            data: params?.data,
            // 对data进行格式转换
            transformRequest: [
              function (data = {}) {
                // 排除空值key
                data = filterParams(data, [0, ''])
                if (config?.json) {
                  return JSON.stringify(data)
                }
                return qs.stringify(data)
              },
            ],
            headers: {
              'Content-Type': config?.json
                ? 'application/json'
                : 'application/x-www-form-urlencoded',
            },
            customParams: { errAlert: true, successAlert: true },
          },
          config,
        ),
      )
  }
}
