export type SectionsTypes = 'section' | 'text' | 'figure' | 'li' | 'ul' | 'table' | 'tr' | 'td';
export type TextStyles = 'bold' | 'uderline';
export type Levels = 'tc' | '1bac' | '2bac';
export type Branches = 'l' | 's' | 'se' | 'sm' | 'sp' | 'svt';
export type Numbers = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

export abstract class ISectionNode {
    constructor(public type: SectionsTypes, public content: string | ISectionNode[], public parent: ISectionNode) {}
}

export class Section extends ISectionNode {
    constructor(public title: string, public sectionLevel: string, content: ISectionNode[], parent: ISectionNode) {
        super('section', content, parent);
    }
}

export class Course extends Section {
    constructor(
        public levels: Levels[],
        public branches: Branches[],
        public units: Numbers[],
        public chapter: Numbers,
        title: string,
        content: ISectionNode[],
        parent: ISectionNode,
    ) {
        super(title, '0', content, parent);
    }
}

export class Text extends ISectionNode {
    constructor(content: string | Text[], public styles: TextStyles[], parent: ISectionNode) {
        super('text', content, parent);
    }
}

export class Figure extends ISectionNode {
    constructor(content: string /*src and alt*/, parent: ISectionNode) {
        super('figure', content, parent);
    }
}

export class Ul extends ISectionNode {
    constructor(content: Li[], parent: ISectionNode) {
        super('ul', content, parent);
    }
}

export class Li extends ISectionNode {
    constructor(content: ISectionNode[], parent: ISectionNode) {
        super('li', content, parent);
    }
}

export class Td extends ISectionNode {
    constructor(content: ISectionNode[], parent: ISectionNode) {
        super('td', content, parent);
    }
}

export class Tr extends ISectionNode {
    constructor(content: Td[], parent: ISectionNode) {
        super('tr', content, parent);
    }
}

export class Table extends ISectionNode {
    constructor(content: Tr[], parent: ISectionNode) {
        super('table', content, parent);
    }
}
