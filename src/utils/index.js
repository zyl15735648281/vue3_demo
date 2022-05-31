import { unref } from 'vue'
import { isObject } from '@/utils/is'

/**
 * @description:  设置节点
 */
export function getPopupContainer(node) {
  return node?.parentNode ?? document.body
}

/**
 * 将对象作为参数添加到URL
 * @param baseUrl {string} url
 * @param obj {object}
 * @returns {string}
 * @example
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl, obj) {
  let parameters = ''
  Object.keys(obj).forEach((key) => {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`
  })
  parameters = parameters.replace(/&$/, '')
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters
}

export function deepMerge(src = {}, target = {}) {
  Object.keys(target).forEach((key) => {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  })
  return src
}

export function openWindow(url, opt) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {}
  const feature = []

  noopener && feature.push('noopener=yes')
  noreferrer && feature.push('noreferrer=yes')

  window.open(url, target, feature.join(','))
}

// dynamic use hook props
export function getDynamicProps(props) {
  const ret = {}

  Object.keys(props).forEach((key) => {
    ret[key] = unref(props[key])
  })

  return ret
}

export function getRawRoute(route) {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined,
  }
}

export const withInstall = (component, alias) => {
  const comp = component
  comp.install = (app) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component
}
