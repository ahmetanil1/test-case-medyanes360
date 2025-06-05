import * as Yup from 'yup';

const validationSchema = Yup.object({

    email: Yup.string()
        .required('Email boş bırakılamaz.')
        .email('Geçerli bir e mail adresi giriniz.'),

    password: Yup.string()
        .required('Şifre boş bırakılamaz!')
});

export default validationSchema;