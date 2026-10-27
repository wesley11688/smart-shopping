// 此處存放用於登錄相關的街口請求
// 1.獲取驗證碼圖形
import instance from '@/utils/request'
// 2.登錄請求
export const getPicCode = () => {
  return instance.get('/captcha/image')
}
// 2. 獲取簡訊驗證碼
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return instance.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}
// 3. 登入接口
// 3. 登入
export const codeLogin = (mobile, smsCode) => {
  return instance.post('/passport/login', {
    form: {
      isParty: false,
      partyData: {},
      mobile,
      smsCode
    }
  })
}
