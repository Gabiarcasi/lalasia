// Função para redimensionar a imagem
function resizeImage() {
    var contentHeight = $('.conteudo_col_1').outerHeight();
    $('#img-2').css('height', contentHeight); 
}

// Função para animar a contagem
function animateCount(selector, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Calcula o valor atual
        const currentValue = Math.floor(progress * (end - start) + start);
        $(selector).text(currentValue + '+');
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

// Função para inicializar observadores
function initObservers() {
    // Observer para animação
    const myObserverAnimate = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            $(entry.target).toggleClass('show', entry.isIntersecting);
        });
    });

    // Observer para imagens lazy load
    const myObserverLazy = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = $(entry.target);
                const src = img.data('src');

                if (src) {
                    img.attr('src', src);
                    img.removeAttr('data-src');

                    if (img.attr('alt') === "Produto 1") {
                        img.on('load', resizeImage); // Redimensiona a imagem após o carregamento
                    }
                }
            }
        });
    });

    // Observer para animação de contagem
    const countElements = $('#experience, #clients, #projects');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Inicia a animação de contagem
                animateCount("#experience", 0, 20, 2000);
                animateCount("#clients", 0, 483, 2000);
                animateCount("#projects", 0, 150, 2000);
                
                // Desobserva o elemento após a animação
                countObserver.unobserve(entry.target);
            }
        });
    });

    // Seleciona elementos
    const lazyImages = $('img[loading="lazy"]');
    const elements = $('.animate_lazy');
    
    // Observa os elementos de animação e lazy load
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

// Document ready function
$(document).ready(function() {
    initObservers(); // Inicializa os observadores
    resizeImage(); // Redimensiona a imagem na carga inicial
});

// Redimensiona a imagem ao alterar o tamanho da janela
$(window).resize(function() {
    resizeImage();
});
