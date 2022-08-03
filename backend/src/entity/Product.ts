import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

//Allowed categories for the products
export enum ProductCaregories {
    MUSIC = 'music',
    LIGHT = 'light',
    DIGITAL = 'digital'
  }

@Entity("products") // products will be the table name in database
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  stock: number;

  @Column()
  price: number;
  
  @Column({default:`[]`})//Reserved is a field which  will contain rentDate and deliverDate when a quote is accepted by client
  reserved: string; 
  
  @Column({type:"enum",enum:ProductCaregories,default:ProductCaregories.MUSIC})//enum is used to allow only specfic categories.
  category: ProductCaregories;

 
  @CreateDateColumn({name:"created_at"})
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

 
}
