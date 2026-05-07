import { Place, Prisma } from '@prisma/client';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { FindAllPlacesDto } from './dto/find-all-places.dto';

export type PlaceWithBrandAndReviews = Prisma.PlaceGetPayload<{
  include: {
    brand: true;
    reviews: {
      select: {
        rating: true;
      };
    };
  };
}>;

export type PlaceWithFullDetails = Prisma.PlaceGetPayload<{
  include: {
    brand: {
      include: {
        business: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
    reviews: {
      include: {
        user: {
          select: {
            id: true;
            fullName: true;
          };
        };
        replies: true;
      };
    };
    offers: true;
    _count: {
      select: {
        checkins: true;
        reviews: true;
      };
    };
  };
}>;

export interface IPlacesRepository {
  create(data: CreatePlaceDto): Promise<Place>;
  findAll(query: FindAllPlacesDto): Promise<PlaceWithBrandAndReviews[]>;
  findById(id: string): Promise<PlaceWithFullDetails | null>;
  update(id: string, data: UpdatePlaceDto): Promise<Place>;
  delete(id: string): Promise<Place>;
}
