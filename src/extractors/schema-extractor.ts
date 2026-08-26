import { SinubeClient } from "../client/sinube-client.js";
import { EntityExtractor } from "./entity-extractor.js";
import { FieldExtractor } from "./field-extractor.js";

export class SchemaExtractor {

  constructor(
    private client: SinubeClient
  ) {}

  async execute() {

    const entities =
      await new EntityExtractor(
        this.client
      ).execute();

    const schema = [];

    const fieldExtractor =
      new FieldExtractor(
        this.client
      );

    for (const entity of entities) {

      console.log(
        `Leyendo ${entity}`
      );

      const fields =
        await fieldExtractor.execute(
          entity
        );

      schema.push({
        entity,
        fields: fields.map(
          f => ({
            name: f.campo,
            type: f.tipo
          })
        )
      });
    }

    return schema;
  }
}
