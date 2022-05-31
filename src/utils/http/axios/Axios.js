import axios from 'axios'
import qs from 'qs'
import { AxiosCanceler } from './axiosCancel'
import { isFunction } from '@/utils/is.js'

/**
 * @description:  axios module
 */
export class VAxios {
  options

  axiosInstance

  constructor(options) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  /**
   * @description:  Create axios instance
   */
  createAxios(config) {
    this.axiosInstance = axios.create(config)
  }

  getTransform() {
    const { transform } = this.options
    return transform
  }

  getAxios() {
    return this.axiosInstance
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config)
  }

  /**
   * @description: Set general header
   */
  setHeader(headers) {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  /**
   * @description: Interceptor configuration
   */
  setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) {
      return
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    const axiosCanceler = new AxiosCanceler()

    // Request interceptor configuration processing
    this.axiosInstance.interceptors.request.use((config) => {
      // If cancel repeat request is turned on, then cancel repeat request is prohibited
      const {
        // @ts-ignore
        headers: { ignoreCancelToken },
      } = config

      const ignoreCancel =
        ignoreCancelToken !== undefined
          ? ignoreCancelToken
          : this.options.requestOptions?.ignoreCancelToken

      !ignoreCancel && axiosCanceler.addPending(config)
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options)
      }
      return config
    }, undefined)

    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    // Response result interceptor processing
    this.axiosInstance.interceptors.response.use((res) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    // Response result interceptor error capture
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }

  /**
   * @description:  File Upload
   */
  uploadFile(config, params) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data[key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, params.data[key])
      })
    }

    return this.axiosInstance.request({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': 'multipart/form-data;charset=UTF-8',
        // @ts-ignore
        ignoreCancelToken: true,
      },
    })
  }

  // support form-data
  supportFormData(config) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== 'application/x-www-form-urlencoded;charset=UTF-8' ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === 'GET'
    ) {
      return config
    }

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  /**
   *
   * @param {Object} config
   * @param {string} config.url url
   * @param {Object} config.params 参数
   * @param {Object} config.data 参数
   * @param {'get'|'GET'|'delete'|'DELETE'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'purge'|'PURGE'|'link'|'LINK'|'unlink'|'UNLINK'} [config.method='GET'] 请求模式
   * @param {string} config.timeoutErrorMessage 超时提示信息
   * @param {Object} options
   * @param {boolean} [options.joinParamsToUrl=false] post请求的时候添加参数到url
   * @param {boolean} [options.formatDate=true] 格式化提交参数时间
   * @param {boolean} [options.isTransformResponse=true] 需要对返回数据进行处理
   * @param {boolean} [options.isReturnNativeResponse=false] 是否返回原生响应头 比如：需要获取响应头时使用该属性
   * @param {boolean} [options.joinPrefix=true] 添加拼接地址到url
   * @param {string} [options.apiUrl] 接口地址
   * @param {string} [options.urlPrefix=''] 接口拼接地址
   * @param {'none' | 'modal' | 'message' | undefined} [options.errorMessageMode='message'] 消息提示类型
   * @param {boolean} [options.joinTime=true] 是否加入时间戳
   * @param {boolean} [options.ignoreCancelToken=true] 忽略重复请求
   * @param {boolean} [options.withToken=true] 是否携带token
   * @returns {Promise<Object>}
   */
  get(config, options) {
    return this.request({ ...config, method: 'GET' }, options)
  }

  /**
   *
   * @param {Object} config
   * @param {string} config.url url
   * @param {Object} config.params 参数
   * @param {Object} config.data 参数
   * @param {'get'|'GET'|'delete'|'DELETE'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'purge'|'PURGE'|'link'|'LINK'|'unlink'|'UNLINK'} [config.method='POST'] 请求模式
   * @param {string} config.timeoutErrorMessage 超时提示信息
   * @param {Object} options
   * @param {boolean} [options.joinParamsToUrl=false] post请求的时候添加参数到url
   * @param {boolean} [options.formatDate=true] 格式化提交参数时间
   * @param {boolean} [options.isTransformResponse=true] 需要对返回数据进行处理
   * @param {boolean} [options.isReturnNativeResponse=false] 是否返回原生响应头 比如：需要获取响应头时使用该属性
   * @param {boolean} [options.joinPrefix=true] 添加拼接地址到url
   * @param {string} [options.apiUrl] 接口地址
   * @param {string} [options.urlPrefix=''] 接口拼接地址
   * @param {'none' | 'modal' | 'message' | undefined} [options.errorMessageMode='message'] 消息提示类型
   * @param {boolean} [options.joinTime=true] 是否加入时间戳
   * @param {boolean} [options.ignoreCancelToken=true] 忽略重复请求
   * @param {boolean} [options.withToken=true] 是否携带token
   * @returns {Promise<Object>}
   */
  post(config, options) {
    return this.request({ ...config, method: 'POST' }, options)
  }

  /**
   *
   * @param {Object} config
   * @param {string} config.url url
   * @param {Object} config.params 参数
   * @param {Object} config.data 参数
   * @param {'get'|'GET'|'delete'|'DELETE'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'purge'|'PURGE'|'link'|'LINK'|'unlink'|'UNLINK'} [config.method='PUT'] 请求模式
   * @param {string} config.timeoutErrorMessage 超时提示信息
   * @param {Object} options
   * @param {boolean} [options.joinParamsToUrl=false] post请求的时候添加参数到url
   * @param {boolean} [options.formatDate=true] 格式化提交参数时间
   * @param {boolean} [options.isTransformResponse=true] 需要对返回数据进行处理
   * @param {boolean} [options.isReturnNativeResponse=false] 是否返回原生响应头 比如：需要获取响应头时使用该属性
   * @param {boolean} [options.joinPrefix=true] 添加拼接地址到url
   * @param {string} [options.apiUrl] 接口地址
   * @param {string} [options.urlPrefix=''] 接口拼接地址
   * @param {'none' | 'modal' | 'message' | undefined} [options.errorMessageMode='message'] 消息提示类型
   * @param {boolean} [options.joinTime=true] 是否加入时间戳
   * @param {boolean} [options.ignoreCancelToken=true] 忽略重复请求
   * @param {boolean} [options.withToken=true] 是否携带token
   * @returns {Promise<Object>}
   */
  put(config, options) {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  /**
   *
   * @param {Object} config
   * @param {string} config.url url
   * @param {Object} config.params 参数
   * @param {Object} config.data 参数
   * @param {'get'|'GET'|'delete'|'DELETE'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'purge'|'PURGE'|'link'|'LINK'|'unlink'|'UNLINK'} [config.method='DELETE'] 请求模式
   * @param {string} config.timeoutErrorMessage 超时提示信息
   * @param {Object} options
   * @param {boolean} [options.joinParamsToUrl=false] post请求的时候添加参数到url
   * @param {boolean} [options.formatDate=true] 格式化提交参数时间
   * @param {boolean} [options.isTransformResponse=true] 需要对返回数据进行处理
   * @param {boolean} [options.isReturnNativeResponse=false] 是否返回原生响应头 比如：需要获取响应头时使用该属性
   * @param {boolean} [options.joinPrefix=true] 添加拼接地址到url
   * @param {string} [options.apiUrl] 接口地址
   * @param {string} [options.urlPrefix=''] 接口拼接地址
   * @param {'none' | 'modal' | 'message' | undefined} [options.errorMessageMode='message'] 消息提示类型
   * @param {boolean} [options.joinTime=true] 是否加入时间戳
   * @param {boolean} [options.ignoreCancelToken=true] 忽略重复请求
   * @param {boolean} [options.withToken=true] 是否携带token
   * @returns {Promise<Object>}
   */
  delete(config, options) {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  /**
   *
   * @param {Object} config
   * @param {string} config.url url
   * @param {Object} config.params 参数
   * @param {Object} config.data 参数
   * @param {'get'|'GET'|'delete'|'DELETE'|'head'|'HEAD'|'options'|'OPTIONS'|'post'|'POST'|'put'|'PUT'|'patch'|'PATCH'|'purge'|'PURGE'|'link'|'LINK'|'unlink'|'UNLINK'} config.method 请求模式
   * @param {string} config.timeoutErrorMessage 超时提示信息
   * @param {Object} options
   * @param {boolean} [options.joinParamsToUrl=false] post请求的时候添加参数到url
   * @param {boolean} [options.formatDate=true] 格式化提交参数时间
   * @param {boolean} [options.isTransformResponse=true] 需要对返回数据进行处理
   * @param {boolean} [options.isReturnNativeResponse=false] 是否返回原生响应头 比如：需要获取响应头时使用该属性
   * @param {boolean} [options.joinPrefix=true] 添加拼接地址到url
   * @param {string} [options.apiUrl] 接口地址
   * @param {string} [options.urlPrefix=''] 接口拼接地址
   * @param {'none' | 'modal' | 'message' | undefined} [options.errorMessageMode='message'] 消息提示类型
   * @param {boolean} [options.joinTime=true] 是否加入时间戳
   * @param {boolean} [options.ignoreCancelToken=true] 忽略重复请求
   * @param {boolean} [options.withToken=true] 是否携带token
   * @returns {Promise<Object>}
   */
  request(config, options) {
    let conf = JSON.parse(JSON.stringify(config))
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt = { ...requestOptions, ...options }

    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }
    conf.requestOptions = opt

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(conf)
        .then((res) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt)
              resolve(ret)
            } catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          resolve(res)
        })
        .catch((e) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt))
            return
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e)
        })
    })
  }
}
