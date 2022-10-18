import { botInit } from "./bot";





async function main() {
  try {
    await botInit().launch()
  } catch (err) {
    console.error(err)
  }
}

main().then(() => console.log("bot started successfully"));