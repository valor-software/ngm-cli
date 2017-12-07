declare module 'cpy' {
  declare interface CpyOptions {
    cwd?:string;
    parents?:boolean;
    rename?:string;
  }
  declare function cpy(files:string[], destination: string,
                       options?:CpyOptions, );
  export = cpy;
}