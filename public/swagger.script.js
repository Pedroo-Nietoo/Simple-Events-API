document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    const topBar = document.querySelector('.swagger-ui .topbar');
    if (topBar) {
      const link = topBar.querySelector('.topbar-wrapper a.link');
      if (link) {
        const svgLogo = link.querySelector('svg');
        if (svgLogo) {
          svgLogo.remove();
        }

        const imgLogo = document.createElement('img');
        // imgLogo.src = './logo.svg';
        imgLogo.alt = 'Logo';
        imgLogo.width = 200;
        imgLogo.height = 40;

        link.appendChild(imgLogo);
      }
    }
  }, 20);
});
