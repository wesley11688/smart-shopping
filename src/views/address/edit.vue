<template>
  <div class="address-edit">
    <!-- 1. 導覽列：新增和編輯共用這一頁，網址有 ?id= 就是編輯 -->
    <van-nav-bar @click-left="$router.go(-1)" :title="addressId ? '編輯收貨地址' : '新增收貨地址'" left-arrow fixed placeholder />

    <!-- 2. 表單：姓名、電話、所在地區、詳細地址（佔位：之後用 v-model 綁 data） -->
    <div class="form">
      <van-field v-model="name" label="收貨人" placeholder="請輸入收貨人姓名" />
      <van-field v-model="phone" label="手機號碼" type="tel" placeholder="請輸入手機號碼" />
      <!-- 所在地區：readonly 不能打字，點了打開下面的省市區彈窗 -->
      <van-field v-model="region" @click="show = true" label="所在地區" placeholder="請選擇省 / 市 / 區" readonly is-link />
      <van-field
        v-model="detail"
        label="詳細地址"
        type="textarea"
        rows="2"
        autosize
        placeholder="街道、門牌號、樓層等"
      />
    </div>

    <!-- 3. 底部儲存按鈕：固定在最下方 -->
    <div class="footer-fixed">
      <div @click="saveAddress" class="save-btn">儲存</div>
    </div>

    <!-- 4. 省市區彈窗：van-popup 從底部彈出，裡面放 van-cascader
         popup 的 v-model="show" 控制開關（點遮罩會自動改回 false）
         cascader 的 v-model 是「選到的值」，不是開關；它的 ✕ 不會自己關彈窗，要 @close 手動關
         options 綁 cascader 陣列，region/tree 轉好之前是空的 -->
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="請選擇所在地區"
        placeholder="請選擇"
        :options="cascader"
        @close="show = false"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>

<script>
import { addAddress, editAddress, getAddressDetail, getRegionTree } from '@/api/address'
export default {
  name: 'AddressEdit',
  data () {
    return {
      show: false, // 省市區彈窗開關，預設關著，點「所在地區」才打開
      cascaderValue: '', // cascader 目前選到的 value
      name: '',
      phone: '',
      region: '', // 畫面顯示用的文字，例如「北京 / 北京市 / 东城区」
      regionList: [], // 送給後端的陣列：後端會 count(region)，送文字會報錯
      detail: '',
      cascader: []
    }
  },
  computed: {
    // 網址有 ?id= 就是編輯，沒有就是新增（query 讀到的是字串）
    addressId () {
      return this.$route.query.id
    }
  },
  // 進頁面就拿省市區資料，轉成 cascader 要的 { text, value, children } 陣列
  // 後端 list 是用 id 當 key 的物件，要先 Object.values 變陣列；省底下叫 city、市底下叫 region
  // 區那層不寫 children，cascader 才知道選到底了，會觸發 finish
  async created () {
    const { data: { list } } = await getRegionTree()
    this.cascader = Object.values(list).map(province => ({
      text: province.name,
      value: province.id,
      children: Object.values(province.city || {}).map(city => ({
        text: city.name,
        value: city.id,
        children: Object.values(city.region || {}).map(area => ({
          text: area.name,
          value: area.id
        }))
      }))
    }))

    // 編輯：抓原本的資料填回表單
    // 詳情的 region 只有名稱，id 在外層的 province_id、city_id、region_id，要配對組回 regionList
    // 不組回來的話，沒重新選地區就按儲存，會送出空陣列
    if (this.addressId) {
      const { data: { detail } } = await getAddressDetail(this.addressId)
      this.name = detail.name
      this.phone = detail.phone
      this.detail = detail.detail
      const r = detail.region
      this.region = `${r.province} / ${r.city} / ${r.region}`
      this.regionList = [
        { label: r.province, value: detail.province_id },
        { label: r.city, value: detail.city_id },
        { label: r.region, value: detail.region_id }
      ]
      // 打開彈窗時直接停在原本的區
      this.cascaderValue = detail.region_id
    }
  },
  methods: {
    // 選到最後一層（區）時觸發：selectedOptions 依序是省、市、區，每筆 { text, value, children }
    onFinish ({ selectedOptions }) {
      this.show = false
      this.region = selectedOptions.map(item => item.text).join(' / ')
      this.regionList = selectedOptions.map(item => ({ label: item.text, value: item.value }))
    },
    // 有 addressId 呼叫編輯接口，沒有就呼叫新增接口；成功後再回上一頁
    // 用 back 而不是 push，返回時才不會又回到這個編輯頁
    async saveAddress () {
      // 送出前檢查：有一欄沒填就提示並 return，不送請求；trim 去掉前後空白，只打空格也算沒填
      if (!this.name.trim()) return this.$toast('請輸入收貨人姓名')
      if (!this.phone.trim()) return this.$toast('請輸入手機號碼')
      if (!this.region) return this.$toast('請選擇所在地區')
      if (!this.detail.trim()) return this.$toast('請輸入詳細地址')
      if (this.addressId) {
        await editAddress(this.addressId, this.name, this.phone, this.regionList, this.detail)
        this.$toast.success('修改成功')
      } else {
        await addAddress(this.name, this.phone, this.regionList, this.detail)
        this.$toast.success('新增成功')
      }
      this.$router.back()
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

.address-edit {
  min-height: 100vh;
  padding: 0 12px 88px;
  box-sizing: border-box;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

.address-edit /deep/ .van-nav-bar {
  .van-nav-bar__title {
    color: @text;
    font-weight: 600;
  }
  .van-icon {
    color: @text;
  }
}

// 2. 表單：白色圓角卡片，四個欄位之間用 van-field 內建的細線分隔
.form {
  margin-top: 12px;
  overflow: hidden;
  background: #fff;
  border-radius: 14px;
  /deep/ .van-field {
    padding: 14px 16px;
    font-size: 15px;
    .van-field__label {
      width: 72px;
      color: @text;
    }
    .van-field__control {
      color: @text;
      &::placeholder {
        color: #c7c7cc;
      }
    }
  }
}

// 3. 底部按鈕列
.footer-fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(180%) blur(20px);
  border-top: 1px solid #e5e5ea;
  .save-btn {
    height: 44px;
    line-height: 44px;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background: @blue;
    border-radius: 999px;
    &:active {
      opacity: 0.8;
    }
  }
}

// 4. 省市區彈窗：選中的分頁底線和勾勾改成 Apple 藍
/deep/ .van-cascader__tab {
  color: @text;
}
/deep/ .van-tabs__line {
  background: @blue;
}
/deep/ .van-cascader__option--selected {
  color: @blue;
}
</style>
