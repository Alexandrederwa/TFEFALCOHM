import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ReqQuotes } from "./Quote";

@Entity("item_details") // item_details will be the name in database of the Table
export class ItemDetail {
  @PrimaryGeneratedColumn("uuid") // row id will be of type uuid
  id: string;

  @Column({ name: "product_id" }) 
  productId: string;

  @Column({ name: "product_price" })
  productPrice: number;

  @Column({ name: "product_name" })
  productName: string;
 
  @Column({ name: "product_category" ,nullable:true})
  productCategory: string;

  @Column({ name: "product_Image" })
  productImage: string;

  @Column({ name: "rent_date" })
  rentDate: string;

  @Column({ name: "deliver_date" })
  deliverDate: string;

  @ManyToOne(() => ReqQuotes, (reqQuote) => reqQuote.itemDetails, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }) // many to one realtion because each itemDetail is connected with a quote. Cascade option means that when a quote is deleted the item_detail related to it will also be deleted.
  reqQuote: ReqQuotes;

  @Column()
  units: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
