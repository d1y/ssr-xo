export const menuLists = [
  {
    icon: 'setting',
    text: '设置',
    path: '/',
  },
  {
    icon: 'sliders',
    text: '代理',
    path: '/proxy',
  },
  {
    icon: 'api',
    text: '日志',
    path: '/log',
  },
  {
    icon: 'alert',
    text: '使用说明',
    path: '/help',
  },
  {
    icon: 'github',
    text: '致谢',
    path: '/thanks'
  }
]

export const fetchMenu = (path: string): string=> {
  let result: number = 0
  menuLists.forEach((item, index)=> {
    if (item.path === path) {
      result = index
    }
  })
  return `${ result }`
}

export default {
  menuLists,
  fetchMenu
}