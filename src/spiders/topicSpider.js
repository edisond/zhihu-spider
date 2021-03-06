'use strict';

const constants = require('./../constants/zhihu');
const superagent = require('superagent-promise')(require('superagent'), Promise);
const parser = require('./../parsers/topic/index');
const _ = require('lodash');
const logger = require('log4js').getLogger('topicSpider');

let session = {};

function setSession(_session) {
  session = _session;
}

function resolveByPage(user, offset) {
  let apiObj = constants.api.userTopics;
  let header = Object.assign(session.getHttpHeader(), apiObj.header(user.id, session.getXsrfToken()));
  let form = apiObj.form(offset);
  return superagent
    .post(apiObj.url(user.id))
    .set(header)
    .send(form)
    .end()
    .then((res) => {
      let data = parser.fromJson(res.text);
      if (!data.list.length) {
        return [];
      }
      return resolveByPage(user, offset + apiObj.pageSize(), apiObj)
        .then((nextList) => {
          return [].concat(data.list, nextList);
        })
        .catch((e) => {
          return [];
        });
    })
}

function resolveTopics(user, offset) {
  logger.debug('Resolving user topics...');
  if (typeof offset === 'undefined' || offset < 0) {
    offset = 0;
  }
  return new Promise((resolve, reject) => {
    resolveByPage(user, offset)
      .then((topicsList) => {
        let _user = {
          topics: _.uniq(topicsList)
        };
        Object.assign(user, _user);
        logger.debug(`Total topics resolved: ${user.topics.length}`);
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      })
  });
}

module.exports = { setSession, resolveTopics };