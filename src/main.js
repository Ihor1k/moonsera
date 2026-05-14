// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

const popup = document.getElementById('popup');
const openButtons = document.querySelectorAll('.button, .header-button, .hero-button, .contact-button, .built-btn');
const closeBtn = document.querySelector('.close-popup');
const form = document.getElementById('joinForm');
const animItems = document.querySelectorAll('.anim-items')

openButtons.forEach(button => {
  button.addEventListener('click', () => {
    popup.classList.add('active');
    document.body.classList.add('menu-open');
  });
});

// закриття
closeBtn.addEventListener('click', () => {
  popup.classList.remove('active');
  document.body.classList.remove('menu-open');
}); 

//   Клік поза формою
  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
//   console.log(form)
// if (form) {
//   form.addEventListener('submit', async function (e) {
//     e.preventDefault();

//     const formData = new FormData(form);
//     const data = Object.fromEntries(formData.entries());

//     // підготувати payload під шаблон EmailJS
//     const payload = {
//       // звичні назви для EmailJS шаблону:
//       from_name: data.name || '',
//       from_email: data.email || '',
//       company: data.company || '',
//       message: data.message || '',
//       subscribe: data.subscribe ? 'yes' : 'no',

//       // опціонально: якщо в шаблоні передбачиш ці змінні
//       to_email: 'info@reimedical.com',
//       page_url: location.href
//     };

//     try {
//       // ВАШІ ідентифікатори
//       const SERVICE_ID  = 'service_7uteqbf';
//       const TEMPLATE_ID = 'template_zqu2xol';

//       // надсилання листа
//       const res = await emailjs.send(SERVICE_ID, TEMPLATE_ID, payload);

//       // резервно — збереження локально
//       try {
//         const savedForms = JSON.parse(localStorage.getItem('contactForms')) || [];
//         savedForms.push(data);
//         localStorage.setItem('contactForms', JSON.stringify(savedForms));
//       } catch (_) {}

//       // UX
//       document.getElementById('popup')?.classList.remove('active');
//       document.body.classList.remove('menu-open');
//       document.getElementById('successPopup')?.classList.add('active');
//       form.reset();
//     } catch (err) {
//       console.error('EmailJS error:', err);
//       document.getElementById('errorPopup')?.classList.add('active');
//     }
//   });
// }





const burger = document.querySelector('.burger');
const burgerClose = document.querySelector('.burger-close');
const headerMenu = document.querySelector('.header-menu');
const headerLinks = document.querySelectorAll('a.header-link');
const menuOverlay = document.querySelector('.menu-overlay');
  
if (burger && burgerClose && headerMenu && menuOverlay) {
  burger.addEventListener('click', () => {
    headerMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
  });

  burgerClose.addEventListener('click', () => {
    headerMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
 
  menuOverlay.addEventListener('click', () => {
    headerMenu.classList.remove('open');
    menuOverlay.classList.remove('active'); // ховаємо затемнення
    document.body.classList.remove('menu-open');
  }); 

  headerLinks.forEach(link => {
    link.addEventListener('click', () => {
      headerMenu.classList.remove('open');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

const achievementsSection = document.querySelector(".achievements-scroll");

if (achievementsSection && window.innerWidth > 991) {
  const items = gsap.utils.toArray(".achievement-item");

  const setActiveItem = (activeIndex) => {
    items.forEach((item, index) => {
      const body = item.querySelector(".achievement-body");

      if (index === activeIndex) {
        item.classList.add("active");

        gsap.to(body, {
          height: "auto",
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: true
        });
      } else {
        item.classList.remove("active");

        gsap.to(body, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
          overwrite: true
        });
      }
    });
  };

  items.forEach((item) => {
    const body = item.querySelector(".achievement-body");
    gsap.set(body, {
      height: 0,
      opacity: 0
    });
  });

  setActiveItem(0);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: achievementsSection,
      start: "top top",
      end: `+=${items.length * 500}`,
      scrub: 1,
      pin: ".achievements-sticky",
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        let index = Math.floor(progress * items.length);

        if (index >= items.length) index = items.length - 1;
        setActiveItem(index);
      }
    }
  });

  items.forEach((_, index) => {
    tl.to({}, { duration: 1 });
  });

  ScrollTrigger.refresh();
}

ScrollTrigger.matchMedia({
  "(min-width: 992px)": function servicesScrollDesktop() {
    const servicesRoot = document.querySelector(".services");
    const servicesPin = document.querySelector(".services__pin");
    const serviceItems = gsap.utils.toArray(".services-item");

    if (!servicesRoot || !servicesPin || serviceItems.length === 0) {
      return;
    }

    /** Must be ≥ longest close transition in services.scss (grid ~0.78s) */
    const SERVICES_OPEN_DELAY_MS = 300;

    const closeAll = () => {
      serviceItems.forEach((item) => {
        item.classList.remove("is-active");
        item.removeAttribute("aria-current");
      });
    };

    const openOnly = (activeIndex) => {
      serviceItems.forEach((item, index) => {
        const on = index === activeIndex;
        item.classList.toggle("is-active", on);
        if (on) {
          item.setAttribute("aria-current", "true");
        } else {
          item.removeAttribute("aria-current");
        }
      });
    };

    const getWantIndex = (self) => {
      const n = serviceItems.length;
      let idx = Math.floor(self.progress * n);
      if (idx >= n) idx = n - 1;
      if (idx < 0) idx = 0;
      return idx;
    };

    let committedOpen = 0;
    let seqTimer = null;
    let scheduledWant = null;

    const syncServicesFromScroll = (self) => {
      const want = getWantIndex(self);

      if (want === committedOpen && seqTimer === null) {
        return;
      }

      if (seqTimer !== null && scheduledWant === want) {
        return;
      }

      if (seqTimer !== null) {
        clearTimeout(seqTimer);
        seqTimer = null;
      }

      scheduledWant = want;
      closeAll();
      committedOpen = -1;

      seqTimer = setTimeout(() => {
        seqTimer = null;
        const w = getWantIndex(self);
        scheduledWant = null;
        openOnly(w);
        committedOpen = w;
        if (getWantIndex(self) !== committedOpen) {
          syncServicesFromScroll(self);
        }
      }, SERVICES_OPEN_DELAY_MS);
    };

    openOnly(0);
    committedOpen = 0;
    scheduledWant = null;

    ScrollTrigger.create({
      trigger: servicesRoot,
      start: "top: 90",
      end: () => `+=${serviceItems.length * 520}`,
      pin: servicesPin,
      scrub: 2.1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        syncServicesFromScroll(self);
      },
    });

    ScrollTrigger.refresh();

    return () => {
      if (seqTimer !== null) {
        clearTimeout(seqTimer);
        seqTimer = null;
      }
      scheduledWant = null;
      serviceItems.forEach((item, index) => {
        item.classList.toggle("is-active", index === 0);
        if (index === 0) {
          item.setAttribute("aria-current", "true");
        } else {
          item.removeAttribute("aria-current");
        }
      });
      committedOpen = 0;
    };
  },
});

function disableAchievementsOnMobile() {

  if (window.innerWidth <= 480) {

    // зупиняємо всі ScrollTrigger
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // показуємо всі тексти
    const bodies = document.querySelectorAll(".achievement-body");

    bodies.forEach(body => {
      gsap.set(body, {
        height: "auto",
        opacity: 1,
        clearProps: "all"
      });
    });

  }

}

disableAchievementsOnMobile();

window.addEventListener("resize", disableAchievementsOnMobile);

// const swiper = new Swiper('.swiper', {
//   speed: 500,
//   spaceBetween: 20,
//   slidesPerView: 1.1,  // трохи видно сусідній слайд на мобілці
//   loop: true,
//   breakpoints: {
//     640: { slidesPerView: 2, spaceBetween: 24 },
//     1024:{ slidesPerView: 3, spaceBetween: 28 }
//   },
//   navigation: {
//     nextEl: '.swiper-btn.next',
//     prevEl: '.swiper-btn.prev'
//   },
//   allowTouchMove: true
// });


  // const slides = Array.from(document.querySelectorAll('.slide'));
  //     const btnPrev = document.querySelector('.slider-arrow--left');
  //     const btnNext = document.querySelector('.slider-arrow--right');
  
  //     let current = 0; // активний індекс
  
  //     function updateSlides() {
  //       const total = slides.length;
  //       const prev = (current - 1 + total) % total;
  //       const next = (current + 1) % total;
  
  //       slides.forEach((slide, idx) => {
  //         slide.classList.remove('slide--active', 'slide--prev', 'slide--next', 'slide--hidden');
  
  //         if (idx === current) {
  //           slide.classList.add('slide--active');
  //         } else if (idx === prev) {
  //           slide.classList.add('slide--prev');
  //         } else if (idx === next) {
  //           slide.classList.add('slide--next');
  //         } else {
  //           slide.classList.add('slide--hidden');
  //         }
  //       });
  //     }
  
  //     btnPrev.addEventListener('click', () => {
  //       current = (current - 1 + slides.length) % slides.length;
  //       updateSlides();
  //     });
  
  //     btnNext.addEventListener('click', () => {
  //       current = (current + 1) % slides.length;
  //       updateSlides();
  //     });
  
  //     // Ініціалізація
  //     updateSlides();


    // document.addEventListener('DOMContentLoaded', () => {
    //   const slider = document.querySelector('.built-slider-track');
    //   const prevBtn = document.querySelector('.built-slider-arrow--prev');
    //   const nextBtn = document.querySelector('.built-slider-arrow--next');
    
    //   if (!slider || !prevBtn || !nextBtn) return;
    
    //   const items = slider.querySelectorAll('.item');
    //   const totalItems = items.length;
    //   let currentIndex = 0;
    
    //   const getStep = () => {
    //     const card = items[0];
    //     if (!card) return 0;
    
    //     const styles = window.getComputedStyle(slider);
    //     const gap = parseFloat(styles.columnGap || styles.gap || '24') || 0;
    
    //     return card.getBoundingClientRect().width + gap;
    //   };
    
    //   const goToIndex = (index) => {
    //     if (!totalItems) return;
    
    //     const step = getStep();
    //     if (!step) return;
    
    //     currentIndex = (index + totalItems) % totalItems;
    
    //     slider.scrollTo({
    //       left: currentIndex * step,
    //       behavior: 'smooth',
    //     });
    //   };
    
    //   prevBtn.addEventListener('click', () => goToIndex(currentIndex - 1));
    //   nextBtn.addEventListener('click', () => goToIndex(currentIndex + 1));
    // });
  

// --- Dropdown menu fix ---
// document.addEventListener('click', (e) => {
//   const toggle = e.target.closest('.dropdown-toggle');
//   const dropdown = e.target.closest('.header-dropdown');

//   // якщо клікнули саме по кнопці "Про компанію"
//   if (toggle && dropdown) {
//     e.preventDefault();
//     e.stopPropagation();

//     // закриваємо інші відкриті меню
//     document.querySelectorAll('.header-dropdown.active').forEach(d => {
//       if (d !== dropdown) d.classList.remove('active');
//     });

//     dropdown.classList.toggle('active');
//     return;
//   }

//   // клік поза меню — закриваємо всі
//   document.querySelectorAll('.header-dropdown.active').forEach(d => d.classList.remove('active'));
// });



// if(animItems.length > 0) {
//   window.addEventListener('scroll', animOnScroll)
//   function animOnScroll (params) {
//       for (let index = 0; index < animItems.length; index++) {
//           const animItem = animItems[index];
//           const animItemHeight = animItem.offsetHeight;
//           const animItemOffset = offset(animItem).top
//           const animStart = 4;

//           let animItemPoint = window.innerHeight - animItemHeight / animStart;
//           if (animItemHeight > window.innerHeight) {
//               animItemPoint = window.innerHeight - window.innerHeight / animStart
//           }

//           if((scrollY > animItemOffset - animItemPoint) && scrollY < (animItemOffset + animItemHeight)) {
//               animItem.classList.add('-active')
//           } else {
//               animItem.classList.remove('-active')
//           }
//       }
//   }
//   function offset(el) {
//       const rect = el.getBoundingClientRect(),
//           scrollLeft = window.scrollX || document.documentElement.scrollLeft,
//           scrollTop = window.scrollY || document.documentElement.scrollTop;
//       return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
//   }
  
//   setTimeout(() => { 
//       animOnScroll()
//   }, 800)
// }



// // === Налаштування =========================================================
// const SUBSCRIBE_ENDPOINT = ""; // якщо серверу ще немає, залиш порожнім
// const OPEN_TRIGGER_SELECTOR = ".logo"; // клік по твоїй бігучій строці

// // === Допоміжні змінні =====================================================
// const modal = document.getElementById("subscribeModal");
// const subscribeFormEl = document.getElementById("subscribeForm");
// const hint = document.getElementById("formHint");

// function openModal() {
//   modal.setAttribute("aria-hidden", "false");
//   document.body.classList.add("modal-open");

//   const first = subscribeFormEl?.querySelector('input[name="name"]');
//   if (first) setTimeout(() => first.focus(), 50);

//   document.addEventListener("keydown", onEscClose);
// }

// function closeModal() {
//   modal.setAttribute("aria-hidden", "true");
//   document.body.classList.remove("modal-open");
//   document.removeEventListener("keydown", onEscClose);
// }

// function onEscClose(e) {
//   if (e.key === "Escape") closeModal();
// }

// // клік по оверлею або кнопці "×"
// modal.addEventListener("click", (e) => {
//   const close = e.target.closest("[data-close]");
//   if (close) closeModal();
// });

// // відкриття при кліку на бігучу строку
// const trigger = document.querySelector(OPEN_TRIGGER_SELECTOR);
// if (trigger) {
//   trigger.style.cursor = "pointer";
//   trigger.addEventListener("click", openModal);
// }

// // проста перевірка email
// function isValidEmail(v) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).toLowerCase());
// }

// // збереження в localStorage
// function saveToLocalStorage(payload) {
//   try {
//     const key = "newsletterSignup";
//     const existing = JSON.parse(localStorage.getItem(key) || "[]");
//     existing.push(payload);
//     localStorage.setItem(key, JSON.stringify(existing));
//     return true;
//   } catch (e) {
//     return false;
//   }
// }

// // надсилання на сервер (опційно)
// async function sendToServer(payload) {
//   if (!SUBSCRIBE_ENDPOINT) return { ok: false, skipped: true };
//   try {
//     const res = await fetch(SUBSCRIBE_ENDPOINT, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     return { ok: res.ok, status: res.status };
//   } catch (err) {
//     return { ok: false, error: String(err) };
//   }
// }

// // сабміт форми
// subscribeFormEl.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   hint.className = "form__hint";
//   hint.textContent = "";

//   const name = subscribeFormEl.elements["name"].value.trim();
//   const email = subscribeFormEl.elements["email"].value.trim();

//   if (!name) {
//     hint.classList.add("error");
//     hint.textContent = "Вкажіть ім’я 🙌";
//     return;
//   }
//   if (!isValidEmail(email)) {
//     hint.classList.add("error");
//     hint.textContent = "Перевірте імейл ✉️";
//     return;
//   }

//   const payload = {
//     name,
//     email,
//     source: "subscribe_modal",
//     ts: new Date().toISOString(),
//     url: location.href,
//   };

//   // 1) зберегти локально
//   saveToLocalStorage(payload);

//   // 2) якщо є сервер — надіслати
//   const server = await sendToServer(payload);

//   // результат
//   // if (server.skipped) {
//   //   hint.classList.add("success");
//   //   hint.textContent =
//   //     "Збережено локально. Додайте endpoint — і воно також надсилатиметься на сервер.";
//   // } else if (server.ok) {
//   //   hint.classList.add("success");
//   //   hint.textContent = "Готово! Ви підписані ✅";
//   // } else {
//   //   hint.classList.add("error");
//   //   hint.textContent =
//   //     "Не вдалось надіслати на сервер. Дані збережено локально.";
//   // }

//   subscribeFormEl.reset();
//   setTimeout(closeModal, 900);
// });


// const languageBtn = document.getElementById('languageBtn');
// const languageSelector = document.querySelector('.language-selector');

// languageBtn.addEventListener('click', () => {
//   languageSelector.classList.toggle('active');
// });

// // Закриває меню при кліку поза ним
// document.addEventListener('click', (e) => {
//   if (!languageSelector.contains(e.target)) {
//     languageSelector.classList.remove('active');
//   }
// });

function initServicesMobileCarousel() {
  const mq = window.matchMedia("(max-width: 480px)");
  let teardown = null;

  const bind = () => {
    const root = document.querySelector(".services");
    const scroller = root?.querySelector(".services__scroller");
    const pager = root?.querySelector(".services__pager");
    const items = root ? Array.from(root.querySelectorAll(".services-item")) : [];
    const dots = pager ? Array.from(pager.querySelectorAll(".services__dot")) : [];

    if (!root || !scroller || !pager || items.length === 0 || dots.length === 0) {
      return () => {};
    }

    let lastIndex = 0;
    let rafId = 0;

    const setSlide = (i) => {
      const idx = Math.max(0, Math.min(i, items.length - 1));
      lastIndex = idx;
      items.forEach((el, n) => {
        const on = n === idx;
        el.classList.toggle("is-active", on);
        if (on) {
          el.setAttribute("aria-current", "true");
        } else {
          el.removeAttribute("aria-current");
        }
      });
      dots.forEach((d, n) => {
        const on = n === idx;
        d.classList.toggle("is-active", on);
        if (on) {
          d.setAttribute("aria-current", "true");
        } else {
          d.removeAttribute("aria-current");
        }
      });
    };

    const maxScroll = () => Math.max(0, scroller.scrollWidth - scroller.clientWidth);

    const centerOffsetForIndex = (idx) => {
      const el = items[idx];
      if (!el) return 0;
      return el.offsetLeft - (scroller.clientWidth - el.offsetWidth) / 2;
    };

    const scrollToIndex = (idx, smooth) => {
      const left = Math.max(0, Math.min(centerOffsetForIndex(idx), maxScroll()));
      scroller.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
    };

    const readIndexFromScroll = () => {
      const mid = scroller.scrollLeft + scroller.clientWidth * 0.5;
      let best = 0;
      let bestDist = Infinity;
      items.forEach((el, i) => {
        const cx = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(cx - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        setSlide(readIndexFromScroll());
      });
    };

    const onPagerClick = (e) => {
      const btn = e.target.closest(".services__dot");
      if (!btn || !pager.contains(btn)) return;
      const i = Number(btn.getAttribute("data-slide"));
      if (Number.isNaN(i)) return;
      scrollToIndex(i, true);
    };

    const onResize = () => {
      scrollToIndex(lastIndex, false);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    pager.addEventListener("click", onPagerClick);
    window.addEventListener("resize", onResize);

    setSlide(0);
    scroller.scrollLeft = 0;

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      pager.removeEventListener("click", onPagerClick);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  };

  const apply = () => {
    if (typeof teardown === "function") {
      teardown();
      teardown = null;
    }
    if (mq.matches) {
      teardown = bind();
    }
  };

  apply();
  mq.addEventListener("change", apply);
}

initServicesMobileCarousel();
