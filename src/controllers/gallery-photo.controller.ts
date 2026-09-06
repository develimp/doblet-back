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
import {GalleryPhoto} from '../models';
import {GalleryPhotoRepository} from '../repositories';

interface GalleryPhotoResponse {
  id?: number;
  albumFk: number;
  imageKey?: string;
}

export class GalleryPhotoController {
  constructor(
    @repository(GalleryPhotoRepository)
    public galleryPhotoRepository : GalleryPhotoRepository,
  ) {}

  private toResponse(galleryPhoto: GalleryPhoto): GalleryPhotoResponse {
    return {
      id: galleryPhoto.id,
      albumFk: galleryPhoto.albumFk,
      imageKey: galleryPhoto.imageKey,
    };
  }

  @authenticate('jwt')
  @post('/gallery-photos')
  @response(200, {
    description: 'GalleryPhoto model instance',
    content: {'application/json': {schema: getModelSchemaRef(GalleryPhoto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GalleryPhoto, {
            title: 'NewGalleryPhoto',
            exclude: ['id'],
          }),
        },
      },
    })
    galleryPhoto: Omit<GalleryPhoto, 'id'>,
  ): Promise<GalleryPhoto> {
    return this.galleryPhotoRepository.create(galleryPhoto);
  }

  @authenticate('jwt')
  @get('/gallery-photos/count')
  @response(200, {
    description: 'GalleryPhoto model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(GalleryPhoto) where?: Where<GalleryPhoto>,
  ): Promise<Count> {
    return this.galleryPhotoRepository.count(where);
  }

  @get('/gallery-photos')
  @response(200, {
    description: 'Array of GalleryPhoto model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(GalleryPhoto, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(GalleryPhoto) filter?: Filter<GalleryPhoto>,
  ): Promise<GalleryPhotoResponse[]> {
    const galleryPhotos = await this.galleryPhotoRepository.find(filter);
    return galleryPhotos.map(galleryPhoto => this.toResponse(galleryPhoto));
  }

  @authenticate('jwt')
  @patch('/gallery-photos')
  @response(200, {
    description: 'GalleryPhoto PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GalleryPhoto, {partial: true}),
        },
      },
    })
    galleryPhoto: GalleryPhoto,
    @param.where(GalleryPhoto) where?: Where<GalleryPhoto>,
  ): Promise<Count> {
    return this.galleryPhotoRepository.updateAll(galleryPhoto, where);
  }

  @authenticate('jwt')
  @get('/gallery-photos/{id}')
  @response(200, {
    description: 'GalleryPhoto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(GalleryPhoto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(GalleryPhoto, {exclude: 'where'}) filter?: FilterExcludingWhere<GalleryPhoto>
  ): Promise<GalleryPhotoResponse> {
    const galleryPhoto = await this.galleryPhotoRepository.findById(id, filter);
    return this.toResponse(galleryPhoto);
  }

  @authenticate('jwt')
  @patch('/gallery-photos/{id}')
  @response(204, {
    description: 'GalleryPhoto PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GalleryPhoto, {partial: true}),
        },
      },
    })
    galleryPhoto: GalleryPhoto,
  ): Promise<void> {
    await this.galleryPhotoRepository.updateById(id, galleryPhoto);
  }

  @authenticate('jwt')
  @put('/gallery-photos/{id}')
  @response(204, {
    description: 'GalleryPhoto PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() galleryPhoto: GalleryPhoto,
  ): Promise<void> {
    await this.galleryPhotoRepository.replaceById(id, galleryPhoto);
  }

  @authenticate('jwt')
  @del('/gallery-photos/{id}')
  @response(204, {
    description: 'GalleryPhoto DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.galleryPhotoRepository.deleteById(id);
  }
}
