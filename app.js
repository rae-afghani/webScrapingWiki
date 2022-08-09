// module that we need: express, puppeteer, cheerio


const express = require('express');
const app = express();

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const path = require('path');

let browser;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

async function getData(url, page){
    try {

        await page.goto(url, {waitUntil : 'load', timeout : 0});
        const html = await page.evaluate( () => document.body.innerHTML) ;
        const $ = cheerio.load(html);

        let title = $("#firstHeading").text();
        let desc = $("#mw-content-text > div.mw-parser-output > p:nth-child(8)").text();
        let img = $("#mw-content-text > div.mw-parser-output > table.infobox.ib-country.vcard > tbody > tr:nth-child(2) > td > div > div:nth-child(1) > div:nth-child(1) > a > img").attr("src");

        return {title, desc, img}

    } catch(error) {
        console.log(error);


    }
}


//setup path

app.get('/results', async function(req, res) {


    browser = await puppeteer.launch({headless : false})

    //open new tab
    const page = await browser.newPage();
    let data = await getData('https://en.wikipedia.org/wiki/Jordan', page);
    console.log(data.title);
    console.log(data.desc);

    res.render('results', {data : data});
    
})



//server
app.listen(3000, () => {
    console.log('the server is running!');
} )



