export class CourseNodeModel {
  constructor(
    public index: number,
    public type: CourseNodeTypes,
    public title: string,
    public parent: CourseNodeModel,
    public children: CourseNodeModel[],
    public content: string
  ) { }
}

type Narrowable = string | number | boolean | symbol | object | {} | void | null | undefined;
const tuple = <T extends Narrowable[]>(...args: T) => args;

export const courseNodeTypes = tuple("Section", "SimpleContent", "Activity", "ActivityQuestion", "ActivityAnswer", "Figure");
export type CourseNodeTypes = (typeof courseNodeTypes)[number];
