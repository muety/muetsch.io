function toggleById(x) {
  if (document.getElementById(x).style.display == 'none') {
    document.getElementById(x).style.display = '';
  } else {
    document.getElementById(x).style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  /**
   * Shows the responsive navigation menu on mobile.
   */
  var header = [
    document.getElementById('header'),
    document.getElementById('header-post')
  ].filter(e => !!e)[0]
  var menuIcons = header.getElementsByClassName('icon')
  if (menuIcons.length) menuIcons[0].addEventListener('click', function (e) {
    menuIcons[0].parentElement.classList.toggle('responsive')
  })

  /**
    * Display the menu if the menu icon is clicked.
    */
  if ([...document.querySelectorAll('.post')].length) {
    var menu = document.getElementById('menu');
    [document.getElementById('menu-icon'), document.getElementById('menu-icon-tablet')]
      .filter(e => !!e)
      .forEach(function (menuIcon) {
        menuIcon.addEventListener('click', function (e) {
          if (!menu.style.visibility || menu.style.visibility === 'hidden') {
            menu.style.visibility = 'visible'
            menuIcon.classList.add('active')
          } else {
            menu.style.visibility = 'hidden'
            menuIcon.classList.remove('active')
          }
          e.preventDefault()
        })
      })
  }
});