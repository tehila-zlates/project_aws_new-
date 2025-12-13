import React, { FC } from 'react';
import './Login.scss';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router';
import { CheckCustomer } from '../../service/wines';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { showMessage } from '../../redux/messageSlice';

interface LoginProps { }

const Login: FC<LoginProps> = () => {
  const myNavigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (values: any) => {
    try {
      const response = await CheckCustomer(
        values.email.toString(),
        values.password.toString()
      );
      if (response.data.success) {
        sessionStorage.setItem('my-token', response.data.id);
        sessionStorage.setItem('user-data', JSON.stringify(response.data));
        dispatch(setUser(response.data));
        setTimeout(() => {
          myNavigate('/Home/About');
        }, 100);
      } else {
        if (response.data.message === "לקוח לא קיים") {
          dispatch(showMessage({
            title: 'התחברות נכשלה',
            body: 'הלקוח לא קיים, אנא הרשם תחילה.',
          }));
       setTimeout(() => {
          myNavigate('/SignUp', {
            state: {
              email: values.email,
              password: values.password
            }
          }); 
        }, 1000);
           // נתיב לקומפוננטת ההרשמה
        } else {
          dispatch(showMessage({
            title: 'התחברות נכשלה',
            body: response.data.message,
          }));
        }
      }
    } catch (error: any) {
      dispatch(showMessage({
        title: 'שגיאה',
        body: 'שגיאה כללית בהתחברות',
      }));
    }
  };



  const generateStrongPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    return password;
  };

  const myForm = useFormik({
    initialValues: { email: '', password: '' },
    onSubmit: loginUser,
    validationSchema: yup.object().shape({
      email: yup.string().email('כתובת אימייל שגויה').required('שדה חובה'),
      password: yup
        .string()
        .required('שדה חובה')
        // .test('strong-password', 'הסיסמה חלשה מדי', (value) => {
        //   if (!value) return false;
        //   return (
        //     value.length >= 8 &&
        //     /[A-Z]/.test(value) &&
        //     /\d/.test(value) &&
        //     /[!@#$%^&*]/.test(value)
        //   );
        // }),
    }),
  });

  return (
    <div className="Login">
      <form onSubmit={myForm.handleSubmit} className="login-form-container">
        <h2>התחברות</h2>

        <input
          name="email"
          type="email"
          placeholder="אימייל"
          value={myForm.values.email}
          onChange={myForm.handleChange}
          onBlur={myForm.handleBlur}
        />
        {myForm.touched.email && myForm.errors.email && (
          <div className="error">{myForm.errors.email}</div>
        )}

        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          value={myForm.values.password}
          onChange={myForm.handleChange}
          onBlur={myForm.handleBlur}
        />
        {myForm.touched.password && myForm.errors.password && (
          <div className="error">{myForm.errors.password}</div>
        )}
{/* 
        <button
          type="button"
          className="suggest-password"
          onClick={() =>
            myForm.setFieldValue('password', generateStrongPassword())
          }
        >
          הצע לי סיסמה חזקה
        </button> */}

        <button type="submit">התחברי</button>
      </form>
    </div>
  );
};

export default Login;