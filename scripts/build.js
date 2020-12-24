const fs = require('fs')
const path = require('path')
const Babel = require('@babel/core')
const CleanCSS = require('clean-css')
const HTMLMinifier = require('html-minifier')

const minifyCSS = (code) => {
  return new CleanCSS().minify(code).styles || ''
}

const minifyHTML = (code) => {
  return HTMLMinifier.minify(code, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    decodeEntities: true,
    keepClosingSlash: true,
    minifyCSS: true,
    minifyJS: true,
    quoteCharacter: '"',
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true
  })
}

const minifyJS = (code) => {
  const options = {
    plugins: ['@babel/plugin-transform-block-scoping']
  }

  return Babel.transformSync(code, options).code || ''
}

const resolvePath = (pathname) => {
  return pathname.replace('~/', path.join(__dirname, '../'))
}

const rmSync = (src) => {
  if (!fs.existsSync(src)) {
    return
  }

  fs.readdirSync(src).forEach((file) => {
    const curPath = path.join(src, file)

    if (fs.lstatSync(curPath).isDirectory()) {
      rmSync(curPath)
    } else {
      fs.unlinkSync(curPath)
    }
  })

  fs.rmdirSync(src)
}

const main = async () => {
  rmSync(resolvePath('~/build/'))
  fs.mkdirSync(resolvePath('~/build/'))

  const css = fs.readFileSync(resolvePath('~/public/styles.css'), 'utf8')
  const js = fs.readFileSync(resolvePath('~/public/common.js'), 'utf8')
  let html = fs.readFileSync(resolvePath('~/public/index.html'), 'utf8')

  html = html.replace(
    '<link href="/styles.css" rel="stylesheet" />',
    `<style>${minifyCSS(css)}</style>`
  )

  html = html.replace(
    '<script src="/common.js"></script>',
    `<script>${minifyJS(js)}</script>`
  )

  fs.writeFileSync(resolvePath('~/build/index.html'), minifyHTML(html), 'utf8')
}

main()
