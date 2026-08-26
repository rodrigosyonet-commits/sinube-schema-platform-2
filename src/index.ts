import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import {
  SinubeClient
} from "./client/sinube-client.js";

import {
  SchemaExtractor
} from "./extractors/schema-extractor.js";

import {
  FileStorage
} from "./storage/file-storage.js";

dotenv.config();

async function bootstrap() {

  console.log("");
  console.log("====================================");
  console.log(" SINUBE SCHEMA EXTRACTOR");
  console.log("====================================");
  console.log("");

  const emp = process.env.SINUBE_EMP;
  const suc = process.env.SINUBE_SUC;
  const usu = process.env.SINUBE_USU;
  const pas = process.env.SINUBE_PAS;

  if (!emp || !suc || !usu || !pas) {

    throw new Error(
      "Faltan variables de entorno. Verifica el archivo .env"
    );

  }

  const outputDir =
    path.join(process.cwd(), "output");

  if (!fs.existsSync(outputDir)) {

    fs.mkdirSync(outputDir, {
      recursive: true
    });

  }

  console.log("Configuración cargada");
  console.log(`Empresa: ${emp}`);
  console.log(`Sucursal: ${suc}`);
  console.log("");

  const client =
    new SinubeClient({
      emp,
      suc,
      usu,
      pas
    });

  console.log("Iniciando extracción...");
  console.log("");

  const schema =
    await new SchemaExtractor(
      client
    ).execute();

  console.log("");
  console.log(
    `Entidades encontradas: ${schema.length}`
  );

  FileStorage.save(
    "./output/schema.json",
    schema
  );

  console.log("");
  console.log(
    "✓ schema.json generado correctamente"
  );

  const entities =
    schema.map(
      entity => entity.entity
    );

  FileStorage.save(
    "./output/entities.json",
    entities
  );

  console.log(
    "✓ entities.json generado correctamente"
  );

  console.log("");
  console.log("Proceso finalizado.");
  console.log("");

}

bootstrap()
  .then(() => {

    process.exit(0);

  })
  .catch((error) => {

    console.error("");
    console.error("ERROR:");
    console.error(error);
    console.error("");

    process.exit(1);

  });
