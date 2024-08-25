const puppeteer = require("puppeteer-extra")
const {id,password,experience_level,internship_type,isRemote,minStipend} =require("./secret")
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { DEFAULT_VIEWPORT } = require("puppeteer")
puppeteer.use(StealthPlugin())

const url="https://cuvette.tech/app/student/login"

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

(async () => {
    const browser= await puppeteer.launch({
        headless:false,
        defaultViewport:false
    })
    const page = await browser.newPage();
    await page.goto(url);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    await page.waitForSelector('.basic-input.LoginWithEmail_darkBorder__3htqi',{visible:true})
    await page.type('.basic-input.LoginWithEmail_darkBorder__3htqi',id)
    await page.waitForSelector('[name="password"]',{visible:true})
    await page.type('[name="password"]',password)
    await page.waitForSelector('.Button_button__2Lf63.LoginWithEmail_login__T6YaR',{visible:true})
    await page.click('.Button_button__2Lf63.LoginWithEmail_login__T6YaR')
    await timeout(3000)
    await page.waitForSelector('#userProfileDropDown',{visible:true})
    await page.goto(`https://cuvette.tech/app/student/jobs/internships/filters?sortByMatch=true&experienceLevel=${experience_level}&internshipType=${internship_type}&maxDuration=%5B1%2C12%5D&isRemote=${isRemote}&minStipend=${minStipend}`)
    await page.waitForSelector('.StudentInternshipCard_container__3fPjn')
    const internshipCards = await page.$$('.StudentInternshipCard_container__3fPjn')
    if(internshipCards.length>0){
            const buttons = await page.evaluate(()=> {
                const cards = Array.from(document.querySelectorAll('.StudentInternshipCard_container__3fPjn'));
                return cards.map(card => {
                    try{
                        const button = card.querySelector('.Button_button__2Lf63').click();
                    }
                    catch(error){console.log(error);
                    }
                });
            })    
        }   
    else{
        console.log("No internships present");
    }
    await timeout(5000);
    await browser.close();
})();
// ------Made by Nakul Jain------->