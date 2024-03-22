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
        to: '/ApostasFeitas',
      },
      {
        component: 'CNavItem',
        name: 'Criar Concursos',
        icon: 'cil-browser',
        to: '/CriarConcurso',
      },
      {
        component: 'CNavItem',
        name: 'Enviar Resultados',
        icon: 'cil-browser',
        to: '/EnviarResultado',
      },
      {
        component: 'CNavItem',
        name: 'Lista de Ganhadores',
        icon: 'cil-browser',
        to: '/modulo3',
      },
      {
        component: 'CNavItem',
        name: 'Relatório Financeiro',
        icon: 'cil-browser',
        to: '/RelatorioFinanceiro',
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
