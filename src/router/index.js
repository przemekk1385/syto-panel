import Vue from "vue";
import VueRouter from "vue-router";

import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: () => {
      const { getters: { isCottageWorker, isStationaryWorker } = {} } = store;

      if (!isCottageWorker && isStationaryWorker) return "/stationary";
      else if (isCottageWorker && !isStationaryWorker) return "/cottage";
    },
    name: "MyCalendar",
    component: () => import("../views/MyCalendar.vue"),
    children: [
      {
        path: "stationary",
        name: "StationaryCalendar",
        component: () => import("../views/StationaryCalendar.vue")
      },
      {
        path: "cottage",
        name: "CottageCalendar",
        component: () => import("../views/CottageCalendar.vue")
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/SignInUp.vue")
  },
  {
    path: "/timetable",
    name: "Timetable",
    component: () => import("../views/admin/Timetable.vue")
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
  const { getters: { isAuthenticated } = {} } = store;

  if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
  else next();
});

export default router;
