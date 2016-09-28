const pug = require('pug')
    , MarkdownIt = require('markdown-it')
    , md = new MarkdownIt()
    , fs = require('fs');

const PAGES_DIR = './src/pages'
    , OUT_DIR = './dist/src'
    , CONTENT_DIR = './src/content';

const run = (devMode) => {
    console.log('Compiling...');

    var pugOptions = {
        pretty: devMode || false
    };

    var pages = fs.readdirSync('./src/pages');

    pages.forEach((page) => {
        var page = page.replace('.pug', '');

        /* Compile pug template */
        var compiledTemplate = pug.renderFile(`${PAGES_DIR}/${page}.pug`, pugOptions);

        try {
            /* Compile related markdown to HTML and replace placeholder in compiled template HTML */
            var markdown = fs.readFileSync(`${CONTENT_DIR}/${page}.md`, 'utf-8');
            var compiledMarkdown = md.render(markdown);
            compiledTemplate = compiledTemplate.replace('$markdown$', compiledMarkdown);
        }
        catch (e) { }

        /* Write output file */
        fs.writeFileSync(`${OUT_DIR}/${page}.html`, compiledTemplate);
    });
};

run();

module.exports = run;