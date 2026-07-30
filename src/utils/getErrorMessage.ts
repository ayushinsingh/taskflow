import axios from "axios";

/**
 * Pulls the most useful message out of an unknown thrown value.
 *
 * The nested optional chain matters: a network failure (backend down, CORS)
 * is still an AxiosError but has no `response`, and a 502 can have a
 * `response` with no JSON `data`. Both fall through to axios' own message.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
