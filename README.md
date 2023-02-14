# markdown-replace-section

Replace a section in a Markdown file with different content.

## Installation

```sh
npm install --save markdown-replace-section
```

## Usage

Code

```javascript
import replaceSection from "markdown-replace-section";

const markdown =
`
Title
=====

Old content

Other title
===========

Some other content
`;

const hungry = true; // Set to false to keep the Subtitle section
console.log(replaceSection(markdown, "Title", "New content", hungry));
```

Output

```markdown
Title
=====

New content

Other title
===========

Some other content
```

## License

See [LICENSE](LICENSE)
