import fs from 'fs';

const filePath = 'src/pages/ResourcesPage.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Find the entry by its unique identifier
const searchMarker = 'title: "RAG KB Implementation Guide"';
const startIdx = content.indexOf(searchMarker);

if (startIdx === -1) {
  console.log('Entry not found by marker');
  process.exit(1);
}

// Find the start of the object (go back to find "icon: Brain")
const objStart = content.lastIndexOf('icon: Brain', startIdx);
// Find the end of the object (find the closing brace with comma after href)
const hrefIdx = content.indexOf('href: "#contact"', objStart);
const objEnd = content.indexOf('},', hrefIdx) + 2;

console.log('Object boundaries:', objStart, '-', objEnd);

const oldEntry = content.substring(objStart, objEnd);
console.log('Found entry:\n', oldEntry);

const newEntry = `icon: Brain,
    key: "ragGuide",
    type: "Guide",
    category: "ai",
    tags: ["knowledge-base", "rag", "governance"],
    updatedAt: "2025-12-30",
    timeToComplete: "1 hour",
    usefulness: 9,
    href: "#contact",
  },`;

content = content.substring(0, objStart) + newEntry + content.substring(objEnd);
fs.writeFileSync(filePath, content, 'utf-8');
console.log('File updated successfully');
