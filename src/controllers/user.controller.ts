import {
  TokenService,
  UserService,
  authenticate,
} from '@loopback/authentication';
import {
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  HttpErrors,
  get,
  getModelSchemaRef,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
import {hash} from 'bcryptjs';

import {User, UserCredentials} from '../models';
import {LoginRequest} from '../models/login-request.model';
import {SignupRequest} from '../models/signup-request.model';
import {UserCredentialsRepository, UserRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, LoginRequest>,
  ) {}

  @authenticate('jwt')
  @post('/signup', {
    responses: {
      '200': {
        description: 'User signup',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SignupRequest),
        },
      },
    })
    newUserRequest: SignupRequest,
  ): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {email: newUserRequest.email},
    });
    if (foundUser) {
      throw new HttpErrors.BadRequest('Email already exists');
    }

    const savedUser = await this.userRepository.create({
      email: newUserRequest.email,
    });

    const hashedPassword = await hash(newUserRequest.password, 10);

    const userCredentials = new UserCredentials({
      password: hashedPassword,
      userFk: savedUser.id,
    });
    await this.userCredentialsRepository.create(userCredentials);

    return savedUser;
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRequest),
        },
      },
    })
    credentials: LoginRequest,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.tokenService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoami', {
    responses: {
      '200': {
        description: 'Current user profile',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                id: {type: 'number'},
                email: {type: 'string'},
              },
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<{id: number; email: string}> {
    const user = await this.userRepository.findById(
      Number(currentUserProfile[securityId]),
    );
    return {id: user.id!, email: user.email};
  }
}
