import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
  @Column({ default: false, nullable: true })
  subscribed: boolean;
  @Column({ nullable: false, default: "user" })
  role: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

	// Before saving a user the password of the user is hashed.
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 7);
  }
}
