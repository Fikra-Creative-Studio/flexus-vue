<template>
  <div
    class="form-group select"
    :class="[{ 'form-group--error': error.status }, { active: active }]"
    ref="dropdown"
  >
    <label v-if="label">{{ label }}</label>
    <div class="select__selected" @click.prevent="toggle">
      <input
        type="text"
        :value="newCurrent || itemCurrent"
        :placeholder="placeholder"
        readonly
      />
      <i class="flaticon-down-arrow"></i>
    </div>
    <div v-if="active" class="select__options">
      <input type="hidden" :value="modelValue" />
      <input
        type="text"
        v-model="search"
        placeholder="pesquise..."
        class="select__search"
        v-if="activeSearch"
      />
      <ul>
        <li
          v-for="(item, index) in filteredItems"
          @click="setItem(item)"
          :class="{ active: item.value == modelValue }"
          :key="index"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>

    <span v-if="error.status">
      <i class="flaticon-exclamation"></i>
      <p>{{ error.msg }}</p>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: false,
      search: "",
      newCurrent: null,
    };
  },
  props: {
    label: String,
    current: String,
    items: Array,
    error: {
      type: Object,
      default: () => ({ status: false, msg: "" }),
    },
    activeSearch: {
      type: Boolean,
      default: true,
    },
    placeholder: String,
    modelValue: [String, Number],
    tooltip: String,
  },
  computed: {
    itemCurrent() {
      let find = this.items.find(item => item.value == this.current);
      return find ? find.name : "";
    },
    filteredItems() {
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    toggle() {
      this.active = !this.active;
    },
    setItem(item) {
      this.newCurrent = item.name;
      this.$emit("update:modelValue", item.value);
      this.search = "";
      this.active = false;
    },
    handleClickOutside(event) {
      if (
        this.active &&
        this.$refs.dropdown &&
        !this.$refs.dropdown.contains(event.target)
      ) {
        this.active = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
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
  .select {
    &__selected {
      cursor: pointer;
      position: relative;
      i {
        position: absolute;
        top: 50%;
        right: 8px;
        font-size: 20px;
        transform: translateY(-50%);
        color: $color-brown;
        transition: 0.3s ease-in-out;
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
      }
    }
    &__search {
      width: 100%;
      background: #f3efe1 !important;
      border: 0px none;
      font-size: 1em;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      padding: 9px 8px 8px;
      outline: none;
      &::placeholder {
        font-size: 0.875em;
        color: $color-gray-light;
      }
    }
    &__options {
      background: $color-white;
      position: absolute;
      top: 59px;
      left: 0;
      width: 100%;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
      border: 1px solid $color-white;
      border-top: 0px none;
      transition: 0.3s ease-in-out;
      max-height: 0px;
      overflow: hidden;
      ul {
        list-style: none;
        max-height: 150px;
        overflow-y: scroll;
        li {
          margin: 0 16px;
          padding: 8px 0 7px;
          cursor: pointer;
          transition: color 0.3s ease-in-out;
          &:not(:last-child) {
            border-bottom: 1px solid $color-secondary;
          }
          &.active {
            font-weight: 700;
          }
          &:not(.active) {
            &:hover {
              color: $color-brand;
            }
          }
        }
      }
    }
  }
  span:not(.flaticon-down-arrow) {
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
    .select__selected {
      i {
        right: 18px;
      }
      input {
        border-color: $color-red;
        padding-right: 25px;
      }
    }
    label {
      color: $color-red;
    }
    span:not(.flaticon-down-arrow) {
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
  &.active {
    z-index: 2;
    .select {
      &__selected {
        i {
          transform: translateY(-50%) rotate(180deg);
        }
      }
      &__options {
        border-color: $color-secondary;
        max-height: 200px;
      }
    }
  }
}
</style>
