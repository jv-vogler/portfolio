import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from '../../assets/image1.png';
import ImageBg from '../../assets/image2.png';
import { Container, Picture, PictureBg, Slider } from './styles';

const HeroImage: React.FC = () => {
  const [t] = useTranslation();
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
      <Picture src={Image} alt={t('AuthorPhoto1') || "Author's photo"} />
      <PictureBg
        ref={imageRef}
        src={ImageBg}
        alt={t('AuthorPhoto2') || "Author's silhouette with code in the background"}
      />
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
        aria-hidden={true}
        tabIndex={-1}
      ></Slider>
    </Container>
  );
};
export default HeroImage;
