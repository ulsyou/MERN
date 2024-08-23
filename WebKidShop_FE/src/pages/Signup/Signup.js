import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import axios from 'axios';

import classNames from 'classnames/bind';
import styles from './Signup.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Register() {
    const [matchPwd, setMatchPwd] = useState('');
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
    });

    const onChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (user.password !== matchPwd) {
            console.log('Not match pwd');
        }
        axios
            .post('http://localhost:8080/api/user/signup', user)
            .then((res) => {
                setUser({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    phone: '',
                });
                setMatchPwd('');
            })
            .catch((err) => {
                alert('Thông tin chưa chính xác! Vui lòng kiểm tra lại!');
                console.log(err);
            });
    };

    return (
        <Container className={cx('signup')}>
            <Row>
                <Col xl={6}>
                    <h1 className={cx('signup-title')}>ĐĂNG KÝ TÀI KHOẢN</h1>
                    <h3 className={cx('signup-desc')}>
                        Nếu bạn có một tài khoản, xin vui lòng chuyển qua trang ĐĂNG NHẬP
                    </h3>
                    <form className={cx('signup-form')}>
                        <p>
                            <span className={cx('signup-form-lable')}>Họ</span>
                            <input
                                type="text"
                                name="firstName"
                                value={user.firstName}
                                onChange={onChange}
                                className={cx('signup-form-input')}
                            />
                        </p>
                        <p>
                            <span className={cx('signup-form-lable')}>Tên</span>
                            <input
                                type="text"
                                name="lastName"
                                value={user.lastName}
                                onChange={onChange}
                                className={cx('signup-form-input')}
                            />
                        </p>
                        <p>
                            <span className={cx('signup-form-lable')}>Điện thoại</span>
                            <input
                                type="tel"
                                name="phone"
                                value={user.phone}
                                onChange={onChange}
                                className={cx('signup-form-input')}
                                pattern="/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/"
                            />
                        </p>
                        <p>
                            <span className={cx('signup-form-lable')}>Email</span>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={onChange}
                                className={cx('signup-form-input')}
                            />
                        </p>

                        <p>
                            <span className={cx('signup-form-lable')}>Mật khẩu</span>
                            <input
                                type="password"
                                name="password"
                                value={user.password}
                                onChange={onChange}
                                className={cx('signup-form-input')}
                            />
                        </p>
                        <p>
                            <span className={cx('signup-form-lable')}>Nhập lại</span>
                            <input
                                type="password"
                                name="matchPwd"
                                value={matchPwd}
                                onChange={(e) => setMatchPwd(e.target.value)}
                                className={cx('signup-form-input')}
                            />
                        </p>
                        <button className={cx('signup-form-btn')} onClick={(e) => handleSubmit(e)}>
                            Đăng ký
                        </button>
                    </form>
                </Col>
                <Col xl={6}>
                    <img
                        className={cx('signup-img')}
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        alt=""
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
