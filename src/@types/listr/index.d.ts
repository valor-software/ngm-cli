declare module 'listr' {
  declare interface ListrTask {
    title: string;
    task: Function;
    skip?: Function;
  }
  declare interface ListrOptions {
    concurrent: boolean;
    renderer:string|Object;
    showSubtasks:boolean;
  }
  declare class Listr {
    constructor(tasks:ListrTask[], opts?:ListrOptions);
    run(context?:Object):Promise<any>;
    add(task:ListrTask):Listr;
    get task():ListrTask|ListrTask[];
    render():any;
  }
  export = Listr;
}