"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    health() {
        return this.appService.health();
    }
    getBusinesses() {
        return this.appService.getBusinesses();
    }
    createBusiness(body) {
        return this.appService.createBusiness(body);
    }
    updateBusiness(id, body) {
        return this.appService.updateBusiness(id, body);
    }
    deleteBusiness(id) {
        return this.appService.deleteBusiness(id);
    }
    getLocations(businessId) {
        return this.appService.getLocations(businessId);
    }
    createLocation(body) {
        return this.appService.createLocation(body);
    }
    updateLocation(id, body) {
        return this.appService.updateLocation(id, body);
    }
    deleteLocation(id) {
        return this.appService.deleteLocation(id);
    }
    getReviews(locationId) {
        return this.appService.getReviews(locationId);
    }
    addReview(body) {
        return this.appService.addReview(body);
    }
    replyReview(id, body) {
        return this.appService.replyReview(id, body.reply);
    }
    addCheckIn(body) {
        return this.appService.addCheckIn(body);
    }
    getStats(locationId) {
        return this.appService.getStats(locationId);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('businesses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getBusinesses", null);
__decorate([
    (0, common_1.Post)('businesses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createBusiness", null);
__decorate([
    (0, common_1.Patch)('businesses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateBusiness", null);
__decorate([
    (0, common_1.Delete)('businesses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteBusiness", null);
__decorate([
    (0, common_1.Get)('locations'),
    __param(0, (0, common_1.Query)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Post)('locations'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Patch)('locations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "updateLocation", null);
__decorate([
    (0, common_1.Delete)('locations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "deleteLocation", null);
__decorate([
    (0, common_1.Get)('reviews'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Post)('reviews'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addReview", null);
__decorate([
    (0, common_1.Patch)('reviews/:id/reply'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "replyReview", null);
__decorate([
    (0, common_1.Post)('checkins'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "addCheckIn", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Query)('locationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getStats", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map