import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainLayout,
    },
    {
      path: '/user',
      component: () => import('@/layouts/UserLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/user/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/user/RegisterView.vue'),
        },
        {
          path: 'edit-profile',
          name: 'edit-profile',
          component: () => import('@/views/user/EditProfileView.vue'),
        },
        {
          path: 'verify-email',
          name: 'verify-email',
          component: () => import('@/views/user/VerifyEmailView.vue'),
        },
        {
          path: 'resend-confirmation',
          name: 'resend-confirmation',
          component: () => import('@/views/user/ResendConfirmationView.vue'),
        },
      ],
    },
  ],
})

export default router
