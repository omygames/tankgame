// @ts-check
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import logger from 'morgan'

const app = express()

app.use(logger('dev'))
app.use(express.json())

app.use(express.static(path.resolve(__dirname, '../../client/dist')))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

export default app
