import { neon } from "@neondatabase/serverless";
import { env } from "../config/env.js";

export const sql = neon(env.databaseUrl);

export const query = async (text, params = []) => {
  if (params.length === 0) {
    const rows = await sql(text);

    return {
      rows,
      rowCount: rows.length,
    };
  }

  throw new Error(
    "Parameterized queries are not supported by this query helper yet."
  );
};