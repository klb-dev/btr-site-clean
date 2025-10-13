// Build a seamless, no-controls, "video-like" horizontal reel from an image list.

const IMAGES = [
  {
    src: "images/webp/skatepark.webp",
    alt: "Skateboarding event",
    caption: "Pleasanton Skatepark",
  },
  {
    src: "images/eventImages/boyTryingTrick.webp",
    alt: "Trying a trick",
    caption: "Trick attempt",
  },
  {
    src: "images/eventImages/breakTime.webp",
    alt: "Break on the steps",
    caption: "Chilling on the steps",
  },
  {
    src: "images/eventImages/chilling.webp",
    alt: "Group posing on steps",
    caption: "Group posing on steps",
  },
  {
    src: "images/eventImages/crusingExcited.webp",
    alt: "She made it down",
    caption: "Excited for staying upright",
  },
  {
    src: "images/eventImages/demonstating.webp",
    alt: "Showing how it's done",
    caption: "Demonstrating",
  },
  {
    src: "images/eventImages/downSlope.webp",
    alt: "Going down the slope",
    caption: "Uncertain, but going down",
  },
  {
    src: "images/eventImages/groupLeaning(2).webp",
    alt: "Couple of kids learning",
    caption: "Trying it out",
  },
  {
    src: "images/eventImages/groupLeaning.webp",
    alt: "Listening to the Byrdman",
    caption: "Byrdman talking shop",
  },
  {
    src: "images/eventImages/havingFun.webp",
    alt: "Riding the board",
    caption: "Crusing and having fun",
  },
  {
    src: "images/eventImages/IMG_8009.webp",
    alt: "GroupListening",
    caption: "Learning about boards",
  },
  {
    src: "images/eventImages/instructorExplaining.webp",
    alt: "Kids listening to teacher",
    caption: "Group is ready to learn",
  },
  {
    src: "images/eventImages/kidsLearningToRide.webp",
    alt: "Pushing and crusing",
    caption: "Learning to ride",
  },
  {
    src: "images/eventImages/learning.webp",
    alt: "Riding the board",
    caption: "Crusing and having fun",
  },
  {
    src: "images/eventImages/learningBalance.webp",
    alt: "Figuring out balance",
    caption: "Finding balance",
  },
  {
    src: "images/eventImages/learningSlope.webp",
    alt: "Learning how to go down",
    caption: "Going down the slope",
  },
  {
    src: "images/eventImages/showingTricks.webp",
    alt: "Tricks",
    caption: "Thinking about tricks",
  },
  {
    src: "images/eventImages/studentTeacher.webp",
    alt: "Fun figuring it out",
    caption: "Fun figuring it out",
  },
  {
    src: "images/eventImages/teacherBalance.webp",
    alt: "Helping balance on board",
    caption: "Helping balance on board",
  },
  {
    src: "images/eventImages/havingFun.webp",
    alt: "Riding the board",
    caption: "Crusing and having fun",
  },
];

(function initReel() {
  const track = document.getElementById("reelTrack");
  if (!track) return;

  // Build one set
  const buildSet = (arr) => {
    const frag = document.createDocumentFragment();
    arr.forEach(({ src, alt, caption }, i) => {
      // Add index parameter here
      const wrap = document.createElement("figure");
      wrap.className = "reel-item" + (i === arr.length - 1 ? " is-last" : "");
      if (caption) wrap.setAttribute("data-caption", caption);

      const img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.src = src;
      img.alt = alt || "Event photo";
      img.onerror = () => {
        wrap.style.display = "none";
      };

      wrap.appendChild(img);
      frag.appendChild(wrap);
    });
    return frag;
  };

  track.appendChild(buildSet(IMAGES));
  track.appendChild(buildSet(IMAGES));

  // Pause animation when tab is hidden to save battery/CPU
  const toggleAnim = () => {
    track.style.animationPlayState = document.hidden ? "paused" : "running";
  };
  document.addEventListener("visibilitychange", toggleAnim, { passive: true });

  // slow the reel on hover
  track.addEventListener("mouseenter", () => {
    track.style.animationDuration = "35s";
  });
  track.addEventListener("mouseleave", () => {
    track.style.animationDuration = "35s";
  });
})();
