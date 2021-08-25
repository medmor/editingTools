
import { NODE_NAMES } from "./nodeNames";

import cheerio from 'cheerio';
import { CheerioAPI, Cheerio, Node } from 'cheerio';
import { first } from "rxjs/operators";
import { SIGCHLD } from "constants";


export class Xml2HtmlConverter {

    $ = cheerio.load('<div id="parent"></div>');
    sectId = 0;
    currentNode: ChildNode;
    currentSectionLevel: string;
    sections: Cheerio<Node>[] = [];
    styles: Element;
    figures: Map<string, string>;

    constructor() { }

    converte(content: NodeListOf<ChildNode>, styles: Element, figures: Map<string, string>) {
        this.styles = styles;
        this.figures = figures;
        this.currentSectionLevel = '1';
        this.sections[this.currentSectionLevel] = this.$('<div></div>');
        this.$('#parent').append(this.sections[this.currentSectionLevel]);
        this.parseChildrenNodes(content);
    }

    parseChildrenNodes(children: NodeListOf<ChildNode>) {

        let child = children[0];
        while (child) {
            this.currentNode = child;

            if (this.currentNode.nodeName === NODE_NAMES.P) {
                this.parseParagraphe();
            }

            else if (this.currentNode.nodeName === NODE_NAMES.H) {
                this.parseHeading();
            }

            else if (this.currentNode.nodeName === NODE_NAMES.LIST) {
                this.parseList();
            }

            else if (this.currentNode.nodeName === NODE_NAMES.TABLE) {
                this.parseTable();
            }
            else {
                console.log("not handled yet");
            }
            child = child.nextSibling as Element;
        }
    }

    parseHeading() {
        this.currentSectionLevel = this.getHeadingLevel();
        const sectionId = this.currentSectionLevel + this.sectId++;


        this.sections[this.currentSectionLevel] = this.$(
            `<div class="border-left border-dark pl-3 pt-1 collapse show" id="sect${sectionId}"></div>`);

        const heading = this.$(
            `<div class="badge-${this.getHeadingColor(this.currentSectionLevel)}">
                <h${this.currentSectionLevel}>${this.getHeadingText()}</h${this.currentSectionLevel}>
                <div class="text-right">
                    <button class="btn btn-sm" data-toggle="collapse" data-target="#sect${sectionId}" onclick="changeBtnIcon(btn${sectionId})">
                        <i id="btn${sectionId}" class= "fas fa-minus-square" ></i>
                    </button>
                </div>
            <div>                
            `);
        const parentLevel = (parseInt(this.currentSectionLevel) - 1).toString();
        this.sections[parentLevel].append(heading);
        this.sections[parentLevel].append(this.sections[this.currentSectionLevel]);
    }

    getHeadingLevel() {
        return (this.currentNode as any).getAttribute('text:outline-level');
    }

    getHeadingColor(level: string) {
        return level === '1' || level == '2' ? 'danger' : level === '3' ? 'success' : 'secondary';
    }

    getHeadingText() {
        return this.currentNode.textContent;
    }

    parseParagraphe() {
        let p;
        const bold = this.getStyle((this.currentNode as any).getAttribute("text:style-name"));
        if (bold)
            p = this.$('<b></b>');
        else
            p = this.$('<p></p>');
        this.parseParagrapheContent(this.currentNode.childNodes, p);
        this.sections[this.currentSectionLevel].append(p);
    }

    parseList() {
        const ul = this.$('<ul></ul>');
        for (let node of (this.currentNode as any).childNodes) {
            const li = this.$('<li></li>');
            ul.append(li);
            this.parseListItemContent(node.childNodes, li);
        }
        this.sections[this.currentSectionLevel].append(ul);
    }

    parseTable() {
        const table = this.$('<table class="table table-sm table-bordered table-striped table-dark"></table>');
        this.parseTableContent(this.currentNode.childNodes, table);
        this.sections[this.currentSectionLevel].append(table);
    }

    parseParagrapheContent(nodeChildren: NodeListOf<ChildNode>, paragraphe: Cheerio<Node>) {
        for (let node of (nodeChildren as any)) {

            if (node.nodeName === NODE_NAMES.FRAME) {
                const figureName = (node.childNodes[0] as Element).getAttribute("xlink:href").substr(9);
                console.log(figureName);
                const frame = this.$(`<div style="text-align:center"><img src="${this.figures.get(figureName)}"  class="img-thumbnail rounded border border-dark" onclick="resizeImg(event)" style="cursor: zoom-in;"></div>`);
                paragraphe.append(frame);
            }
            else if (node.nodeName === NODE_NAMES.SPAN) {
                let span;
                const name = (node as Element).getAttribute('text:style-name');
                if (this.getStyle(name))
                    span = this.$(`<b>${node.textContent}</b>`);
                else
                    span = this.$(`<span>${node.textContent}</span>`);
                paragraphe.append(span);
            } else {
                paragraphe.append(`<span>${node.textContent}</span>`);

            }
        }
    }

    parseListItemContent(nodeChildren: NodeListOf<ChildNode>, li: Cheerio<Node>) {
        for (let node of (nodeChildren as any)) {
            if (node.nodeName === NODE_NAMES.P) {
                const p = this.$('<p></p>');
                li.append(p);
                this.parseParagrapheContent(node.childNodes, p);
            }
            else if (node.nodeName === NODE_NAMES.LIST) {
                const ul = this.$('<ul></ul>');
                li.parent().append(ul);
                for (let nodeChile of node.childNodes) {
                    const liChild = this.$('<li></li>');
                    ul.append(liChild);
                    this.parseListItemContent(nodeChile.childNodes, liChild);
                }
            }
        }
    }

    parseTableContent(nodeChildren: NodeListOf<ChildNode>, table: Cheerio<Node>) {
        for (let node of (nodeChildren as any)) {
            if (node.nodeName === NODE_NAMES.TR) {
                this.parseTableRow(node.childNodes, table);
            }
        }
    }

    parseTableRow(nodeChildren: NodeListOf<ChildNode>, table: Cheerio<Node>) {
        const tr = this.$('<tr></tr>');
        table.append(tr);
        for (let node of (nodeChildren as any)) {
            if (node.nodeName === NODE_NAMES.TD) {
                this.parseTableCell(node.childNodes, tr);
            } else {
                tr.append(this.$('<td></td>'));
            }
        }
    }

    parseTableCell(nodeChildren: NodeListOf<ChildNode>, tableRow: Cheerio<Node>) {
        const td = this.$('<td></td>');
        tableRow.append(td);
        for (let node of (nodeChildren as any)) {
            if (node.nodeName === NODE_NAMES.P) {
                this.parseParagrapheContent(node.childNodes, td);
            }
        }
    }

    getStyle(name: string) {

        for (let child of (this.styles.children as any)) {
            if (child.getAttribute("style:name") == name) {
                const firstC = child.firstChild as Element;
                if (
                    firstC.getAttribute('fo:font-weight') == 'bold'
                    || firstC.getAttribute('style:font-weight-asian') == 'bold'
                    || firstC.getAttribute('style:font-weight-complex') == 'bold'
                )

                    return true;
            }
            if (child.attributes["fo:font-weight"] === "bold")
                return true;
        }
        return false;
    }
}

const headContent = `    
    <script src="https://kit.fontawesome.com/60c0e972f9.js"></script>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous" />
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script>
        function changeBtnIcon(id) {
            const icon = $(id);
            if (icon.hasClass("fa-plus-square")) {
                icon.removeClass("fa-plus-square");
                icon.addClass("fa-minus-square");
            } else {
                icon.removeClass("fa-minus-square");
                icon.addClass("fa-plus-square");
            }
        }

        function resizeImg(e) {
            const img = $(e.target);
            let src = img.attr("src");
            if (img.hasClass("img-thumbnail")) {
                img.removeClass("img-thumbnail");
                img.addClass("img-fluid");
                img.css("cursor", "zoom-out");
                src = src.replace("thumbnails/", "");
                //src = src.replace("jpg", "png");
                img.attr("src", src);
            } else {
                img.removeClass("img-fluid");
                img.addClass("img-thumbnail");
                img.css("cursor", "zoom-in");
                if (src.includes("exercices")) src = src.replace("/exercices", "/exercices/thumbnails");
                else src = src.replace("/chapter", "/thumbnails/chapter");
                //src = src.replace("png", "jpg");
                img.attr("src", src);
            }
            $("body").focus();
        }

        const coursesUtils = {
            changeBtnIcon(id) {
                const icon = $(id);
                if (icon.hasClass(" fa - plus - square ")) {
                    icon.removeClass(" fa - plus - square ");
                    icon.addClass(" fa - minus - square ");
                } else {
                    icon.removeClass(" fa- minus - square ");
                    icon.addClass(" fa - plus - square ");
                }
            },

            resizeImg(e) {
                const img = $(e.target);
                let src = img.attr(" src ");
                if (img.hasClass(" img - thumbnail ")) {
                    img.removeClass(" img - thumbnail ");
                    img.addClass(" img - fluid ");
                    img.css(" cursor ", " zoom - out ");
                    src = src.replace(" thumbnails /", "");
                    //src = src.replace(" jpg ", " png ");
                    img.attr(" src ", src);
                } else {
                    img.removeClass(" img - fluid ");
                    img.addClass(" img - thumbnail ");
                    img.css(" cursor ", " zoom -in");
                    if (src.includes(" exercices ")) src = src.replace(" /exercices&quot;, &quot;/exercices / thumbnails ");
                    else src = src.replace(" /chapter&quot;, &quot;/thumbnails / chapter ");
                    //src = src.replace(" png ", " jpg ");
                    img.attr(" src ", src);
                }
                $(" body ").focus();
            }
        }
    </script>`;
