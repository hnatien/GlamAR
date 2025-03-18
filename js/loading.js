window.addEventListener('load', function() {
    setTimeout(function() {
      document.body.classList.add('loaded');
      const loader = document.querySelector('.loader-overlay');
      setTimeout(() => loader.remove(), 500);
    }, 1000); 
  });

document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazyload"));

    if ("IntersectionObserver" in window) {
      const lazyImageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.add("lazyloaded");
              lazyImageObserver.unobserve(lazyImage);
            }
          });
        },
        {
          rootMargin: "0px 0px 50px 0px", 
          threshold: 0.1, 
        }
      );

      lazyImages.forEach((lazyImage) => {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      let lazyLoadThrottleTimeout;
      const lazyLoad = () => {
        if (lazyLoadThrottleTimeout) {
          clearTimeout(lazyLoadThrottleTimeout);
        }
  
        lazyLoadThrottleTimeout = setTimeout(() => {
          const scrollTop = window.pageYOffset;
          lazyImages.forEach((lazyImage) => {
            if (lazyImage.offsetTop < window.innerHeight + scrollTop) {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove("lazyload");
            }
          });
          if (lazyImages.length === 0) {
            document.removeEventListener("scroll", lazyLoad);
            window.removeEventListener("resize", lazyLoad);
            window.removeEventListener("orientationchange", lazyLoad);
          }
        }, 20);
      };
  
      document.addEventListener("scroll", lazyLoad);
      window.addEventListener("resize", lazyLoad);
      window.addEventListener("orientationchange", lazyLoad);
    }
  });