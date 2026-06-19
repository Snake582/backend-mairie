import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

    @Column()
  type!: string;

  @Column("json")
  data!: any;
  @Column({
    default: 'pending',
  })
  status!: string;

  @ManyToOne(
    () => User,
    (user) => user.requests,
  )
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}