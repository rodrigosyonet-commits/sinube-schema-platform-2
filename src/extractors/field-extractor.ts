import { SinubeClient } from "../client/sinube-client.js";
import { parseSiNube } from "../parser/parse-sinube.js";

export class FieldExtractor {

  constructor(
    private client: SinubeClient
  ) {}

  async execute(
    entity: string
  ) {

    const sql = `
      SELECT campo,tipo
      FROM DbEntidadCampo
      WHERE entidad='${entity}'
      TAMPAG 999
    `;

    const raw =
      await this.client.execute(sql);

    return parseSiNube(raw).rows;
  }
}
