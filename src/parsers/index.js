'use strict';

const jsdom = require('jsdom');
const logger = require('log4js').getLogger('parser');

function fromHtml(html, parsers) {
  return new Promise((resolve, reject) => {
    jsdom.env(html, (err, window) => {
      if (err) {
        window.close();
        reject(err);
      } else {
        const $ = require('jquery')(window);
        let item = {};
        for (let parser of parsers) {
          try {
            Object.assign(item, parser($));
          } catch (e) {
            logger.error(e);
          }
        }
        window.close();
        resolve(item);
      }
    });
  })
}

function fromJson(jsonText, parsers) {
  let json = JSON.parse(jsonText);
  let item = {};
  for (let parser of parsers) {
    try {
      Object.assign(item, parser(json));
    } catch (e) {
      logger.error(e)
    }
  }
  return item;
}

module.exports = { fromHtml, fromJson };