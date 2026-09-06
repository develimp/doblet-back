import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SpDataSource} from '../datasources';
import {GalleryPhoto, GalleryPhotoRelations} from '../models';

export class GalleryPhotoRepository extends DefaultCrudRepository<
  GalleryPhoto,
  typeof GalleryPhoto.prototype.id,
  GalleryPhotoRelations
> {
  constructor(
    @inject('datasources.sp') dataSource: SpDataSource,
  ) {
    super(GalleryPhoto, dataSource);
  }
}
