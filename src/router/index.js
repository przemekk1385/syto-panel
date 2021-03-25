import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "myCalendar",
    component: () => import("../views/MyCalendar.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/SignInUp.vue")
  },
  {
    path: "/overview",
    name: "overview",
    component: () => import("../views/admin/Overview.vue")
  },
  {
    path: "/slots",
    name: "slots",
    component: () => import("../views/admin/Slots.vue")
  },
  {
    path: "/users",
    name: "users",
    component: () => import("../views/admin/Users.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name !== "login" && !store.getters.isAuthenticated)
    next({ name: "login" });
  else next();
});

export default router;
