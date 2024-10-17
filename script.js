function resizeImage() {
    var contentHeight = $('.conteudo_col_1').outerHeight();
    $('#img-2').css('height', contentHeight); 
}

function animateCount(selector, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const currentValue = Math.floor(progress * (end - start) + start);
        $(selector).text(currentValue + '+');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

function initObservers() {
    const myObserverAnimate = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            $(entry.target).toggleClass('show', entry.isIntersecting);
        });
    });

    const myObserverLazy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = $(entry.target);
                const src = img.data('src');

                if (src) {
                    img.attr('src', src);
                    img.removeAttr('data-src');

                    if (img.attr('alt') === "Produto 1") {
                        img.on('load', resizeImage);
                    }
                }
            }
        });
    });


    const countElements = $('#experience, #clients, #projects');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {

                animateCount("#experience", 0, 20, 2000);
                animateCount("#clients", 0, 483, 2000);
                animateCount("#projects", 0, 150, 2000);
                
                countObserver.unobserve(entry.target);
            }
        });
    });

    const lazyImages = $('img[loading="lazy"]');
    const elements = $('.animate_lazy');
    
    elements.each(function() {
        myObserverAnimate.observe(this);
    });
    lazyImages.each(function() {
        myObserverLazy.observe(this);
    });
    countElements.each(function() {
        countObserver.observe(this);
    });
}

$(document).ready(function() {
    initObservers();
    resizeImage();

	var $carousel = $('#productCarousel');
    var $carouselInner = $carousel.find('.carousel_inner_product');
    var originalState = $carouselInner.html();
    var isMobile = $(window).width() < 768;

    function adjustCarousel() {
        var newIsMobile = $(window).width() < 768;
        
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            
            if (isMobile) {
                $carousel.find('.carousel_item_product').each(function() {
                    $(this).find('.col_product').each(function(index) {
                        if (index > 0) {
                            $(this).wrap('<div class="carousel-item carousel_item_product"></div>').parent().appendTo($carouselInner);
                        }
                    });
                });
            } else {
                $carouselInner.html(originalState);
            }
            
            $carousel.carousel('dispose').carousel();
        }
    }

    adjustCarousel();
    $(window).on('resize', adjustCarousel);
});

$(window).resize(function() {
    resizeImage();
});