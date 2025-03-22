import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string | undefined;

  @Column({ type: "varchar" })
  name: string | undefined;

  @Column({ type: "varchar" })
  email: string | undefined;

  @Column({ type: "varchar" })
  password: string | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;

  @UpdateDateColumn()
  updatedAt: Date | undefined;
}
