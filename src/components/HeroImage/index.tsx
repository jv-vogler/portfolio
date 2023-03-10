import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from '../../assets/image1.png';
import ImageWebp from '../../assets/image1.webp'
import ImageBg from '../../assets/image2.png';
import ImageBgWebp from '../../assets/image2.webp';
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
      <picture>
        <source srcSet={ImageWebp} type='image/webp' />
        <Picture src={Image} alt={t('AuthorPhoto1') || "Author's photo"} />
      </picture>
      <picture>
      <source srcSet={ImageBgWebp} type='image/webp' />
        <PictureBg
          ref={imageRef}
          src={ImageBg}
          alt={t('AuthorPhoto2') || "Author's silhouette with code in the background"}
        />
      </picture>
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
