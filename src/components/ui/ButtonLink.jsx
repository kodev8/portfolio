import React from "react";

const Button = ({ className, id, href, text }) => {

  const onClick = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    // if (!target) return;
    // const targetElement = document.getElementById(target)
    // if (!targetElement) return;
    // window.location.href = targetElement.href;
    // const rect = targetElement.getBoundingClientRect();
    // const scrollPosition = window.scrollY;
    // const offset = rect.top + scrollPosition;
    // window.scrollTo({
    //   top: offset,
    //   behavior: "smooth",
    // });
  };

  return (
    <a
      // onClick={onClick}
      href={href}
      className={`cta-wrapper ${className}`} id={id}>
      <div className="cta-button group">
        <div className="bg-circle"></div>
        <p className="text">{text}</p>
        <div className="arrow-wrapper">
          <img src="/images/arrow-down.svg" alt="arrow"/>
        </div>
      </div>
    </a>
  );
};

export default Button;
