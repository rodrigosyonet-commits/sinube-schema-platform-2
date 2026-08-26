export interface ParsedResult {

  count: number;

  cursor: string | null;

  headers: string[];

  rows: Record<string, string>[];
}

export function parseSiNube(
  raw: string
): ParsedResult {

  const chunks =
    raw.split("¬");

  const header =
    chunks[0].split("|");

  const count =
    Number(header[0]);

  const cursor =
    header[1] === "&NullSiNube;"
      ? null
      : header[1];

  const headers: string[] = [];

  for (
    let i = 2;
    i < header.length;
    i += 2
  ) {
    headers.push(header[i]);
  }

  const rows =
    chunks
      .slice(1)
      .filter(Boolean)
      .map((row) => {

        const values =
          row.split("|");

        const record:
          Record<string, string> = {};

        headers.forEach(
          (column, index) => {

            record[column] =
              values[index] ?? "";

          }
        );

        return record;
      });

  return {
    count,
    cursor,
    headers,
    rows
  };
}
