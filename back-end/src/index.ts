import * as app from './app'
import { config } from './config'

app.start(config).catch((err) => {
  console.error(err)
  process.exit(1)
})
