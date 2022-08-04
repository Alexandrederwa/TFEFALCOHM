"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./../middlewares/auth");
const Quote_1 = require("./../entity/Quote");
const Product_1 = require("./../entity/Product");
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey("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");
const express_1 = require("express");
const data_source_1 = require("../data-source");
const itemDetail_1 = require("../entity/itemDetail");
const Quote_2 = require("../entity/Quote");
const auth_2 = require("../middlewares/auth");
const catchAsyncError_1 = __importDefault(require("../middlewares/catchAsyncError"));
const errorHandler_1 = require("../utils/errorHandler");
const quotesRespository = data_source_1.AppDataSource.getRepository(Quote_2.ReqQuotes);
const itemDetailRepository = data_source_1.AppDataSource.getRepository(itemDetail_1.ItemDetail);
const productRepository = data_source_1.AppDataSource.getRepository(Product_1.Product);
const getQuotes = (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqQuotes = yield quotesRespository.find({
            relations: ["itemDetails"],
        });
        return res.json(reqQuotes);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const getQuote = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log({ id });
    console.log('lol');
    try {
        const quote = yield quotesRespository.findOne({
            where: {
                id,
            },
            relations: ["itemDetails"],
        });
        console.log(quote);
        if (!quote)
            return next(new errorHandler_1.errorHandler("Quote was not found.", 400));
        return res.json(quote);
    }
    catch (error) {
        return res.json({ error: "Something went wrong" });
    }
}));
const getUserQuotes = (0, catchAsyncError_1.default)((_, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userQuotes = yield quotesRespository.find({
            where: {
                userEmail: (_a = res.locals) === null || _a === void 0 ? void 0 : _a.user.email,
            },
            relations: ["itemDetails"],
        });
        console.log({ userQuotes });
        return res.status(200).json(userQuotes);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const userDecisionQuote = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { decision } = req.body;
    if (!id ||
        (decision !== Quote_1.UserDecision.ASKDISCOUNT &&
            decision !== Quote_1.UserDecision.REJECTED &&
            decision !== Quote_1.UserDecision.ACCEPTED)) {
        return next(new errorHandler_1.errorHandler("Cannot perform that Action. Invalid Decision", 400));
    }
    const quote = yield quotesRespository.findOne({
        where: { id },
        relations: ["itemDetails"],
    });
    if (!quote)
        return next(new errorHandler_1.errorHandler("Quote not found", 400));
    if (quote.userEmail !== res.locals.user.email) {
        return next(new errorHandler_1.errorHandler("You can't perform this task", 400));
    }
    quote.userDecision = decision;
    if (quote.userDecision == Quote_1.UserDecision.ACCEPTED) {
        quote.status = Quote_1.Status.ACCEPTED;
        for (let index = 0; index < quote.itemDetails.length;) {
            let saved = null;
            const { productId, units, rentDate, deliverDate } = quote.itemDetails[index];
            if (quote.status === Quote_1.Status.ACCEPTED &&
                quote.userDecision === Quote_1.UserDecision.ACCEPTED) {
                const product = yield productRepository.findOne({
                    where: {
                        id: productId,
                    },
                });
                if (!product)
                    return next(new errorHandler_1.errorHandler("An Error occured while accepting Quote.", 400));
                const reservedList = JSON.parse(product.reserved);
                if (reservedList === null || reservedList === void 0 ? void 0 : reservedList.length) {
                    product.reserved = JSON.stringify([
                        ...reservedList,
                        {
                            start: rentDate,
                            end: deliverDate,
                            quoteId: quote.id,
                            reservedUnits: units,
                        },
                    ]);
                }
                else {
                    product.reserved = JSON.stringify([
                        {
                            start: rentDate,
                            end: deliverDate,
                            reservedUnits: units,
                            quoteId: quote.id,
                        },
                    ]);
                }
                saved = yield productRepository.save(product);
            }
            if (saved) {
                index++;
            }
        }
    }
    yield quotesRespository.save(quote);
    console.log("Saved =>", { quote: JSON.stringify(quote) });
    return res.status(200).json({ success: true, quote });
}));
const addReqQuoteItems = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { itemsList, totalPrice } = req.body;
    const { id } = req.params;
    if (!totalPrice)
        return next(new errorHandler_1.errorHandler("Invalid total Price", 400));
    const reqQuote = yield quotesRespository.findOne({ where: { id } });
    if (!reqQuote)
        return next(new errorHandler_1.errorHandler("Quote no found", 400));
    if (!itemsList[0])
        return next(new errorHandler_1.errorHandler("Please add products", 400));
    try {
        let data = [];
        for (let index = 0; index < itemsList.length;) {
            const item = itemsList[index];
            const detail = new itemDetail_1.ItemDetail();
            detail.productId = item.id;
            detail.productCategory = item.category;
            detail.units = item.units;
            detail.productName = item.name;
            detail.productPrice = item.price;
            detail.rentDate = item.startDate;
            detail.deliverDate = item.endDate;
            detail.productImage = item.image;
            const saved = yield itemDetailRepository.save(detail, { chunk: 50 });
            if (saved) {
                data.push(detail);
                index++;
            }
        }
        reqQuote.itemDetails = data;
        reqQuote.status = Quote_1.Status.SENT;
        reqQuote.totalPrice = Number(totalPrice);
        const saved = yield quotesRespository.save(reqQuote);
        if (!saved) {
            return next(new errorHandler_1.errorHandler("Failed to save the quote", 400));
        }
        const string = `${process.env.ORIGIN}/quote?quoteId=${reqQuote.id}`;
        const msg = {
            to: reqQuote.userEmail,
            from: "falcohm6tm@outlook.com",
            subject: "Your Quote is Ready",
            text: "Go to fontend/quote to see it ",
            html: `<a href=${string} style="color:red;">${string} </a>`,
        };
        yield mail_1.default.send(msg);
        console.log("Email send is => ", string);
        return res.json(reqQuote);
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const removeQuotes = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id)
        return next(new errorHandler_1.errorHandler("Invalid Id", 400));
    try {
        const found = yield quotesRespository.findOne({
            where: { id },
            relations: ["itemDetails"],
        });
        if (!found)
            return next(new errorHandler_1.errorHandler("Quote not found", 400));
        if (found.status !== Quote_1.Status.ASKED) {
            for (let index = 0; index < found.itemDetails.length;) {
                const { productId } = found.itemDetails[index];
                const product = yield productRepository.findOne({
                    where: {
                        id: productId,
                    },
                });
                if (!product)
                    return next(new errorHandler_1.errorHandler("The items were not found.", 400));
                const reservedList = JSON.parse(product.reserved);
                product.reserved = JSON.stringify((reservedList === null || reservedList === void 0 ? void 0 : reservedList.filter((item) => item.quoteId !== found.id)) || []);
                const saved = yield productRepository.save(product);
                if (saved) {
                    index++;
                }
            }
        }
        yield quotesRespository.remove(found);
        const msg = {
            to: found.userEmail,
            from: "falcohm6tm@outlook.com",
            subject: "Quote Status",
            text: "Hey, You quote was Rejected... ",
            html: `<h3 style="margin:20px;color:crimson;">
        Sadly your Requested Quote has been deleted.</h3>`,
        };
        yield mail_1.default.send(msg);
        console.log("Email send is => ", msg["html"]);
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const giveDiscount = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { totalPrice } = req.body;
    const { id } = req.params;
    console.log({ totalPrice });
    try {
        const found = yield quotesRespository.findOne({
            where: { id },
            relations: ["itemDetails"],
        });
        if (!found)
            return next(new errorHandler_1.errorHandler("Quote not found", 400));
        found.checkUser();
        found.status = Quote_1.Status.DISCOUNTED;
        const saved = yield quotesRespository.save(found, { reload: true });
        if (!saved)
            return next(new errorHandler_1.errorHandler("Failed to give the discount", 400));
        const msg = {
            to: found.userEmail,
            from: "falcohm6tm@outlook.com",
            subject: "Quote Status",
            text: "Hey, You got a Discount ",
            html: `<h3 style="margin:20px;color:green;">
        Hey you have been given a discount</h3>`,
        };
        yield mail_1.default.send(msg);
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        return res.json({ error: "Something went wrong" });
    }
}));
const editOrRemoveItems = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { remove, units, quoteId } = req.body;
    if (!quoteId)
        return next(new errorHandler_1.errorHandler("Failed to process", 400));
    const quote = yield quotesRespository.findOne({ where: { id: quoteId } });
    if (!quote)
        return next(new errorHandler_1.errorHandler("Failed to process", 400));
    const data = yield itemDetailRepository.findOne({ where: { id } });
    if (!data)
        return next(new errorHandler_1.errorHandler("Cannot find the item.", 400));
    const product = yield productRepository.findOne({
        where: { id: data.productId },
    });
    if (!product)
        return next(new errorHandler_1.errorHandler("An Error occured", 400));
    if (remove && quoteId) {
        const done = yield itemDetailRepository.remove(data);
        if (!done)
            return next(new errorHandler_1.errorHandler("Failed to remove the Item", 400));
        if (quote.status !== Quote_1.Status.ASKED &&
            quote.userDecision !== Quote_1.UserDecision.PENDING) {
            console.log("Yess1");
            let reservedList = JSON.parse(product.reserved);
            if (reservedList.length) {
                reservedList = reservedList.filter((list) => list.quoteId !== quoteId);
                console.log("Yes 3");
                product.reserved = JSON.stringify(reservedList);
                console.log({ reservedList, productReserved: product.reserved });
                const saved = yield productRepository.save(product);
                if (!saved) {
                    return next(new errorHandler_1.errorHandler("An error occured while updated item quantity", 400));
                }
                console.log("Yes 4");
                return res.status(200).json({ success: true });
            }
            else {
                return res.status(200).json({ success: true });
            }
        }
        else {
            console.log("Yess No change in product entity");
            return res.status(200).json({ success: true });
        }
    }
    if (units && Number(units) === data.units) {
        return next(new errorHandler_1.errorHandler("Please change units price", 400));
    }
    else if (units) {
        data.units = Number(units);
        let reservedList = JSON.parse(product === null || product === void 0 ? void 0 : product.reserved);
        if (quote.status !== Quote_1.Status.ASKED &&
            quote.userDecision !== Quote_1.UserDecision.PENDING) {
            console.log("update 1");
            if (reservedList.length) {
                console.log("update 2");
                const found = reservedList.find((list) => list.quoteId === quoteId);
                if (found) {
                    console.log("update 3");
                    found.reservedUnits = Number(units);
                    reservedList = reservedList.filter((list) => list.quoteId !== quoteId);
                    product.reserved = JSON.stringify([...reservedList, found]);
                    const saved = yield productRepository.save(product);
                    if (!saved) {
                        return next(new errorHandler_1.errorHandler("An error occured while updated item quantity", 400));
                    }
                    console.log("update 4");
                    const updatedItem = yield itemDetailRepository.save(data);
                    if (!updatedItem) {
                        return next(new errorHandler_1.errorHandler("An error occured while updated item quantity", 400));
                    }
                    console.log("update 5");
                    return res.status(200).json({ success: true });
                }
            }
            else {
                const updatedItem = yield itemDetailRepository.save(data);
                if (!updatedItem) {
                    return next(new errorHandler_1.errorHandler("An error occured while updated item quantity", 400));
                }
                return res.status(200).json({ success: true });
            }
        }
        else {
            console.log("update 6");
            const updatedItem = yield itemDetailRepository.save(data);
            if (!updatedItem) {
                return next(new errorHandler_1.errorHandler("An error occured while updated item quantity", 400));
            }
            return res.status(200).json({ success: true });
        }
    }
}));
const requestQuote = (0, catchAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { name, email, phone, party, itemsList, totalPrice } = req.body;
    const { role } = (_b = res.locals) === null || _b === void 0 ? void 0 : _b.user;
    const quote = new Quote_2.ReqQuotes();
    quote.userEmail = email;
    quote.nameClient = name;
    if (phone) {
        quote.phone = phone;
    }
    if (party) {
        quote.party = party;
    }
    if (role && role === "admin") {
        if (!totalPrice)
            return next(new errorHandler_1.errorHandler("Invalid total Price", 400));
        if (!itemsList[0])
            return next(new errorHandler_1.errorHandler("Please add products to rent", 400));
        let data = [];
        for (let index = 0; index < itemsList.length;) {
            const item = itemsList[index];
            const detail = new itemDetail_1.ItemDetail();
            detail.productId = item.id;
            detail.productCategory = item.category;
            detail.units = item.units;
            detail.productName = item.name;
            detail.productPrice = item.price;
            detail.rentDate = item.startDate;
            detail.deliverDate = item.endDate;
            detail.productImage = item.image;
            const saved = yield itemDetailRepository.save(detail, { chunk: 50 });
            if (saved) {
                data.push(detail);
                index++;
            }
        }
        quote.itemDetails = data;
        quote.status = Quote_1.Status.SENT;
        quote.totalPrice = Number(totalPrice);
        quote.emailRegistered = false;
    }
    console.log(quote);
    const saved = yield quotesRespository.save(quote);
    if (!saved) {
        return next(new errorHandler_1.errorHandler("Failed to save the quote", 400));
    }
    const string = `${process.env.ORIGIN}/item_list?id=${saved.id}`;
    const msg = {
        to: "face.alex.d@gmail.com",
        from: "falcohm6tm@outlook.com",
        subject: "Your Quote is Ready",
        text: "Hey,A new quote has been requested, go check it out.",
        html: `<a href=${string} style="color:red;">${string} </a>`,
    };
    console.log("1");
    yield mail_1.default.send(msg);
    console.log("2");
    console.log("Email send is => ", string);
    return res.status(200).json({ success: true });
}));
const router = (0, express_1.Router)();
router.post("/request", auth_1.SetAuthUser, requestQuote);
router.get("/all", auth_1.SetAuthUser, auth_2.authMiddleware, getQuotes);
router.get("/my_quotes", auth_1.SetAuthUser, auth_2.authMiddleware, getUserQuotes);
router.put("/user_quote/:id", auth_1.SetAuthUser, auth_2.authMiddleware, userDecisionQuote);
router.get("/:id", auth_1.SetAuthUser, getQuote);
router.put("/add_items/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), addReqQuoteItems);
router.put("/discount/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), giveDiscount);
router.put("/item/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), editOrRemoveItems);
router.delete("/:id", auth_1.SetAuthUser, auth_2.authMiddleware, (0, auth_2.authorizeRoles)("admin"), removeQuotes);
exports.default = router;
//# sourceMappingURL=quotes.js.map