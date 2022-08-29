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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReqQuotes = exports.UserDecision = exports.Status = void 0;
const User_1 = require("./User");
const class_transformer_1 = require("class-transformer");
const typeorm_1 = require("typeorm");
const itemDetail_1 = require("./itemDetail");
const data_source_1 = require("../data-source");
var Status;
(function (Status) {
    Status["ASKED"] = "asked";
    Status["SENT"] = "sent";
    Status["ACCEPTED"] = "accepted";
    Status["REJECTED"] = "rejected";
    Status["DISCOUNTED"] = "discounted";
})(Status = exports.Status || (exports.Status = {}));
var UserDecision;
(function (UserDecision) {
    UserDecision["PENDING"] = "pending";
    UserDecision["REJECTED"] = "rejected";
    UserDecision["ACCEPTED"] = "accepted";
    UserDecision["ASKDISCOUNT"] = "askDiscount";
})(UserDecision = exports.UserDecision || (exports.UserDecision = {}));
let ReqQuotes = class ReqQuotes {
    get totalReserved() {
        var _a;
        let val = 0;
        if ((_a = this.itemDetails) === null || _a === void 0 ? void 0 : _a.length) {
            this.itemDetails.forEach((item) => {
                val += item.units;
            });
        }
        return val;
    }
    checkUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
            try {
                const found = yield userRepository.findOne({
                    where: { email: this.userEmail },
                });
                if (found) {
                    this.emailRegistered = true;
                }
                else {
                    this.emailRegistered = false;
                }
            }
            catch (error) {
                this.emailRegistered = false;
            }
        });
    }
    toJSON() {
        return (0, class_transformer_1.instanceToPlain)(this);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReqQuotes.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => itemDetail_1.ItemDetail, (itemDetail) => itemDetail.reqQuote, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    __metadata("design:type", Array)
], ReqQuotes.prototype, "itemDetails", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ReqQuotes.prototype, "totalReserved", null);
__decorate([
    (0, typeorm_1.Column)({ name: "email_registered", default: false }),
    __metadata("design:type", Boolean)
], ReqQuotes.prototype, "emailRegistered", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReqQuotes.prototype, "checkUser", null);
__decorate([
    (0, typeorm_1.Column)({ name: "user_email" }),
    __metadata("design:type", String)
], ReqQuotes.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "name_client" }),
    __metadata("design:type", String)
], ReqQuotes.prototype, "nameClient", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "party", nullable: true }),
    __metadata("design:type", String)
], ReqQuotes.prototype, "party", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "phone_number" }),
    __metadata("design:type", String)
], ReqQuotes.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: "total_price" }),
    __metadata("design:type", Number)
], ReqQuotes.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: Status, default: Status.ASKED }),
    __metadata("design:type", String)
], ReqQuotes.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "user_decision", type: "enum", enum: UserDecision, default: UserDecision.PENDING }),
    __metadata("design:type", String)
], ReqQuotes.prototype, "userDecision", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ReqQuotes.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: "updated_at" }),
    __metadata("design:type", Date)
], ReqQuotes.prototype, "updatedAt", void 0);
ReqQuotes = __decorate([
    (0, typeorm_1.Entity)("quotes")
], ReqQuotes);
exports.ReqQuotes = ReqQuotes;
//# sourceMappingURL=Quote.js.map