export default [
  {
    component: 'CNavTitle',
    name: 'Dashboard',
  },
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Modulos',
  },
  {
    component: 'CNavGroup',
    name: 'Modulos',
    icon: 'cil-browser',
    items: [
      {
        component: 'CNavItem',
        name: 'Apostas Feitas',
        icon: 'cil-browser',
        to: '/LogBancasPremios',
      },
    ],
  },
  {
    component: 'CNavTitle',
    name: 'Usuários',
  },
  {
    component: 'CNavItem',
    name: 'Usuários',
    to: '/usuarios',
    icon: 'cil-user',
  },
]
