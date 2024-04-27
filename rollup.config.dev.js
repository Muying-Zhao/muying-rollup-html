const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const babel = require('@rollup/plugin-babel')
const json = require('@rollup/plugin-json')

const path = require('path')

const inputPath = path.resolve(__dirname, './src/index.js')
const outputUmdPath = path.resolve(__dirname, './dist/muying-rollupvue.js')
const outputCjsPath = path.resolve(__dirname, './dist/muying-rollupvue.cjs.js')
const outputEsPath = path.resolve(__dirname, './dist/muying-rollupvue.es.js')


module.exports = {
    input: inputPath,
    output: [
        {
            file: outputUmdPath,
            format: 'umd',
            name: 'roolupVue'
        },
        {
            file: outputCjsPath,
            format: 'cjs'
        },
        {
            file: outputEsPath,
            format: 'es',
        }
    ],
    plugins: [
        resolve(), //resolve插件帮助Rollup查找并解析node_modules中的模块
        commonjs(),
        babel({
            exclude: 'node_modules/**'// 哪些模块不进行babel编译
        }),
        json()
    ],
    external:[
        'vue'
    ]
}
