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
export declare class AppService {
    private readonly businesses;
    private readonly locations;
    private readonly reviews;
    private readonly checkIns;
    health(): {
        ok: boolean;
        service: string;
        timestamp: string;
    };
    getBusinesses(): Business[];
    createBusiness(input: Omit<Business, 'id'>): Business;
    updateBusiness(id: string, patch: Partial<Omit<Business, 'id'>>): Business;
    deleteBusiness(id: string): {
        deleted: boolean;
    };
    getLocations(businessId?: string): Location[];
    createLocation(input: Omit<Location, 'id'>): Location;
    updateLocation(id: string, patch: Partial<Omit<Location, 'id'>>): Location;
    deleteLocation(id: string): {
        deleted: boolean;
    };
    getReviews(locationId?: string): Review[];
    addReview(input: Omit<Review, 'id' | 'createdAt'>): Review;
    replyReview(id: string, reply: string): Review;
    addCheckIn(input: Omit<CheckIn, 'id' | 'createdAt'>): CheckIn;
    getStats(locationId?: string): {
        totalBusinesses: number;
        totalLocations: number;
        totalCheckIns: number;
        totalReviews: number;
        avgRating: number;
    };
}
export {};
