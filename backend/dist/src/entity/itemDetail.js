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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDetail = void 0;
const typeorm_1 = require("typeorm");
const Quote_1 = require("./Quote");
let ItemDetail = class ItemDetail {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], ItemDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_id" }),
    __metadata("design:type", String)
], ItemDetail.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_price" }),
    __metadata("design:type", Number)
], ItemDetail.prototype, "productPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_name" }),
    __metadata("design:type", String)
], ItemDetail.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_category", nullable: true }),
    __metadata("design:type", String)
], ItemDetail.prototype, "productCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "product_Image" }),
    __metadata("design:type", String)
], ItemDetail.prototype, "productImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rent_date" }),
    __metadata("design:type", String)
], ItemDetail.prototype, "rentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "deliver_date" }),
    __metadata("design:type", String)
], ItemDetail.prototype, "deliverDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Quote_1.ReqQuotes, (reqQuote) => reqQuote.itemDetails, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Quote_1.ReqQuotes)
], ItemDetail.prototype, "reqQuote", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ItemDetail.prototype, "units", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ItemDetail.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], ItemDetail.prototype, "updatedAt", void 0);
ItemDetail = __decorate([
    (0, typeorm_1.Entity)("item_details")
], ItemDetail);
exports.ItemDetail = ItemDetail;
//# sourceMappingURL=itemDetail.js.map