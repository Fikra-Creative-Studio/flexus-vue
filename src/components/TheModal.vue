<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal" @click.self="handleClose">
      <div class="modal__content">
        <button class="close-btn" @click="handleClose">
          <i class="flaticon-x"></i>
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TheModal",
  props: {
    modalType: {
      type: String,
      required: true,
    },
  },
  computed: {
    isVisible() {
      return this.modalType === "first"
        ? this.isModalVisible
        : this.isSecondModalVisible;
    },
    ...mapGetters("modal", ["isModalVisible", "isSecondModalVisible"]),
  },
  methods: {
    handleClose() {
      this.modalType === "first" ? this.closeModal() : this.closeSecondModal();
      this.$emit("close");
    },
    ...mapActions("modal", ["closeModal", "closeSecondModal"]),
  },
};
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  &__content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    position: relative;
    h2 {
      font-family: $font-secondary;
    }
  }
  &__form {
    margin: 20px 0 !important;
    .form-group {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
  &__buttons {
    display: flex;
    align-items: center;
    gap: 20px;
    a {
      text-align: center;
    }
  }
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
  color: $color-black;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}
.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
