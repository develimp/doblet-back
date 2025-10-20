import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import fs, {promises as fsAsync} from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import puppeteer from 'puppeteer';
import {BalanceRepository, MemberRepository, MovementRepository} from '../repositories';

@injectable()
export class ReceiptGeneratorService {
  constructor(
    @repository(MemberRepository)
    private memberRepository: MemberRepository,
    @repository(BalanceRepository)
    private balanceRepository: BalanceRepository,
    @repository(MovementRepository)
    private movementRepository: MovementRepository,
  ) { }

  async generateReceiptPDFBuffer(
    memberId: number,
    paymentData: {
      pay_fee: number;
      pay_lottery: number;
      pay_raffle: number;
    },
  ): Promise<Buffer> {
    const member = await this.memberRepository.findById(memberId);
    const balance = await this.balanceRepository.findById(memberId);

    const lastMovement = await this.movementRepository.findOne({
      order: ['id DESC'],
    });

    let invoiceNumber = '';
    if (lastMovement && lastMovement.fallaYearFk && lastMovement.receiptNumber) {
      invoiceNumber = `${lastMovement.fallaYearFk}-${lastMovement.receiptNumber}`;
    }

    const totalPay =
      (paymentData.pay_fee || 0) +
      (paymentData.pay_lottery || 0) +
      (paymentData.pay_raffle || 0);

    let imagePath = path.join(process.cwd(), 'dist', 'templates', 'images', 'escut.png');
    if (!fs.existsSync(imagePath)) {
      const devImagePath = path.join(process.cwd(), 'src', 'templates', 'images', 'escut.png');
      if (fs.existsSync(devImagePath)) {
        imagePath = devImagePath;
      } else {
        imagePath = '';
      }
    }

    let imageBase64 = '';
    if (imagePath) {
      const imageData = await fsAsync.readFile(imagePath);
      imageBase64 = `data:image/png;base64,${imageData.toString('base64')}`;
    }

    const templateData: any = {
      name: `${member.name} ${member.surname}`,
      individualized: 0,
      current_date: new Date().toLocaleDateString('ca-ES'),
      invoice_number: invoiceNumber,
      pay_fee: paymentData.pay_fee.toFixed(2),
      pay_lottery: paymentData.pay_lottery.toFixed(2),
      pay_raffle: paymentData.pay_raffle.toFixed(2),
      assigned_fee: balance.feeAssigned.toFixed(2),
      payed_fee: balance.feePayed.toFixed(2),
      assigned_lottery: balance.lotteryAssigned.toFixed(2),
      payed_lottery: balance.lotteryPayed.toFixed(2),
      assigned_raffle: balance.raffleAssigned.toFixed(2),
      payed_raffle: balance.rafflePayed.toFixed(2),
      fee_debt: (balance.feeAssigned - balance.feePayed).toFixed(2),
      lottery_debt: (balance.lotteryAssigned - balance.lotteryPayed).toFixed(2),
      raffle_debt: (balance.raffleAssigned - balance.rafflePayed).toFixed(2),
      total_pay: totalPay.toFixed(2),
      total_assigned: (balance.feeAssigned + balance.lotteryAssigned + balance.raffleAssigned).toFixed(2),
      total_payed: (balance.feePayed + balance.lotteryPayed + balance.rafflePayed).toFixed(2),
      total_debt:
        (balance.feeAssigned +
          balance.lotteryAssigned +
          balance.raffleAssigned -
          (balance.feePayed + balance.lotteryPayed + balance.rafflePayed)).toFixed(2),
      imageBase64,
    };

    let templatePath = path.join(process.cwd(), 'dist', 'templates', 'receipt.hbs');
    if (!fs.existsSync(templatePath)) {
      const devPath = path.join(process.cwd(), 'src', 'templates', 'receipt.hbs');
      if (fs.existsSync(devPath)) {
        templatePath = devPath;
      } else {
        throw new Error('Template file not found');
      }
    }

    const templateContent = await fsAsync.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    const html = template(templateData);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, {waitUntil: 'networkidle0'});
    const pdfData = await page.pdf({format: 'A4'});
    await browser.close();

    return Buffer.from(pdfData);
  }
}
