'use strict';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const pug = require('pug')
    , removeMd = require('remove-markdown')
    , fs = require('fs')
    , utils = require('./utils')
    , _ = require('lodash')
    , hljs = require('highlight.js')
    , md = require('markdown-it')({
        langPrefix: 'language-html',
        highlight: function(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return '<pre class="hljs"><code>' +
                        hljs.highlight(lang, str, true).value +
                        '</code></pre>';
                } catch (__) { }
            }

            return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
        }
    });

const PAGES_DIR = './src/pages'
    , ASSETS_DIR = './src/assets'
    , OUT_DIR = './dist'
    , CONTENT_DIR = './src/content'
    , BLOG_CONTENT_DIR = './src/articles'
    , LAYOUTS_DIR = './src/layouts'
    , SNIPPET_WORD_LENGTH = 30;

const run = (devMode) => {
    console.log('Compiling...');

    let pugOptions = {
        pretty: devMode || false
    };

    let pagesFiles = fs.readdirSync(PAGES_DIR);
    let articlesFiles = fs.readdirSync(BLOG_CONTENT_DIR);
    let articles = {};

    /* Clear dist dir */
    utils.deleteFolderRecursiveSync(OUT_DIR);
    fs.mkdirSync(OUT_DIR, '0755');

    /* Compile articles' markdown and build array. */
    /* Article with lowest prefix (e.g. 0_foo.md) appears on top */
    articlesFiles.forEach((file) => {
        file = file.replace('.md', '');
        let markdown = fs.readFileSync(`${BLOG_CONTENT_DIR}/${file}.md`, 'utf-8');
        let compiledMarkdown = md.render(markdown);
        compiledMarkdown = utils.formatCodeSnippet(compiledMarkdown);

        let title = markdown.substr(0, markdown.indexOf('\n')).replaceAll('#', '').trim();
        let snippet = removeMd(markdown.substr(markdown.indexOf('\n') + 1).split(' ').slice(0, SNIPPET_WORD_LENGTH).join(' '));
        let filename = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/[ ]/g, '-').replaceAll('--', '-');

        let compiledTemplate = pug.renderFile(`${LAYOUTS_DIR}/article.pug`, pugOptions);
        compiledTemplate = compiledTemplate.replace('$markdown$', compiledMarkdown);
        fs.writeFileSync(`${OUT_DIR}/${filename}.html`, compiledTemplate);
        articles[title] = { link: `${filename}.html`, snippet: snippet };
    });

    /* Build pages */
    pagesFiles.forEach((page) => {
        page = page.replace('.pug', '');
        let compiledTemplate;

        /* Compile pug template */
        let opts = page === 'blog' ? _.assign(pugOptions, { articles: articles }) : pugOptions;
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

    /* Copy assets */
    utils.copyFolderRecursiveSync(ASSETS_DIR, OUT_DIR);
};

run();

module.exports = {
    run: run,
    OUT_DIR: OUT_DIR
};