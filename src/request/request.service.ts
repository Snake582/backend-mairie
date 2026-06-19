import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "./entities/request.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { CreateRequestDto } from "./dto/create-request.dto";

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    dto: CreateRequestDto,
    userId: number,
  ) {
    const user =
      await this.userRepository.findOne({
        where: { id: userId },
      });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const requestData = dto.data as unknown;

    const request =
      this.requestRepository.create({
        type: dto.type,
        data: requestData,
        user,
      });

    return this.requestRepository.save(
      request,
    );
  }

  async findByUser(userId: number) {
  return this.requestRepository.find({
    where: {
      user: {
        id: userId,
      },
    },
    order: {
      createdAt: 'DESC',
    },
  });
}
}