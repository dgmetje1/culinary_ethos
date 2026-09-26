import { describe, it, expect, beforeEach, vi } from "vitest";
import { UsersController } from "./users.controller";

describe("UsersController (Social)", () => {
  let controller: UsersController;
  let mockService: any;

  const mockUserAccount = {
    id: "user123",
    accountId: "acc123",
    nickName: "testuser",
    name: "Test",
    lastName: "User",
    email: "test@example.com",
    language: "en",
    profilePicture: null,
  };

  const mockUserSummary = {
    id: "user123",
    nickName: "testuser",
    name: "Test",
    lastName: "User",
    profilePicture: null,
  };

  beforeEach(() => {
    mockService = {
      createUser: vi.fn(),
      getDataByAccountId: vi.fn(),
      getDataById: vi.fn(),
      getDataSummaryById: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    };
    controller = new UsersController(mockService);
  });

  describe("createUser", () => {
    it("should create user and return account response", async () => {
      mockService.createUser.mockResolvedValue(mockUserAccount);
      const dto = {
        account_id: "acc123",
        nick_name: "testuser",
        name: "Test",
        last_name: "User",
        email: "test@example.com",
        language: "en",
      };

      const result = await controller.createUser(dto);

      expect(result).toEqual(mockUserAccount);
      expect(mockService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe("getUserByAccountId", () => {
    it("should return user by account id", async () => {
      mockService.getDataByAccountId.mockResolvedValue(mockUserAccount);

      const result = await controller.getUserByAccountId("acc123");

      expect(result).toEqual(mockUserAccount);
      expect(mockService.getDataByAccountId).toHaveBeenCalledWith("acc123");
    });
  });

  describe("getUserById", () => {
    it("should return user by id", async () => {
      mockService.getDataById.mockResolvedValue(mockUserAccount);

      const result = await controller.getUserById("user123");

      expect(result).toEqual(mockUserAccount);
      expect(mockService.getDataById).toHaveBeenCalledWith("user123");
    });
  });

  describe("getUserSummaryById", () => {
    it("should return user summary", async () => {
      mockService.getDataSummaryById.mockResolvedValue(mockUserSummary);

      const result = await controller.getUserSummaryById("user123");

      expect(result).toEqual(mockUserSummary);
      expect(mockService.getDataSummaryById).toHaveBeenCalledWith("user123");
    });
  });

  describe("updateUser", () => {
    it("should update user and return account response", async () => {
      const updated = { ...mockUserAccount, nickName: "updated" };
      mockService.updateUser.mockResolvedValue(updated);
      const dto = { nick_name: "updated" };

      const result = await controller.updateUser("user123", dto);

      expect(result).toEqual(updated);
      expect(mockService.updateUser).toHaveBeenCalledWith("user123", dto);
    });
  });

  describe("deleteUser", () => {
    it("should delete user", async () => {
      await controller.deleteUser("user123");

      expect(mockService.deleteUser).toHaveBeenCalledWith("user123");
    });
  });
});
