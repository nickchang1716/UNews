$(document).ready(() => {
  $('html,body').animate({
    "scrollTop": 100
  }, 'slow');
});
$(".video").on("click", () => {
  $("video").prop('muted', false);
})
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
let viewheight = screen.height;
//console.log(viewheight);
// console.log(s1);
// console.log(s2);
// console.log(s3);
// console.log(s4);
// console.log(s5);
// console.log(s6);
//$("#section1").fadeIn(1500);
let ani = (section) => {
  section.animate({
    "margin-top": "50px",
    "opacity": "1"
  }, 1200);
}

$(document).scroll(function() {
  let windowY = $(window).scrollTop();
  if (windowY > s0 - viewheight * 0.8) {
    ani($("#section1"));
  }
  if (windowY > s0 + s1 - viewheight * 0.8) {
    ani($("#section2"));
  }
  if (windowY > s0 + s1 + s2 - viewheight * 0.8) {
    ani($("#section3"));
  }
  if (windowY > s0 + s1 + s2 + s3 - viewheight * 0.8) {
    ani($("#section4"));
  }
  if (windowY > s0 + s1 + s2 + s3 + s4 - viewheight * 0.8) {
    ani($("#section5"));
  }
})