"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    businesses = [
        { id: 'b1', name: 'ACTA Coffee', brand: 'ACTA', phone: '0901111111' },
    ];
    locations = [
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
    reviews = [];
    checkIns = [];
    health() {
        return { ok: true, service: 'backend-nest', timestamp: new Date().toISOString() };
    }
    getBusinesses() {
        return this.businesses;
    }
    createBusiness(input) {
        const next = { id: crypto.randomUUID(), ...input };
        this.businesses.unshift(next);
        return next;
    }
    updateBusiness(id, patch) {
        const idx = this.businesses.findIndex((b) => b.id === id);
        if (idx < 0)
            throw new common_1.NotFoundException('Business not found');
        this.businesses[idx] = { ...this.businesses[idx], ...patch };
        return this.businesses[idx];
    }
    deleteBusiness(id) {
        const locationIds = this.locations.filter((l) => l.businessId === id).map((l) => l.id);
        this.reviews.splice(0, this.reviews.length, ...this.reviews.filter((r) => !locationIds.includes(r.locationId)));
        this.checkIns.splice(0, this.checkIns.length, ...this.checkIns.filter((c) => !locationIds.includes(c.locationId)));
        this.locations.splice(0, this.locations.length, ...this.locations.filter((l) => l.businessId !== id));
        const before = this.businesses.length;
        this.businesses.splice(0, this.businesses.length, ...this.businesses.filter((b) => b.id !== id));
        return { deleted: before - this.businesses.length > 0 };
    }
    getLocations(businessId) {
        if (!businessId)
            return this.locations;
        return this.locations.filter((l) => l.businessId === businessId);
    }
    createLocation(input) {
        const next = { id: crypto.randomUUID(), ...input };
        this.locations.unshift(next);
        return next;
    }
    updateLocation(id, patch) {
        const idx = this.locations.findIndex((l) => l.id === id);
        if (idx < 0)
            throw new common_1.NotFoundException('Location not found');
        this.locations[idx] = { ...this.locations[idx], ...patch };
        return this.locations[idx];
    }
    deleteLocation(id) {
        this.reviews.splice(0, this.reviews.length, ...this.reviews.filter((r) => r.locationId !== id));
        this.checkIns.splice(0, this.checkIns.length, ...this.checkIns.filter((c) => c.locationId !== id));
        const before = this.locations.length;
        this.locations.splice(0, this.locations.length, ...this.locations.filter((l) => l.id !== id));
        return { deleted: before - this.locations.length > 0 };
    }
    getReviews(locationId) {
        if (!locationId)
            return this.reviews;
        return this.reviews.filter((r) => r.locationId === locationId);
    }
    addReview(input) {
        const next = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...input,
        };
        this.reviews.unshift(next);
        return next;
    }
    replyReview(id, reply) {
        const idx = this.reviews.findIndex((r) => r.id === id);
        if (idx < 0)
            throw new common_1.NotFoundException('Review not found');
        this.reviews[idx] = { ...this.reviews[idx], reply };
        return this.reviews[idx];
    }
    addCheckIn(input) {
        const next = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...input,
        };
        this.checkIns.unshift(next);
        return next;
    }
    getStats(locationId) {
        const checkIns = locationId
            ? this.checkIns.filter((c) => c.locationId === locationId)
            : this.checkIns;
        const reviews = locationId
            ? this.reviews.filter((r) => r.locationId === locationId)
            : this.reviews;
        const avgRating = reviews.length > 0
            ? Number((reviews.reduce((sum, current) => sum + current.rating, 0) / reviews.length).toFixed(1))
            : 0;
        return {
            totalBusinesses: this.businesses.length,
            totalLocations: this.locations.length,
            totalCheckIns: checkIns.length,
            totalReviews: reviews.length,
            avgRating,
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map