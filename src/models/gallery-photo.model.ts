import {belongsTo, Entity, model, property} from '@loopback/repository';
import {GalleryAlbum} from './gallery-album.model';

@model({
  settings: {
    mysql: {
      table: 'galleryPhoto',
    },
  },
})
export class GalleryPhoto extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => GalleryAlbum, {name: 'album'})
  albumFk: number;

  @property({
    type: 'string',
  })
  imageKey?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<GalleryPhoto>) {
    super(data);
  }
}

export interface GalleryPhotoRelations {
  album?: GalleryAlbum;
}

export type GalleryPhotoWithRelations = GalleryPhoto & GalleryPhotoRelations;
