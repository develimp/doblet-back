/// <reference types="jest" />

import {Credentials} from '@loopback/authentication-jwt';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {User, UserCredentials} from '../src/models';
import {UserCredentialsRepository, UserRepository} from '../src/repositories';
import {MyUserService} from '../src/services/my-user-service';

describe('MyUserService (unit)', () => {
  let service: MyUserService;
  let userRepository: jest.Mocked<Pick<UserRepository, 'findOne' | 'findById'>>;
  let credentialsRepository: jest.Mocked<
    Pick<UserCredentialsRepository, 'findOne'>
  >;

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn(),
      findById: jest.fn(),
    };
    credentialsRepository = {
      findOne: jest.fn(),
    };

    service = new MyUserService(
      userRepository as unknown as UserRepository,
      credentialsRepository as unknown as UserCredentialsRepository,
    );
  });

  it('rejects an email that does not exist', async () => {
    userRepository.findOne.mockResolvedValue(null);

    await expect(
      service.verifyCredentials({
        email: 'missing@example.test',
        password: 'password',
      } as Credentials),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password.',
    });
    expect(credentialsRepository.findOne).not.toHaveBeenCalled();
  });

  it('rejects a user without stored credentials', async () => {
    userRepository.findOne.mockResolvedValue({id: 17} as User);
    credentialsRepository.findOne.mockResolvedValue(null);

    await expect(
      service.verifyCredentials({
        email: 'user@example.test',
        password: 'password',
      } as Credentials),
    ).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password.',
    });
    expect(credentialsRepository.findOne).toHaveBeenCalledWith({
      where: {userFk: 17},
    });
  });

  it('rejects a password that does not match the stored hash', async () => {
    userRepository.findOne.mockResolvedValue({id: 17} as User);
    credentialsRepository.findOne.mockResolvedValue(
      new UserCredentials({
        password: '$2a$10$invalid-hash',
        userFk: 17,
      }),
    );

    await expect(
      service.verifyCredentials({
        email: 'user@example.test',
        password: 'wrong-password',
      } as Credentials),
    ).rejects.toBeInstanceOf(HttpErrors.Unauthorized);
  });

  it('converts a user to the expected authentication profile', () => {
    const user = {id: 17, email: 'user@example.test'} as User;

    expect(service.convertToUserProfile(user)).toEqual({
      [securityId]: '17',
      name: 'user@example.test',
    });
  });

  it('looks up a user by ID', async () => {
    const user = {id: 17, email: 'user@example.test'} as User;
    userRepository.findById.mockResolvedValue(user);

    await expect(service.findUserById(17)).resolves.toBe(user);
    expect(userRepository.findById).toHaveBeenCalledWith(17);
  });
});
