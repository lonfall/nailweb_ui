import Vue from 'vue'
import Router from 'vue-router'
import axiox from '../axios/http'
// import HelloWorld from '@/components/HelloWorld'

const _import = path => require('@/components/' + path + '.vue').default

Vue.use(Router)

const originalPush = Router.prototype.push

Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'hash',
  routes: []
})

var noFind = {
  path: '/404',
  name: '404',
  component: _import('common/404'),
  meta: {
    title: '404',
    unrequireAuth: true
  }
}

var login = {
  path: '/login',
  name: 'login',
  component: _import('common/login'),
  meta: {
    title: '登录',
    unrequireAuth: true
  }
}

var main = {
  path: '/',
  name: 'main',
  redirect: '/home',
  component: _import('layout/main'),
  meta: {
    title: '首页'
  },
  children: []
}

router.addRoutes([login, noFind])

var isUserMenuTouterLoad = false // 是否加载用户菜单路由

router.beforeEach((to, from, next) => {
  // 判断当前路由是否不需要授权
  if (to.meta.unrequireAuth) {
    // 如果不需要授权则执行下一个钩子
    next()
  } else {
    // 如果需要授权则获取token
    if (router.app.$cookies.isKey('token')) {
      if (isUserMenuTouterLoad) {
        // 如果路由加载完毕则执行下一个钩子
        next()
      } else {
        axiox
          .get('/sys/menu/tree')
          .then(response => {
            if (response.data.code === 200) {
              var treeData = response.data.data
              console.log('menu tree get')
              initUserMenuTouter(treeData)
              router.addRoutes([
                main,
                {
                  path: '*',
                  redirect: '/404'
                }
              ])
              isUserMenuTouterLoad = true
              next({ ...to, replace: true })
            } else if (response.data.msg) {
              console.log('menu tree fail')
              next(false)
            }
          })
          .catch(error => {
            console.log('error:' + error)
            next(error)
          })
      }
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
})

/**
 * 初始化用户菜单路由
 * @param {*} treeData
 */
function initUserMenuTouter (treeData) {
  if (treeData) {
    for (var i = 0; i < treeData.length; i++) {
      var node = treeData[i]
      if (node.data.type === 1) {
        // 是菜单则添加路由
        main.children.push({
          path: node.data.url,
          component: _import('view' + node.data.url),
          meta: {
            title: node.data.name
          }
        })
      } else if (
        node.data.type === 0 &&
        node.hasChildren &&
        node.children &&
        node.children.length
      ) {
        // 是目录且子菜单不为空，则回调
        initUserMenuTouter(node.children)
      }
    }
  }
}

export default router
