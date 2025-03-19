<template>
  <div class="form-group" :class="{ 'form-group--error': error.status }">
    <label class="normal" v-if="label">{{ label }}</label>
    <input
      v-if="type === 'file'"
      :type="type"
      :placeholder="placeholder"
      @change="handleFileChange"
      :disabled="disabled"
    />
    <input
      v-else-if="mask"
      :type="type"
      :placeholder="placeholder"
      v-mask="mask"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    />
    <input
      v-else
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled"
    />
    <span>
      <i class="flaticon-exclamation"></i>
      <p>{{ error.msg }}</p>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    error: {
      type: Object,
      default: () => ({ status: false, msg: "" }),
    },
    placeholder: String,
    mask: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    modelValue: [String, Number, File],
    tooltip: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      this.$emit("update:modelValue", file);
    },
  },
};
</script>

<style scoped lang="scss">
.form-group {
  position: relative;
  label {
    display: block;
    font-size: 1em;
    font-weight: 600;
    margin-bottom: 8px;
    transition: 0.3s ease-in-out;
    &:not(.normal) {
      text-transform: lowercase;
    }
  }
  input {
    width: 100%;
    font-size: 1em;
    color: $color-black;
    border: 0px none;
    border-bottom: 1px solid $color-secondary;
    padding: 11px 8px 10px;
    background-color: $color-background;
    outline: none;
    transition: 0.3s ease-in-out;
    &::placeholder {
      font-size: 0.875em;
      color: $color-gray-light;
    }
    &[disabled] {
      background-color: $color-background !important;
      color: $color-gray-light;
      cursor: not-allowed;
    }
  }
  span {
    position: absolute;
    bottom: 10px;
    right: 0;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
    z-index: -1;
    cursor: help;
    i {
      color: $color-red;
    }
    p {
      position: absolute;
      top: -4px;
      right: 0%;
      white-space: nowrap;
      font-size: 0.75em;
      background: $color-red;
      color: $color-white;
      padding: 4px 8px;
      border-radius: 4px;
      transition: 0.3s ease-in-out;
      transform: translate(0%, calc(-100% + 10px));
      opacity: 0;
    }
    &:hover {
      p {
        transform: translate(0%, -100%);
        opacity: 1;
      }
    }
  }
  &--error {
    input {
      border-color: $color-red;
      padding-right: 25px;
    }
    label {
      color: $color-red;
    }
    span {
      opacity: 1;
      z-index: 2;
    }
  }
  &.gold {
    label {
      color: $color-brown;
      margin-bottom: initial;
    }
    input {
      background: $color-white;
    }
  }
}
</style>
