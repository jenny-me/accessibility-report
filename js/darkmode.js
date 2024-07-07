var isDarkMode = localStorage.getItem('darkMode') || window.matchMedia('(prefers-color-scheme: dark)').matches;
const modeToggle = document.querySelector('.mode-toggle');

function setModeClass() {
  //console.log(isDarkMode);
  var pageClasses = document.documentElement.className;
  if (isDarkMode) {
    document.documentElement.className = document.documentElement.className.replace('light-mode', 'dark-mode');
    modeToggle.querySelector('.visuallyhidden').textContent = "Light Mode";
  } else {
    document.documentElement.className = document.documentElement.className.replace('dark-mode', 'light-mode');
    modeToggle.querySelector('.visuallyhidden').textContent = "Dark Mode";
  }
}
function updateDarkMode(){
  isDarkMode = !isDarkMode;
  setModeClass();
  localStorage.setItem("darkMode", isDarkMode);
}

setModeClass();
modeToggle.addEventListener('click', updateDarkMode, false);