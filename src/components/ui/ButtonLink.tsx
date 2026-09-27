import React from "react";

interface ButtonLinkProps {
  className?: string;
  id?: string;
  href?: string;
  text?: string;
}

const Button = ({ className, id, href, text }: ButtonLinkProps) => {
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
