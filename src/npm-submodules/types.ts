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

// todo: remove!
export enum BuildMode {tsc, ngc}