// todo: export to some typings
// todo: add documentation
declare interface TsmOptions {
  src: string;
  dist: string;
  tmp: string;
  project: string;
  pkg: any;
  /**
   * Array of local cross dependencies
   * */
  cross?: string[];
  tsconfig: {path: string; config: any;}
}

declare interface BuildOptions {
  project: string;
  verbose: boolean;
  clean: boolean;
  local: boolean;
}
