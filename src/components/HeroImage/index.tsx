import { useRef, useState } from 'react';
import Image from '../../assets/image1.png';
import ImageBg from '../../assets/image2.png';
import { Container, Picture, PictureBg, Slider } from './styles';

const HeroImage: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const imageRef = useRef<HTMLImageElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  function slide() {
    let slideValue = sliderRef.current?.value;
    imageRef.current!.style.clipPath =
      'polygon(0 0,' + slideValue + '% 0,' + slideValue + '% 100%, 0 100%)';
  }

  return (
    <Container>
      <Picture src={Image} />
      <PictureBg ref={imageRef} src={ImageBg} />
      <Slider
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        ref={sliderRef}
        onChange={e => {
          slide();
          setSliderValue(parseInt(e.target.value));
        }}
      ></Slider>
    </Container>
  );
};
export default HeroImage;
