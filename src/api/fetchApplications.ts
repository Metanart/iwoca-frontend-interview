import { formatDate } from "./utils/formatDate";
import { formatGbp } from "./utils/formatGbp";

export type TApplicationServerDto = {
  id: number;
  first_name: string;
  last_name: string;
  loan_amount: number;
  loan_type: string;
  email: string;
  company: string;
  date_created: string;
  expiry_date: string;
  avatar: string;
  loan_history: any[];
};

export type TApplicationClientDto = {
  id: number;
  firstName: string;
  lastName: string;
  loanAmount: string;
  loanType: string;
  email: string;
  company: string;
  dateCreated: string;
  expiryDate: string;
  avatar: string;
  loanHistory: any[];
};

export type TPaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

const convertServerDtoForClient = (
  application: TApplicationServerDto
): TApplicationClientDto => {
  return {
    id: application.id,
    firstName: application.first_name,
    lastName: application.last_name,
    loanAmount: formatGbp(application.loan_amount),
    loanType: application.loan_type,
    email: application.email,
    company: application.company,
    dateCreated: formatDate(application.date_created),
    expiryDate: formatDate(application.expiry_date),
    avatar: application.avatar,
    loanHistory: application.loan_history,
  };
};

const parsePaginationInfo = (
  linkHeaderMetadata: string,
  page: number
): TPaginationInfo => {
  let pagination: TPaginationInfo = {
    currentPage: page,
    totalPages: 1,
    hasNext: false,
    hasPrev: page > 1,
  };

  const links = linkHeaderMetadata.split(",").map((link) => link.trim());

  const nextLink = links.find((link) => link.includes('rel="next"'));

  const lastLink = links.find((link) => link.includes('rel="last"'));

  pagination.hasNext = !!nextLink;

  if (lastLink) {
    const lastPageMatch = lastLink.match(/_page=(\d+)/);

    if (lastPageMatch) {
      pagination.totalPages = parseInt(lastPageMatch[1]);
    }
  }

  return pagination;
};

export const fetchApplications = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  applications: TApplicationClientDto[];
  pagination: TPaginationInfo;
}> => {
  try {
    const response = await fetch(
      `http://localhost:3001/api/applications?_page=${page}&_limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch applications");
    }

    const data = await response.json();

    const linkHeaderMetadata = response.headers.get("Link");

    return {
      applications: data.map(convertServerDtoForClient),
      pagination: parsePaginationInfo(linkHeaderMetadata, page),
    };
  } catch (error) {
    throw new Error("Failed to fetch applications");
  }
};
