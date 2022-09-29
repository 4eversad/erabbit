import request from "@/utils/request";
/**
 * 账号密码登录
 * @param {String} account -账号
 * @param {String} password -密码 
 * @returns  Promise
 */
export const userAccountLogin = ({ account, password }) => {
  return request('/login', 'post', { account, password })
}
 
/**
 * 获取手机号的短信验证码
 * @param {String} mobile  -手机号
 * @returns  promise
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}

/**
 * 验证验证码
 * @param {String} mobile -手机号 
 * @param {String} mobile -验证码 
 * @returns promise
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}

/**
 * QQ登录
 * @param {String} unionId -qq唯一标识, openId
 * @param {} source  客户端类型 1PC
 * @returns 
 */
export const userQQLogin = (unionId, source = 1) => {
  return request('/login/social', 'post', { unionId, source })
}


/**
 * 获取QQ绑定时的短信验证码
 * @param {String} mobile -手机号
 * @returns Promise
 */
export const userQQBindCode = (mobile) => {
  return request('/login/social/code', 'get', { mobile })
}

/**
 * qq绑定手机号
 * @param {String} param0 -qq唯一标识 openId
 * @param {String} param1 -手机号码
 * @param {String} param2 -验证码
 * @returns 
 */
export const userQQBindLogin = ({ unionId, mobile, code }) => {
  return request('login/social/bind', 'post', { unionId, mobile, code })
}

/**
 * 验证用户名唯一性
 * @param {String} account -用户名
 * @returns 
 */
export const userAccountCheck = (account) => {
  return request('/register/check', 'get', { account })

}
/**
 * 获取qq完善信息时的验证码
 * @param {String} mobile -手机号
 * @returns 
 */
export const userQQPatchCode = (mobile) => {
  return request('/register/code', 'get', { mobile })

}
/**
 * 完善信息
 * @param {String} unionId  -qq唯一标识 openId
 * @param {String} mobile -手机号码
 * @param {String} code -验证码
 * @param {String} account -用户名 
 * @param {String} password -密码
 * @returns 
 */
export const userQQPatchLogin = ({ unionId, mobile, code, account, password }) => {
  return request(`login/social/${unionId}/complement`, 'post', { unionId, mobile, code, account, password })
}