'use strict';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

const pug = require('pug')
    , removeMd = require('remove-markdown')
    , fs = require('fs')
    , path = require('path')
    , utils = require('./utils')
    , _ = require('lodash')
    , moment = require('moment')
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

const PAGES_DIR = path.normalize(__dirname + '/src/pages')
    , ASSETS_DIR = path.normalize(__dirname + '/src/assets')
    , OUT_DIR = path.normalize(__dirname + '/dist')
    , CONTENT_DIR = path.normalize(__dirname + '/src/content')
    , BLOG_CONTENT_DIR = path.normalize(__dirname + '/src/articles')
    , LAYOUTS_DIR = path.normalize(__dirname + '/src/layouts')
    , BASE_URL = 'https://ferdinand-muetsch.de/'
    , BASE_TITLE = 'Ferdinand Mütsch'
    , BASE_IMG = 'assets/img/avatar.jpg'
    , PLACEHOLDER_IMG = 'https://placehold.it/350x150'
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
        
        let imageUrl = utils.findImageUrlFromMarkdown(markdown, PLACEHOLDER_IMG);
        if (imageUrl.indexOf('http://') !== 0) imageUrl = BASE_URL + imageUrl;

        let compiledMarkdown = md.render(markdown);
        compiledMarkdown = utils.formatCodeSnippet(compiledMarkdown);

        let title = markdown.split('\n')[0].replaceAll('#', '').trim(); // first line
        let rawDate = moment(markdown.split('\n')[1]).format();
        let date = moment(markdown.split('\n')[1]).format('MMMM DD, YYYY'); // second line
        let snippet = removeMd(markdown.split('\n').slice(2).join('\n').split(' ').slice(0, SNIPPET_WORD_LENGTH).join(' '));
        let filename = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/[ ]/g, '-').replaceAll('--', '-');

        let article = {
            link: `${filename}.html`,
            snippet: snippet,
            date: date,
            rawDate: rawDate,
            title: title,
            url: BASE_URL + `${filename}.html`,
            imgUrl: imageUrl
        };

        let compiledTemplate = pug.renderFile(`${LAYOUTS_DIR}/article.pug`, _.assign(pugOptions, { article: article }));
        compiledTemplate = compiledTemplate.replace('$markdown$', compiledMarkdown);
        fs.writeFileSync(`${OUT_DIR}/${filename}.html`, compiledTemplate);
        articles[title] = article;
    });

    /* Build pages */
    pagesFiles.forEach((page) => {
        page = page.replace('.pug', '');
        let compiledTemplate;

        /* Compile pug template */
        let meta = { title: `${BASE_TITLE} - ${utils.toTitleCase(page)}`, url: `${BASE_URL}${page}.html`, imgUrl: `${BASE_URL}${BASE_IMG}`};
        let opts = page === 'blog' ? _.assign(pugOptions, { articles: articles }) : _.assign(pugOptions, meta);
        compiledTemplate = pug.renderFile(`${PAGES_DIR}/${page}.pug`, opts);

        try {
            /* Compile related markdown to HTML and replace placeholder in compiled template HTML */
            let markdown = fs.readFileSync(`${CONTENT_DIR}/${page}.md`, 'utf-8');
            let compiledMarkdown = md.render(markdown);
            compiledMarkdown = utils.formatCodeSnippet(compiledMarkdown);
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