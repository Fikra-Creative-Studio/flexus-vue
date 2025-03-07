<template>
  <div class="banner">
    <span class="banner__image"> </span>
    <div class="banner__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
@keyframes anime {
  0% {
    transform: translate(0%, 0%);
  }
  100% {
    transform: translate(-50%, 0%);
  }
}
.banner {
  &__image {
    width: 100%;
    height: calc(100vh - 40px);
    transform: scaleX(-1);
    display: block;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 200%;
      height: 200%;
      top: 0;
      left: 0;
      z-index: -1;
      background: url("/src/assets/img/mesh.jpg") no-repeat center center;
      background-size: cover;
      animation: anime 80s forwards 1;
    }
  }
  &__content {
    padding: 20px;
  }

  &--medium {
    .banner {
      &__content {
        width: 74%;
        min-width: 700px;
      }
    }
  }
  &--titled {
    height: calc(100vh - 155px) !important;
    .banner {
      &__content {
        left: 80px;
        width: 70%;
        min-width: 700px;
      }
    }
  }
  &--blue {
    .banner {
      &__content {
        left: 100px;
        h2 {
          color: $color-black;
        }
        p,
        a {
          color: $color-gray;
          line-height: 1.2em;
        }
        a {
          font-weight: 400;
          font-size: 0.725em;
        }
      }
    }

    &::after {
      background: $color-brand !important;
      mix-blend-mode: color;
    }
  }
  &--gold {
    &::after {
      background: #987b59 !important;
      mix-blend-mode: color;
    }
  }
}
</style>
