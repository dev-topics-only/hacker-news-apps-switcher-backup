import styleText from "data-text:./style.scss"

import { addValueChangeListener, getValue, setValue } from "../storage/index"
import { $, $$, createElement } from "../utils/index"

const apps = [
  "https://news.ycombinator.com/item?id=1234",
  "https://insin.github.io/react-hn/#/story/1234",
  "https://hn.svelte.dev/item/1234",
  "https://hn.premii.com/#/comments/1234",
  "https://hackernewsmobile.com/#/comments/1234",
  "https://hackerweb.app/#/item/1234",
  "https://lotusreader.netlify.app/item/1234",
  "https://hacker-news.news/post/1234",
  "https://whnex.com/items/1234",
  "https://hack.ernews.info/comments-for/1234",
  // eslint-disable-next-line no-script-url
  "javascript:;",
]

const getStyle = () => {
  const style = createElement("style")
  style.id = "hnas_style"
  style.textContent = styleText
  document.head.append(style)
}

let tooltip = null
function toSiteName(url) {
  return /\/([^/]+)\//.exec(url)[1]
}

const handler = (event) => {
  let target = event.target
  const tooltip = $(".hnas_tooltip")
  if (tooltip) {
    while (target !== tooltip && target) {
      target = target.parentNode
    }

    if (target === tooltip) {
      event.preventDefault()
      return
    }

    tooltip.style.display = "none"
  }

  document.removeEventListener("click", handler)
}

function displayTooltip(id: string, wrapper) {
  if (!tooltip) {
    tooltip = createElement("div")
    tooltip.setAttribute("class", "hnas_tooltip")
    tooltip.style.display = "none"

    const ul = createElement("ul")
    for (const app of apps) {
      const li = createElement("li")
      const link = createElement("a")
      link.href = app
      link.isSwnaLink = true
      if (app.startsWith("javascript")) {
        link.innerHTML = "close"
      } else {
        link.setAttribute("target", "_blank")
        link.innerHTML = toSiteName(app)
      }

      link.addEventListener("click", (event) => {
        const tooltip = $(".hnas_tooltip")
        if (tooltip) {
          tooltip.style.display = "none"
        }

        document.removeEventListener("click", handler)
      })

      li.append(link)
      ul.append(li)
    }

    tooltip.append(ul)
  }

  if (tooltip.style.display === "block" && tooltip.parentNode === wrapper) {
    return
  }

  for (const link of tooltip.querySelectorAll("ul li a")) {
    link.href = link.href.replace(/\d+/, id)
  }

  const width = wrapper.clientWidth
  const height = wrapper.clientHeight
  tooltip.style.display = "block"
  tooltip.style.top = height + "px"
  tooltip.style.width = width + "px"
  wrapper.append(tooltip)

  document.removeEventListener("click", handler)
  setTimeout(() => {
    document.addEventListener("click", handler)
  }, 100)
}

function updateLinks() {
  const links = $$(
    'a[href^="https://news.ycombinator.com/item?id="],a[href^="http://news.ycombinator.com/item?id="]'
  )
  for (const link of links) {
    if (link.binded || link.isSwnaLink) {
      continue
    }

    link.binded = true

    const wrapper = createElement("span")
    wrapper.setAttribute("class", "hnas_wrapper")
    link.after(wrapper)
    wrapper.append(link)

    const id = /id=(\d+)/.exec(link.href)[1]
    console.log(id)
    if (id) {
      link.addEventListener(
        "click",
        (event) => {
          event.preventDefault()
          displayTooltip(id, wrapper)
        },
        false
      )
    }
  }
}

async function main() {
  if (!document.body) {
    return
  }

  getStyle()

  setInterval(updateLinks, 1000)
  updateLinks()
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
