import { Between, FindManyOptions, ILike } from "typeorm";

import ApiError from "../configs/api-error";
import { MailsResponse, NewMailDto, PaginationOptions } from "../dto/warrant";
import Warrant from "../entities/warrant";
import WarrantRepository from "../repositories/warrant";
import UserRepository from "../repositories/user";
import GenerateAgenda from "../utils/agenda";
import { uploadToS3 } from "../utils/s3";

export default class WarrantService {
  constructor(
    private readonly warrantRepository: WarrantRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createMail(
    userUUID: string,
    body: NewMailDto,
    evidence: any
  ): Promise<Warrant | []> {
    const existingUser = await this.userRepository.getUserByUUID(userUUID);

    if (!existingUser) throw new ApiError(404, "Account not found.");

    delete existingUser.password;

    let agenda = "0000001";

    const lastAgenda = await this.warrantRepository.getLastAgenda();

    if (lastAgenda) {
      agenda = await GenerateAgenda(lastAgenda.agenda);
    }

    if (evidence) {
      const document = await uploadToS3(
        `warrants/${evidence.originalname}`,
        evidence.buffer
      );

      body.evidence = document;
    }

    const mail = {
      ...body,
      agenda: agenda,
      archiver: existingUser,
    };

    return await this.warrantRepository.createMail(mail);
    // return [];
  }

  async mailList(options: PaginationOptions): Promise<MailsResponse> {
    const {
      pageNumber,
      pageSize,
      sortingField,
      sortOrder,
      startDate,
      endDate,
      agenda,
      active,
    } = options;

    const skip = (pageNumber - 1) * pageSize;

    const findOptions: FindManyOptions = {
      select: {
        uuid: true,
        agenda: true,
        number: true,
        dipa: true,
        place: true,
        startDate: true,
        endDate: true,
      },
      skip,
      take: pageSize,
      order: { [sortingField]: sortOrder || "ASC" },
      where: {
        is_active: active,
        agenda: ILike(`%${agenda}%`),
      },
    };

    if (startDate && endDate) {
      findOptions.where = {
        mailingDate: Between(startDate, endDate),
      };
    }

    const [mails, total] = await this.warrantRepository.paginate(findOptions);

    const totalPages = Math.ceil(total / pageSize);

    const response: MailsResponse = {
      mails,
      pagination: {
        pageNumber,
        pageSize,
        totalPages,
        totalItems: total,
      },
    };

    return response;
  }

  async detail(agenda: string): Promise<Warrant> {
    const result = await this.warrantRepository.getMailByAgenda(agenda);

    if (!result) throw new ApiError(404, "Mail not found.");

    delete result.archiver.password;

    return result;
  }

  async update(
    agenda: string,
    userUUID: string,
    body: NewMailDto,
    evidence: any
  ): Promise<Warrant> {
    const mail = await this.checkExistMail(agenda);

    if (mail.archiver.uuid !== userUUID) {
      throw new ApiError(403, "Unauthorized.");
    }

    if (evidence) {
      const document = await uploadToS3(
        `outgoing-mails/${evidence.originalname}`,
        evidence.buffer
      );

      body.evidence = document;
    }

    return await this.warrantRepository.updateMail(mail, body);
  }

  async softDelete(agenda: string): Promise<Warrant> {
    const mail = await this.checkExistMail(agenda);

    return await this.warrantRepository.softDelete(mail);
  }

  async restore(agenda: string): Promise<Warrant> {
    const mail = await this.checkExistMail(agenda, false);

    return await this.warrantRepository.restore(mail);
  }

  async deleteMail(agenda: string): Promise<boolean> {
    const mail = await this.checkExistMail(agenda, false);

    return await this.warrantRepository.deleteMail(mail.agenda);
  }

  async checkExistMail(
    agenda: string,
    active: boolean = true
  ): Promise<Warrant> {
    const exist = await this.warrantRepository.getMailByAgenda(agenda, active);

    if (!exist) throw new ApiError(404, "Mail not found.");

    delete exist.archiver.password;

    return exist;
  }
}
