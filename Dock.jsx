import { useRef, useEffect } from "react";
import "./Stylesheet/Dock.css";

const icons = [
  { name: "Figma", iconSrc: "/src/assets/Figma.svg" },
  {
    name: "Blender",
    iconSrc: "/src/assets/Blender.svg",
  },
  { name: "HTML", iconSrc: "/src/assets/Html.svg" },
  {
    name: "React.js",
    iconSrc: "/src/assets/React.svg",
  },
  {
    name: "Creative Suite",
    iconSrc: "/src/assets/AdobeCreative.svg",
  },
  {
    name: "Notion",
    iconSrc: "/src/assets/Notion.svg",
  },
  { name: "Any Tools!", iconSrc: "/src/assets/Aster.svg" },

  // Add more icons as needed
];

export default function TDock({
  IconBsSize = 50,
  rate = 1000,
  PopOverFade = 200,
}) {
  const timeStamp = {
    new: 0,
    previous: 0,
  };
  const count = icons.length;
  let width =
    ((document.body.getBoundingClientRect().width * 82) / 100 - 80) /
    (2 * (count * 1.3 + 0.3));
  let containerWidth = width * (count * 1.3 + 0.3);
  const refDockContainer = useRef();
  const refElements = [];
  const refTags = [];
  const refIcons = [];
  const arr = [];
  for (let i = 0; i < count; i++) {
    refElements.push(useRef());
    refTags.push(useRef());
    refIcons.push(useRef());
    arr.push({ new: width, current: width, progress: 0, diff: 0 });
  }
  const containerParam = {
    new: containerWidth,
    current: containerWidth,
    progress: 0,
    diff: 0,
  };
  const parameters = {
    offset: 0,
  };

  useEffect(() => {
    function animate() {
      if (!refDockContainer.current) return;
      timeStamp.new = Date.now();
      const delta = timeStamp.new - timeStamp.previous;
      for (let i = 0; i < count; i++) {
        if (arr[i].progress) {
          if (arr[i].new > arr[i].current) {
            arr[i].current += (arr[i].diff * delta) / 100000;
            if (arr[i].new < arr[i].current) {
              arr[i].current = arr[i].new;
              arr[i].progress = 0;
            }
          } else {
            arr[i].current -= (arr[i].diff * delta) / 100000;
            if (arr[i].new > arr[i].current) {
              arr[i].current = arr[i].new;
              arr[i].progress = 0;
            }
          }
          refElements[i].current.style.width = arr[i].current + "px";
          refElements[i].current.style.height = arr[i].current + "px";
          const iconSize =
            ((arr[i].current * 10) / width - 10) * 3 + IconBsSize;
          refIcons[i].current.style.width = iconSize + "%";
        }
      }

      if (containerParam.progress) {
        if (containerParam.new > containerParam.current) {
          containerParam.current += (containerParam.diff * delta) / 100000;
          if (containerParam.new < containerParam.current) {
            containerParam.current = containerParam.new;
            containerParam.progress = 0;
          }
        } else {
          containerParam.current -= (containerParam.diff * delta) / 100000;
          if (containerParam.new > containerParam.current) {
            containerParam.current = containerParam.new;
            containerParam.progress = 0;
          }
        }
        refDockContainer.current.style.width = containerParam.current + "px";
      }
      timeStamp.previous = timeStamp.new;
      requestAnimationFrame(animate);
    }

    function updateParameter() {
      const screenSize = document.body.getBoundingClientRect().width;
      if (screenSize > 1000) {
        width = ((screenSize * 70) / 100 - 70) / (2 * (count * 1.3 + 0.3));
        containerWidth = width * (count * 1.3 + 0.3);
      } else if (screenSize > 767) {
        width = ((screenSize * 72) / 100 - 70) / (2 * (count * 1.3 + 0.3));
        containerWidth = width * (count * 1.3 + 0.3);
      } else if (screenSize > 520) {
        width = (screenSize * 55) / 100 / (count * 1.3 + 0.3);
        containerWidth = width * (count * 1.3 + 0.3);
      } else {
        width = (screenSize * 90) / 100 / (count * 1.3 + 0.3);
        containerWidth = width * (count * 1.3 + 0.3);
      }
      for (let i = 0; i < count; i++) {
        refElements[i].current.style.width = width + "px";
        refElements[i].current.style.height = width + "px";
        arr[i].current = width;
        refTags[i].current.style.bottom = width * 1.3 + "px";
      }
      refDockContainer.current.style.width = containerWidth + "px";
      refDockContainer.current.style.height = width * 1.2 + "px";
      refDockContainer.current.style.paddingBottom = width * 0.2 + "px";
      containerParam.current = containerWidth;
      if (refDockContainer.current)
        parameters.offset = refDockContainer.current.getBoundingClientRect().x;
    }

    window.addEventListener("resize", updateParameter);
    updateParameter();
    const animation = { id: null };
    if (refDockContainer.current) animation.id = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", updateParameter);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="Docker"
        style={{
          width: `${containerWidth}px`,
          height: `${width * 1.2}px`,
          paddingBottom: `${width * 0.2}px`,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          zIndex: "10",
        }}
        onMouseEnter={() => {
          timeStamp.previous = Date.now();
        }}
        onMouseLeave={() => {
          for (let i = 0; i < count; i++) {
            arr[i].new = width;
            arr[i].progress = 1;
            arr[i].diff = Math.abs(arr[i].new - arr[i].current) * rate;
            refTags[i].current.style.opacity = "0";
          }

          containerParam.new = containerWidth;
          containerParam.diff =
            Math.abs(containerParam.current - containerWidth) * rate;
          containerParam.progress = 1;
        }}
        onMouseMove={(event) => {
          const index = Math.round(
            (event.clientX - parameters.offset - width) / (width * 1.3)
          );
          containerParam.new = 0;
          for (let i = 0; i < count; i++) {
            const distance = Math.abs(
              i * width * 1.3 - (event.clientX - parameters.offset - width)
            );
            if (distance < 2.5 * width)
              arr[i].new = 1.5 * width - 0.2 * distance;
            else arr[i].new = width;

            arr[i].progress = 1;
            arr[i].diff = Math.abs(arr[i].new - arr[i].current) * rate;
            containerParam.new += arr[i].new;
            if (index == i) refTags[i].current.style.opacity = "1";
            else refTags[i].current.style.opacity = "0";
          }
          containerParam.new += (count + 1) * width * 0.3;
          containerParam.diff =
            Math.abs(containerParam.new - containerWidth) * rate;
          containerParam.progress = 1;
        }}
        ref={refDockContainer}
      >
        {icons.map((item, index) => (
          <div
            className="IconContainerBox"
            key={index}
            style={{
              position: "relative",
              height: `${width}px`,
              width: `${width}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            ref={refElements[index]}
          >
            <div
              className="popOver"
              style={{
                position: "relative",
                opacity: "0",
                bottom: `${width * 1.1}px`,
                textAlign: "center",
                textWrap: "nowrap",
                width: "fit-content",
                transitionDuration: `${PopOverFade}ms`,
              }}
              ref={refTags[index]}
            >
              {item.name}
            </div>
            <img
              src={item.iconSrc}
              style={{
                width: `${IconBsSize}%`,
                position: "absolute",
                justifySelf: "center",
              }}
              ref={refIcons[index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
