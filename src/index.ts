import fs from "node:fs/promises";
import path from "node:path";

import { SinubeClient } from "./sinube.js";
import { getEntities } from "./extractEntities.js";
import { getEntityFields } from "./extractFields.js";
import { detectRelations } from "./relationshipDetector.js";
import { buildHtml } from "./htmlExporter.js";

const OUTPUT_DIR = "output";

async function ensureOutputDirectory() {
    await fs.mkdir(OUTPUT_DIR, {
        recursive: true
    });
}

async function saveJson(
    filename: string,
    data: unknown
) {
    const filePath =
        path.join(
            OUTPUT_DIR,
            filename
        );

    await fs.writeFile(
        filePath,
        JSON.stringify(
            data,
            null,
            2
        ),
        "utf-8"
    );
}

async function retry<T>(
    fn: () => Promise<T>,
    retries = 3
): Promise<T> {

    let lastError: unknown;

    for (
        let attempt = 1;
        attempt <= retries;
        attempt++
    ) {

        try {

            return await fn();

        }
        catch (error) {

            lastError = error;

            console.warn(
                `Intento ${attempt}/${retries} falló`
            );

            if (
                attempt < retries
            ) {

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            2000
                        )
                );
            }
        }
    }

    throw lastError;
}

async function main() {

    console.log(
        "================================="
    );
    console.log(
        "SiNube Schema Mapper"
    );
    console.log(
        "================================="
    );

    await ensureOutputDirectory();

    const client =
        new SinubeClient(

            process.env.EMPRESA!,

            process.env.SUCURSAL!,

            process.env.USUARIO!,

            process.env.PASSWORD!
        );

    console.log(
        "Obteniendo entidades..."
    );

    const entities =
        await retry(
            () =>
                getEntities(
                    client
                )
        );

    console.log(
        `${entities.length} entidades encontradas`
    );

    await saveJson(
        "entities.json",
        entities
    );

    const schema:
        Record<
            string,
            {
                entity: string;
                fields: Record<
                    string,
                    unknown
                >[];
            }
        > = {};

    for (
        let i = 0;
        i < entities.length;
        i++
    ) {

        const entity =
            entities[i];

        console.log(
            `[${i + 1}/${entities.length}] ${entity}`
        );

        try {

            const fields =
                await retry(
                    () =>
                        getEntityFields(
                            client,
                            entity
                        )
                );

            schema[entity] = {
                entity,
                fields
            };

            /*
             * Guardado incremental
             * para no perder
             * el progreso.
             */

            await saveJson(
                "schema-full.json",
                schema
            );

            console.log(
                `   ${fields.length} campos`
            );
        }
        catch (error) {

            console.error(
                `Error procesando ${entity}`
            );

            console.error(
                error
            );
        }
    }

    console.log(
        "Detectando relaciones..."
    );

    const relations =
        detectRelations(
            schema
        );

    await saveJson(
        "relations.json",
        relations
    );

    const aiSchema = {

        metadata: {

            extractedAt:
                new Date()
                    .toISOString(),

            totalEntities:
                entities.length,

            totalRelations:
                relations.length,

            source:
                "SiNube"
        },

        entities:
            schema,

        relations
    };

    await saveJson(
        "schema-ai.json",
        aiSchema
    );

    console.log(
        "Generando HTML..."
    );

    await buildHtml(
        schema
    );

    console.log(
        "================================="
    );
    console.log(
        "Extracción finalizada"
    );
    console.log(
        "================================="
    );

    console.log(
        "Archivos generados:"
    );

    console.log(
        "output/entities.json"
    );

    console.log(
        "output/schema-full.json"
    );

    console.log(
        "output/schema-ai.json"
    );

    console.log(
        "output/relations.json"
    );

    console.log(
        "output/schema.html"
    );
}

main()
    .catch(error => {

        console.error(
            "Error fatal:"
        );

        console.error(
            error
        );

        process.exit(1);
    });
