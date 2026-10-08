// Image lazy loading utility
export const useImageLazyLoad = () => {
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  };

  const handleImageLoad = (img) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          image.src = image.dataset.src;
          image.classList.remove('lazy');
          observer.unobserve(image);
        }
      });
    }, observerOptions);

    observer.observe(img);
  };

  return { handleImageLoad };
};

// Image component with lazy loading
export const LazyImage = ({ src, alt, className, placeholder }) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3C/svg%3E');
  const [imageRef, setImageRef] = React.useState();

  React.useEffect(() => {
    let observer;

    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { rootMargin: '50px' }
      );
      observer.observe(imageRef);
    }

    return () => observer && observer.disconnect();
  }, [imageRef, imageSrc, src, placeholder]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};
