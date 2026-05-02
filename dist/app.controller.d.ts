import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    health(): {
        ok: boolean;
        service: string;
        timestamp: string;
    };
    getBusinesses(): {
        id: string;
        name: string;
        brand: string;
        phone: string;
    }[];
    createBusiness(body: {
        name: string;
        brand: string;
        phone: string;
    }): {
        id: string;
        name: string;
        brand: string;
        phone: string;
    };
    updateBusiness(id: string, body: {
        name?: string;
        brand?: string;
        phone?: string;
    }): {
        id: string;
        name: string;
        brand: string;
        phone: string;
    };
    deleteBusiness(id: string): {
        deleted: boolean;
    };
    getLocations(businessId?: string): {
        id: string;
        businessId: string;
        name: string;
        address: string;
        phone: string;
        openHours: string;
        latitude: number;
        longitude: number;
    }[];
    createLocation(body: {
        businessId: string;
        name: string;
        address: string;
        phone: string;
        openHours: string;
        latitude: number;
        longitude: number;
    }): {
        id: string;
        businessId: string;
        name: string;
        address: string;
        phone: string;
        openHours: string;
        latitude: number;
        longitude: number;
    };
    updateLocation(id: string, body: {
        name?: string;
        address?: string;
        phone?: string;
        openHours?: string;
        latitude?: number;
        longitude?: number;
    }): {
        id: string;
        businessId: string;
        name: string;
        address: string;
        phone: string;
        openHours: string;
        latitude: number;
        longitude: number;
    };
    deleteLocation(id: string): {
        deleted: boolean;
    };
    getReviews(locationId?: string): {
        id: string;
        locationId: string;
        author: string;
        rating: number;
        content: string;
        createdAt: string;
        reply?: string;
    }[];
    addReview(body: {
        locationId: string;
        author: string;
        rating: number;
        content: string;
    }): {
        id: string;
        locationId: string;
        author: string;
        rating: number;
        content: string;
        createdAt: string;
        reply?: string;
    };
    replyReview(id: string, body: {
        reply: string;
    }): {
        id: string;
        locationId: string;
        author: string;
        rating: number;
        content: string;
        createdAt: string;
        reply?: string;
    };
    addCheckIn(body: {
        locationId: string;
        lat: number;
        lng: number;
    }): {
        id: string;
        locationId: string;
        lat: number;
        lng: number;
        createdAt: string;
    };
    getStats(locationId?: string): {
        totalBusinesses: number;
        totalLocations: number;
        totalCheckIns: number;
        totalReviews: number;
        avgRating: number;
    };
}
