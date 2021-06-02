// Program to know about your surrounding locations, Universities, Hospitals, Railway Stations, Malls and Shopping Centers, Airports

const {gettabledetails, getdist}=require("./driver");
const puppeteer = require("puppeteer");
const location = "Nirwna Greens 4 , Nirwana, Mohali";
let detailsOF = ["Chandigarh University", "Hotels", "Hospitals ", "Shopping Centers", "Restaurants", "Bus stand", "PVR",];
(async function () {
    try {

        let browser = await puppeteer.launch({
            defaultViewport: null,
            headless: false,
            args: ["--start-maximized"]
        })

        console.log(`Below you wil find the data regarding public amenities near your desired location: ${location}`);
        let tab = await browser.newPage();
        await tab.goto("https://www.google.com/maps");
        await tab.waitForNavigation({ visible: true });
        await tab.type("#searchboxinput", location, { delay: 100 });
        await tab.keyboard.press("Enter");
        await tab.waitForNavigation({ visible: true, waitUntil: "networkidle0" });
        await tab.waitForSelector("div[data-value='Nearby']");

        let dist1=await getdist(tab, "Airport");

        console.log(`
         Distance from your location to Airport is ${dist1}
        `);

        let dist2=await getdist(tab, "Railway Station");
        
        console.log(`
         Distance from your location to Railway Station is ${dist2}
        `);

        await tab.waitForSelector("div[data-value='Nearby']");
        await tab.click("button[data-value='Nearby']");
        await tab.waitForNavigation({ visible: true, waitUntil: "networkidle0" });
        for (let i = 0; i <= detailsOF.length; i++) {
            if (i == 0) {
                let detailsarr = await gettabledetails(tab, detailsOF[i]);
            } else if (i == detailsOF.length) { }
            else {
                console.log(`Details of (top 5) ${detailsOF[i - 1]} are below:`);
                let detailsarr = await gettabledetails(tab, detailsOF[i]);
                console.table(detailsarr);
            }
        }
        await tab.waitForTimeout();
        await browser.close();
    } catch (err) {
        console.log(err);
    }
})();