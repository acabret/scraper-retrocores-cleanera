const scraperObject = {
  url: "https://www.yapo.cl/region_metropolitana/autos?ca=15_s&l=0&w=1&cmn=&st=s",
  async scraper(browser, category) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    await page.goto(this.url);

    // let selectedCategory = await page.$$eval(
    //   "#WorldOverViewList .WorldList_2 > td:first-child > a, #WorldOverViewList .WorldList_1 > td:first-child > a",
    //   (links, _category) => {
    //     // Search for the element that has the matching text
    //     // links = links.map((a) => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
    //     // let link = links.filter((tx) => tx !== null)[0];
    //     let link = links.find((tx) => tx.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category);
    //     return link.href;
    //   },
    //   category
    // );

    // await page.goto(selectedCategory);
    let scrapedData = [];

    async function scrapeCurrentPage() {
      // await page.waitForSelector(".page_inner");

      let urls = await page.$$eval("table.listing_thumbs > tbody > tr.ad.listing_thumbs", (element) => {
        
        const publicacionesAutos = element.map(ele => {

          let dataObj = {};

          dataObj["titulo"] = ele.querySelector("td.thumbs_subject > a").textContent
          dataObj["linkPublicacion"] = ele.querySelector("td.thumbs_subject > a").href
          dataObj["precio"] = ele.querySelector("td.thumbs_subject > span.price").innerText
          dataObj["kilometraje"] = ele.querySelector("td.thumbs_subject > div.icons > div.icons__element:nth-child(2) > span.icons__element-text").textContent
          dataObj["anio"] = ele.querySelector("td.thumbs_subject > div.icons > div.icons__element:nth-child(1) > span.icons__element-text").textContent
          dataObj["transmision"] = ele.querySelector("td.thumbs_subject > div.icons > div.icons__element:nth-child(3) > span.icons__element-text").textContent
          dataObj["fechaPublicacion"] = ele.querySelector("td.listing_thumbs_date").innerText

          return dataObj
        })



        return publicacionesAutos
      });

      // let obtenerInfoAuto = async (link) => {
      //   console.log("algo?:", link);
      //   let dataObj = {};
      //   // let newPage = await browser.newPage();
      //   // await newPage.goto(link);
      //   dataObj["titulo"] = await link.$eval("td.thumbs_subject > a", (a) => a.textContent);
      //   dataObj["linkPublicacion"] = await link.$eval("td.thumbs_subject > a", (a) => a.href);
      //   dataObj["precio"] = await link.$eval("td.thumbs_subject > span.price", (span) => span.textContent);
      //   dataObj["kilometraje"] = await link.$eval("td.thumbs_subject > div.icons > div.icons__element:nth-child(2) > span.icons__element-text", (span) => span.textContent);
      //   dataObj["anio"] = await link.$eval("td.thumbs_subject > div.icons > div.icons__element:nth-child(1) > span.icons__element-text", (span) => span.textContent);
      //   dataObj["transmision"] = await link.$eval("td.thumbs_subject > div.icons > div.icons__element:nth-child(3) > span.icons__element-text", (span) => span.textContent);
      //   dataObj["fechaPublicacion"] = await link.$eval("td.listing_thumbs_date", (td) => td.innerText);

      //   // await new Promise((res, rej) => {
      //   //   setTimeout(() => {
      //   //     res()
      //   //   }, 5000);
      //   // })
      //   return dataObj;

      //   // resolve(dataObj);
      //   // await newPage.close();
      // };
        


      // scrapedData = await Promise.all(urls.map(obtenerInfoAuto))

      // console.log();
      // for (link in urls) {
      //   let currentPageData = await obtenerInfoAuto(urls[link]);
      //   scrapedData.push(currentPageData);
      //   // console.log(currentPageData);
      // }


      // let nextButtonExist = false;
      // try {
      //   const nextButton = await page.$eval(".next > a", (a) => a.textContent);
      //   nextButtonExist = true;
      // } catch (err) {
      //   nextButtonExist = false;
      // }
      // if (nextButtonExist) {
      //   await page.click(".next > a");
      //   return scrapeCurrentPage(); // Call this function recursively
      // }
      await page.close();
      return urls;
    }
    let data = await scrapeCurrentPage();
    // console.log(data);
    return data;
  },
};

module.exports = scraperObject;
