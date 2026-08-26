export interface SinubeConfig {
  emp: string;
  suc: string;
  usu: string;
  pas: string;
}

export class SinubeClient {

  private readonly url =
    "https://getpost-dot-facturanube.appspot.com/getpost";

  constructor(
    private readonly config: SinubeConfig
  ) {}

  async execute(sql: string): Promise<string> {

    const body = new URLSearchParams({
      tipo: "3",
      emp: this.config.emp,
      suc: this.config.suc,
      usu: this.config.usu,
      pas: this.config.pas,
      cns: sql
    });

    const response =
      await fetch(this.url, {
        method: "POST",
        body
      });

    return response.text();
  }
}
