/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	const UsersSearch = __webpack_require__(2);
	const TweetCompose = __webpack_require__(3);
	const InfiniteTweets = __webpack_require__(4);
	
	
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
	  new InfiniteTweets();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const FollowToggle = __webpack_require__(1);
	
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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	class InfiniteTweets {
	  constructor() {
	    this.$ul = $("#feed");
	    this.maxCreatedAt = null;
	    $(".fetch-more").on("click", (e) => {
	      e.preventDefault();
	      this.fetchTweets();
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
	        that.insertTweets(resp);
	        if (resp.length < 20) {
	          $(".fetch-more").remove();
	          that.$ul.append($("<li>There's no more tweets</li>"));
	        } else {
	          that.maxCreatedAt = resp[resp.length - 1].created_at;
	        }
	      }
	    });
	  }
	
	  insertTweets(resp) {
	    console.log(resp);
	    resp.forEach((tweet) => {
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
	      this.$ul.append(li);
	    })
	  }
	}
	
	module.exports = InfiniteTweets;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map