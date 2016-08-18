const FollowToggle = require("./follow_toggle");
const UsersSearch = require("./users_search");
const TweetCompose = require("./tweet_compose");


$(() => {
  const followButtons = $(".follow-toggle");
  if (followButtons.length) {
    followButtons.each(function(i, el){
      new FollowToggle($(el));
    });
  }
  const userSearch = $(".users-search");
  if (userSearch.length) {
    new UsersSearch(userSearch);
  }
  new TweetCompose();
});
