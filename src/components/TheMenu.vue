<template>
  <nav class="menu">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <router-link :to="{ name: item.page }">
          {{ item.name }}
          <span></span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { page: "modules", name: "módulos", permissao: 1 },
        { page: "etapas", name: "etapas", permissao: 1 },
        { page: "empresas", name: "empresas", permissao: 10 },
        { page: "funcionarios", name: "funcionários", permissao: 1 },
        { page: "clientes", name: "clientes", permissao: 1 },
      ],
    };
  },
};
</script>

<style scope lang="scss">
.menu {
  padding-left: 20px;
  ul {
    list-style: none;
    width: 100%;
    li {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      &:nth-child(1) {
        a.router-link-active {
          span {
            width: calc(100% - 110px);
          }
        }
      }
      &:nth-child(2) {
        a.router-link-active {
          span {
            width: calc(100% - 90px);
          }
        }
      }
      &:nth-child(3) {
        a.router-link-active {
          span {
            width: calc(100% - 120px);
          }
        }
      }
      &:nth-child(4) {
        a.router-link-active {
          span {
            width: calc(100% - 140px);
          }
        }
      }
      &:nth-child(5) {
        a.router-link-active {
          span {
            width: calc(100% - 100px);
          }
        }
      }
      a {
        display: block;
        text-decoration: none;
        transition: 0.3s ease-in-out;
        color: $color-black;
        padding: 7px 0 6px 20px;
        position: relative;
        &:not(.router-link-active) {
          &:hover {
            color: $color-brand;
          }
        }
        &.router-link-active {
          background-color: $color-background;
          font-weight: 600;
          color: $color-brand;
          border-bottom-left-radius: 8px;
          border-top-left-radius: 8px;
        }
        span {
          display: block;
          width: 0;
          height: 2px;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          background: rgb(49, 93, 104);
          background: linear-gradient(
            90deg,
            rgba(49, 93, 104, 1) 35%,
            rgba(255, 255, 255, 1) 100%
          );
          transition: 0.3s ease-in-out;
          &::after {
            content: "";
            width: 8px;
            height: 8px;
            background-color: $color-white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
}
</style>
