class FollowToggle {
  constructor ($button) {
    this.$button = $button;
    this.userId = this.$button.data("button").userId;
    this.followState = (this.$button.data("button").initialFollow) ? "followed" : "unfollowed";
    this.render();
    this.handleClick();
  }

  render () {
    if(this.followState === "unfollowed"){
      this.$button.text("Follow!");
    } else if(this.followState === "followed") {
      this.$button.text("Unfollow!");
    } else {
      this.$button.prop('disabled', true);
    }
  }

  handleClick(){
    let that = this;
    this.$button.on('click', event => {
      event.preventDefault();
      let htmlVerb;
      if (that.followState === "unfollowed") {
        htmlVerb = "POST";
      } else {
        htmlVerb = "DELETE";
      }
      that.followState = (that.followState === "followed") ? "unfollowing" : "following";
      that.render();
      $.ajax({
        url: `/users/${that.userId}/follow`,
        type: htmlVerb,
        dataType: 'json',
        success() {
          that.followState = (that.followState === "unfollowing") ? "unfollowed" : "followed";
          that.$button.prop('disabled', false);
          that.render();
        }
      });
    });
  }
}

module.exports = FollowToggle;
