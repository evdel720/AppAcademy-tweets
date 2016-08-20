class InfiniteTweets {
  constructor() {
    this.$ul = $("#feed");
    this.maxCreatedAt = null;
    $(".fetch-more").on("click", (e) => {
      e.preventDefault();
      this.fetchTweets();
    })

    this.$ul.on("insert-tweet", (e, tweets) => {
      e.preventDefault();
      this.insertTweets([tweets], 0);
    })

  }

  fetchTweets() {
    let that = this;
    let maxData = (this.maxCreatedAt !== null) ? { max_created_at: that.maxCreatedAt } : {};
    $.ajax({
      url: "/feed",
      type: "GET",
      dataType: "json",
      data: maxData,
      success(resp) {
        that.insertTweets(resp, 1);
        if (resp.length < 20) {
          $(".fetch-more").remove();
          that.$ul.append($("<li>There's no more tweets</li>"));
        } else {
          that.maxCreatedAt = resp[resp.length - 1].created_at;
        }
      }
    });
  }

  insertTweets(tweets, ord) {
    tweets.forEach((tweet) => {
      let li = $('<li></li>')
      li.html(`${tweet.content} -- <a href="/users/${tweet.user.id}">${tweet.user.username}</a> -- ${tweet.created_at}`)
      if (tweet.mentions.length) {
        let mentionedUserList = $('<ul></ul>');
        tweet.mentions.forEach((mention) => {
          let mentionedUser = $(`<li><a href="/users/${mention.user.id}">${mention.user.username}</a></li>`);
          mentionedUserList.append(mentionedUser);
        })
        li.append(mentionedUserList);
      }
      if (ord === 0){
        this.$ul.prepend(li);
      } else {
        this.$ul.append(li);
      }
    })
  }
}

module.exports = InfiniteTweets;
