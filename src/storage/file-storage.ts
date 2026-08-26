import fs from "fs";

export class FileStorage {

  static save(
    file: string,
    data: unknown
  ) {

    fs.writeFileSync(
      file,
      JSON.stringify(
        data,
        null,
        2
      )
    );

  }
}
