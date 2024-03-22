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
        name: 'Excluir Concusrsos',
        icon: 'cil-browser',
        to: '/ExcluirConcurso',
      },
      {
        component: 'CNavItem',
        name: 'Enviar Resultados',
        icon: 'cil-browser',
        to: '/EnviarResultado',
      },
      {
        component: 'CNavItem',
        name: 'Aprovar Premio',
        icon: 'cil-browser',
        to: '/AprovarPremio',
      },
      {
        component: 'CNavItem',
        name: 'Sobrepor Resultados',
        icon: 'cil-browser',
        to: '/Modulo4',
      },
      {
        component: 'CNavItem',
        name: 'Lista de Ganhadores',
        icon: 'cil-browser',
        to: '/modulo3',
      },
      {
        component: 'CNavItem',
        name: 'Lista Ganhadores Bichão',
        icon: 'cil-browser',
        to: '/GanhadoresBichao',
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
  {
    component: 'CNavTitle',
    name: 'Logs',
  },
  {
    component: 'CNavItem',
    name: 'Logs',
    to: '/logs',
    icon: 'cil-warning',
  },
]
