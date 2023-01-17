import styled from 'styled-components';

export const Section = styled.section`
  min-height: calc(100vh - 80px);
  width: 100%;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  height: 100%;
  width: 100%;
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding: 1rem;
`;

export const HeadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 2rem;
  align-self: flex-start;

  @media screen and (min-width: 768px) {
    padding: 3rem;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  min-width: 30%;
  margin-top: 5rem;
  margin-left: auto;
  margin-right: auto;

  @media screen and (max-width: 768px) {
    min-width: 100%;
    margin-top: 2rem;
  }
`;

export const Label = styled.label`
  font-weight: 700;
  font-size: 0.9rem;
`;

export const FormItem = styled.div`
  position: relative;
`;

export const FeedbackContainer = styled.div`
  position: absolute;
`;

export const Message = styled.div`
  display: 'flex';
  place-items: 'center';
  gap: 10;
  color: 'crimson';
`;

type Props = {
  error: string | undefined;
  touched: boolean | undefined;
};

export const Input = styled.input<Props>`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid
    ${props => {
      if (props.error) {
        return 'crimson';
      } else if (props.value !== '') {
        return 'green';
      } else {
        return props.theme.colors.text;
      }
    }};
  outline: none;
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-weight: 600;
  transition: 0.3s;

  &:focus {
    box-shadow: 0px 0px 5px 2px ${props => props.theme.colors.text};
  }

  &::placeholder {
    font-weight: 400;
  }
`;

export const TextArea = styled.textarea<Props>`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid
    ${props => {
      if (props.error) {
        return 'crimson';
      } else if (props.value !== '') {
        return 'green';
      } else {
        return props.theme.colors.text;
      }
    }};
  border-radius: 0.5rem;
  outline: none;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-weight: 600;
  resize: none;
  transition: 0.3s;

  &:focus {
    box-shadow: 0px 0px 5px 2px ${props => props.theme.colors.text};
  }

  &::placeholder {
    font-weight: 400;
  }
`;
