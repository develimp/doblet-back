/// <reference types="jest" />

import {TokenService, UserService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {compare} from 'bcryptjs';
import {SpDataSource} from '../src/datasources/sp.datasource';
import {Member, User} from '../src/models';
import {LoginRequest} from '../src/models/login-request.model';
import {SignupRequest} from '../src/models/signup-request.model';
import {
  FamilyRepository,
  FallaYearRepository,
  MemberRepository,
  MovementRepository,
  UserCredentialsRepository,
  UserRepository,
} from '../src/repositories';
import {UserController} from '../src/controllers/user.controller';
import {MyUserService} from '../src/services/my-user-service';

describe('User signup and login (integration)', () => {
  let dataSource: SpDataSource;
  let userController: UserController;
  let userRepository: UserRepository;
  let userCredentialsRepository: UserCredentialsRepository;
  let memberRepository: MemberRepository;
  let createdUserId: number | undefined;
  let signupEmail: string;

  beforeAll(() => {
    dataSource = new SpDataSource();

    let familyRepository: FamilyRepository;
    let fallaYearRepository: FallaYearRepository;
    let memberRepositoryInstance: MemberRepository;
    let movementRepository: MovementRepository;

    const familyGetter = async () => familyRepository;
    const fallaYearGetter = async () => fallaYearRepository;
    const memberGetter = async () => memberRepositoryInstance;
    const movementGetter = async () => movementRepository;

    memberRepositoryInstance = new MemberRepository(
      dataSource,
      movementGetter,
      familyGetter,
    );
    familyRepository = new FamilyRepository(dataSource, memberGetter);
    movementRepository = new MovementRepository(
      dataSource,
      memberGetter,
      fallaYearGetter,
    );
    fallaYearRepository = new FallaYearRepository(dataSource, movementGetter);
    memberRepository = memberRepositoryInstance;
    userRepository = new UserRepository(dataSource, memberGetter);
    userCredentialsRepository = new UserCredentialsRepository(dataSource);

    const userService = new MyUserService(
      userRepository,
      userCredentialsRepository,
    );
    const tokenService: Pick<TokenService, 'generateToken'> = {
      generateToken: jest.fn().mockResolvedValue('integration-test-token'),
    };
    userController = new UserController(
      userRepository,
      userCredentialsRepository,
      tokenService as TokenService,
      userService as UserService<User, LoginRequest>,
    );
  });

  beforeEach(() => {
    const uniqueSuffix = Math.random().toString(36).slice(2, 8);
    signupEmail = `u${Date.now().toString(36)}${uniqueSuffix}@t.test`;
    createdUserId = undefined;
  });

  afterEach(async () => {
    if (createdUserId !== undefined) {
      await userCredentialsRepository.deleteAll({userFk: createdUserId});
      await userRepository.deleteById(createdUserId);
    }
  });

  afterAll(async () => {
    await dataSource.stop();
  });

  it('creates a user with a hashed password, rejects duplicate email, and logs in', async () => {
    const password = 'integration-test-password';
    const signupRequest = {email: signupEmail, password} as SignupRequest;

    const createdUser = await userController.signUp(signupRequest);
    createdUserId = createdUser.id;

    const storedCredentials = await userCredentialsRepository.findOne({
      where: {userFk: createdUser.id},
    });

    expect(createdUser.email).toBe(signupEmail);
    expect(storedCredentials).toBeDefined();
    expect(storedCredentials!.password).not.toBe(password);
    await expect(compare(password, storedCredentials!.password)).resolves.toBe(
      true,
    );

    await expect(userController.signUp(signupRequest)).rejects.toMatchObject({
      statusCode: 400,
      message: 'Email already exists',
    });
    expect(
      await userRepository.find({where: {email: signupEmail}}),
    ).toHaveLength(1);

    await expect(
      userController.login({email: signupEmail, password} as LoginRequest),
    ).resolves.toEqual({token: 'integration-test-token'});
    await expect(
      userController.login({
        email: signupEmail,
        password: 'incorrect-password',
      } as LoginRequest),
    ).rejects.toMatchObject({statusCode: 401});
  });

  it('returns the authenticated user and associated member from whoami', async () => {
    const member = await memberRepository.findOne();
    if (!member) {
      throw new Error('The test database must contain a seeded member');
    }

    const existingUser = await userRepository.findOne({
      where: {id: member.id},
    });
    const email = existingUser?.email ?? signupEmail;
    if (!existingUser) {
      await dataSource.execute('INSERT INTO `user` (id, email) VALUES (?, ?)', [
        member.id,
        email,
      ]);
      createdUserId = member.id;
    }

    const profile = {
      [securityId]: String(member.id),
      name: email,
    } as UserProfile;

    await expect(userController.whoAmI(profile)).resolves.toEqual({
      id: member.id,
      email,
      name: member.name,
    });
  });
});
