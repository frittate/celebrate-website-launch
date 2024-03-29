/**
 * Confetti particle class
 */
class ConfettiParticle {
  constructor( context, width, height ) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.color = '';
    this.lightness = 50;
    this.diameter = 0;
    this.tilt = 0;
    this.tiltAngleIncrement = 0;
    this.tiltAngle = 0;
    this.particleSpeed = 1;
    this.waveAngle = 0;
    this.x = 0;
    this.y = 0;
    this.reset();
  }

  reset() {
    this.lightness = 50;
    this.color = Math.floor( Math.random() * 360 ); 
    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height - this.height;
    this.diameter = Math.random() * 6 + 4;
    this.tilt = 0;
    this.tiltAngleIncrement = Math.random() * 0.1 + 0.04;
    this.tiltAngle = 0;
  }

  darken() {
    if ( this.y < 100 || this.lightness <= 0 ) return; 
    this.lightness -= ( 250 / this.height ); 
  }

  update() {
    this.waveAngle += this.tiltAngleIncrement;
    this.tiltAngle += this.tiltAngleIncrement;
    this.tilt = Math.sin( this.tiltAngle ) * 12;
    this.x += Math.sin( this.waveAngle );
    this.y += ( Math.cos( this.waveAngle ) + this.diameter + this.particleSpeed ) * 0.4;
    if ( this.complete() ) this.reset(); 
    this.darken();
  }

  complete() {
    return ( this.y > this.height + 20 );
  }

  draw() {
    let x = this.x + this.tilt;
    this.context.beginPath();
    this.context.lineWidth = this.diameter;
    this.context.strokeStyle = "hsl("+ this.color +", 50%, "+this.lightness+"%)";
    this.context.moveTo( x + this.diameter / 2, this.y );
    this.context.lineTo( x, this.y + this.tilt + this.diameter / 2 );
    this.context.stroke();
  }
}

let data = {
  dom: {
    effectsContainer: document.getElementById("yay-effects__container"),
    resultsName: document.getElementById("yay-results__url"),
    resultsLink: document.getElementById("yay-button__goto"),
    pyroPlaceholder: document.getElementById("yay-pyro__placeholder"),
    shareButton: document.getElementById("yay-share__button"),
    toastContainer: document.getElementById("yay-share__toast")
  },
  meta: {
    title: "",
    description: ""
  },
  output: {
    url: "",
    theme: ""
  }
};

let view = {
  startTheShow: function() {
    this.getInfo();
    this.showInfo();
    this.showTheme();
  },
  getInfo: function(){
    let urlParams = new URLSearchParams(window.location.search);
    data.output.url = urlParams.get('url'),
    data.output.theme = urlParams.get('theme');
  },
  showInfo: function(){
    data.dom.resultsName.innerHTML = data.output.url;
    data.dom.resultsLink.href = 'http://' + data.output.url;
  },
  showTheme: function(){
    if (data.output.theme === 'fireworks') {
      data.dom.pyroPlaceholder.classList.add('pyro');
    } else {
      this.startConfetti();
    }
  },
  startConfetti: function() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    // particle canvas
    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );
    canvas.id = 'particle-canvas';
    canvas.width = width;
    canvas.height = height;
    data.dom.effectsContainer.appendChild( canvas );

    // update canvas size
    const updateSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // create confetti particles
    const createParticles = () => {
      particles = [];
      let total = 100;

      if ( width > 1080 ) { total = 400; } else
      if ( width > 760 )  { total = 300; } else
      if ( width > 520 )  { total = 200; }

      for ( let i = 0; i < total; ++i ) {
        particles.push( new ConfettiParticle( context, width, height ) );
      }
    };

    // animation loop function
    const animationFunc = () => {
      requestAnimationFrame( animationFunc );
      context.clearRect( 0, 0, width, height );

      for ( let p of particles ) {
        p.width = width;
        p.height = height;
        p.update();
        p.draw();
      }
    };

    // on resize
    window.addEventListener( 'resize', e => {
      updateSize();
      createParticles();
    });

    // start
    updateSize();
    createParticles();
    animationFunc();
  }
}

let controllers = {
  setMeta: function(){
    data.meta.description = `Celebrate with me - ${data.output.url} is now live!`;
    data.meta.title = "Hooray, a new website was born!";

    document.querySelector('meta[property="og:url"]').setAttribute("content", data.output.url)

    document.querySelector('meta[property="og:description"]').setAttribute("content", data.meta.description)

    document.querySelector('meta[property="og:title"]').setAttribute("content", data.meta.title)

  },

  listeners: function(){
    showShareButtons = function(){
      data.dom.shareButton.addEventListener('click', function(e){
        data.dom.toastContainer.classList.toggle('is-active')
      })
    }

    showShareButtons()
  },

  social: function(){
    window.twttr = (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function(f) {
        t._e.push(f);
      };

      return t;
    })(document, "script", "twitter-wjs");

    (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  }
}

controllers.setMeta();
controllers.social();
view.startTheShow();
controllers.listeners();
