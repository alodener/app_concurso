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
        name: 'Todos | Log de bilhetes',
        icon: 'cil-browser',
        to: '/ApostasFeitas',
      },
      {
        component: 'CNavItem',
        name: 'Todos | Fluxo de Caixa',
        icon: 'cil-browser',
        to: '/RelatorioFinanceiro',
      },
      {
        component: 'CNavItem',
        name: 'Todos | Backup Lista Ganhadores',
        icon: 'cil-browser',
        to: '/ListaGanhadoresEscritorio',
      },
      {
        component: 'CNavItem',
        name: 'Loteria | Aprovar Prêmio',
        icon: 'cil-browser',
        to: '/AprovarPremio',
      },
      {
        component: 'CNavItem',
        name: 'Loteria | Novo Concurso',
        icon: 'cil-browser',
        to: '/CriarConcurso',
      },
      {
        component: 'CNavItem',
        name: 'Loteria | Excluir Concurso',
        icon: 'cil-browser',
        to: '/ExcluirConcurso',
      },
      {
        component: 'CNavItem',
        name: 'Loteria | Enviar Resultado',
        icon: 'cil-browser',
        to: '/EnviarResultado',
      },
      {
        component: 'CNavItem',
        name: 'Loteria | Lista Ganhadore',
        icon: 'cil-browser',
        to: '/modulo3',
      },
      {
        component: 'CNavItem',
        name: 'Loteria | Sobrepor Resultados',
        icon: 'cil-browser',
        to: '/Modulo4',
      },
      {
        component: 'CNavItem',
        name: 'Bichão | Aprovar Premiações',
        icon: 'cil-browser',
        to: '/AprovarPremioBichao',
      },
      {
        component: 'CNavItem',
        name: 'Bichão | Lista Ganhadores',
        icon: 'cil-browser',
        to: '/GanhadoresBichao',
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
