const { now } = require('lodash');
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
	const page = await browser.newPage();
	await page.goto('http://localhost:9001/');
	await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: 'C:\\Projects\\vueWebpackPlayground\\frames'})
	setTimeout(async () => {
		// console.log(page);
		// await page.evaluate(async () => {
		// 	debugger;
		// });
		await browser.close();
	}, 6000);
})();