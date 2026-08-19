document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CUSTOM CURSOR
  ========================= */

  const cursor = document.getElementById("cursor");
  const ring = document.getElementById("cursor-ring");

  let mx = innerWidth / 2;
  let my = innerHeight / 2;

  let rx = mx;
  let ry = my;

  if (matchMedia("(pointer:fine)").matches) {

    addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    const loop = () => {

      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;

      cursor.style.left = mx + "px";
      cursor.style.top = my + "px";

      ring.style.left = rx + "px";
      ring.style.top = ry + "px";

      requestAnimationFrame(loop);
    };

    loop();

    /* Cursor hover effect */

    document
      .querySelectorAll(
        "a, .work-card, .tool-list div, .btn"
      )
      .forEach((el) => {

        el.addEventListener("mouseenter", () => {
          ring.classList.add("big");
        });

        el.addEventListener("mouseleave", () => {
          ring.classList.remove("big");
        });

      });
  }


  /* =========================
     SCROLL PROGRESS
  ========================= */

  const progress =
    document.getElementById("progress");

  const updateProgress = () => {

    const pageHeight =
      document.documentElement.scrollHeight -
      innerHeight;

    const percentage =
      scrollY / Math.max(pageHeight, 1);

    progress.style.width =
      percentage * 100 + "%";
  };

  addEventListener(
    "scroll",
    updateProgress,
    { passive: true }
  );

  updateProgress();


  /* =========================
     SCROLL REVEAL
  ========================= */

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("in");

            observer.unobserve(
              entry.target
            );
          }

        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll(".reveal")
    .forEach((element, index) => {

      element.style.transitionDelay =
        (index % 5) * 70 + "ms";

      observer.observe(element);
    });


  /* =========================
     HERO 3D PARALLAX
  ========================= */

  const hero =
    document.querySelector(".hero");

  const orb =
    document.querySelector(".fire-orb");


  if (
    hero &&
    orb &&
    matchMedia("(pointer:fine)").matches
  ) {

    hero.addEventListener(
      "mousemove",
      (e) => {

        const x =
          (e.clientX / innerWidth - 0.5) * 2;

        const y =
          (e.clientY / innerHeight - 0.5) * 2;

        orb.style.transform = `
          rotateY(${x * 7}deg)
          rotateX(${-y * 6}deg)
          translateY(${y * -8}px)
        `;
      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {
        orb.style.transform = "";
      }
    );
  }


  /* =========================
     3D PORTFOLIO CARD TILT
  ========================= */

  document
    .querySelectorAll(".work-card")
    .forEach((card) => {

      card.addEventListener(
        "mousemove",
        (e) => {

          if (
            !matchMedia(
              "(pointer:fine)"
            ).matches
          ) {
            return;
          }

          const rect =
            card.getBoundingClientRect();

          const x =
            (e.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (e.clientY - rect.top) /
              rect.height -
            0.5;

          card.style.transform = `
            perspective(900px)
            rotateX(${y * -3}deg)
            rotateY(${x * 4}deg)
            translateY(-5px)
          `;
        }
      );


      card.addEventListener(
        "mouseleave",
        () => {
          card.style.transform = "";
        }
      );

    });

});
