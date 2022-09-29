// 给vee提供校验函数

import { userAccountCheck } from "@/api/user"
export default {
  // 用户名校验
  account(value) {
    if (!value) return "用户名不能为空!";
    // 规则：字母开头, 6-20个字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return "字母开头且6-20个字符"
    return true;

  },
  // 用户名校验且校验唯一性
  async accountApi(value) {
    if (!value) return "用户名不能为空!";
    // 规则：字母开头, 6-20个字符之间
    if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return "字母开头且6-20个字符"
    const data = await userAccountCheck(value)
    if (data.result.valid) {
      return '用户名已存在'
    }

    return true;

  },
  // 密码校验
  password(value) {
    if (!value) return '密码不能为空!'
    // 规则: 6-20个字符
    if (!/^\w{6,24}$/.test(value)) return '密码必须为6-20个字符!'
    return true
  },
  // 再次确认密码的校验
  rePassword(value, { form }) {
    // vee提供一个表单数据对象
    if (!value) return '密码不能为空!'
    // 规则: 6-20个字符
    if (!/^\w{6,24}$/.test(value)) return '密码必须为6-20个字符!'
    if (value != form.password) return '两次密码不一致!'
    return true
  },
  mobile(value) {
    if (!value) return '请输入手机号!'
    // 规则: 1开头+3-9之间的一个数字+9个数字
    if (!/^1[3-9]\d{9}$/.test(value)) return '请输入正确的手机号'
    return true
  },
  code(value) {
    if (!value) return '请输入验证码!'
    // 规则: 6个数字
    if (!/^\d{6}$/.test(value)) return '请输入正确的验证码'
    return true
  },
  isAgree(value) {
    if (!value) return '请勾选登录协议!'
    return true
  }

}