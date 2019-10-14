import Vue from 'vue'
import Router from 'vue-router'
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

var noFind = [
  {
    path: '/404',
    name: '404',
    component: _import('common/404'),
    meta: {
      title: '404',
      unrequireAuth: true
    }
  },
  {
    path: '*',
    redirect: '/404'
  }
]

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
  children: [
    {
      path: '/home',
      name: 'home',
      component: _import('view/home'),
      meta: {
        title: '首页'
      }
    }
  ]
}

main.children.push({
  path: '/user',
  name: 'user',
  component: _import('view/sys/user'),
  meta: {
    title: '用户管理'
  }
})

main.children.push({
  path: '/role',
  name: 'role',
  component: _import('view/sys/role'),
  meta: {
    title: '角色管理'
  }
})

main.children.push({
  path: '/menu',
  name: 'menu',
  component: _import('view/sys/menu'),
  meta: {
    title: '菜单管理'
  }
})

router.addRoutes([main, login])

router.addRoutes(noFind)

router.beforeEach((to, from, next) => {
  // 判断当前路由是否不需要授权
  if (to.meta.unrequireAuth) {
    // 如果不需要授权则执行下一个钩子
    next()
  } else {
    // 如果需要授权则获取token
    if (router.app.$cookies.isKey('token')) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
})

export default router
