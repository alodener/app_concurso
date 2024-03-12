import { createRouter, createWebHashHistory } from 'vue-router'
import { isSignedIn } from '@/plugins/auth'

import DefaultLayout from '@/layouts/DefaultLayout'

const user = JSON.parse(localStorage.getItem('user'))

setTimeout(300)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue'),
        beforeEnter(_, __, next) {
          if (isSignedIn()) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/usuarios',
        name: 'Usuarios',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Usuarios/Usuarios.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['super_admin', 'admin', 'socio'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/usuarios/criar',
        name: 'CriarUsuario',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Usuarios/CriarUsuario.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['super_admin', 'admin', 'socio'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/usuarios/editar/:id',
        name: 'EditarUsuario',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Usuarios/EditarUsuario.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['super_admin', 'admin', 'socio'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/logs',
        name: 'Logs',
        component: () =>
          import(/* webpackChunkName: "dashboard" */ '@/views/Logs/Logs.vue'),
        beforeEnter(_, __, next) {
          if (isSignedIn() && ['super_admin'].includes(user.role)) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/ApostasFeitas',
        name: 'ApostasFeitas',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/ApostasFeitas.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['socio', 'super_admin', 'admin'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/CriarConcurso',
        name: 'CriarConcurso',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/CriarConcurso.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['super_admin', 'admin', 'gerente_jogo'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/EnviarResultado',
        name: 'EnviarResultado',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/EnviarResultado.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            [
              'super_admin',
              'admin',
              'gerente_jogo',
              'gestor_resultado',
            ].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/ExcluirConcurso',
        name: 'ExcluirConcurso',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/ExcluirConcurso.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            [
              'super_admin',
              'admin',
              'gerente_jogo',
              'gestor_resultado',
            ].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/modulo3',
        name: 'Modulo3',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/Modulo3.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['super_admin', 'admin', 'marketing'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/AprovarPremio',
        name: 'AprovarPremio',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/AprovarPremio.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            [
              'super_admin',
              'admin',
              'gerente_jogo',
              'gestor_resultado',
            ].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
      {
        path: '/Modulo4',
        name: 'Modulo4',
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Modulos/Modulo4.vue'
          ),
        beforeEnter(_, __, next) {
          if (
            isSignedIn() &&
            ['super_admin', 'admin', 'gerente_jogo'].includes(user.role)
          ) {
            next()
            return
          }
          next('/login')
        },
      },
    ],
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
