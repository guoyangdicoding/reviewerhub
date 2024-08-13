jQuery(document).ready(function () {
  // on scroll actions
  var scroll_offset = 120;
  $(window).scroll(function () {
    var $this = $(window);
    if ($(".header-section").length) {
      if ($this.scrollTop() > scroll_offset) {
        $(".header-section").addClass("header-active");
      } else {
        $(".header-section").removeClass("header-active");
      }
    }
  });

  // scroll top
  $(window).scroll(function () {
    if ($(window).scrollTop() > 500) {
      $(".scrollToTop").addClass("topActive");
    } else {
      $(".scrollToTop").removeClass("topActive");
    }
  });

  // navbar active color
  $(".navbar-nav .nav-item a").click(function () {
    $(".nav-item a").removeClass("active");
    $(this).addClass("active");
  });

  // magnificPopup
  $(".popup_img").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  // data background
  $("[data-background]").each(function () {
    $(this).css(
      "background-image",
      "url(" + $(this).attr("data-background") + ")"
    );
  });

  // reply
  $(".reply").on("click", function () {
    $(this).toggleClass("reply-active");
    $(this).parent().next(".reply__content").slideToggle();
  });

  // nav-right__search
  $(".nav-right__search-icon").on("click", function () {
    $(this).toggleClass("active");
    $(this).parent().next(".nav-right__search-inner").slideToggle();
  });

  // sidebar_btn
  $(".sidebar_btn").on("click", function () {
    $(".cus_scrollbar").toggleClass("show");
  });

  // faq
  $(".accordion-header").on("click", function () {
    $(".accordion-item").removeClass("accordion_bg");
    $(this).parent().closest(".accordion-item").toggleClass("accordion_bg");
  });

  // browse-spaces-filter__tab
  $("#browse-spaces-filter__tab li a").on("click", function () {
    // fetch the class of the clicked item
    var ourClass = $(this).attr("class");

    // reset the active class on all the buttons
    $("#browse-spaces-filter__tab li").removeClass("active");
    // update the active state on our clicked button
    $(this).parent().addClass("active");

    if (ourClass == "all") {
      // show all our items
      $("#browse-spaces-filter__content").children("div.item").show();
    } else {
      // hide all elements that don't share ourClass
      $("#browse-spaces-filter__content")
        .children("div:not(." + ourClass + ")")
        .hide();
      // show all elements that do share ourClass
      $("#browse-spaces-filter__content")
        .children("div." + ourClass)
        .show();
    }
    return false;
  });
});

// btn_theme
$(function () {
  $(".btn_theme")
    .on("mouseenter", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find("span").css({ top: relY, left: relX });
    })
    .on("mouseout", function (e) {
      var parentOffset = $(this).offset(),
        relX = e.pageX - parentOffset.left,
        relY = e.pageY - parentOffset.top;
      $(this).find("span").css({ top: relY, left: relX });
    });
});
