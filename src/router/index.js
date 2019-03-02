import Vue from 'vue'
import Router from 'vue-router'
/*
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Search from 'components/search/search'
import Singer from 'components/singer/singer2'
import SingerDetail from 'components/singer-detail/singer-detail2'
import Disc from 'components/disc/disc'
import TopList from 'components/top-list/top-list'
import User from 'components/user-center/user-center'
*/

Vue.use(Router)

//路由的懒加载 webpack的import()
const Rank = (resolve) => {
  import('components/rank/rank').then((rank) => {
    resolve(rank)
  })
}

const Recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((search) => {
    resolve(search)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer2').then((singer) => {
    resolve(singer)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail2').then((singerDetail) => {
    resolve(singerDetail)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((disc) => {
    resolve(disc)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then((topList) => {
    resolve(topList)
  })
}

const User = (resolve) => {
  import('components/user-center/user-center').then((userCenter) => {
    resolve(userCenter)
  })
}


export default new Router({
  routes: [
    {
    	path: '/',
    	redirect: '/recommend'
    },
    {
    	path: '/rank',
    	component: Rank,
      children: [
        {
    	    path:':id',
          component: TopList
        }
      ]
    },
    {
    	path: '/recommend',
    	component: Recommend,
      children:[
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
    	path: '/search',
    	component: Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
    	path: '/singer',
    	component: Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        },
      ]
    },
    {
      path:'/user',
      component: User
    }
  ]
})
