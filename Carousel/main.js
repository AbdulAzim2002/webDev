const leftButton = document.querySelector(".button-previous");
const rightButton = document.querySelector(".button-next");
const list = document.querySelector(".list");
const itemsStart = document.querySelectorAll(".item-start");
const itemsMiddle = document.querySelectorAll(".item-middle");
const itemsEnd = document.querySelectorAll(".item-end");
const scrollButtons = document.querySelectorAll(".button");

const scrollOfset = list.scrollLeft;
let itemWidth = itemsMiddle[0].offsetWidth;
let carouselWidth = itemWidth * itemsMiddle.length;

document.querySelector(".wrapper").onresize = toogleScroll;
toogleScroll();

if(carouselWidth > window.innerWidth) {
    list.scrollBy({left: (2*carouselWidth), behavior: "instant"});
}

if(isTouchDevice())
    list.addEventListener("touchstart", snap);
else {
    leftButton.addEventListener("click", () => {scroll("left"); snapLeft();});
    rightButton.addEventListener("click", () => {scroll("right"); snapRight();});
}

function scroll(direction) {
    if(direction === "left") {
        list.scrollBy({left: -itemWidth, behavior: "smooth"});
    } else {
        list.scrollBy({left: itemWidth, behavior: "smooth"});
    }
}

function toogleScroll() {

    itemWidth = itemsMiddle[0].offsetWidth;
    carouselWidth = itemWidth * itemsMiddle.length;

    if(carouselWidth <= window.innerWidth) {

        scrollButtons.forEach(element => {
            element.style.display = "none";
        });

        itemsStart.forEach(element => {
            element.style.display = "none";
        });

        itemsEnd.forEach(element => {
            element.style.display = "none";
        });

        list.style.maskImage = "none";
    } else {

        if(!isTouchDevice()){
            scrollButtons.forEach(element => {
                element.style.display = "block";
            });
        } else {
            scrollButtons.forEach(element => {
                element.style.display = "none";
            });
        }

        itemsStart.forEach(element => {
            element.style.display = "block";
        });

        itemsEnd.forEach(element => {
            element.style.display = "block";
        });

        list.style.maskImage = "linear-gradient(to right, rgb(0, 0, 0, 0) 0%, rgba(205, 205, 205) 20%, rgba(205, 205, 205) 80%, rgb(0, 0, 0, 0) 100%)";
    }
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
}

function snap() {
    if(list.scrollLeft >= (3 * carouselWidth))
        list.scrollBy({left: -carouselWidth, behavior: "instant"});
    else if(list.scrollLeft <= (carouselWidth))
        list.scrollBy({left: carouselWidth, behavior: "instant"});
}

function snapLeft() {
    if(list.scrollLeft <= (1 * itemsMiddle[0].offsetWidth * itemsMiddle.length)) {
        list.scrollBy({left: (itemsMiddle[0].offsetWidth * (itemsMiddle.length)), behavior: "instant"});
        list.scrollBy({left: -itemsMiddle[0].offsetWidth, behavior: "smooth"})
    }
}

function snapRight() {
    if(list.scrollLeft >= (3 * itemsMiddle[0].offsetWidth * itemsMiddle.length)) {
        list.scrollBy({left: -(itemsMiddle[0].offsetWidth * (itemsMiddle.length)), behavior: "instant"});
        list.scrollBy({left: itemsMiddle[0].offsetWidth, behavior: "smooth"});
    }
}