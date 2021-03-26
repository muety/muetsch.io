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
  var menuIcons = document.getElementById('header').getElementsByClassName('icon')
  if (menuIcons.length) menuIcons[0].addEventListener('click', function (e) {
    menuIcons[0].parentElement.classList.toggle('responsive')
  })

  /**
    * Display the menu if the menu icon is clicked.
    */
  if ([...document.querySelectorAll('.post')].length) {
    var menu = document.getElementById('menu')
    [document.getElementById('menu-icon'), document.getElementById('menu-icon-tablet')].forEach(function (menuIcon) {
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