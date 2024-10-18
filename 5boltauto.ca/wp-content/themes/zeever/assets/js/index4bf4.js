
"use strict";
const zeeverAnimateObserves = document.getElementsByClassName('zeever-animate');

let zeeveranimateobserve = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let item = entry.target;
            if(document.querySelector('.zeever-page-preloader') !== null && window.scrollY < 150){
                setTimeout(() => {item.classList.add('zeever-animate-init');}, 300);
            }else{
                item.classList.add('zeever-animate-init');
            }
            //zeeveranimateobserve.disconnect();
        }
    });
}, {threshold: 0.5});

for (let itemobserve of zeeverAnimateObserves) {
    zeeveranimateobserve.observe(itemobserve);
}