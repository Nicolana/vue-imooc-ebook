export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY_LIST = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Monsterrat' },
  { font: 'Tangerine' }
]

export function themeList (vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          color: '#4c5059',
          background: '#fcfcfc'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeGray'),
      name: 'Gray',
      style: {
        body: {
          color: '#4c5059',
          background: '#cecece'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          color: '#5c5b56',
          background: '#c6c2b6'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          color: '#404c42',
          background: '#a9c1a9'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          color: '#cecece',
          background: '#000000'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    }
  ]
}

// 利用disabled 实现CSS动态加载
// 对每个CSS文件，仅需加载一次，减少HTTP请求数量，优化使用体验
export function addCss (href) {
  let flag = false // link存在哨兵
  let currentLink = null // 如何link已经存在，记录该节点
  const result = []
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && link.getAttribute('href')) {
      if (link.getAttribute('href') === href) {
        flag = true
        currentLink = link
      } else {
        result.push(link)
      }
    }
  }
  if (!flag) {
    const beforeLinks = getBeforeCss()
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', href)
    link.onload = link.readystatechange = function () {
      // 必须等link加载并渲染完成后才禁用原来的CSS link，页面才不会闪烁
      disableAllCSS(beforeLinks)
    }
    document.getElementsByTagName('head')[0].appendChild(link)
  } else {
    disableAllCSS(result)
    currentLink.removeAttribute('disabled')
  }
}

export function disableAllCSS (links) {
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link) {
      link.setAttribute('disabled', true)
    }
  }
}

export function getBeforeCss () {
  const urls = [
    `${process.env.VUE_APP_RES_URL}/theme/theme_default.css`,
    `${process.env.VUE_APP_RES_URL}/theme/theme_gray.css`,
    `${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`,
    `${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`,
    `${process.env.VUE_APP_RES_URL}/theme/theme_night.css`,
    `${process.env.VUE_APP_RES_URL}/theme/theme_default.css`
  ]
  const result = []
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && urls.indexOf(link.getAttribute('href')) >= 0) {
      result.push(link)
    }
  }
  return result
}

export function flatten (array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
