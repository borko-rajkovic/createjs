export default [
  {
    path: '/game-sample1',
    component: () => import('pages/gameSample1')
  },
  {
    path: '/ninja-jump',
    component: () => import('pages/ninjaJump')
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
