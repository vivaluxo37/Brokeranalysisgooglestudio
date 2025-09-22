

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

console.log('Starting prerender script...');

try {
    // Read brokers data from the TS file.
    const brokersTS = fs.readFileSync(toAbsolute('../data/brokers.ts'), 'utf-8');
    const brokers = [];
    // FIX: Updated the regex to correctly parse only the content of the description string.
    // The previous regex was too greedy and captured unrelated data, breaking meta tags.
    const brokerObjectsRegex = /{\s*id:\s*'([^']+)'.*?name:\s*'([^']+)'.*?description:\s*'([^']*)'/g;
    
    let match;
    while((match = brokerObjectsRegex.exec(brokersTS)) !== null) {
        brokers.push({
            id: match[1],
            name: match[2],
            description: match[3] // The description is now correctly captured.
        });
    }
    console.log(`Found ${brokers.length} brokers to prerender.`);

    // Load the built server entry and the client HTML template
    const template = fs.readFileSync(toAbsolute('../dist/client/index.html'), 'utf-8');
    const { render } = await import(toAbsolute('../dist/server/prerender-entry.js'));
    console.log('Loaded template and server bundle.');

    // Prerender each broker page
    for (const broker of brokers) {
        const url = `/broker/${broker.id}`;
        const appHtml = render(url);

        const title = `${broker.name} Review & Analysis | Brokeranalysis`;
        const description = broker.description.substring(0, 160).replace(/\s+/g, ' ').trim(); // Trim to 160 chars and remove newlines

        const headHtml = `
            <title>${title}</title>
            <meta name="description" content="${description}" />
        `;

        const html = template
            .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
            .replace(`</head>`, `<meta name="description" content="${description}" /></head>`) // Add meta description
            .replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);

        const dirPath = toAbsolute(`../dist/client/broker/${broker.id}`);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        const filePath = path.join(dirPath, 'index.html');
        fs.writeFileSync(filePath, html);
        console.log(`  ✓ Prerendered: ${url}`);
    }

    console.log('Prerender complete!');

} catch (error) {
    console.error('❌ Error during prerendering:', error);
    process.exit(1);
}