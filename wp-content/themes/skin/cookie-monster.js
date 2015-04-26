// fiction was here

// last time writing JS was in 1996 so please forgive the ugly syntax

(function() {

  var enabled = "Vklopljeni";
  var disabled = "Izklopljeni";
  var dnttext = "Izklopljeni (DNT)";
  var element = "#allowCookies";
  var nocookies = "no-cookies";
  var reserved = ["wordpress", "viewed_cookie_policy", "wp-"];
  var mydomain = ".cutis-nostra.si";
  var tracking = ["__utma", "__utmb", "__utmc", "__utmz"];

  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
       return this.indexOf(str) == 0;
    };
  }

  function disableCookies(set = true) {
    // $.cookie is totally broken
    outer_loop:
    for (var cookie in $.cookie()) {
      
      for (var prefix in reserved) {
        if (!Object.prototype.hasOwnProperty.call(reserved, prefix)) {
          continue;
        } 

        if (cookie.startsWith(reserved[prefix])) {
          continue outer_loop;
        }
      }

      $.cookie(cookie, "", { expires: -1, path: "/" });
      $.cookie(cookie, "", { expires: -1, path: "/", domain: mydomain });
    }

    for (var cookie in tracking) {
      if (!Object.prototype.hasOwnProperty.call(tracking, cookie)) {
        continue;
      }

      $.cookie(tracking[cookie], "", { expires: -1, path: "/" });
      $.cookie(tracking[cookie], "", { expires: -1, path: "/", domain: mydomain });
    }

    if (set) {
      $.cookie(nocookies, "1", { expires: 365, path: "/" });
    }
  }

  function enableCookies() {
    if ($.cookie(nocookies) !== null) {
      $.cookie(nocookies, "", { expires: -1, path: "/" });
    }
  }

  $(function() {
    // Usually pages should not have the desired element
    if ($(element).length == 0) {
      return;
    }

    // Fact that I came here justifies removing the cookie bar already
    $(element).button();
    $.cookie("viewed_cookie_policy", "1", { expires: 365, path: "/" });

    var dnt = navigator.doNotTrack == "yes";
    if (dnt) {
      $(element).prop("checked", false).button("option", "label", dnttext).button("refresh").button("disable");
      disableCookies(false);
      return;
    }

    var $cookies = $.cookie(nocookies) === null;

    if ($cookies) {
      $(element).prop("checked", true).button("option", "label", enabled).button("enable").button("refresh");
    } else {
      $(element).prop("checked", false).button("option", "label", disabled).button("enable").button("refresh");
      disableCookies();
    }

    $(element).click(function() {
      if ($(element).prop("checked")) {
	$(element).button("option", "label", enabled);
	enableCookies();
      } else {
	$(element).button("option", "label", disabled);
	disableCookies();
      }
    });
  });
})();
