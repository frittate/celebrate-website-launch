let data = {
  dom: {
    userUrl: document.getElementById("yay-options__input--url"),
    userTheme: document.getElementById("yay-options__input--theme"),
    button: document.getElementById("yay-button"),
    toast: document.getElementById("yay-toast"),
  },
  input: {
    url: "",
    theme: ""
  }
};

let view = {
  buttonEnable: function(){
    if(data.input.url.length != 0) {
      data.dom.button.disabled = false;
    } else {
      data.dom.button.disabled = true;
    }
  },
  testUrl: function(){
    urlToTest = data.input.url
    //https://
    if (urlToTest.slice(0,3) === 'www' || urlToTest.slice(0,8) === 'https://' || urlToTest.slice(0,7) === 'http://') {
      return true
    } else {
      return false
    }
  },
  showError: function(){
    if (this.testUrl()) {
      return true
    } else {
      data.dom.toast.classList.add('visible');
      setTimeout(() => {
        data.dom.toast.classList.remove('visible')
      }, 2000);
      return false
    }
  },
  goToResult: function(){
    let resultURL = new URL(
      'https://celebrate-website-launch.netlify.com//result.html?url=null&theme=null'
    );
    let queryString = resultURL.search;
    let params = new URLSearchParams(queryString)
    params.set('url', data.input.url)
    params.set('theme', data.input.theme)
    resultURL.search = params.toString();
    window.location.href = resultURL.href
  }

}

let controllers= {
  listeners: function(){
    data.dom.userUrl.addEventListener('input', function(e){
        data.input.url = e.target.value;
        view.buttonEnable();
    }),
    data.dom.button.addEventListener('click', function(e){
      if(view.showError()) {
        data.input.theme = data.dom.userTheme.value;
        view.goToResult();
      }
    })
  }
}

controllers.listeners();
