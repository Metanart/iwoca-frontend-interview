import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchApplications, TApplicationServerDto } from "./fetchApplications";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("fetchApplications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch applications successfully with pagination", async () => {
    const mockApplications: TApplicationServerDto[] = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        loan_amount: 50000,
        loan_type: "Business Loan",
        email: "john.doe@example.com",
        company: "Test Company",
        date_created: "2023-01-01",
        expiry_date: "2023-12-31",
        avatar: "https://example.com/avatar.jpg",
        loan_history: [],
      },
    ];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi
          .fn()
          .mockReturnValue(
            '<http://localhost:3001/api/applications?_page=1&_limit=5>; rel="first", <http://localhost:3001/api/applications?_page=2&_limit=5>; rel="next", <http://localhost:3001/api/applications?_page=20&_limit=5>; rel="last"'
          ),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(1, 5);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/applications?_page=1&_limit=5"
    );
    expect(result.applications).toEqual([
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        loanAmount: "£50,000",
        loanType: "Business Loan",
        email: "john.doe@example.com",
        company: "Test Company",
        dateCreated: "01-01-2023",
        expiryDate: "31-12-2023",
        avatar: "https://example.com/avatar.jpg",
        loanHistory: [],
      },
    ]);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 20,
      hasNext: true,
      hasPrev: false,
    });
  });

  it("should handle response without Link header", async () => {
    const mockApplications: TApplicationServerDto[] = [];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi.fn().mockReturnValue(null),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(1, 5);

    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it("should handle pagination for page > 1", async () => {
    const mockApplications: TApplicationServerDto[] = [];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi
          .fn()
          .mockReturnValue(
            '<http://localhost:3001/api/applications?_page=1&_limit=5>; rel="first", <http://localhost:3001/api/applications?_page=3&_limit=5>; rel="next", <http://localhost:3001/api/applications?_page=2&_limit=5>; rel="prev", <http://localhost:3001/api/applications?_page=20&_limit=5>; rel="last"'
          ),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(2, 5);

    expect(result.pagination).toEqual({
      currentPage: 2,
      totalPages: 20,
      hasNext: true,
      hasPrev: true,
    });
  });

  it("should handle last page without next link", async () => {
    const mockApplications: TApplicationServerDto[] = [];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi
          .fn()
          .mockReturnValue(
            '<http://localhost:3001/api/applications?_page=1&_limit=5>; rel="first", <http://localhost:3001/api/applications?_page=19&_limit=5>; rel="prev"'
          ),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(20, 5);

    expect(result.pagination).toEqual({
      currentPage: 20,
      totalPages: 1, // No last link, so defaults to 1
      hasNext: false,
      hasPrev: true,
    });
  });

  it("should handle network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const result = await fetchApplications(1, 5);

    expect(result.applications).toEqual([]);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it("should handle HTTP error response", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(1, 5);

    expect(result.applications).toEqual([]);
    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it("should use default parameters when none provided", async () => {
    const mockApplications: TApplicationServerDto[] = [];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi.fn().mockReturnValue(null),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    await fetchApplications();

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3001/api/applications?_page=1&_limit=5"
    );
  });

  it("should parse complex Link header correctly", async () => {
    const mockApplications: TApplicationServerDto[] = [];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi
          .fn()
          .mockReturnValue(
            '<http://localhost:3001/api/applications?_page=1&_limit=5>; rel="first", <http://localhost:3001/api/applications?_page=3&_limit=5>; rel="next", <http://localhost:3001/api/applications?_page=1&_limit=5>; rel="prev", <http://localhost:3001/api/applications?_page=10&_limit=5>; rel="last"'
          ),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(2, 5);

    expect(result.pagination).toEqual({
      currentPage: 2,
      totalPages: 10,
      hasNext: true,
      hasPrev: true,
    });
  });

  it("should handle malformed Link header gracefully", async () => {
    const mockApplications: TApplicationServerDto[] = [];

    const mockResponse = {
      ok: true,
      json: vi.fn().mockResolvedValue(mockApplications),
      headers: {
        get: vi.fn().mockReturnValue("invalid-link-header"),
      },
    };

    mockFetch.mockResolvedValue(mockResponse);

    const result = await fetchApplications(1, 5);

    expect(result.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });
});
