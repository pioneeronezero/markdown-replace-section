import type { Heading, Root } from "mdast";
import { remark } from "remark";

export function replaceSection(document: string, headingName: string, content: string, hungry = true): string {
  const node = remark.parse(document);

  const heading = findHeading(document, node, headingName);
  if (heading) {
    const { start, end } = findSectionRange(node, heading, hungry);

    return replaceRange(document, { start, end }, content);
  }
  return document;
}

function replaceRange(document: string, { start, end }: { start: number; end?: number; }, content: string) {
  const before = document.slice(0, start);
  const after = document.slice(end);

  if (after === "") {
    return `${before}\n\n${content}\n`;
  }

  return `${before}\n\n${content}\n\n${after}`;
}

function findSectionRange(node: Root, heading: Heading, hungry = true) {
  const headingIndex = node.children.indexOf(heading);

  const sectionStart = heading.position?.end.offset ?? 0;
  let sectionEnd;

  for (const sibling of node.children.slice(headingIndex + 1)) {
    if (sibling.type === "heading") {
      if (!hungry || sibling.depth === heading.depth) {
        sectionEnd = sibling.position?.start.offset;
        break;
      }
    } else {
      sectionEnd = sibling.position?.end.offset ?? sectionStart + 1;
    }
  }

  return { start: sectionStart, end: sectionEnd };
}

function findHeading(document: string, node: Root, name: string): Heading | undefined {
  for (const child of node.children) {
    const { type } = child;

    if (type === "heading") {
      const content = getContent(document, child);

      if (content === name) {
        return child;
      }
    }
  }
}

function getContent(document: string, child: Heading) {
  let contentRange = { start: 0, end: 0 };
  if (child.children.length === 1) {
    if (child.children[0].position) {
      const position = child.children[0].position;
      contentRange = { start: position.start.offset ?? 0, end: position.end.offset ?? 0 };
    }
  } else if (child.children.length > 1) {
    const firstPosition = child.children[0].position;
    const lastPosition = child.children[child.children.length - 1].position;
    contentRange = { start: firstPosition?.start.offset ?? 0, end: lastPosition?.end.offset ?? 0 };
  }

  const { start, end } = contentRange;
  return document.slice(start, end);
}
