export default [
  {
    path: '/ninja-river-jump',
    component: () => import('pages/ninjaRiverJump')
  },
  {
    path: '/ninja-ghost-leg',
    component: () => import('pages/ninjaGhostLeg')
  },
  {
    path: '/ninja-lava-jump',
    component: () => import('pages/ninjaLavaJump')
  },
  {
    path: '/game',
    component: () => import('pages/game')
  },
  {
    path: '/snake',
    component: () => import('pages/snake')
  },
  {
    path: '/',
    component: () => import('layouts/default'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
