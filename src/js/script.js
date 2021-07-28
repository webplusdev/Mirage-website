window.onload = function () {

    const lastLink = document.querySelector('.icon-menu');

    function sizeDeterm() {
        if (window.matchMedia("(max-width: 767.98px)").matches) {
            lastLink.innerHTML = "More";
            lastLink.classList.remove('icon-menu');
        }
        else {
            lastLink.innerHTML = "";
            lastLink.classList.add('icon-menu');
        }
    }

    sizeDeterm();


    lastLink.onmouseover = function () {
        if (!isMobile.any()) {
            lastLink.closest('.sub-menu').classList.add('sub-menu_active');
        }
    }
    lastLink.onmouseout = function () {
        if (!isMobile.any()) {
            lastLink.closest('.sub-menu').classList.remove('sub-menu_active');
        }
    }
    lastLink.onclick = function () {
        if (isMobile.any()) {
            lastLink.closest('.sub-menu').classList.toggle('sub-menu_active');
        }
    }

    const icon_menu = document.querySelector('.menu-icon');
    const menu_body = document.querySelector('.menu__body');
    const body = document.querySelector('body');
    const container = document.querySelector('.container');

    window.addEventListener(`resize`, sizeDeterm);

    icon_menu.addEventListener('click', function () {
        icon_menu.classList.toggle('menu-icon_active');
        menu_body.classList.toggle('menu__body_active');
        body.classList.toggle('lock');
    });

    const header = document.querySelector('header');
    const header_con = document.querySelector('.header__container');

    window.onscroll = function (e) {
        if (window.scrollY >= 100) {
            header.style.backgroundColor = '#FFF1F9';
            header_con.style.paddingTop = '25px';
            header_con.style.paddingBottom = '25px';
        } else {
            header.style.backgroundColor = 'transparent';
            header_con.style.paddingTop = '57px';
            header_con.style.paddingBottom = '57px';
        }
    };

    const spoiler_btn = document.querySelectorAll('.link-col__btn');

    spoiler_btn.forEach(el => {
        el.onclick = function () {
            this.classList.toggle('link-col__btn_active');
        }
    });

    const adv_item = document.querySelectorAll('.advantages__item');

    adv_item.forEach(el => {
        el.onmouseover = function () {
            if (!isMobile.any()) {
                this.classList.add('advantages__item_active');
            }
        }
        el.onmouseout = function () {
            if (!isMobile.any()) {
                this.classList.remove('advantages__item_active');
            }
        }
    });

    "use strict"

    const spollersArray = document.querySelectorAll('[data-spollers]');

    if (spollersArray.length > 0) {
        const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
            return !item.dataset.spollers.split(",")[0];
        });

        if (spollersRegular.length > 0) {
            initSpollers(spollersRegular);
        }

        const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
            return item.dataset.spollers.split(",")[0];
        });

        if (spollersMedia.length > 0) {
            const breakpointsArray = [];
            spollersMedia.forEach(item => {
                const params = item.dataset.spollers;
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            });

            let mediaQueries = breakpointsArray.map(function (item) {
                return '(' + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            });
            mediaQueries = mediaQueries.filter(function (item, index, self) {
                return self.indexOf(item) === index;
            });

            mediaQueries.forEach(breakpoint => {
                const paramsArray = breakpoint.split(",");
                const mediaBreakpoint = paramsArray[1];
                const mediaType = paramsArray[2];
                const matchMedia = window.matchMedia(paramsArray[0]);

                const spollersArray = breakpointsArray.filter(function (item) {
                    if (item.value === mediaBreakpoint && item.type === mediaType) {
                        return true;
                    }
                });

                matchMedia.addListener(function () {
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
            });
        }

        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock => {
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                if (matchMedia.matches || !matchMedia) {
                    spollersBlock.classList.add("init");
                    initSpollerBody(spollersBlock);
                    spollersBlock.addEventListener("click", setSpollerAction);
                } else {
                    spollersBlock.classList.remove('init');
                    initSpollerBody(spollersBlock, false);
                    spollersBlock.removeEventListener("click", setSpollerAction);
                }
            });
        }
        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
            if (spollerTitles.length > 0) {
                spollerTitles.forEach(spollerTitle => {
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute('tabindex');
                        if (!spollerTitle.classList.contains('active')) {
                            spollerTitle.nextElementSibling.hidden = true;
                        }
                    } else {
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                });
            }
        }

        function setSpollerAction(e) {
            const el = e.target;
            if (el.hasAttribute('data-spoller') || el.closest('[data-spollers]')) {
                const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closesr('[data-spoller]');
                const spollersBlock = spollerTitle.closest('[data-spollers]');
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
                if (!spollersBlock.querySelectorAll('.slide').length) {
                    if (oneSpoller && !spollerTitle.classList.contains('active')) {
                        hideSpollersBody(spollersBlock);
                    }
                    spollerTitle.classList.toggle('active');
                    slideToggle(spollerTitle.nextElementSibling, 500);
                }
                e.preventDefault();
            }
        }
        function hideSpollersBody(spollersBlock) {
            const spollerActiveTitle = spollersBlock.querySelector('[data-spoller].active');
            if (spollerActiveTitle) {
                spollerActiveTitle.classList.remove('active');
                slideUp(spollerActiveTitle.nextElementSibling, 500);
            }
        }
    }


    let slideUp = (target, duration = 500) => {
        if (!target.classList.contains('slide')) {
            target.classList.add('slide');
            target.style.transitionProperty = 'height, margin, padding';
            target.style.transitionDuration = duration + 'ms';
            target.style.boxSizing = 'border-box';
            target.style.height = target.offsetHeight + 'px';
            target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout(() => {
                target.hidden = true;
                target.style.removeProperty('height');
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('slide');
                //alert("!");
            }, duration);
        }

    }

    let slideDown = (target, duration = 500) => {
        if (!target.classList.contains('slide')) {
            target.classList.add('slide');
            if (target.hidden) {
                target.hidden = false;
            }
            let height = target.offsetHeight;
            target.style.overflow = 'hidden';
            target.style.height = 0;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.boxSizing = 'border-box';
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + 'ms';
            target.style.height = height + 'px';
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            window.setTimeout(() => {
                target.style.removeProperty('height');
                target.style.removeProperty('overflow');
                target.style.removeProperty('transition-duration');
                target.style.removeProperty('transition-property');
                target.classList.remove('slide');
            }, duration);
        }

    }
    var slideToggle = (target, duration = 500) => {
        if (target.hidden) {
            return slideDown(target, duration);
        } else {
            return slideUp(target, duration);
        }
    }

    const swiper = new Swiper('.testimonial__container', {
        // Optional parameters
        loop: true,
        speed: 600,
        spaceBetween: 100,

        effect: 'cube',
        cubeEffect: {
            slideShadows: false,
            shadow: false
        },

        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',

        },

    });


}