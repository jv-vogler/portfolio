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
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
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
  display: flex;
  place-content: center;
  font-weight: 700;
`;

export const InputName = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid ${props => props.theme.colors.text};
  outline: none;
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-weight: 600;
  transition: 0.3s;

  &:focus {
    border: 2px solid ${props => props.theme.colors.accent};
  }

  &::placeholder {
    font-weight: 400;
  }

  &:valid {
    border: 2px solid green;
  }

  &:invalid {
    /* border: 2px solid red; */
  }
`;

export const InputEmail = styled.input`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid ${props => props.theme.colors.text};
  outline: none;
  border-radius: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-weight: 600;
  transition: 0.5s;

  &:focus {
    border: 2px solid ${props => props.theme.colors.accent};
  }

  &::placeholder {
    font-weight: 400;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  background: transparent;
  border: 2px solid ${props => props.theme.colors.text};
  border-radius: 0.5rem;
  outline: none;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  font-weight: 600;
  resize: none;
  transition: 0.5s;

  &::placeholder {
    font-weight: 400;
  }

  &:focus {
    border: 2px solid ${props => props.theme.colors.accent};
  }
`;

export const SubmitBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 150px;
  margin: 2rem 0;
  margin-left: auto;
  margin-right: auto;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.background};
  font-family: inherit;
  font-weight: bold;
  font-size: 1.5rem;
  outline: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${props => props.theme.colors.textSecondary};
    color: ${props => props.theme.colors.accent};
    transform: scale(1.1);
  }

  @media screen and (max-width: 768px) {
    align-self: center;
    min-width: 150px;
  }
`;
