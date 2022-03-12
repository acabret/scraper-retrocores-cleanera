const scraperObject = {
  url: "https://retrocores.com/?subtopic=community&view=online",
  async scraper(browser, category) {
    let page = await browser.newPage();
    console.log(`Navigating to ${this.url}...`);

    await page.goto(this.url);

    let selectedCategory = await page.$$eval(
      "#WorldOverViewList .WorldList_2 > td:first-child > a, #WorldOverViewList .WorldList_1 > td:first-child > a",
      (links, _category) => {
        // Search for the element that has the matching text
        // links = links.map((a) => a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category ? a : null);
        // let link = links.filter((tx) => tx !== null)[0];
        let link = links.find((tx) => tx.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") === _category);
        return link.href;
      },
      category
    );

    await page.goto(selectedCategory);
    let scrapedData = [];

    async function scrapeCurrentPage() {
      // await page.waitForSelector(".page_inner");

      let urls = await page.$$eval("#WorldOverViewList > tbody > .WorldList_1 > td:first-child a, #WorldOverViewList > tbody > .WorldList_2 > td:first-child a", (links) => {
        // links = links.filter((link) => link.querySelector(".instock.availability > i").textContent !== "In stock");
        links = links.map((el) => el.href);
        return links;
      });

      let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = {};
        let newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj["name"] = await newPage.$eval("table.characterProfileTable_charInfo tr:nth-child(1) > td:nth-child(2)", (td) => td.textContent);
        dataObj["gender"] = await newPage.$eval("table.characterProfileTable_charInfo tr:nth-child(2) > td:nth-child(2)", (td) => td.textContent);
        dataObj["profession"] = await newPage.$eval("table.characterProfileTable_charInfo tr:nth-child(3) > td:nth-child(2)", (td) => td.textContent);
        dataObj["level"] = await newPage.$eval("table.characterProfileTable_charInfo tr:nth-child(4) > td:nth-child(2)", (td) => td.textContent);
        dataObj["guild"] = await newPage.$eval("table.characterProfileTable_charInfo tr:nth-child(5) > td:nth-child(2)", (td) => td.textContent);
        resolve(dataObj);
        await newPage.close();
      });
        

      for (link in urls) {
        let currentPageData = await pagePromise(urls[link]);
        scrapedData.push(currentPageData);
        // console.log(currentPageData);
      }


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
      return scrapedData;
    }
    let data = await scrapeCurrentPage();
    // console.log(data);
    return data;
  },
};

module.exports = scraperObject;
