import { addValueChangeListener, getValue, setValue } from "../storage/index"

function showVisitCount(visitCount: string) {
  const div = document.createElement("div")
  div.innerHTML = String(visitCount)
  div.setAttribute(
    "style",
    "display: block; position: absolute; top: 50px; right: 50px; background-color: yellow; z-index: 100000;"
  )
  document.body.append(div)
}

async function main() {
  if (!document.body) {
    return
  }

  const visitCount = (await getValue("visitCount")) || "1"
  let visitCountInt = Number.parseInt(visitCount, 10)
  showVisitCount(String(++visitCountInt))
  await setValue("visitCount", visitCountInt)

  addValueChangeListener("visitCount", async () => {
    const visitCount = (await getValue("visitCount")) || "1"
    showVisitCount(visitCount)
  })
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
main()
