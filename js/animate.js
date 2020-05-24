// let s1 = $("#section1").offset().top;
// let s2 = $("#section2").offset().top;
// let s3 = $("#section3").offset().top;
// let s4 = $("#section4").offset().top;
// let s5 = $("#section5").offset().top;
// let s6 = $("#section6").offset().top;
let s0 = $("#section0").height();
let s1 = $("#section1").height();
let s2 = $("#section2").height();
let s3 = $("#section3").height();
let s4 = $("#section4").height();
let s5 = $("#section5").height();
let s6 = $("#section6").height();
let viewheight = screen.height;
console.log(viewheight);
// console.log(s1);
// console.log(s2);
// console.log(s3);
// console.log(s4);
// console.log(s5);
// console.log(s6);
//$("#section1").fadeIn(1500);
$(document).scroll(function() {
  let windowY = $(window).scrollTop();
  if (windowY > s0 + s1 - viewheight) {
    $("#section2").fadeIn(1500);
  }
  if (windowY > s0 + s1 + s2 - viewheight) {
    $("#section3").fadeIn(1500);
  }
  if (windowY > s0 + s1 + s2 + s3 - viewheight) {
    $("#section4").fadeIn(1500);
  }
  if (windowY > s0 + s1 + s2 + s3 + s4 - viewheight) {
    $("#section5").fadeIn(1500);
  }
  if (windowY > s0 + s1 + s2 + s3 + s5 - viewheight) {
    $("#section6").fadeIn(1500);
  }
})