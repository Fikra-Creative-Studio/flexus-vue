<template>
  <div class="loading">
    <div class="loading__content">
      <p>carregando</p>
      <span class="loader"></span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: calc(100vh - 155px);
  display: flex;
  align-items: center;
  justify-content: center;
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 16px;
    p {
      font-size: 1.5em;
      color: $color-brand;
    }
  }
}
.loader {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: block;
  position: relative;
  background: $color-brand;
  box-shadow: -32px 0 $color-brand, 32px 0 $color-brand;
  box-sizing: border-box;
  animation: shadowPulse 2s linear infinite;
}

@keyframes shadowPulse {
  33% {
    background: $color-brand;
    box-shadow: -32px 0 $color-secondary, 32px 0 $color-brand;
  }

  66% {
    background: $color-secondary;
    box-shadow: -32px 0 $color-brand, 32px 0 $color-brand;
  }

  100% {
    background: $color-brand;
    box-shadow: -32px 0 $color-brand, 32px 0 $color-secondary;
  }
}
</style>
