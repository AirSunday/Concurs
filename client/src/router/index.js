import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const routes = [
  {
    path: "/",
    name: "HomeMain",
    component: () => import("@/views/Home.vue"),
  }, {
    path: "/competition/:id",
    name: "CompetitionPage",
    component: () => import("@/views/Competition.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.inc(); // увеличение прогресса на случайный процент
    NProgress.start();
  }
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
