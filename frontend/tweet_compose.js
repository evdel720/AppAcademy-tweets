class TweetCompose {
  constructor() {
    this.$el = $('.tweet-compose');
    this.handleInput();
    this.handleTyping();
  }

  handleTyping() {
    $(".tweetbox").on('input', function(event) {
      let num = 140;
      let chars = $(".tweetbox").val().length;
      $(".remaining").text(num-chars);
    });
  }

  handleInput(){
    let that = this;
    this.$el.on("submit", (event) => {
      event.preventDefault();
      let formData = this.$el.serialize();
      $(":input").prop('disabled', true);
      $.ajax({
        url: "/tweets",
        type: "POST",
        data: formData,
        dataType: "json",
        success(resp) {
          that.handleSuccess(resp);
        }
      });
    });
  }

  clearInput() {
    $(".tweetbox").val("");
    $(".non-default").prop('selected', false);
    $(".default").prop('selected', true);
  }

  handleSuccess(resp) {
    this.clearInput();
    $(":input").prop('disabled', false);

    let $listItem = $(`<li>${resp.content} -- <a href="/users/${resp.user_id}">${resp.user.username}</a> -- ${resp.created_at}</li>`);

    if(resp.mentions.length){
      let $mentionedlist = $('<ul></ul>');
      resp.mentions.forEach((mention) => {
        let person = $(`<li><a href="/users/${mention.user.id}">${mention.user.username}</a></li>`);
        $mentionedlist.append(person);
      });
      $listItem.append($mentionedlist);
    }
    $("#feed").prepend($listItem);
  }
}

module.exports = TweetCompose;
