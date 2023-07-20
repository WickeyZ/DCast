import { useState } from "react";

function MetamaskHover() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span>
      Please install{" "}
      <a
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        href="https://metamask.io/download/"
        target="_blank"
        style={{
          color: isHovered ? "rgba(0, 0, 255, 0.7)" : "blue",
          textDecoration: "underline",
          transition: "color 0.2s",
        }}
      >
        MetaMask
      </a>{" "}
      first.
    </span>
  );
}

export default MetamaskHover;
