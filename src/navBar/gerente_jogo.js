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
      {
        component: 'CNavItem',
        name: 'Lista Ganhadores Bichão',
        icon: 'cil-browser',
        to: '/GanhadoresBichao',
      },
      {
        component: 'CNavItem',
        name: 'Excluir Concusrsos',
        icon: 'cil-browser',
        to: '/ExcluirConcurso',
      },
      {
        component: 'CNavItem',
        name: 'Sobrepor Resultados',
        icon: 'cil-browser',
        to: '/Modulo4',
      },
    ],
  },
]
