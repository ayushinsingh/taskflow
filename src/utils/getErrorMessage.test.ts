import { describe, expect, it } from "vitest";
import { AxiosError, AxiosHeaders } from "axios";
import { getErrorMessage } from "./getErrorMessage";

const FALLBACK = "Something went wrong";

function makeAxiosError(
  message: string,
  response?: { status: number; data: unknown },
): AxiosError {
  const config = { headers: new AxiosHeaders() };
  const error = new AxiosError(message, "ERR_BAD_REQUEST", config);
  if (response) {
    error.response = {
      status: response.status,
      statusText: "",
      data: response.data,
      headers: new AxiosHeaders(),
      config,
    } as AxiosError["response"];
  }
  return error;
}

describe("getErrorMessage", () => {
  it("prefers the server's message when the response carries one", () => {
    const error = makeAxiosError("Request failed with status code 401", {
      status: 401,
      data: { message: "Invalid credentials" },
    });
    expect(getErrorMessage(error, FALLBACK)).toBe("Invalid credentials");
  });

  it("falls back to axios' message when the response has no JSON body", () => {
    // A 502 from a proxy typically returns HTML or nothing at all.
    const error = makeAxiosError("Request failed with status code 502", {
      status: 502,
      data: undefined,
    });
    expect(getErrorMessage(error, FALLBACK)).toBe(
      "Request failed with status code 502",
    );
  });

  it("falls back to axios' message when data is a non-object", () => {
    const error = makeAxiosError("Request failed with status code 500", {
      status: 500,
      data: "<html>Internal Server Error</html>",
    });
    expect(getErrorMessage(error, FALLBACK)).toBe(
      "Request failed with status code 500",
    );
  });

  // The regression that mattered: an unreachable backend is still an
  // AxiosError, but has no `response` at all. Reading response?.data?.message
  // yields undefined, and an earlier version returned that to the UI.
  it("returns a readable message when the request never got a response", () => {
    const error = makeAxiosError("Network Error");
    expect(getErrorMessage(error, FALLBACK)).toBe("Network Error");
  });

  it("uses the message of a plain Error", () => {
    expect(getErrorMessage(new Error("Boom"), FALLBACK)).toBe("Boom");
  });

  it("uses the fallback for values that are not Errors", () => {
    expect(getErrorMessage("just a string", FALLBACK)).toBe(FALLBACK);
    expect(getErrorMessage(null, FALLBACK)).toBe(FALLBACK);
    expect(getErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
  });
});
