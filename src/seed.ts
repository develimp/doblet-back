import {ApiApplication} from './application';
import {juggler} from '@loopback/repository';

import {
  FamilyRepository,
  MemberRepository,
  DirectDebitRepository,
  BalanceRepository,
  MovementRepository,
  FallaYearRepository,
  LotteryNameRepository,
  LotteryRepository,
  SupplierRepository,
  ClientRepository,
  BudgetItemRepository,
  SubItemRepository,
  BuyRepository,
  SaleRepository,
} from './repositories';

export async function seed(args: string[]) {
  const app = new ApiApplication();
  await app.boot();

  // The schema (tables + triggers + procedures) has already been loaded
  // separately with `npm run db:schema` (see package.json), starting from
  // db/schema.sql. This script ONLY inserts dummy data,
  // relying on the triggers/procedures already existing and
  // functioning as in production.
  await seedData(app);

  console.log('Seed completed successfully.');
  process.exit(0);
}

async function seedData(app: ApiApplication) {
  const familyRepo = await app.getRepository(FamilyRepository);
  const memberRepo = await app.getRepository(MemberRepository);
  const directDebitRepo = await app.getRepository(DirectDebitRepository);
  const balanceRepo = await app.getRepository(BalanceRepository);
  const movementRepo = await app.getRepository(MovementRepository);
  const fallaYearRepo = await app.getRepository(FallaYearRepository);
  const lotteryNameRepo = await app.getRepository(LotteryNameRepository);
  const lotteryRepo = await app.getRepository(LotteryRepository);
  const supplierRepo = await app.getRepository(SupplierRepository);
  const clientRepo = await app.getRepository(ClientRepository);
  const budgetItemRepo = await app.getRepository(BudgetItemRepository);
  const subItemRepo = await app.getRepository(SubItemRepository);
  const buyRepo = await app.getRepository(BuyRepository);
  const saleRepo = await app.getRepository(SaleRepository);

  // Level 0: No Foreign Keys

  // IMPORTANT: The `member_beforeInsert` trigger ALWAYS recalculates
  // categoryFk based on the member's age, via the SQL function
  // calculateMemberCategory(). That function returns FIXED IDs (1 to 5,
  // business logic, not free auto-increment):
  // 1 = adult/senior (18+)     2 = youth (14-17)
  // 3 = cadet (10-13)          4 = child (5-9)
  // 5 = baby (<5)
  // That's why we create the categories with these explicit IDs: if they don't
  // match, any INSERT into member will fail due to a foreign key, regardless
  // of the category foreign key we pass in create().

  const categoriesById: Record<number, {fee: number; name: string; description: string}> = {
    1: {fee: 535, name: 'adult', description: 'major de 18 anys'},
    2: {fee: 375, name: 'cadet', description: 'entre 14 i 17 anys'},
    3: {fee: 220, name: 'jovenil', description: 'entre 10 i 13 anys'},
    4: {fee: 140, name: 'infantil', description: 'entre 5 i 9 anys'},
    5: {fee: 50, name: 'bebe', description: 'menor de 5 anys'},
  };
  const categoryEntities: Record<number, {id: number; fee: number}> = {};
  const dataSource = await app.get<juggler.DataSource>('datasources.sp');
  for (const [idStr, data] of Object.entries(categoriesById)) {
    const id = Number(idStr);
    // We use direct SQL instead of categoryRepo.create() because LoopBack
    // blocks manually assigning `id` to models with generated IDs
    // (forceId: true by default) — correct for the public API, but
    // here we need fixed IDs that match calculateMemberCategory().
    await dataSource.execute(
      'INSERT INTO category (id, fee, name, description) VALUES (?, ?, ?, ?)',
      [id, data.fee, data.name, data.description],
    );
    categoryEntities[id] = {id, fee: data.fee};
  }
  const categoryGeneral = categoryEntities[1]; // We use "adult" as the base seed category

  const family = await familyRepo.create({discount: 10});

  const fallaYear = await fallaYearRepo.create({
    code: 2027,
    created: '2026-03-20',
  });

  const [supplierStark, supplierOscorp] = await Promise.all([
    supplierRepo.create({
      name: 'Stark Industries',
      nif: 'B12345678',
      address: '52 Discovery Drive, Irvine, 92618, California',
      phoneNumber: '2129704133',
      email: 'info@starkindustries.com',
    }),
    supplierRepo.create({
      name: 'Oscorp',
      nif: 'B87654321',
      address: '135 E 57th St, Oscorp Tower, New York, NY 10022',
      phoneNumber: '2139504163',
      email: 'contact@oscorp.com',
    }),
  ]);

  const client = await clientRepo.create({
    name: 'New York City Hall',
    nif: 'P4625000A',
    address: 'City Hall, 1 Centre St, New York, NY 10007',
    phoneNumber: '2126399675',
    email: 'info@newyorkcityhall.com',
  });

  const budgetItemWeapons = await budgetItemRepo.create({
    name: 'Armes',
    description: 'Armes, armadures i munició',
  });

  // Level 1: member (-> family, category)
  const member = await memberRepo.create({
    name: 'Tony',
    surname: 'Stark',
    birthdate: '1970-05-29',
    gender: 'M',
    dni: '12345678A',
    address: 'Star Tower, 10880 Malibu Point, Malibu, CA 90265',
    phoneNumber: '600111222',
    familyFk: family.id,
    categoryFk: categoryGeneral.id,
    email: 'tony.stark@example.com',
    isRegistered: true,
    isAuthorizationSigned: true,
  });

  await memberRepo.create({
    name: 'Morgan',
    surname: 'Stark',
    birthdate: '2019-05-29',
    gender: 'F',
    familyFk: family.id,
    categoryFk: categoryEntities[4].id, // starting value; the trigger will recalculate it according to actual age
    isRegistered: true,
    isAuthorizationSigned: false,
  });

  // Level 2: directDebit (-> member)
  const directDebit = await directDebitRepo.create({
    memberFk: member.id,
    accountNumber: 'ES1234567890123456789012',
    calculatedAmount: 120.5,
    actualAmount: 120.5,
  });

  // We close the member <-> directDebit cycle
  await memberRepo.updateById(member.id, {directDebitFk: directDebit.id});

  // balance: NOT inserted directly

  // The member addition trigger has already created the `balance` row for
  // `member` when `memberRepo.create()` was called above.
  // From here on, each `movement` we insert will fire the corresponding
  // trigger and automatically update that row.
  //
  // Domain name convention:
  //   idType:    1 = assignment, 2 = payment
  //   idConcept: 1 = fee, 2 = lottery, 3 = raffle

  // Fee assignment: We did NOT insert it. `insertBalance` already
  // automatically assigned `feeAssigned = category.fee` (adjusted by the
  // actual family discount, calculated by `updateFamilyDiscount` based on
  // how many family members were already registered at THAT moment)
  // as soon as the member was registered, within the member_afterInsert event itself.
  // If we were to insert another transaction here with idType=1/idConcept=1, we would duplicate
  // that initial assignment.

  // Payment of the fee (this is a real and additive transaction)
  await movementRepo.create({
    transactionDate: '2027-02-01',
    amount: 109,
    idType: 2,
    idConcept: 1,
    fallaYearFk: fallaYear.code,
    memberFk: member.id,
    description: 'pagat en caixa',
  });

  // Lottery assignment and payment
  await movementRepo.create({
    transactionDate: '2026-12-15',
    amount: 63,
    idType: 1,
    idConcept: 2,
    fallaYearFk: fallaYear.code,
    memberFk: member.id,
    description: 'assignació nadal 2026',
  });

  await movementRepo.create({
    transactionDate: '2026-12-15',
    amount: 11,
    idType: 2,
    idConcept: 1,
    fallaYearFk: fallaYear.code,
    memberFk: member.id,
    description: 'benefici nadal 2026',
  });

  await movementRepo.create({
    transactionDate: '2027-02-10',
    amount: 63,
    idType: 2,
    idConcept: 2,
    fallaYearFk: fallaYear.code,
    memberFk: member.id,
    description: 'pagat en caixa',
  });

  // Raffle allocation WITHOUT payment (to have a case with a difference > 0
  // and be able to test the `difference` calculation in summaryMembersFallaYear
  // or any delinquency logic)
  await movementRepo.create({
    transactionDate: '2026-05-15',
    amount: 10,
    idType: 1,
    idConcept: 3,
    fallaYearFk: fallaYear.code,
    memberFk: member.id,
    description: 'rifes',
  });

  // Level 2: lotteryName (-> fallaYear)
  const lotteryName = await lotteryNameRepo.create({
    description: 'nadal',
    fallaYearFk: fallaYear.code,
  });

  // Level 3: lottery (-> lotteryName, member)
  // NOTE: Price and benefit are VIRTUAL/GENERATED columns in MariaDB,
  // they are not inserted (MariaDB calculates them). We do not include them in the create() function.
  await lotteryRepo.create({
    lotteryId: 45568,
    assigned: '2026-12-15',
    memberFk: member.id,
    ticketsMale: 5,
    ticketsFemale: 3,
    ticketsChildish: 0,
    tenthsMale: 1,
    tenthsFemale: 0,
    tenthsChildish: 0,
    isAssigned: true,
    lotteryNameFk: lotteryName.id,
  });

  // Level 1: subItem (-> budgetItem)
  const subItemIronman = await subItemRepo.create({
    budgetItemFk: budgetItemWeapons.id,
    name: 'armadura Ironman',
    description: 'Ironman Mark II',
  });

  // Level 2: buy (-> subItem, supplier, fallaYear)
  await buyRepo.create({
    subItemFk: subItemIronman.id,
    supplierFk: supplierStark.id,
    amount: 350,
    payMethod: 'banc',
    ticketReference: 'FRA-2026-001',
    buyed: '2027-02-01',
    created: '2027-02-01',
    description: 'reactor Arc per a Ironman',
    fallaYearFk: fallaYear.code,
  });

  await buyRepo.create({
    subItemFk: subItemIronman.id,
    supplierFk: supplierOscorp.id,
    amount: 800,
    payMethod: 'efectiu',
    ticketReference: 'FRA-2026-002',
    buyed: '2027-03-10',
    created: '2027-03-10',
    description: 'aliatge de titani per a armadura Ironman',
    fallaYearFk: fallaYear.code,
  });

  // Level 2: sale (-> subItem, client, fallaYear)
  await saleRepo.create({
    subItemFk: subItemIronman.id,
    clientFk: client.id,
    amount: 100,
    payMethod: 'banc',
    ticketReference: 'VTA-2026-001',
    sold: '2027-03-01',
    created: '2027-03-01',
    description: 'publicitat llibret',
    fallaYearFk: fallaYear.code,
  });
}

seed(process.argv).catch(err => {
  console.error('Cannot seed database', err);
  process.exit(1);
});