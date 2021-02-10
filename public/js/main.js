// Mobile Navigation
if ($("#navtop").length) {
  var $mobile_nav = $("#navtop").clone().prop({
    id: "mobile-nav",
  });
  $mobile_nav.find(">ul").attr({
    class: "",
    id: "",
  });
  $("body").append($mobile_nav);
  $("body").prepend(
    '<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>'
  );
  $("body").append('<div id="mobile-body-overly"></div>');
  $(document).on("click", "#mobile-nav-toggle", function (e) {
    $("body").toggleClass("mobile-nav-active");
    $("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
    $("#mobile-body-overly").toggle();
  });

  $(document).click(function (e) {
    var container = $("#mobile-nav, #mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($("body").hasClass("mobile-nav-active")) {
        $("body").removeClass("mobile-nav-active");
        $("#mobile-nav-toggle i").toggleClass("fa-times fa-bars");
        $("#mobile-body-overly").fadeOut();
      }
    }
  });
} else if ($("#mobile-nav, #mobile-nav-toggle").length) {
  $("#mobile-nav, #mobile-nav-toggle").hide();
}

// const loginError = document.querySelector("#loginform");
// const formSubmit = document.querySelector("#submitform");
// const addEmail = document.querySelector("#exampleInputEmail1").value;
// const addPassword = document.querySelector("#exampleInputPassword1").value;
// const selectEmail = document.querySelector("input[type='email']");
// const selectPassword = document.querySelector("input[type='password']");
// const messageText = document.querySelector(".alertEmail");
// const messagePassword = document.querySelector(".alertPassword");

// loginError.addEventListener("submit", errorLogin);
// function errorLogin(e) {
//   e.preventDefault();
//   if (!addEmail == "") {
//     messageText.innerHTML = "";
//   } else {
//     selectEmail.classList.add("inputError");
//     messageText.textContent = "Please add email";
//   }

//   if (!addPassword == "") {
//     messageText.textContent = "";
//   } else {
//     selectPassword.classList.add("inputError");
//     messagePassword.textContent = "Please enter password";
//   }
// }
