import {Entity, hasMany, model, property} from '@loopback/repository';
import {GalleryPhoto} from './gallery-photo.model';

@model({
  settings: {
    mysql: {
      table: 'galleryAlbum',
    },
  },
})
export class GalleryAlbum extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
  })
  fallaYear: number;

  @property({
    type: 'date',
  })
  date?: string;

  @hasMany(() => GalleryPhoto, {keyTo: 'albumFk'})
  photos: GalleryPhoto[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<GalleryAlbum>) {
    super(data);
  }
}

export interface GalleryAlbumRelations {
  // describe navigational properties here
}

export type GalleryAlbumWithRelations = GalleryAlbum & GalleryAlbumRelations;
