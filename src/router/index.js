import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "MyCalendar",
    component: () => import("../views/MyCalendar.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/SignInUp.vue")
  },
  {
    path: "/overview",
    name: "Overview",
    component: () => import("../views/admin/Overview.vue")
  },
  {
    path: "/slots",
    name: "Slots",
    component: () => import("../views/admin/Slots.vue")
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/admin/Users.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name !== "Login" && !store.getters.isAuthenticated)
    next({ name: "Login" });
  else next();
});

export default router;
