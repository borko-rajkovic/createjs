const webpack = require('webpack')
// Configuration for your app

module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: [
      'i18n',
      'axios',
      'quill',
      'lodash',
      'd3',
      'md5',
      'createjs',
      'qs',
      'lzString',
      'qrcode',
      'profile'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      publicPath: '.',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/,
          // loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.module.rules.push({
          test: /node_modules[/\\]createjs/,
          loader: 'imports-loader?this=>window!exports-loader?window.createjs'
        })
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          'vue$': 'vue/dist/vue.esm.js',
          'createjs': 'createjs/builds/1.0.0/createjs.js'
        },
        cfg.plugins.push(               
          new webpack.ProvidePlugin({
            'window.Quill': 'quill'
          })
        )
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QCard',
        'QInput',
        'QCardTitle',
        'QToggle',
        'QField',
        'QTooltip',
        'QPopover',
        'QTabs',
        'QTab',
        'QTabPane',
        'QModal',
        'QSlider',
        'QBtnToggle',
        'QSelect',
        'QStepper',
        'QStep',
        'QStepperNavigation',
        'QCheckbox',
        'QColor',
        'QCardSeparator',
        'QRadio',
        'QLayoutFooter',
        'QTable',
        'QTd',
        'QUploader',
        'QPagination',
        'QDatetime',
        'QKnob'
      ],
      directives: [
        'Ripple'
      ],
      // Quasar plugins
      plugins: [
        'Notify',
        'Loading',
        'Dialog'
      ]
    },
    // animations: 'all' --- includes all animations
    /*
    animations: [
    ],
    */
    animations: 'all',
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack (cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.2'
  }
}
