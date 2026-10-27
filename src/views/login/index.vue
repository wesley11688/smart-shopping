<template>
  <div class="login">
    <van-nav-bar
      title="會員登入"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="container">
      <div class="title">
        <h3>手機號登入</h3>
        <p>未註冊的手機號登入後將自動註冊</p>
      </div>

      <div class="form">
        <!-- 手機號 -->
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="請輸入手機號碼" type="text">
        </div>
        <!-- 圖形驗證碼：圖片之後換成接口回傳的 base64 -->
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="請輸入圖形驗證碼" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode" alt="圖形驗證碼">
        </div>
        <!-- 簡訊驗證碼 -->
        <div class="form-item">
          <input v-model="smsCode" class="inp" maxlength="6" placeholder="請輸入簡訊驗證碼" type="text">
          <button ref="btn" class="code-btn" @click="getCode">{{ second === totalSecond ? '獲取驗證碼' : second  + '秒後重新發送' }}</button>
        </div>
      </div>

      <div @click="login" class="login-btn">登入</div>
    </div>
  </div>
</template>

<script>
import { getPicCode, getMsgCode, codeLogin } from '@/api/login'
import { Toast } from 'vant'

export default {
  name: 'LoginIndex',
  created () {
    this.getPicCode()
  },
  components: {},
  data () {
    return {
      picCode: '', // 用戶輸入的圖形驗證碼
      picKey: '', // 將來請求傳遞的驗證碼唯一標示
      picUrl: '', // 存儲請求渲染的圖片標示
      totalSecond: 60, // 儲存總秒數
      second: 60, // 目前倒數到第幾秒
      timer: null, // 計時器的 id
      mobile: '',
      smsCode: ''
    }
  },
  destroyed () {
    // 離開頁面時清掉計時器，不然會在背景繼續跑
    clearInterval(this.timer)
  },
  methods: {
    onClickLeft () {
      this.$router.go(-1)
    },
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
      Toast('圖形驗證碼已更換')
    },
    validFn () {
      if (!/^09\d{8}$/.test(this.mobile)) {
        Toast('請輸入正確的電話號碼')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        Toast('請輸入正確的驗證碼')
        return false
      }
      return true
    },
    async getCode () {
      if (!this.validFn()) {
        return
      }
      // 沒有計時器、而且還沒開始倒數，才開始倒數（防止重複點擊）
      if (!this.timer && this.second === this.totalSecond) {
        const res = await getMsgCode(this.picCode, this.picKey, this.mobile)
        console.log(res)
        Toast('短信驗證碼已發送')
        this.$refs.btn.disabled = true
        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond
            this.$refs.btn.disabled = false
          }
        }, 1000)
      }
    },
    async login () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.smsCode)) {
        return Toast('請輸入正確的驗證碼')
      }
      const res = await codeLogin(this.mobile, this.smsCode)
      console.log(res)
      if (res.status === 200) {
        Toast('登錄成功')
        this.$router.push('/')
      }
    }

  }
}
</script>

<style lang="less" scoped>
// Apple 風格：白底、系統字、淺灰圓角，強調色只用 Apple 藍
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.login {
  min-height: 100vh;
  background: #fff;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

.container {
  padding: 40px 24px;
}

.title {
  margin-bottom: 28px;
  h3 {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.5px;
  }
  p {
    margin-top: 8px;
    font-size: 14px;
    color: @muted;
  }
}

.form-item {
  display: flex;
  align-items: center;
  height: 50px;
  margin-bottom: 14px;
  padding: 0 16px;
  background: @card;
  border-radius: 12px;

  .inp {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: @text;
    &::placeholder {
      color: @muted;
    }
  }

  img {
    width: 94px;
    height: 32px;
    border-radius: 6px;
  }

    .code-btn {
    border: none;
    background: transparent;
    font-size: 15px;
    color: @blue;
    &:disabled {
      color: @muted;
    }
  }
}

.login-btn {
  height: 50px;
  margin-top: 32px;
  line-height: 50px;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
  background: @blue;
  border-radius: 25px;
}

</style>
