function toggleById(x) {
  if (document.getElementById(x).style.display == 'none') {
    document.getElementById(x).style.display = '';
  } else {
    document.getElementById(x).style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if ([...document.querySelectorAll('.post')].length) {
    var menu = document.getElementById('menu')
    var menuIcons = [document.getElementById('menu-icon'), document.getElementById('menu-icon-tablet')]
    menuIcons.forEach(function (menuIcon) {
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