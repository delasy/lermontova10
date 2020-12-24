const express = require('express')

const app = express()

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', true)
}

app.use(express.static('public'))
app.listen(process.env.PORT || 8080, process.env.HOST || '0.0.0.0')
