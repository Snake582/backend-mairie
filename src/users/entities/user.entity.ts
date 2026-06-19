import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Request } from '../../request/entities/request.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  phone!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  adresse?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  numeroCni?: string;

  @Column({ nullable: true })
  resetPasswordCode?: string;

  @Column({ nullable: true, type: 'datetime' })
  resetPasswordCodeExpiresAt?: Date;

  @OneToMany(() => Request, (request) => request.user)
  requests!: Request[];
}