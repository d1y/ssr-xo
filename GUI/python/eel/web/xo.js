/*
** create by @d1y in 2019-12-23
*/

;(async ()=> {
  window.changeTile = (newTitle)=> {
    document.title = newTitle
  }
  let vue
  const init = ()=> {
    const { name, github, el, color } = window.config
    changeTile(name)
    vue = new Vue({
      el,
      data: {
        logo: `./draw/xo.gif`,
        name,
        color,
        left: './draw/miku.gif',
        right: './draw/233.gif'
      },
      methods: {
        
      },
    })
  }

  init()
})()