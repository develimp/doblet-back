/// <reference types="jest" />

import {Response} from '@loopback/rest';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {Family, Member} from '../src/models';
import {FamilyRepository, MemberRepository} from '../src/repositories';
import {MemberController} from '../src/controllers/member.controller';
import {PdfService} from '../src/services/pdf.service';

const pdfEndpoints: Array<{
  method:
    | 'generateAdherencePdf'
    | 'generateAuthorizationPdf'
    | 'generatePartnerPdf';
  template: string;
  filename: string;
}> = [
  {
    method: 'generateAdherencePdf',
    template: 'adherence-document.hbs',
    filename: 'adherence-document.pdf',
  },
  {
    method: 'generateAuthorizationPdf',
    template: 'minors-authorization.hbs',
    filename: 'minors-authorization.pdf',
  },
  {
    method: 'generatePartnerPdf',
    template: 'partner-document.hbs',
    filename: 'partner-document.pdf',
  },
];

describe('MemberController (custom operations)', () => {
  let controller: MemberController;
  let memberRepository: jest.Mocked<
    Pick<MemberRepository, 'findById' | 'updateById'>
  >;
  let familyRepository: jest.Mocked<Pick<FamilyRepository, 'create'>>;
  let dataSource: SpDataSource;
  let execute: jest.Mock;
  let pdfService: jest.Mocked<Pick<PdfService, 'renderPdf'>>;

  beforeEach(() => {
    memberRepository = {
      findById: jest.fn(),
      updateById: jest.fn(),
    };
    familyRepository = {
      create: jest.fn(),
    };
    execute = jest.fn();
    dataSource = {execute} as unknown as SpDataSource;
    pdfService = {
      renderPdf: jest.fn(),
    };

    controller = new MemberController(
      memberRepository as unknown as MemberRepository,
      familyRepository as unknown as FamilyRepository,
      dataSource,
      pdfService as unknown as PdfService,
    );
  });

  it('creates a new family with no discount and moves the member into it', async () => {
    const memberId = 42;
    const newFamilyId = 73;
    memberRepository.findById.mockResolvedValue({id: memberId} as Member);
    familyRepository.create.mockResolvedValue({
      id: newFamilyId,
      discount: 0,
    } as Family);

    await controller.leaveFamily(memberId);

    expect(memberRepository.findById).toHaveBeenCalledWith(memberId);
    expect(familyRepository.create).toHaveBeenCalledWith({discount: 0});
    expect(memberRepository.updateById).toHaveBeenCalledWith(memberId, {
      familyFk: newFamilyId,
    });
  });

  it('calls the stored procedure with the supplied date and note and returns its result', async () => {
    const body = {date: '2026-10-12', note: 'Pagament domiciliat'};
    const procedureResult = [{affectedRows: 2}];
    execute.mockResolvedValue(procedureResult);

    await expect(controller.registerAllDirectDebitPayments(body)).resolves.toBe(
      procedureResult,
    );
    expect(execute).toHaveBeenCalledWith(
      'CALL registerAllDirectDebitPayments(?, ?)',
      [body.date, body.note],
    );
  });

  it.each(pdfEndpoints)(
    'renders and returns the $filename document',
    async ({method, template, filename}) => {
      const pdf = Buffer.from('pdf content');
      pdfService.renderPdf.mockResolvedValue(pdf);
      const response = {
        setHeader: jest.fn(),
        end: jest.fn(),
      } as unknown as Response;

      await controller[method](response);

      expect(pdfService.renderPdf).toHaveBeenCalledWith(template, {});
      expect(response.setHeader).toHaveBeenNthCalledWith(
        1,
        'Content-Type',
        'application/pdf',
      );
      expect(response.setHeader).toHaveBeenNthCalledWith(
        2,
        'Content-Disposition',
        `inline; filename="${filename}"`,
      );
      expect(response.end).toHaveBeenCalledWith(pdf);
    },
  );
});
