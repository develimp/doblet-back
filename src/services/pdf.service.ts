import {injectable} from '@loopback/core';
import fsSync from 'fs';
import * as fs from 'fs/promises';
import handlebars from 'handlebars';
import * as path from 'path';
import puppeteer from 'puppeteer';

@injectable()
export class PdfService {
  private resolveTemplatePath(fileName: string): string {
    let templatePath = path.join(
      process.cwd(),
      'dist',
      'templates',
      fileName,
    );

    if (fsSync.existsSync(templatePath)) return templatePath;

    const devPath = path.join(process.cwd(), 'templates', fileName);
    if (fsSync.existsSync(devPath)) return devPath;

    throw new Error(`No s'ha trobat la plantilla ${fileName}`);
  }

  private resolveCssPath(): string {
    let stylesPath = path.join(
      process.cwd(),
      'dist',
      'templates',
      'styles',
      'document.css',
    );

    if (fsSync.existsSync(stylesPath)) return stylesPath;

    const devPath = path.join(
      process.cwd(),
      'templates',
      'styles',
      'document.css',
    );

    if (fsSync.existsSync(devPath)) return devPath;

    throw new Error('No s’ha trobat el fitxer d’estils document.css');
  }

  private async loadImageBase64(filePath: string, mime: string): Promise<string | null> {
    if (!fsSync.existsSync(filePath)) return null;

    const buffer = await fs.readFile(filePath);
    return `data:${mime};base64,${buffer.toString('base64')}`;
  }

  async renderPdf(
    templateName: string,
    data: Record<string, any>,
    options?: {filename?: string},
  ): Promise<Buffer> {
    const templatePath = this.resolveTemplatePath(templateName);
    const cssPath = this.resolveCssPath();

    const [templateContent, cssContent] = await Promise.all([
      fs.readFile(templatePath, 'utf-8'),
      fs.readFile(cssPath, 'utf-8'),
    ]);

    const templateDir = path.dirname(templatePath);
    const imagesDir = path.join(templateDir, 'images');

    const logoPath = path.join(imagesDir, 'escut.png');
    const qrPath = path.join(imagesDir, 'qr.jpg');

    const imageBase64 = await this.loadImageBase64(logoPath, 'image/png');
    const qrBase64 = await this.loadImageBase64(qrPath, 'image/jpeg');

    const template = handlebars.compile(templateContent);

    const html = template({
      ...data,
      imageBase64,
      qrBase64,
    });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.setContent(html, {waitUntil: 'networkidle0'});

    await page.addStyleTag({
      content: cssContent,
    });

    const pdf = await page.pdf({format: 'A4'});

    await browser.close();

    return Buffer.from(pdf);
  }
}
