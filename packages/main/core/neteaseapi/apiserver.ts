// import neteaseApi from "NeteaseCloudMusicApi";
//
// const cache = require('NeteaseCloudMusicApi/util/apicache').middleware
// const fileUpload = require('express-fileupload')
// const decode = require('safe-decode-uri-component')
// const express = require('express')
// import type { NextFunction, Request, Response } from 'express'
//
// import apiMap from './apimap'

const neteaseApi = require('NeteaseCloudMusicApi')
export const useNetEaseApiServer = (
  options = {
    port: 12138,
    host: '127.0.0.1',
  }
) => {
  return neteaseApi.serveNcmApi(options)
  // const app = express()
  //
  // app.set('trust proxy', true)
  // // CORS & Preflight request
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   if (req.path !== '/' && !req.path.includes('.')) {
  //     res.set({
  //       'Access-Control-Allow-Credentials': true,
  //       'Access-Control-Allow-Origin': req.headers.origin || '*',
  //       'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
  //       'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
  //       'Content-Type': 'application/json; charset=utf-8',
  //     })
  //   }
  //   req.method === 'OPTIONS' ? res.status(204).end() : next()
  // })
  //
  // // cookie parser
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   req.cookies = {}
  //   //;(req.headers.cookie || '').split(/\s*;\s*/).forEach((pair) => { //  Polynomial regular expression //
  //   ;(req.headers.cookie || '').split(/;\s+|(?<!\s)\s+$/g).forEach((pair) => {
  //     const crack = pair.indexOf('=')
  //     if (crack < 1 || crack == pair.length - 1) return
  //     req.cookies[decode(pair.slice(0, crack)).trim()] = decode(pair.slice(crack + 1)).trim()
  //   })
  //   next()
  // })
  //
  // // body parser
  // app.use(express.json())
  // app.use(express.urlencoded({ extended: false }))
  //
  // app.use(fileUpload())
  //
  // // cache
  // app.use(cache('2 minutes', (req: Request, res: Response) => res.statusCode === 200))
  //
  // Object.entries(apiMap).map(([k, v]) => {
  //   app.use(k, v)
  // })
  // app.use('/env', (req: Request, res: Response) => {
  //   res.send(process.env)
  // })
  // const host = '127.0.0.1'
  // const port = 12138
  //
  // app.server = app.listen(port, host, () => {
  //   console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
  // })
}
