import '../../assets/css/style.sass'
import 'bootstrap'
//change class onclick
document.addEventListener('DOMContentLoaded', startF);

function startF(){
    vElements();
    changeBtnHeader();

}
var spanHeader, btnHeader;

function vElements() {
    btnHeader = document.querySelector('.btn-navbar-toggler');
    spanHeader = document.querySelector('.btn-navbar');

}
function changeClass(elFirst,elSecond,className) {
//Change header class
    function changeBtnClass() {
        elSecond.classList.toggle(className)
    }
//events
    elFirst.addEventListener('click',changeBtnClass);

}
function changeBtnHeader(){
    changeClass(btnHeader, spanHeader, 'btn-close')

}
export {changeBtnHeader}
