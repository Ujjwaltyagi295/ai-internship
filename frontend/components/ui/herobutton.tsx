"use client"
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const HeorButton = () => {
     const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 20);
    return () => clearTimeout(timeout);
  }, []);

  return (
 <StyledWrapper style={{ opacity: show ? 1 : 0, transition: 'opacity 0.4s' }}>

      <div className="btn-wrapper">
        <button className="btn">
          <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
          <div className="txt-wrapper">
            <div className="txt-1">
              <span className="btn-letter">W</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">l</span>
              <span className="btn-letter">c</span>
              <span className="btn-letter">o</span>
              <span className="btn-letter">m</span>
              <span className="btn-letter">e</span>
              <span className="gap"></span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">o</span>
              <span className="gap"></span>
              <span className="btn-letter">C</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">P</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">h</span>
            </div>
            <div className="txt-2">
              <span className="btn-letter">W</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">l</span>
              <span className="btn-letter">c</span>
              <span className="btn-letter">o</span>
              <span className="btn-letter">m</span>
              <span className="btn-letter">e</span>
              <span className="gap"></span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">o</span>
              <span className="gap"></span>
              <span className="btn-letter">C</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">e</span>
              <span className="btn-letter">r</span>
              <span className="btn-letter">P</span>
              <span className="btn-letter">a</span>
              <span className="btn-letter">t</span>
              <span className="btn-letter">h</span>
               <span className="btn-letter">!</span>
            </div>
          </div>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn-wrapper {
    position: relative;
    display: inline-block;
  }

  .btn {
    --border-radius: 24px;
    --padding: 4px;
    --transition: 0.4s;
    --button-color: rgba(255, 255, 255, 0.13); /* Glass effect */
    --highlight-color-hue: 210deg;

    user-select: none;
    display: flex;
    justify-content: center;
    padding: 0.8em 1.0em;
    font-family: "Poppins", "Inter", "Segoe UI", sans-serif;
    font-size: 0.9em;
    font-weight: 400;
    background-color: var(--button-color);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: var(--border-radius);
    cursor: pointer;
    outline: none;

    /* No border or box-shadow */
    border: none;
    box-shadow: none;
    transition:
      box-shadow var(--transition),
      border var(--transition),
      background-color var(--transition);
  }

  .btn::before,
  .btn::after {
    /* Remove all border/shadow/background for true glass effect */
    background-image: none;
    box-shadow: none;
    border: none;
  }

  .btn-letter {
    position: relative;
    display: inline-block;
    color: rgba(255, 255, 255, 0.85);
    animation: letter-anim 2s ease-in-out infinite;
    transition:
      color var(--transition),
      text-shadow var(--transition),
      opacity var(--transition);
  }

  .gap {
    display: inline-block;
    width: 0.2em;
  }

  @keyframes letter-anim {
    50% {
      text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
      color: #fff;
    }
  }

  .btn-svg {
    flex-grow: 1;
    height: 24px;
    margin-right: 0.7rem;
    fill: #e8e8e8;
    animation: flicker 2s linear infinite;
    animation-delay: 0.5s;
    filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.6));
    transition:
      fill var(--transition),
      filter var(--transition),
      opacity var(--transition);
  }
  @keyframes flicker {
    50% {
      opacity: 0.3;
    }
  }

  .txt-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 14em;
  }
  .txt-1,
  .txt-2 {
    position: absolute;
    word-spacing: normal;
  }
  .txt-1 {
    animation: appear-anim 1s ease-in-out forwards;
  }
  .txt-2 {
    opacity: 0;
  }
  @keyframes appear-anim {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  .btn:focus .txt-1 {
    animation: opacity-anim 0.3s ease-in-out forwards;
    animation-delay: 1s;
  }
  .btn:focus .txt-2 {
    animation: opacity-anim 0.3s ease-in-out reverse forwards;
    animation-delay: 1s;
  }
  @keyframes opacity-anim {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .btn:focus .btn-letter {
    animation:
      focused-letter-anim 1s ease-in-out forwards,
      letter-anim 1.2s ease-in-out infinite;
    animation-delay: 0s, 1s;
  }
  @keyframes focused-letter-anim {
    0%,
    100% {
      filter: blur(0px);
    }
    50% {
      transform: scale(2);
      filter: blur(10px) brightness(150%)
        drop-shadow(-36px 12px 12px hsl(var(--highlight-color-hue), 100%, 70%));
    }
  }
  .btn:focus .btn-svg {
    animation-duration: 1.2s;
    animation-delay: 0.2s;
  }

  .btn:focus::before, .btn:focus::after,
  .btn:active::before, .btn:active::after {
    /* Remove active/focus shadow and border completely */
    background-image: none;
    box-shadow: none;
    border: none;
  }

  /* Animation delays for letters */
  .btn-letter:nth-child(1),  .btn:focus .btn-letter:nth-child(1) { animation-delay: 0s; }
  .btn-letter:nth-child(2),  .btn:focus .btn-letter:nth-child(2) { animation-delay: 0.08s; }
  .btn-letter:nth-child(3),  .btn:focus .btn-letter:nth-child(3) { animation-delay: 0.16s; }
  .btn-letter:nth-child(4),  .btn:focus .btn-letter:nth-child(4) { animation-delay: 0.24s; }
  .btn-letter:nth-child(5),  .btn:focus .btn-letter:nth-child(5) { animation-delay: 0.32s; }
  .btn-letter:nth-child(6),  .btn:focus .btn-letter:nth-child(6) { animation-delay: 0.4s; }
  .btn-letter:nth-child(7),  .btn:focus .btn-letter:nth-child(7) { animation-delay: 0.48s; }
  /* ...continue delays for more letters as needed up to 21 */
`;

export default HeorButton;
