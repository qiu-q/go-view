import { useRoute } from 'vue-router'
import { ResultEnum, RequestHttpHeaderEnum } from '@/enums/httpEnum'
import { ErrorPageNameMap, PageEnum, PreviewEnum } from '@/enums/pageEnum'
import { SystemStoreEnum, SystemStoreUserInfoEnum } from '@/store/modules/systemStore/systemStore.d'
import { StorageEnum } from '@/enums/storageEnum'
import { clearLocalStorage, getLocalStorage, clearCookie } from './storage'
import router from '@/router'
import { logoutApi } from '@/api/path'

/**
 * * 根据名字跳转路由
 * @param pageName
 * @param isReplace
 * @param windowOpen
 */
export const routerTurnByName = (
  pageName: string,
  isReplace?: boolean,
  windowOpen?: boolean
) => {
  if (windowOpen) {
    const path = fetchPathByName(pageName, 'href')
    openNewWindow(path)
    return
  }
  if (isReplace) {
    router.replace({
      name: pageName,
    })
    return
  }
  router.push({
    name: pageName,
  })
}

/**
 * * 根据名称获取路由信息
 * @param pageName
 * @param pageName
 */
export const fetchPathByName = (pageName: string, p?: string) => {
  try {
    const pathData = router.resolve({
      name: pageName,
    })
    return p ? (pathData as any)[p] : pathData
  } catch (error) {
    window['$message'].warning('查询路由信息失败，请联系管理员！')
  }
}

/**
 * * 根据路径跳转路由
 * @param path
 * @param query
 * @param isReplace
 * @param windowOpen
 */
export const routerTurnByPath = (
  path: string,
  query?: Array<string | number>,
  isReplace?: boolean,
  windowOpen?: boolean
) => {
  let fullPath = ''
  if (query?.length) {
    fullPath = `${path}/${query.join('/')}`
  }
  if (windowOpen) {
    return openNewWindow(fullPath)
  }
  if (isReplace) {
    router.replace({
      path: fullPath,
    })
    return
  }
  router.push({
    path: fullPath,
  })
}

/**
 * * 错误页重定向
 * @param icon
 * @returns
 */
export const redirectErrorPage = (code: ResultEnum) => {
  if (!code) return false
  const pageName = ErrorPageNameMap.get(code)
  if (!pageName) return false
  routerTurnByName(pageName)
}

/**
 * * 重新加载当前路由页面
 */
export const reloadRoutePage = () => {
  routerTurnByName(PageEnum.RELOAD_NAME)
}

/**
 * * 退出登录
 */
export const logout = async () => {
  try {
    const res = await logoutApi()
    if(res && res.code === ResultEnum.SUCCESS) {
      window['$message'].success(window['$t']('global.logout_success'))
      clearCookie(RequestHttpHeaderEnum.COOKIE)
      clearLocalStorage(StorageEnum.GO_SYSTEM_STORE)
      routerTurnByName(PageEnum.BASE_LOGIN_NAME)
    }
  } catch (error) {
    window['$message'].success(window['$t']('global.logout_failure'))
  }
}

/**
 * * 新开页面
 * @param url
 */
export const openNewWindow = (url: string) => {
  return window.open(url, '_blank')
}


/**
 * * 判断是否是预览页
 * @returns boolean
 */
export const isPreview = () => {
  return document.location.hash.includes('preview')
}

/**
 * * 获取当前路由下的参数
 * @returns object
 */
export const fetchRouteParams = () => {
  try {
    const route = useRoute()
    return route.params
  } catch (error) {
    window['$message'].warning('查询路由信息失败，请联系管理员！')
  }
}

/**
 * * 通过硬解析获取当前路由下的参数
 * @returns object
 */
export const fetchRouteParamsLocation = () => {
  try {
    // 防止添加query参数的时候，解析ID异常
    return document.location.hash.split('?')[0].split('/').pop() || ''
  } catch (error) {
    window['$message'].warning('查询路由信息失败，请联系管理员！')
    return ''
  }
}

/**
 * * 回到主页面
 * @param confirm
 */
export const goHome = () => {
  routerTurnByName(PageEnum.BASE_HOME_NAME)
}

/**
 * * 判断是否登录
 * @return boolean
 */
export const loginCheck = () => {
  try {
    const info = getLocalStorage(StorageEnum.GO_SYSTEM_STORE)
    if (!info) return false
    if (info[SystemStoreEnum.USER_INFO][SystemStoreUserInfoEnum.USER_TOKEN]) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}

/**
 * * 预览地址
 * @returns 
 */
 export const previewPath = (id?: string | number) => {
  const { origin, pathname } = document.location
  const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
  const previewPath = `${origin}${pathname}${path}/${id || fetchRouteParamsLocation()}`
  return previewPath
}