// todo: export to some typings
// todo: add documentation
export interface TsmOptions {
  src: string;
  dist: string;
  project: string;
  pkg: any;
  /**
   * Array of local cross dependencies
   * */
  cross?: string[];
}

export interface BuildOptions {
  project: string;
  verbose: boolean;
  clean: boolean;
  local: boolean
}