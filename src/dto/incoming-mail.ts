import IncomingMail from "../entities/incoming-mail";
import User from "../entities/user";

export class NewMailDto {
  agenda?: string;
  number?: string;
  origin?: string;
  regarding?: string;
  followUp?: string;
  explanation?: string;
  evidence?: string;
  attachment?: string;
  recipient?: string;
  mailingDate?: Date;
  receivedDate?: Date;
  archiver?: User;
  is_active?: boolean;
}

export class MailListDto {
  uuid?: string;
  agenda?: string;
  number?: string;
  origin?: string;
  regarding?: string;
  mailingDate?: Date;
  receivedDate?: Date;
}

export interface PaginationOptions {
  pageNumber: number;
  pageSize: number;
  sortingField?: string;
  sortOrder?: "ASC" | "DESC";
  startDate?: string;
  endDate?: string;
  agenda?: string;
  active?: boolean;
}

export interface PaginationInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface MailsResponse {
  mails: IncomingMail[];
  pagination: PaginationInfo;
}
