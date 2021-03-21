import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "overview",
    component: () => import("../views/admin/Overview.vue")
  },
  {
    path: "/slots",
    name: "slots",
    component: () => import("../views/admin/Slots.vue")
  },
  {
    path: "/hours",
    name: "hours",
    component: () => import("../views/Hours.vue")
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

export default router;
