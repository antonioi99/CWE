const fs = require('fs');
const original = require('./story.js');

function stripContent(obj) {
    const result = {};
    for (const key in obj) {
        const node = obj[key];
        result[key] = {
            ...node,
            content: ''
        };
    }
    return result;
}

const stripped = stripContent(original);

const output = 'const storyNodes = ' + JSON.stringify(stripped, null, 4) + ';';

fs.writeFileSync('story_without_content.js', output);
console.log('Created story_without_content.js without content.');
