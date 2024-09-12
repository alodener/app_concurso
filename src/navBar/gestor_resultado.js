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
  {
    component: 'CNavItem',
    name: 'Aprovação Automática',
    icon: 'cil-browser',
    to: '/AprovacaoAutomatica',
  },
  {
    component: 'CNavItem',
    name: 'Aprovar Premio Bichão',
    icon: 'cil-browser',
    to: '/AprovarPremioBichao',
  },
  {
    component: 'CNavItem',
    name: 'Todos | Fluxo de Caixa',
    icon: 'cil-browser',
    to: '/RelatorioFinanceiro',
  },
]
