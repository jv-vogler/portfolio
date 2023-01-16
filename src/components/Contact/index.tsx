import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import {
  Form,
  FormContainer,
  HeadingContainer,
  Section,
  SubmitBtn,
  Textarea,
  Wrapper,
  Label,
  Input,
  FormItem,
  FeedbackContainer,
} from './styles';
import axios from 'axios';

const Contact: React.FC = () => {
  const [t] = useTranslation();

  const schema = yup.object().shape({
    name: yup
      .string()
      .required(t('ErrorRequired') || 'Your name is required')
      .min(2, t('ErrorMinName') || 'Your name needs at least 2 characters'),
    email: yup
      .string()
      .required(t('ErrorRequired') || 'Your email is required')
      .email(t('ErrorEmailFormat') || 'Needs to be a valid email'),
    message: yup
      .string()
      .required(t('ErrorRequired') || 'Your message is required')
      .min(20, t('ErrorMinMessage') || 'Your message needs at least 20 characters'),
  });

  function onSubmit() {
    axios.post('https://getform.io/f/772b6ddd-c4a3-44b2-a018-96ac8fd73e2c', values)
    resetForm();
  }

  const { values, errors, handleChange, handleBlur, handleSubmit, resetForm } = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: schema,
    onSubmit,
  });

  return (
    <Section id="Contact">
      <Wrapper>
        <HeadingContainer>
          <h2>{t('Contact')}</h2>
          <p>{t('ContactDescription')}</p>
        </HeadingContainer>
        <FormContainer>
          <Form
            action="https://getform.io/f/772b6ddd-c4a3-44b2-a018-96ac8fd73e2c"
            method="POST"
            autoComplete="off"
            spellCheck={false}
            onSubmit={handleSubmit}
          >
            <FormItem>
              <Label htmlFor="name">{t('Name')}</Label>
              <Input
                type="text"
                name="name"
                value={values.name}
                error={errors.name}
                placeholder="John Doe"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FeedbackContainer>
                {errors.name ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'crimson' }}>
                    <FaExclamationTriangle /> {errors!.name}
                  </div>
                ) : (
                  values.name && (
                    <div style={{ display: 'flex', placeItems: 'center', gap: 10, color: 'green' }}>
                      <FaCheckCircle /> Ok!
                    </div>
                  )
                )}
              </FeedbackContainer>
            </FormItem>

            <FormItem>
              <Label htmlFor="email">{t('Email')}</Label>
              <Input
                type="text"
                name="email"
                value={values.email}
                error={errors.email}
                placeholder="johndoe@gmail.com"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <FeedbackContainer>
                {errors.email ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'crimson' }}>
                    <FaExclamationTriangle /> {errors!.email}
                  </div>
                ) : (
                  values.email && (
                    <div style={{ display: 'flex', placeItems: 'center', gap: 10, color: 'green' }}>
                      <FaCheckCircle /> Ok!
                    </div>
                  )
                )}
              </FeedbackContainer>
            </FormItem>

            <FormItem>
              <Label htmlFor="message">{t('Message')}</Label>
              <Textarea
                name="message"
                value={values.message}
                error={errors.message}
                placeholder={t('EnterMessage') || 'Enter your message'}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={10}
              ></Textarea>
              <FeedbackContainer>
                {errors.message ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'crimson' }}>
                    <FaExclamationTriangle /> {errors!.message}
                  </div>
                ) : (
                  values.message && (
                    <div style={{ display: 'flex', placeItems: 'center', gap: 10, color: 'green' }}>
                      <FaCheckCircle /> Ok!
                    </div>
                  )
                )}
              </FeedbackContainer>
            </FormItem>

            <SubmitBtn>{t('FormCTA')}</SubmitBtn>
          </Form>
        </FormContainer>
      </Wrapper>
    </Section>
  );
};

export default Contact;
