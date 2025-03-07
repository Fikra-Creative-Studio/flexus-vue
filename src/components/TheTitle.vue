<template>
  <h1 v-html="text"></h1>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: 2em;
  line-height: 1.3em;
  color: $color-text;
  font-weight: 400;
  margin-bottom: 40px;
  &::after {
    content: "";
    width: 60px;
    height: 2px;
    display: block;
    background: $color-text;
    margin-top: 12px;
  }
}
</style>
