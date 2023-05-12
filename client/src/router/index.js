import { createRouter, createWebHistory } from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Concurs from "@/services/Concurs";

const routes = [
  {
    path: "/",
    name: "HomeMain",
    component: () => import("@/views/Home.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/competition/:id",
    name: "CompetitionPage",
    component: () => import("@/views/Competition.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/model/:id",
    name: "ModelPage",
    component: () => import("@/views/Model.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    name: "AuthPage",
    component: () => import("@/views/Auth.vue"),
  },
  {
    path: "/edit/profile",
    name: "EditProfilePage",
    component: () => import("@/views/EditProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/competition/:id",
    name: "EditCompetitionPage",
    component: () => import("@/views/EditCompetition.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/model/:id",
    name: "EditModelPage",
    component: () => import("@/views/EditModel.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add/competition",
    name: "AddCompetitionPage",
    component: () => import("@/views/AddCompetition.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/add/model/:id",
    name: "AddModelPage",
    component: () => import("@/views/AddModel.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/competition",
    name: "CompetitionsPage",
    component: () => import("@/views/Competitions.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/competition/end",
    name: "CompetitionsEndPage",
    component: () => import("@/views/CompetitionsEnd.vue"),
    meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    Concurs.isAuthenticated().then((res) => {
      if (!res.data.login) {
        next({
          path: '/auth',
          query: { redirect: to.fullPath } // сохраняем URL для перенаправления после регистрации
        })
      } else {
        next() // продолжаем навигацию
      }
    })
  } else {
    next() // продолжаем навигацию
  }
})

export default router;
