<template>
  <div class="bar-step">
    <div class="bar-step__wrapper">
      <ul class="bar-step__bar">
        <li
          v-for="(step, index) in steps"
          :key="step.id"
          :class="getStepClass(step, index)"
        >
          <span>
            <i class="flaticon-check"></i>
          </span>
          <p>
            <strong>{{ step.nome }}</strong>
            {{ step.status ? "concluído" : "pendente" }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["steps", "current"],
  methods: {
    getStepClass(step, index) {
      if (step.status) {
        return "completed";
      } else if (index === 0 || (index > 0 && this.steps[index - 1].status)) {
        return "current";
      } else {
        return "incomplete";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bar-step {
  padding: 16px 0 16px;
  margin-top: 4px;
  border-top: 1px solid RGBA(0, 0, 0, 0.1);
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    position: relative;
    &::after {
      content: "";
      width: calc(100% - 48px);
      height: 1px;
      background: $color-brand;
      position: absolute;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1;
    }
    li {
      text-align: center;
      position: relative;
      z-index: 2;
      span {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: $color-white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        border: 1px solid $color-brand;
        position: relative;
      }
      p {
        font-size: 12px;
        text-align: left;
        strong {
          font-size: 14px;
          font-weight: 400;
          display: block;
          margin-bottom: 2px;
        }
      }
      &.current,
      &.incomplete {
        span {
          i {
            display: none;
          }
        }
      }
      &.current {
        span {
          background-color: $color-white;
          &:before {
            content: "";
            width: 20px;
            height: 20px;
            background: $color-secondary;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        p {
          font-weight: 600;
          strong {
            font-weight: 600;
          }
        }
      }
      &.completed {
        span {
          background-color: $color-brand;
          color: $color-white;
          i {
            transform: translateY(2px);
          }
        }
      }
    }
  }
}
</style>
