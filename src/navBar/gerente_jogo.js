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
        to: '/modulo2',
      },
    ],
  },
]
