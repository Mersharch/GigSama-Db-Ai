import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("projects")
export class Project {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  userID: string | undefined;

  @Column({ type: "varchar" })
  title: string | undefined;

  @Column("jsonb")
  conversation:
    | Array<{
        userInput: string;
        schemaCode: string | null;
        aiResponse: string;
      }>
    | undefined;

  @CreateDateColumn()
  createdAt: Date | undefined;

  @UpdateDateColumn()
  updatedAt: Date | undefined;

  constructor() {
    this.id = uuidv4();
  }
}
