import { User } from "./User";
import { instanceToPlain, Expose } from "class-transformer";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ItemDetail } from "./itemDetail";
import { AppDataSource } from "../data-source";

//Quote Status Enum
export enum Status {
  ASKED = "asked",
  SENT = "sent",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  DISCOUNTED = "discounted"
}

//User decision Status
export enum UserDecision {
  PENDING = "pending",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  ASKDISCOUNT = "askDiscount"
}

@Entity("quotes") // quotes will be the name of the table in database
export class ReqQuotes {
  @PrimaryGeneratedColumn("uuid")
  id: string;
	
  @OneToMany(() => ItemDetail, (itemDetail) => itemDetail.reqQuote, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })// one to many relation is used because a quote contains mutiple itemDetails(products to be rented)
  itemDetails: ItemDetail[];


  //Expose decorator is used to get total number of item reserved its not stored in the database but when caluculated whenever a quote is fetched
  @Expose()
  get totalReserved(): number {
    let val = 0;
    if(this.itemDetails?.length){

      this.itemDetails.forEach((item) => {
        val += item.units;
      });
    }
    return val;
  }
  
  @Column({ name: "email_registered",default:false })
  emailRegistered: boolean;


	// This method is used to see that the user who requested the quote is registered or not.
  @BeforeInsert()
  @BeforeUpdate()
  async checkUser(): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    
    try {
      const found = await userRepository.findOne({
        where: { email: this.userEmail },
      });
      if (found) {
     
        this.emailRegistered = true;
      }else{ 
      this.emailRegistered = false;

      }
    
      
    } catch (error) {
      this.emailRegistered = false;

    }
    
  }

  @Column({ name: "user_email" })
  userEmail: string;

  @Column({nullable: true, name: "name_client" })
  nameClient: string;

  @Column({ name: "party" ,nullable:true})
  party: string;
  @Column({ name: "phone_number" })
  phone: string;
  @Column({ nullable: true, name: "total_price" })
  totalPrice: number;

  @Column({ type: "enum", enum: Status, default: Status.ASKED })
  status: Status;
  @Column({ name:"user_decision", type: "enum", enum: UserDecision, default: UserDecision.PENDING })
  userDecision: UserDecision;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
 
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
