//MENU HAMBURGUESA

const openMenu = document.querySelector(".open-menu");
const closeMenu = document.querySelector(".close-menu");
const aside = document.querySelector("aside");
const menuLinks = document.querySelectorAll(".boton-menu");

openMenu.addEventListener("click", () => {
  aside.classList.add("aside-visible");
});

closeMenu.addEventListener("click", () => {
  aside.classList.remove("aside-visible");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  });
});

// Agregar event listener para ocultar el menú al hacer clic fuera de él
document.addEventListener("click", (event) => {
  const target = event.target;
  const isMenuOpen = aside.classList.contains("aside-visible");

  if (isMenuOpen && !target.closest("aside") && !target.closest(".open-menu")) {
    aside.classList.remove("aside-visible");
  }
});