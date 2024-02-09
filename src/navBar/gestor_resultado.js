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
  },
  {
    component: 'CNavItem',
    name: 'Aprovar Premio',
    icon: 'cil-browser',
    to: '/AprovarPremio',
  },
]
