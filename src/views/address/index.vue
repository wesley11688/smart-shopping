<template>
  <div class="address-page">
    <!-- 1. 導覽列：fixed 固定在頂部，placeholder 在原位置留出同高的空白 -->
    <van-nav-bar @click-left="$router.go(-1)" title="收貨地址" left-arrow fixed placeholder />

    <!-- 2. 地址列表：key 用 address_id（刪除後才不會對錯資料）
         列表沒有「是否預設」欄位，要拿 defaultId 跟每筆的 address_id 比對 -->
    <div class="list">
      <div class="address-item" v-for="item in list" :key="item.address_id">
        <div class="info">
          <div class="info-content">
            <span class="name">{{ item.name }}</span>
            <span class="phone">{{ item.phone }}</span>
            <!-- 預設地址才顯示 -->
            <van-tag v-if="item.address_id === defaultId" round type="primary" class="tag">預設</van-tag>
          </div>
          <!-- region 是物件 { province, city, region }，要自己跟 detail 接起來 -->
          <div class="info-address">
            {{ item.region.province }} {{ item.region.city }} {{ item.region.region }} {{ item.detail }}
          </div>
        </div>
        <!-- 操作列：設為預設、編輯、刪除 -->
        <div class="actions">
          <span class="action default" :class="{ active: item.address_id === defaultId }">
            <van-icon :name="item.address_id === defaultId ? 'checked' : 'circle'" />
            {{ item.address_id === defaultId ? '已設為預設' : '設為預設' }}
          </span>
          <span @click="goEdit(item.address_id)" class="action">
            <van-icon name="edit" />編輯
          </span>
          <span @click="delAddress(item.address_id)" class="action">
            <van-icon name="delete-o" />刪除
          </span>
        </div>
      </div>
    </div>

    <!-- 3. 沒有地址時顯示 -->
    <div class="empty" v-if="list.length === 0">
      <van-icon name="location-o" class="empty-icon" />
      <p>還沒有收貨地址</p>
    </div>

    <!-- 4. 底部按鈕：固定在最下方，點了跳新增頁 -->
    <div class="footer-fixed">
      <div @click="goAdd" class="add-btn">新增收貨地址</div>
    </div>
  </div>
</template>

<script>
import { getAddressList, getDefaultId, removeAddress } from '@/api/address'
export default {
  name: 'AddressIndex',
  data () {
    return {
      list: [], // 地址列表，每筆 address_id、name、phone、region{province,city,region}、detail
      defaultId: null // 預設地址的 address_id
    }
  },
  async created () {
    const { data: { list } } = await getAddressList()
    this.list = list
    const { data: { defaultId } } = await getDefaultId()
    this.defaultId = defaultId
  },
  methods: {
    goAdd () {
      this.$router.push('/address/edit')
    },
    // 編輯跟新增共用 /address/edit，帶 ?id= 讓編輯頁知道要改哪一筆
    goEdit (id) {
      this.$router.push(`/address/edit?id=${id}`)
    },
    async delAddress (id) {
      // 先跳確認框，按取消會 reject，用 catch 接住就不會往下執行
      await this.$dialog.confirm({ title: '提示', message: '確定要刪除這個地址嗎？' })
      await removeAddress(id)
      this.$toast.success('刪除成功')
      // 前端直接把這筆濾掉，不用重新打列表接口
      this.list = this.list.filter(item => item.address_id !== id)
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

.address-page {
  min-height: 100vh;
  // 底部留出按鈕列（72px）的高度，最後一筆才不會被擋住
  padding: 0 12px 88px;
  box-sizing: border-box;
  background: @card;
  color: @text;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'PingFang TC', 'Helvetica Neue', sans-serif;
}

// 加了 placeholder 後，組件最外層變成佔位的 div，.van-nav-bar 在它裡面，所以要從頁面根往下穿透
.address-page /deep/ .van-nav-bar {
  .van-nav-bar__title {
    color: @text;
    font-weight: 600;
  }
  .van-icon {
    color: @text;
  }
}

// 2. 地址卡片
.address-item {
  margin-top: 12px;
  background: #fff;
  border-radius: 14px;
  .info {
    padding: 16px;
  }
  .info-content {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    font-size: 16px;
    font-weight: 600;
    .phone {
      margin-left: 8px;
      font-weight: 400;
      color: @muted;
    }
    .tag {
      margin-left: 8px;
      // van-tag 的 primary 是 Vant 藍，改成 Apple 藍
      background: @blue;
    }
  }
  .info-address {
    font-size: 13px;
    line-height: 1.5;
    color: @muted;
  }
  // 操作列：跟上面用細線分開，「設為預設」靠左，編輯、刪除靠右
  .actions {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-top: 1px solid #e5e5ea;
    font-size: 13px;
    color: @muted;
    .action {
      display: flex;
      align-items: center;
      margin-left: 18px;
      .van-icon {
        margin-right: 4px;
        font-size: 16px;
      }
    }
    .default {
      margin-left: 0;
      margin-right: auto;
    }
    // 已是預設地址：勾勾和文字變藍
    .active {
      color: @blue;
    }
  }
}

// 3. 空狀態
.empty {
  padding-top: 120px;
  text-align: center;
  color: @muted;
  font-size: 15px;
  .empty-icon {
    margin-bottom: 12px;
    font-size: 56px;
    color: #c7c7cc;
  }
  p {
    margin: 0;
  }
}

// 4. 底部按鈕列
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
  .add-btn {
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
</style>
