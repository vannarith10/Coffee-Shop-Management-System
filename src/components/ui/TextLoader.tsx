import styled from 'styled-components';

interface Props {
  text?: string;
  className?: string;
}

export default function TextLoader({ text = "Loading...", className }:Props) {
    
  return (
    <StyledWrapper>
      <div className="inline-flex gap-1 text-text-primary">
        {text.split("").map((char, index) => (
          <div
            key={index}
            className={`letter font-bold ${className}`}
            style={{ "--i": index + 1 } as React.CSSProperties}
          >
            {char}
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`

  .letter {
    display: inline-block;
    animation: letter 1s ease-in-out infinite alternate;
    animation-delay: calc(-1 * var(--i) * 0.1s);
    transform: scale(1);
  }

  @keyframes letter {
    0% {
      margin-right: 4px;
    }
    100% {
      margin-right: 0px;
    }
  }
`;