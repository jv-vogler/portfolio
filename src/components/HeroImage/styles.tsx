import styled from 'styled-components';
import SliderIcon from '../../assets/slider-icon.svg';

export const Container = styled.div`
  position: relative;
  overflow: hidden;
  width: 95vmin;
  height: 100%;

  @media screen and (min-width: 768px) {
    height: 67.5vmin;
  }
`;

export const Picture = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const PictureBg = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: contain;
  clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
`;

export const Slider = styled.input`
  position: relative;
  -webkit-appearance: none;
  width: calc(100% + 40px);
  height: 100%;
  margin-left: -20px;
  background-color: transparent;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 40px;
    width: 40px;
    background: url(${SliderIcon}), rgba(0, 0, 0, 0.3);
    border: 3px solid ${props => props.theme.colors.accent};
    border-radius: 50%;
    background-size: contain;
    cursor: pointer;
  }
`;
