const FollowToggle = require("./follow_toggle");

class UsersSearch {
  constructor($el) {
    this.$el = $el;
    this.$searchform = $("input.searchform");
    this.results = $("ul.users");
    this.handleInput();
  }

  renderResults(users) {
    this.results.html("");
    users.forEach((el) => {
      this.results.append(`<li><a href="/users/${el.id}">${el.username}</a></li>`);
      let button = $("<button></button>");
      button.addClass("follow-toggle");
      button.data("button", { "userId": el.id, "initialFollow": el.follows});
      this.results.append(button);
      new FollowToggle(button);
    });
  }

  handleInput() {
    let that = this;
    this.$searchform.on('input', function(event) {
      event.preventDefault();
      $.ajax({
        url: '/users/search',
        type: "GET",
        data: {query: that.$searchform.val()},
        dataType: 'json',
        success:  function(resp) {
          that.renderResults(resp);
        }
      });
    });
  }
}

module.exports = UsersSearch;
