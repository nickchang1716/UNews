// let s1 = $("#section1").offset().top;
// let s2 = $("#section2").offset().top;
// let s3 = $("#section3").offset().top;
// let s4 = $("#section4").offset().top;
// let s5 = $("#section5").offset().top;
// let s6 = $("#section6").offset().top;
// console.log(s1);
// console.log(s2);
// console.log(s3);
// console.log(s4);
// console.log(s5);
// console.log(s6);
//$("#section1").fadeIn(1500);
$(document).scroll(function() {
  let windowY = $(window).scrollTop();
  if (windowY > 800) {
    $("#section2").fadeIn(1500);
  }
  if (windowY > 1950) {
    $("#section3").fadeIn(1500);
  }
  if (windowY > 3750) {
    $("#section4").fadeIn(1500);
  }
  if (windowY > 4000) {
    $("#section5").fadeIn(1500);
  }
  if (windowY > 4550) {
    $("#section6").fadeIn(1500);
  }
})