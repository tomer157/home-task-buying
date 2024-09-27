// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    URL: string;
    USERNAME: string;
    PASSWORD: string;
  }
}
