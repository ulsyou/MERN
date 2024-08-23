import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';

import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Signin.module.scss';

import { useAuth } from '../../context/auth';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Login() {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8080/api/user/login', user)
            .then((res) => {
                setAuth({ ...auth, user: res.data.user });
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
                alert('Tên tài khoản hoặc mật khẩu không chính xác!');
            });
    };

    return (
        <Container className={cx('signin')}>
            <Row>
                <Col xl={6}>
                    <h1 className={cx('signin-title')}>Đăng nhập</h1>
                    <h3 className={cx('signin-desc')}>Nếu bạn có một tài khoản, xin vui lòng đăng nhập</h3>
                    <form className={cx('signin-form')}>
                        <p>
                            <span className={cx('signin-form-lable')}>Email</span>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={onChange}
                                className={cx('signin-form-input')}
                            />
                        </p>
                        <p>
                            <span className={cx('signin-form-lable')}>Mật khẩu</span>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={onChange}
                                className={cx('signin-form-input')}
                            />
                        </p>
                        <button className={cx('signin-btn-login')} onClick={handleLogin}>
                            Đăng nhập
                        </button>
                    </form>
                </Col>
                <Col xl={6}>
                    <img
                        className={cx('signin-img')}
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        alt=""
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Login;
