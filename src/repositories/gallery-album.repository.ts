import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {GalleryAlbum, GalleryAlbumRelations} from '../models';

export class GalleryAlbumRepository extends DefaultCrudRepository<
  GalleryAlbum,
  typeof GalleryAlbum.prototype.id,
  GalleryAlbumRelations
> {
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
  ) {
    super(GalleryAlbum, dataSource);
  }
}
