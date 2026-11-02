<template>
<div class="count-box">
  <button @click="minus" class="minus">-</button>
  <input  :value="value" @change="handleChange" class="inp" type="text">
  <button @click="add" class="add ">+</button>
</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number
    }
  },
  components: {},
  data () {
    return {
    }
  },
  methods: {
    add () {
      this.$emit('input', this.value + 1)
    },
    minus () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleChange (e) {
      console.log(e.target.value)
      const num = +e.target.value
      if (isNaN(num) || num <= 1) {
        e.target.value = this.value
        return
      }
      this.$emit('input', num)
    }
  }
}
</script>

<style lang="less" scoped>
@text: #1d1d1f;
@muted: #6e6e73;
@card: #f5f5f7;
@blue: #0071e3;

.count-box {
  display: flex;
  align-items: center;
  button,
  .inp {
    height: 30px;
    border: none;
    outline: none;
    background: @card;
    color: @text;
    font-size: 15px;
    text-align: center;
    border-radius: 8px;
  }
  button {
    width: 30px;
    padding: 0;
    &:active {
      background: darken(@card, 6%);
    }
    // 數量到上下限時加上 disabled，按鈕變淡
    &:disabled {
      color: @muted;
      opacity: 0.4;
    }
  }
  .inp {
    width: 44px;
    margin: 0 4px;
    &:focus {
      box-shadow: 0 0 0 2px fade(@blue, 40%);
    }
  }
}
</style>
