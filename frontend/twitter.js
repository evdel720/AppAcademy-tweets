const FollowToggle = require("./follow_toggle");

$(() => {
  const followButtons = $(".follow-toggle");
  if (followButtons.length) {
    followButtons.each(function(i, el){
      new FollowToggle($(el));
    });
  }
});
