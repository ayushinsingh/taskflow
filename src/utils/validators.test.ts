import { describe, expect, it } from "vitest";
import { getFieldErrors } from "./validators";

describe("Email Tests", () => {
  it("should give validation error for invalid email", () => {
    const email = "email.com";
    expect(getFieldErrors.email(email)).toBe("Not a valid email");
  })

  it("should give required error for empty email", () => {
    expect(getFieldErrors.email("")).toBe("Email is required");
  })

  it("should return empty string for valid email", () => {
    expect(getFieldErrors.email("abc@email.com")).toBe("");
  })
});

describe("Password Tests", () => {
  it("should give validation error for short password", () => {
    expect(getFieldErrors.password("1234567")).toBe("Password must be at least 8 characters");
  })

  it("should give required error for empty password", () => {
    expect(getFieldErrors.password("")).toBe("Password is required");
  })

  it("should return empty string for valid password", () => {
    expect(getFieldErrors.password("12345678")).toBe("");
  })
});

describe("User name Tests", () => {
  it("should give validation error for short name", () => {
    expect(getFieldErrors.name("A")).toBe("Name should be between 2 to 100 characters.");
  })

  it("should give validation error for short name", () => {
    expect(getFieldErrors.name("ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJA")).toBe("Name should be between 2 to 100 characters.");
  })

  it("should give required error for empty name", () => {
    expect(getFieldErrors.name("")).toBe("Name is required");
  })

  it("should return empty string for valid name", () => {
    expect(getFieldErrors.name("Ayush")).toBe("");
  })
});

describe("Workspace name Tests", () => {
  it("should give validation error for short workspace name", () => {
    expect(getFieldErrors.workspaceName("A")).toBe("Workspace name should be between 3 to 20 characters.");
  })

  it("should give validation error for short name", () => {
    expect(getFieldErrors.workspaceName("ABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJABCDEFGHIJA")).toBe("Workspace name should be between 3 to 20 characters.");
  })

  it("should give required error for empty name", () => {
    expect(getFieldErrors.workspaceName("")).toBe("Workspace name is required");
  })

  it("should return empty string for valid name", () => {
    expect(getFieldErrors.workspaceName("Ayush")).toBe("");
  })
});
