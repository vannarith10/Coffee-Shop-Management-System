
import styled from 'styled-components';

const MenuSwitch = ({handleOpen, open}:{handleOpen: ()=> void, open: boolean}) => {
  return (
    <StyledWrapper className='md:hidden h-full flex items-center'>
        <input type="checkbox" id="checkbox" 
        checked={open}
        onChange={handleOpen}/>
        <label htmlFor="checkbox" className="toggle">
          <div className="bars bg-text-primary" id="bar1" />
          <div className="bars bg-text-primary" id="bar2" />
          <div className="bars bg-text-primary" id="bar3" />
        </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 24px;
    height: 20px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition-duration: .5s;
  }

  .bars {
    width: 100%;
    height: 2px;
  }

  #bar2 {
    transition-duration: 1.5s;
  }


  #checkbox:checked + .toggle .bars {
    position: absolute;
    transition-duration: 1s;
  }

  #checkbox:checked + .toggle #bar2 {
    transform: scaleX(0);
    transition-duration: .3s;
  }

  #checkbox:checked + .toggle #bar1 {
    width: 100%;
    transform: rotate(45deg);
    transition-duration: .5s;
  }

  #checkbox:checked + .toggle #bar3 {
    width: 100%;
    transform: rotate(-45deg);
    transition-duration: .5s;
  }

  #checkbox:checked + .toggle {
    transition-duration: .5s;
    transform: rotate(360deg);
  }`;

export default MenuSwitch;
