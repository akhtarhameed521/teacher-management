document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger")
  const nav = document.querySelector(".nav-links")
  const navLinks = document.querySelectorAll(".nav-links li")

  // Toggle navigation
  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active")

    // Animate links
    navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = ""
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
      }
    })

    // Burger animation
    burger.classList.toggle("toggle")
  })

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    const isClickInsideNav = nav.contains(event.target)
    const isClickInsideBurger = burger.contains(event.target)

    if (!isClickInsideNav && !isClickInsideBurger && nav.classList.contains("nav-active")) {
      nav.classList.remove("nav-active")
      burger.classList.remove("toggle")

      navLinks.forEach((link) => {
        link.style.animation = ""
      })
    }
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })

      // Close mobile menu if open
      if (nav.classList.contains("nav-active")) {
        nav.classList.remove("nav-active")
        burger.classList.remove("toggle")

        navLinks.forEach((link) => {
          link.style.animation = ""
        })
      }
    })
  })
})

