
import { SinubeClient } from "../client/sinube-client.js";
import { parseSiNube } from "../parser/parse-sinube.js";

export class EntityExtractor {

  constructor(
    private readonly client: SinubeClient
  ) {}

  async execute(): Promise<string[]> {

    const sql = `
      SELECT entidad
      FROM DbEntidad
      TAMPAG 999
    `;

    const raw =
      await this.client.execute(sql);

    const data =
      parseSiNube(raw);

    return data.rows.map(
      r => r.entidad
    );
  }
}
