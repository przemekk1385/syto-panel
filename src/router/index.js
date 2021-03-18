import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "overview",
    component: () => import("../views/Overview.vue")
  },
  {
    path: "/slots",
    name: "slots",
    component: () => import("../views/Slots.vue")
  },
  {
    path: "/hours",
    name: "hours",
    component: () => import("../views/Hours.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
