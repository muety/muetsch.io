'use strict';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const pug = require('pug')
    , MarkdownIt = require('markdown-it')
    , md = new MarkdownIt()
    , removeMd = require('remove-markdown')
    , fs = require('fs')
    , _ = require('lodash');

const PAGES_DIR = './src/pages'
    , OUT_DIR = './dist/src'
    , CONTENT_DIR = './src/content'
    , BLOG_CONTENT_DIR = './src/articles'
    , LAYOUTS_DIR = './src/layouts'
    , SNIPPET_LENGTH = 200;

const run = (devMode) => {
    console.log('Compiling...');

    let pugOptions = {
        pretty: devMode || false
    };

    let pagesFiles = fs.readdirSync(PAGES_DIR);
    let articlesFiles = fs.readdirSync(BLOG_CONTENT_DIR);
    let articles = {};

    /* Compile articles' markdown and build array. */
    articlesFiles.forEach((file) => {
        file = file.replace('.md', '');
        let markdown = fs.readFileSync(`${BLOG_CONTENT_DIR}/${file}.md`, 'utf-8');
        let compiledMarkdown = md.render(markdown);

        let title = markdown.substr(0, markdown.indexOf('\n')).replaceAll('#', '');
        let snippet = removeMd(markdown.substr(markdown.indexOf('\n') + 1, SNIPPET_LENGTH));

        let compiledTemplate = pug.renderFile(`${LAYOUTS_DIR}/article.pug`, pugOptions);
        compiledTemplate = compiledTemplate.replace('$markdown$', compiledMarkdown);
        fs.writeFileSync(`${OUT_DIR}/${file}.html`, compiledTemplate);
        articles[title] = {link: `${file}.html`, snippet: snippet};
    });

    /* Build pages */
    pagesFiles.forEach((page) => {
        page = page.replace('.pug', '');
        let compiledTemplate;

        /* Compile pug template */
        let opts = page === 'blog' ? _.assign(pugOptions, {articles: articles}) : pugOptions;
        compiledTemplate = pug.renderFile(`${PAGES_DIR}/${page}.pug`, opts);

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