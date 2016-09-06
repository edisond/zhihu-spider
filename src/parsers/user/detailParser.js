'use strict';

module.exports = function ($) {
  let user = {};
  let profileCard = $('.ProfileCard');
  let locationDiv = profileCard.find('[data-name=location]');
  let employmentDiv = profileCard.find('[data-name=employment]');
  let educationDiv = profileCard.find('[data-name=education]');
  user.location = {
    location: locationDiv.find('.location').text(),
    profession: locationDiv.find('.business').text(),
  };
  user.employment = {
    company: employmentDiv.find('.employment').text(),
    position: employmentDiv.find('.position').text(),
  };
  user.education = {
    education: educationDiv.find('.education').text(),
    major: educationDiv.find('.education-extra').text(),
  };
  return user;
};