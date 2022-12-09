# 介绍

## 安装

``` bash
npm install @gurming/http-request
```

## 基本用法

``` ts
import httpRequest from '@gurming/http-request'

httpRequest.get('http/www.xxx.com/api/xxx', { params })

httpRequest.post('http/www.xxx.com/api/xxx', { data, params })

httpRequest.patch('http/www.xxx.com/api/xxx', { data, params })

httpRequest.put('http/www.xxx.com/api/xxx', { data, params })

httpRequest.delete('http/www.xxx.com/api/xxx', { data, params })

httpRequest.export('http/www.xxx.com/api/xxx', { params })
```

## 设置默认配置项

配置项和axios的defaults属性一致，可参考[axios config defaults](https://axios-http.com/docs/config_defaults)

``` ts
httpRequest.setDefaults({
  baseURL: import.meta.env.VITE_APP_API as string | undefined,
  timeout: 10000,
})
```

## 拦截请求

``` ts
httpRequest.setInterceptorsRequest(
  (config) => {
    // todo
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
```

## 拦截响应

``` ts
httpRequest.setInterceptorsResponse(
  (res) => {
    // todo
    if(res.status === 200){
      return Promise.resolve(data)
    } else {
      return Promise.reject(res.data)
    }
  },
  (err) => {
    // todo
    return Promise.reject(err)
  }
)
```

## customParams

可以通过调用请求方法时传入customParams对象，来自定义接口返回的数据

``` ts
httpRequest.post('http//www.xxx.com/api/xxx', { data, params }, customParams)
```

customParams默认有两个参数

``` ts
errAlert：boolean 表示接口报错时是否弹窗提示
successAlert：boolean 表示接口成功时是否弹窗提示
```

如果是get/export请求，customParams默认值是

``` ts
{ errAlert: true, successAlert: false }
```

其他请求方式的默认值是

``` ts
{ errAlert: true, successAlert: true }
```

可以在拦截器里获取到customParams值

``` ts
httpRequest.setInterceptorsResponse(
  (res) => {
    const { config: { customParams } } = res
    if(customParams.successAlert){
      alert('success alert')
    }
    // todo
  },
  (err) => {
    const { config: { customParams } } = err
    if(customParams.errAlert){
      alert('err alert')
    }
    // todo
  }
)
```

## httpStatus

httpRequest提供了一些错误请求码的中文映射

``` ts
const httpStatus: Record<number, string> = {
  400: '请求错误',
  401: '未授权，请登录',
  403: '拒绝访问',
  404: '请求地址出错',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务器未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持',
}
```

在拦截错误时可以用上

``` ts
import httpRequest, { httpStatus } from '@gurming/http-request'

httpRequest.setInterceptorsResponse(
  (res) => {
    // todo
  },
  (err) => {
    if (err && err.request) {
      const status: number = err.request.status
      err.msg = httpStatus[status] || '网络发生错误'
      alert(err.msg)
    }
    // todo
  }
)
```
