import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {GalleryAlbum} from '../models';
import {GalleryAlbumRepository} from '../repositories';

export class GalleryAlbumController {
  constructor(
    @repository(GalleryAlbumRepository)
    public galleryAlbumRepository : GalleryAlbumRepository,
  ) {}

  @authenticate('jwt')
  @post('/gallery-albums')
  @response(200, {
    description: 'GalleryAlbum model instance',
    content: {'application/json': {schema: getModelSchemaRef(GalleryAlbum)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GalleryAlbum, {
            title: 'NewGalleryAlbum',
            exclude: ['id'],
          }),
        },
      },
    })
    galleryAlbum: Omit<GalleryAlbum, 'id'>,
  ): Promise<GalleryAlbum> {
    return this.galleryAlbumRepository.create(galleryAlbum);
  }

  @authenticate('jwt')
  @get('/gallery-albums/count')
  @response(200, {
    description: 'GalleryAlbum model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(GalleryAlbum) where?: Where<GalleryAlbum>,
  ): Promise<Count> {
    return this.galleryAlbumRepository.count(where);
  }

  @get('/gallery-albums')
  @response(200, {
    description: 'Array of GalleryAlbum model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(GalleryAlbum, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(GalleryAlbum) filter?: Filter<GalleryAlbum>,
  ): Promise<GalleryAlbum[]> {
    return this.galleryAlbumRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/gallery-albums')
  @response(200, {
    description: 'GalleryAlbum PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GalleryAlbum, {partial: true}),
        },
      },
    })
    galleryAlbum: GalleryAlbum,
    @param.where(GalleryAlbum) where?: Where<GalleryAlbum>,
  ): Promise<Count> {
    return this.galleryAlbumRepository.updateAll(galleryAlbum, where);
  }

  @authenticate('jwt')
  @get('/gallery-albums/{id}')
  @response(200, {
    description: 'GalleryAlbum model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GalleryAlbum, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GalleryAlbum, {exclude: 'where'}) filter?: FilterExcludingWhere<GalleryAlbum>
  ): Promise<GalleryAlbum> {
    return this.galleryAlbumRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/gallery-albums/{id}')
  @response(204, {
    description: 'GalleryAlbum PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GalleryAlbum, {partial: true}),
        },
      },
    })
    galleryAlbum: GalleryAlbum,
  ): Promise<void> {
    await this.galleryAlbumRepository.updateById(id, galleryAlbum);
  }

  @authenticate('jwt')
  @put('/gallery-albums/{id}')
  @response(204, {
    description: 'GalleryAlbum PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() galleryAlbum: GalleryAlbum,
  ): Promise<void> {
    await this.galleryAlbumRepository.replaceById(id, galleryAlbum);
  }

  @authenticate('jwt')
  @del('/gallery-albums/{id}')
  @response(204, {
    description: 'GalleryAlbum DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.galleryAlbumRepository.deleteById(id);
  }
}
