<template>
  <div class="notification-container">
    <transition-group name="fade">
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        :class="`toast toast-${toast.type}`"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("toast", ["toasts"]), // Pegando os toasts do Vuex Store
  },
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  padding: 12px 20px;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  min-width: 200px;
  max-width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.toast-success {
  background-color: #4caf50;
}

.toast-error {
  background-color: #f44336;
}

.toast-warning {
  background-color: $color-red;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
