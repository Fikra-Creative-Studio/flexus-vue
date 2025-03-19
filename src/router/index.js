import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import CreateView from "../views/CreateView.vue";
import ConfirmAccount from "../views/ConfirmAccount.vue";
import ConfirmedAccount from "../views/ConfirmedAccount.vue";
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import ModuloView from "../views/ModuloView.vue";
import ItemView from "../views/ItemView.vue";
import StepsView from "../views/StepsView.vue";
import CompaniesView from "../views/CompaniesView.vue";
import EmployeesView from "../views/EmployeesView.vue";
import ClientsView from "../views/ClientsView.vue";
import LotView from "../views/LotView.vue";
import AccountView from "../views/AccountView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/create",
    name: "create",
    component: CreateView,
  },
  {
    path: "/confirm-account",
    name: "confirm-account",
    component: ConfirmAccount,
  },
  {
    path: "/confirmed-account",
    name: "confirmed-account",
    component: ConfirmedAccount,
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
  },
  {
    path: "/modules",
    name: "modules",
    component: ModuloView,
  },
  {
    path: "/modules/:id/items",
    name: "items",
    component: ItemView,
  },
  {
    path: "/lotes",
    name: "lotes",
    component: LotView,
  },
  {
    path: "/companies",
    name: "companies",
    component: CompaniesView,
  },
  {
    path: "/companies/:id",
    name: "companies-users",
    component: EmployeesView,
  },
  {
    path: "/account",
    name: "account",
    component: AccountView,
  },
  {
    path: "/usuarios",
    name: "users",
    component: EmployeesView,
  },
  {
    path: "/clientes",
    name: "clientes",
    component: ClientsView,
  },
  {
    path: "/etapas",
    name: "etapas",
    component: StepsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
