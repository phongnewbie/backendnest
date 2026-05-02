import { Injectable, NotFoundException } from '@nestjs/common';

type Business = {
  id: string;
  name: string;
  brand: string;
  phone: string;
};

type Location = {
  id: string;
  businessId: string;
  name: string;
  address: string;
  phone: string;
  openHours: string;
  latitude: number;
  longitude: number;
};

type Review = {
  id: string;
  locationId: string;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
  reply?: string;
};

type CheckIn = {
  id: string;
  locationId: string;
  lat: number;
  lng: number;
  createdAt: string;
};

@Injectable()
export class AppService {
  private readonly businesses: Business[] = [
    { id: 'b1', name: 'ACTA Coffee', brand: 'ACTA', phone: '0901111111' },
  ];

  private readonly locations: Location[] = [
    {
      id: 'l1',
      businessId: 'b1',
      name: 'ACTA Coffee Q1',
      address: 'Nguyen Hue, Quan 1, TP.HCM',
      phone: '0901111111',
      openHours: '07:00 - 22:00',
      latitude: 10.7747,
      longitude: 106.7042,
    },
  ];

  private readonly reviews: Review[] = [];
  private readonly checkIns: CheckIn[] = [];

  health() {
    return { ok: true, service: 'backend-nest', timestamp: new Date().toISOString() };
  }

  getBusinesses() {
    return this.businesses;
  }

  createBusiness(input: Omit<Business, 'id'>) {
    const next: Business = { id: crypto.randomUUID(), ...input };
    this.businesses.unshift(next);
    return next;
  }

  updateBusiness(id: string, patch: Partial<Omit<Business, 'id'>>) {
    const idx = this.businesses.findIndex((b) => b.id === id);
    if (idx < 0) throw new NotFoundException('Business not found');
    this.businesses[idx] = { ...this.businesses[idx], ...patch };
    return this.businesses[idx];
  }

  deleteBusiness(id: string) {
    const locationIds = this.locations.filter((l) => l.businessId === id).map((l) => l.id);
    this.reviews.splice(
      0,
      this.reviews.length,
      ...this.reviews.filter((r) => !locationIds.includes(r.locationId)),
    );
    this.checkIns.splice(
      0,
      this.checkIns.length,
      ...this.checkIns.filter((c) => !locationIds.includes(c.locationId)),
    );
    this.locations.splice(
      0,
      this.locations.length,
      ...this.locations.filter((l) => l.businessId !== id),
    );
    const before = this.businesses.length;
    this.businesses.splice(
      0,
      this.businesses.length,
      ...this.businesses.filter((b) => b.id !== id),
    );
    return { deleted: before - this.businesses.length > 0 };
  }

  getLocations(businessId?: string) {
    if (!businessId) return this.locations;
    return this.locations.filter((l) => l.businessId === businessId);
  }

  createLocation(input: Omit<Location, 'id'>) {
    const next: Location = { id: crypto.randomUUID(), ...input };
    this.locations.unshift(next);
    return next;
  }

  updateLocation(id: string, patch: Partial<Omit<Location, 'id'>>) {
    const idx = this.locations.findIndex((l) => l.id === id);
    if (idx < 0) throw new NotFoundException('Location not found');
    this.locations[idx] = { ...this.locations[idx], ...patch };
    return this.locations[idx];
  }

  deleteLocation(id: string) {
    this.reviews.splice(
      0,
      this.reviews.length,
      ...this.reviews.filter((r) => r.locationId !== id),
    );
    this.checkIns.splice(
      0,
      this.checkIns.length,
      ...this.checkIns.filter((c) => c.locationId !== id),
    );
    const before = this.locations.length;
    this.locations.splice(
      0,
      this.locations.length,
      ...this.locations.filter((l) => l.id !== id),
    );
    return { deleted: before - this.locations.length > 0 };
  }

  getReviews(locationId?: string) {
    if (!locationId) return this.reviews;
    return this.reviews.filter((r) => r.locationId === locationId);
  }

  addReview(input: Omit<Review, 'id' | 'createdAt'>) {
    const next: Review = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.reviews.unshift(next);
    return next;
  }

  replyReview(id: string, reply: string) {
    const idx = this.reviews.findIndex((r) => r.id === id);
    if (idx < 0) throw new NotFoundException('Review not found');
    this.reviews[idx] = { ...this.reviews[idx], reply };
    return this.reviews[idx];
  }

  addCheckIn(input: Omit<CheckIn, 'id' | 'createdAt'>) {
    const next: CheckIn = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.checkIns.unshift(next);
    return next;
  }

  getStats(locationId?: string) {
    const checkIns = locationId
      ? this.checkIns.filter((c) => c.locationId === locationId)
      : this.checkIns;
    const reviews = locationId
      ? this.reviews.filter((r) => r.locationId === locationId)
      : this.reviews;
    const avgRating =
      reviews.length > 0
        ? Number(
            (reviews.reduce((sum, current) => sum + current.rating, 0) / reviews.length).toFixed(
              1,
            ),
          )
        : 0;
    return {
      totalBusinesses: this.businesses.length,
      totalLocations: this.locations.length,
      totalCheckIns: checkIns.length,
      totalReviews: reviews.length,
      avgRating,
    };
  }
}
