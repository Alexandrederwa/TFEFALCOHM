import { SetAuthUser } from "./../middlewares/auth";
import { Status, UserDecision } from "./../entity/Quote";
import dotenv from "dotenv";
import { Product } from "./../entity/Product";
import sgMail from "@sendgrid/mail";
dotenv.config();
const apiSendGrid =process.env.SENDGRID_API_KEY
sgMail.setApiKey(apiSendGrid);

import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { ItemDetail } from "../entity/itemDetail";
import { ReqQuotes } from "../entity/Quote";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";
import catchAsyncError from "../middlewares/catchAsyncError";
import { errorHandler } from "../utils/errorHandler";

// REPOITORIES TO DEAL WITH DATABASE

const quotesRespository = AppDataSource.getRepository(ReqQuotes);
const itemDetailRepository = AppDataSource.getRepository(ItemDetail);
const productRepository = AppDataSource.getRepository(Product);

// ADMIN GET ALL QUOTES
const getQuotes = catchAsyncError(async (_: Request, res: Response) => {
  try {
    const reqQuotes = await quotesRespository.find({
      relations: ["itemDetails"],
    });
    return res.json(reqQuotes);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong" });
  }
});
// USER GET QUOTE BY ID
const getQuote = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log({id});
    console.log('lol')
     
    try {
      const quote = await quotesRespository.findOne({
        where: {
          id,
        },
        relations: ["itemDetails"],
      });
      console.log(quote);

      if (!quote) return next(new errorHandler("Quote was not found.", 400));
      // CHECK IF THE AUTHORIZED USER IS ACCEPTING THE QUOTE
   
      return res.json(quote);
    } catch (error) {
      // console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);

// USER GET QUOTE HISTORY
const getUserQuotes = catchAsyncError(async (_: Request, res: Response) => {
  try {
    const userQuotes = await quotesRespository.find({
      where: {
        userEmail: res.locals?.user.email,
      },

      relations: ["itemDetails"],
    });
    console.log({ userQuotes });

    return res.status(200).json(userQuotes);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong" });
  }
});
// USER DECISION ROUTE
const userDecisionQuote = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { decision } = req.body;
    // INPUT VALIDATION
    if (
      !id ||
      (decision !== UserDecision.ASKDISCOUNT &&
        decision !== UserDecision.REJECTED &&
        decision !== UserDecision.ACCEPTED)
    ) {
      return next(
        new errorHandler("Cannot perform that Action. Invalid Decision", 400)
      );
    }

    const quote = await quotesRespository.findOne({
      where: { id },
      relations: ["itemDetails"],
    });
    if (!quote) return next(new errorHandler("Quote not found", 400));
    // CHECK IF THE AUTHORIZED USER IS ACCEPING THE QUOTE
    if (quote.userEmail !== res.locals.user.email) {
      return next(new errorHandler("You can't perform this task", 400));
    }
    quote.userDecision = decision;
    if (quote.userDecision == UserDecision.ACCEPTED) {
      quote.status = Status.ACCEPTED;
      // IF USER ACCEPTS THE QUOTE THEN UPDATED THE RESERVED DATE OF THE PRODUCTS
      for (let index = 0; index < quote.itemDetails.length; ) {
        let saved = null;
        const { productId, units, rentDate, deliverDate } =
          quote.itemDetails[index];
        if (
          quote.status === Status.ACCEPTED &&
          quote.userDecision === UserDecision.ACCEPTED
        ) {
          const product = await productRepository.findOne({
            where: {
              id: productId,
            },
          });
          if (!product)
            return next(
              new errorHandler("An Error occured while accepting Quote.", 400)
            );
          // PARSING RESERVED ARRAY OF PRODUCT
          const reservedList = JSON.parse(product.reserved);
          // IF NOT EMPTY THEN ADD NEW DATES
          if (reservedList?.length) {
            product.reserved = JSON.stringify([
              ...reservedList,
              {
                start: rentDate,
                end: deliverDate,
                quoteId: quote.id,
                reservedUnits: units,
              },
            ]);
          } else {
            // IF NOT RESERVED BEFORE ASSIGN THE ARRAY
            product.reserved = JSON.stringify([
              {
                start: rentDate,
                end: deliverDate,
                reservedUnits: units,

                quoteId: quote.id,
              },
            ]);
          }
          saved = await productRepository.save(product);
        }
        if (saved) {
          index++;
        }
      }
    }
    await quotesRespository.save(quote);
    console.log("Saved =>", { quote: JSON.stringify(quote) });

    return res.status(200).json({ success: true, quote });
  }
);

interface reqBody {
  itemsList: [
    {
      id: string;
      price: number;
      name: string;

      category: string;
      startDate: string;
      endDate: string;
      image: string;
      units: number;
    }
  ];
  totalPrice: number;
}
// ADMIN CREATE QUOTE
const addReqQuoteItems = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { itemsList, totalPrice }: reqBody = req.body;
    const { id } = req.params;
    // INPUT VALIDATION
    if (!totalPrice) return next(new errorHandler("Invalid total Price", 400));
    const reqQuote = await quotesRespository.findOne({ where: { id } });
    if (!reqQuote) return next(new errorHandler("Quote no found", 400));
    // CHECK IF QUOTE CONTAINS PRODUCTS TO RENT
    if (!itemsList[0])
      return next(new errorHandler("Please add products", 400));
    try {
      let data: any = [];
      // LOOPING THORUGHT LIST OF PRODUCTS TO RENT
      for (let index = 0; index < itemsList.length; ) {
        const item = itemsList[index];
        // CREATING NEW ITEM FOR EACH PRODUCT OF QUOTE
        const detail = new ItemDetail();
        detail.productId = item.id;
        detail.productCategory = item.category;

        detail.units = item.units;
        detail.productName = item.name;
        detail.productPrice = item.price;
        detail.rentDate = item.startDate;
        detail.deliverDate = item.endDate;
        detail.productImage = item.image;
        const saved = await itemDetailRepository.save(detail, { chunk: 50 });

        if (saved) {
          data.push(detail);
          index++;
        }
      }
      // SETTING QUOTES ITEMDETAILS
      reqQuote.itemDetails = data;
      reqQuote.status = Status.SENT;
      reqQuote.totalPrice = Number(totalPrice);
      const saved = await quotesRespository.save(reqQuote);
      if (!saved) {
        return next(new errorHandler("Failed to save the quote", 400));
      }
      // MAILING TO THE CUSTOMER THAT YOUR QUOTE IS READY
      const string = `${process.env.ORIGIN}/quote?quoteId=${reqQuote.id}`;

      const msg = {
        to: reqQuote.userEmail,
        from: "falcohm6tm@outlook.com", // Use the email address or domain you verified above
        subject: "Your Quote is Ready",
        text: "Go to fontend/quote to see it ",
        html: `<a href=${string} style="color:red;">${string} </a>`,
      };

      await sgMail.send(msg);
      console.log("Email send is => ", string);
      return res.json(reqQuote);
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);
// ADMIN REMOVE QUOTES
const removeQuotes = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new errorHandler("Invalid Id", 400));
    try {
      const found = await quotesRespository.findOne({
        where: { id },
        relations: ["itemDetails"],
      });
      if (!found) return next(new errorHandler("Quote not found", 400));
      // UPDATE PRODUCTS RESERVED DATES WHEN IF THE QUOTE STATUS OTHER THAN ASKED
      if (found.status !== Status.ASKED) {
        for (let index = 0; index < found.itemDetails.length; ) {
          const { productId } = found.itemDetails[index];

          const product = await productRepository.findOne({
            where: {
              id: productId,
            },
          });
          if (!product)
            return next(new errorHandler("The items were not found.", 400));
          // PARSING THE RESERVED DATE ARRAY
          const reservedList = JSON.parse(product.reserved);
          product.reserved = JSON.stringify(
            // FILTERING THE RESERVED DATES WITH THE ID OF DELETED QUOTE
            reservedList?.filter((item: any) => item.quoteId !== found.id) || []
          );
          // UPDATING THE PRODUCT
          const saved = await productRepository.save(product);
          if (saved) {
            index++;
          }
        }
      }
      await quotesRespository.remove(found);
      // ENDING MAIL TO USER AFTER DELETE HIS QUOTE
      const msg = {
        to: found.userEmail,
        from: "falcohm6tm@outlook.com", // Use the email address or domain you verified above
        subject: "Quote Status",
        text: "Hey, You quote was Rejected... ",
        html: `<h3 style="margin:20px;color:crimson;">
        Sadly your Requested Quote has been deleted.</h3>`,
      };

      await sgMail.send(msg);
      
      console.log("Email send is => ", msg["html"]);
      
      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);
// ADMIN GIVE DISCOUNT
const giveDiscount = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { totalPrice } = req.body;

    const { id } = req.params;
    console.log({ totalPrice });
    try {
      const found = await quotesRespository.findOne({
        where: { id },
        relations: ["itemDetails"],
      });
      if (!found) return next(new errorHandler("Quote not found", 400));
      // CHECKING IF THE USER IS REGISTERED OR NOT
      found.checkUser();

      found.status = Status.DISCOUNTED;

      const saved = await quotesRespository.save(found, { reload: true });
      if (!saved)
        return next(new errorHandler("Failed to give the discount", 400));
      // SENDING NOTIFICATION TO CUSTOMER THAT HE HAS BEEN GIVEN A DISCOUNT
      const msg = {
        to: found.userEmail,
        from: "falcohm6tm@outlook.com", // Use the email address or domain you verified above
        subject: "Quote Status",
        text: "Hey, You got a Discount ",
        html: `<h3 style="margin:20px;color:green;">
        Hey you have been given a discount</h3>`,
      };

      await sgMail.send(msg);
      return res.json({ success: true });
    } catch (error) {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    }
  }
);
const editOrRemoveItems = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { remove, units, quoteId } = req.body;
    if (!quoteId) return next(new errorHandler("Failed to process", 400));
    const quote = await quotesRespository.findOne({ where: { id: quoteId } });
    if (!quote) return next(new errorHandler("Failed to process", 400));

    const data = await itemDetailRepository.findOne({ where: { id } });
    if (!data) return next(new errorHandler("Cannot find the item.", 400));

    const product = await productRepository.findOne({
      where: { id: data.productId },
    });
    if (!product) return next(new errorHandler("An Error occured", 400));
    // IF delete the quote Item
    if (remove && quoteId) {
      const done = await itemDetailRepository.remove(data);
      if (!done)
        return next(new errorHandler("Failed to remove the Item", 400));
      if (
        quote.status !== Status.ASKED &&
        quote.userDecision !== UserDecision.PENDING
      ) {
        console.log("Yess1");

        let reservedList = JSON.parse(product.reserved);
        if (reservedList.length) {
          reservedList = reservedList.filter(
            (list: any) => list.quoteId !== quoteId
          );
          console.log("Yes 3");

          product.reserved = JSON.stringify(reservedList);

          console.log({ reservedList, productReserved: product.reserved });

          const saved = await productRepository.save(product);
          if (!saved) {
            return next(
              new errorHandler(
                "An error occured while updated item quantity",
                400
              )
            );
          }
          console.log("Yes 4");

          return res.status(200).json({ success: true });
        } else {
          return res.status(200).json({ success: true });
        }
      } else {
        console.log("Yess No change in product entity");

        return res.status(200).json({ success: true });
      }
    }

    if (units && Number(units) === data.units) {
      return next(new errorHandler("Please change units price", 400));
    } else if (units) {
      data.units = Number(units);
      let reservedList = JSON.parse(product?.reserved);

      if (
        quote.status !== Status.ASKED &&
        quote.userDecision !== UserDecision.PENDING
      ) {
        console.log("update 1");

        if (reservedList.length) {
          console.log("update 2");

          const found = reservedList.find(
            (list: any) => list.quoteId === quoteId
          );
          if (found) {
            console.log("update 3");

            found.reservedUnits = Number(units);
            reservedList = reservedList.filter(
              (list: any) => list.quoteId !== quoteId
            );

            product.reserved = JSON.stringify([...reservedList, found]);
            const saved = await productRepository.save(product);
            if (!saved) {
              return next(
                new errorHandler(
                  "An error occured while updated item quantity",
                  400
                )
              );
            }
            console.log("update 4");

            const updatedItem = await itemDetailRepository.save(data);
            if (!updatedItem) {
              return next(
                new errorHandler(
                  "An error occured while updated item quantity",
                  400
                )
              );
            }
            console.log("update 5");

            return res.status(200).json({ success: true });
          }
        }else{
          const updatedItem = await itemDetailRepository.save(data);
          if (!updatedItem) {
            return next(
              new errorHandler(
                "An error occured while updated item quantity",
                400
              )
            );
          }
  
          return res.status(200).json({ success: true });
        }
      } else {
        console.log("update 6");

        const updatedItem = await itemDetailRepository.save(data);
        if (!updatedItem) {
          return next(
            new errorHandler(
              "An error occured while updated item quantity",
              400
            )
          );
        }

        return res.status(200).json({ success: true });
      }
    }
  }
);

// CUSTOMER REQUEST QUOTE
const requestQuote = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, party, itemsList, totalPrice } = req.body;
    const { role } = res.locals?.user;
    const quote = new ReqQuotes();
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
        return next(new errorHandler("Invalid total Price", 400));
      // CHECK IF QUOTE CONTAINS PRODUCTS TO RENT
      if (!itemsList[0])
        return next(new errorHandler("Please add products to rent", 400));

      let data: any = [];
      // LOOPING THORUGHT LIST OF PRODUCTS TO RENT
      for (let index = 0; index < itemsList.length; ) {
        const item = itemsList[index];
        // CREATING NEW ITEM FOR EACH PRODUCT OF QUOTE
        const detail = new ItemDetail();
        detail.productId = item.id;
        detail.productCategory = item.category;

        detail.units = item.units;
        detail.productName = item.name;
        detail.productPrice = item.price;
        detail.rentDate = item.startDate;
        detail.deliverDate = item.endDate;
        detail.productImage = item.image;
        const saved = await itemDetailRepository.save(detail, { chunk: 50 });

        if (saved) {
          data.push(detail);
          index++;
        }
      }
      // SETTING QUOTES ITEMDETAILS
      quote.itemDetails = data;
      quote.status = Status.SENT;
      quote.totalPrice = Number(totalPrice);
      quote.emailRegistered = false;
    }
    console.log(quote);
    const saved = await quotesRespository.save(quote);
    if (!saved) {
      return next(new errorHandler("Failed to save the quote", 400));
    }

    const string = `https://www.falcohmsystem.be/item_list?id=${saved.id}`;
    // SENDING MAIL TO ADMIN THAT A QUOTE HAS BEN REGISTERED
    const msg = {
      to: `${quote.userEmail}`,
      from: "falcohm6tm@outlook.com", // Use the email address or domain you verified above
      subject: "Your Quote is Ready",
      text: "Hey,A new quote has been requested, go check it out.",
      html: `<a href=${string} style="color:red;">${string} </a>`,
    };
    console.log("1")
    await sgMail.send(msg);
    console.log("2")
    console.log("Email send is => ", string);
    return res.status(200).json({ success: true });
  }
);
const router = Router();

// OPEN ROUTES
router.post("/request", SetAuthUser, requestQuote);
router.get(
  "/all",
  SetAuthUser,
  authMiddleware,

  getQuotes
);
router.get("/my_quotes", SetAuthUser, authMiddleware, getUserQuotes);
router.put("/user_quote/:id", SetAuthUser, authMiddleware, userDecisionQuote);
router.get("/:id", SetAuthUser, getQuote);

// Procted ROUTES
router.put(
  "/add_items/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  addReqQuoteItems
);

router.put(
  "/discount/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  giveDiscount
);
router.put(
  "/item/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  editOrRemoveItems
);
router.delete(
  "/:id",
  SetAuthUser,
  authMiddleware,
  authorizeRoles("admin"),
  removeQuotes
);

export default router;
