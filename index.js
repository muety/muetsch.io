'use strict';

const pug = require('pug')
    , MarkdownIt = require('markdown-it')
    , md = new MarkdownIt()
    , fs = require('fs');

const PAGES_DIR = './src/pages'
    , OUT_DIR = './dist/src'
    , CONTENT_DIR = './src/content';

const run = (devMode) => {
    console.log('Compiling...');

    let pugOptions = {
        pretty: devMode || false
    };

    let pages = fs.readdirSync('./src/pages');

    pages.forEach((page) => {
        page = page.replace('.pug', '');

        /* Compile pug template */
        let compiledTemplate = pug.renderFile(`${PAGES_DIR}/${page}.pug`, pugOptions);

        try {
            /* Compile related markdown to HTML and replace placeholder in compiled template HTML */
            let markdown = fs.readFileSync(`${CONTENT_DIR}/${page}.md`, 'utf-8');
            let compiledMarkdown = md.render(markdown);
            compiledTemplate = compiledTemplate.replace('$markdown$', compiledMarkdown);
        }
        catch (e) { }

        /* Write output file */
        fs.writeFileSync(`${OUT_DIR}/${page}.html`, compiledTemplate);
    });
};

run();

module.exports = {
    run: run,
    OUT_DIR: OUT_DIR
};