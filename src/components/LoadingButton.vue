<template>
  <button type="submit" :class="buttonClass" :disabled="loading || disabled">
    <span v-if="!loading">{{ text }}</span>
    <span v-else class="loader"></span>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    buttonClass: {
      type: String,
      default: "btn btn--primary",
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  &[disabled] {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 41px;
    padding: 0;
    &:hover {
      filter: initial;
    }
  }
}
.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  position: relative;
  background: #fff;
  box-shadow: -24px 0 #fff, 24px 0 #fff;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: #fff;
    box-shadow: -24px 0 $color-brand, 24px 0 #fff;
  }

  66% {
    background: $color-brand;
    box-shadow: -24px 0 #fff, 24px 0 #fff;
  }

  100% {
    background: #fff;
    box-shadow: -24px 0 #fff, 24px 0 $color-brand;
  }
}
</style>
