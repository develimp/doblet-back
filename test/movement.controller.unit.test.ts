/// <reference types="jest" />

import {Response} from '@loopback/rest';
import {MovementController} from '../src/controllers/movement.controller';
import {
  BalanceRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
} from '../src/repositories';
import {MailService} from '../src/services/mail.service';
import {ReceiptGeneratorService} from '../src/services/receipt-generator.service';

describe('MovementController (custom operations)', () => {
  let controller: MovementController;
  let receiptGenerator: jest.Mocked<
    Pick<ReceiptGeneratorService, 'generateReceiptPDFBuffer'>
  >;
  let mailService: jest.Mocked<Pick<MailService, 'sendMailWithAttachment'>>;
  let memberRepository: jest.Mocked<Pick<MemberRepository, 'findById'>>;

  beforeEach(() => {
    receiptGenerator = {
      generateReceiptPDFBuffer: jest.fn(),
    };
    mailService = {
      sendMailWithAttachment: jest.fn(),
    };
    memberRepository = {
      findById: jest.fn(),
    };

    controller = new MovementController(
      receiptGenerator as unknown as ReceiptGeneratorService,
      mailService as unknown as MailService,
      {} as MovementRepository,
      memberRepository as unknown as MemberRepository,
      {} as BalanceRepository,
      {} as FallaYearRepository,
    );
  });

  it('returns the generated receipt PDF with download headers', async () => {
    const memberId = 42;
    const paymentData = {pay_fee: 20, pay_lottery: 10, pay_raffle: 5};
    const pdf = Buffer.from('receipt');
    receiptGenerator.generateReceiptPDFBuffer.mockResolvedValue(pdf);
    const response = {
      setHeader: jest.fn(),
      end: jest.fn(),
    } as unknown as Response;

    await controller.generateReceiptPDF(memberId, paymentData, response);

    expect(receiptGenerator.generateReceiptPDFBuffer).toHaveBeenCalledWith(
      memberId,
      paymentData,
    );
    expect(response.setHeader).toHaveBeenNthCalledWith(
      1,
      'Content-Type',
      'application/pdf',
    );
    expect(response.setHeader).toHaveBeenNthCalledWith(
      2,
      'Content-Disposition',
      'inline; filename="receipt.pdf"',
    );
    expect(response.end).toHaveBeenCalledWith(pdf);
  });

  it('emails the generated receipt to the member and returns a confirmation', async () => {
    const memberId = 42;
    const paymentData = {pay_fee: 20, pay_lottery: 10, pay_raffle: 5};
    const pdf = Buffer.from('receipt');
    memberRepository.findById.mockResolvedValue({
      id: memberId,
      email: 'member@example.com',
    } as Awaited<ReturnType<MemberRepository['findById']>>);
    receiptGenerator.generateReceiptPDFBuffer.mockResolvedValue(pdf);

    await expect(
      controller.sendReceiptByEmail(memberId, paymentData),
    ).resolves.toEqual({message: 'Correu enviat correctament'});

    expect(memberRepository.findById).toHaveBeenCalledWith(memberId);
    expect(receiptGenerator.generateReceiptPDFBuffer).toHaveBeenCalledWith(
      memberId,
      paymentData,
    );
    expect(mailService.sendMailWithAttachment).toHaveBeenCalledWith(
      'member@example.com',
      'Rebut de pagament',
      "S'adjunta el rebut corresponent al teu últim pagament.",
      pdf,
    );
  });
});
