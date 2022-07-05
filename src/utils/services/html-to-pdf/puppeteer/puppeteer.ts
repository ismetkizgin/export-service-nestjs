import { HtmlToPdf, HtmlToPdfType } from '../../../../html-to-pdf/dto';
import { IHtmlToPdfService } from '../base/html-to-pdf';
import puppeteer from 'puppeteer';

export class PuppeteerService implements IHtmlToPdfService {
  generatePDFAsync(options: HtmlToPdf): Promise<Buffer> {
    if (options.type == HtmlToPdfType.HTML) return this._htmlToPdf(options);
    else return this._webUrlToPdf(options);
  }

  private async _htmlToPdf(options: HtmlToPdf): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(options.html);
    const buffer = await page.pdf({
      format: options.format,
      printBackground: true,
    });
    await browser.close();
    return buffer;
  }

  private async _webUrlToPdf(options: HtmlToPdf): Promise<Buffer> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(options.url, {
      waitUntil: 'load',
    });
    const buffer = await page.pdf({
      format: options.format,
      printBackground: true,
    });
    await browser.close();
    return buffer;
  }
}
