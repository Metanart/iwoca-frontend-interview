export type TApplication = {
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

export type TPaginationInfo = {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
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
  applications: TApplication[];
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
      applications: data as TApplication[],
      pagination: parsePaginationInfo(linkHeaderMetadata, page),
    };
  } catch (error) {
    throw new Error("Failed to fetch applications");
  }
};
