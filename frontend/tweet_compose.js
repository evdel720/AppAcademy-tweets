class TweetCompose {
  constructor() {
    this.$el = $('.tweet-compose');
    this.handleInput();
    this.handleTyping();
    this.addMentionedUser();
    this.removeMentionedUser();
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
    $(".mentioned-users").empty();
  }

  handleSuccess(resp) {
    this.clearInput();
    $(":input").prop('disabled', false);

    $('#feed').trigger("insert-tweet", [resp]);
  }

  addMentionedUser() {
    $(".add-mentioned-user").on('click', (event) => {
      $('.mentioned-users').append($(".mentionscript").html());
    });
  }

  removeMentionedUser(){
    $(".mentioned-users").on('click', $(".remove-mentioned-user"), (event) => {
      if ($(event.target).is(".remove-mentioned-user")) {
        $(event.target).parent().remove();
      }
    });
  }


}

module.exports = TweetCompose;
