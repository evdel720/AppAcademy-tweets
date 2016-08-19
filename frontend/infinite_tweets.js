class InfiniteTweets {
  constructor() {
    this.$ul = $(".feed");
  }

  fetchTweets() {
    $.ajax({
      url: "/feed",
      type: "GET",
      dataType: "json",
      success(resp) {

      }
    });
  }
}

module.exports = InfiniteTweets;
