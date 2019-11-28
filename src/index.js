/*
 * @Descripttion: node爬虫
 * @Author: Aaron
 * @Date: 2019-11-28-14:13
 */
const originRequest = require('request')
const cheerio = require('cheerio')
const iconv = require('iconv-lite/lib/index')
const fs = require('fs')
const config = require('../config')

function request(url, cb) {
    const options = {
        url: url,
        encoding: null
    }
    originRequest(url,options,cb)
}

let homeCooling = []

// start: 103922498 , end: 104175793
const start = 103922498
const end = 103922598
for(let i= start; i < end;i++ ) {
    const url = `${config.originUrl}${i}/`
    request(url,(err,res,body)=>{
        if(err){
            console.log(err)
            return
        }
        const html = iconv.decode(body, 'utf-8')
        const $ = cheerio.load(html)
        const _title = $('h1.page-title').text() // 菜名
        if(!_title){
            return;
        }
        const _cover = $('.recipe-show .cover img').attr('src') // 图片封面
        const _author = $('.recipe-show .author span').text() // 作者
        const _desc = $('.recipe-show .desc').text() // 描述
         // 用料
        let _material = []
        $('.recipe-show .ings tr').each((idx,ele)=>{
            const _name = $(ele).find('.name').text()
            const _unit = $(ele).find('.unit').text()
            _material.push({
                name: _name,
                unit: _unit
            })
        })
        let _step = [] // 步骤
        $('.recipe-show .steps li.container').each((idx,ele)=>{
            const _txt = $(ele).find('p.text').text()
            const _img = $(ele).find('img').attr('src')
            _step.push({
                txt: _txt,
                img: _img
            })
        })
        const _tip = $('.tip-container .tip').text() // 提示
        homeCooling.push({
            title: _title,
            cover: _cover,
            author: _author,
            desc: _desc,
            material: _material,
            step: _step,
            tip: _tip
        })
        if( i >= end){
            fs.writeFile(config.targetOutput, JSON.stringify(homeCooling), (err) => {
                if(err) throw err
                console.log('写入成功')
            })
        }
    })
}


