import { faCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Nav.module.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function Nav() {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios
            .get('http://localhost:8080/api/category')
            .then((res) => setCategories(res.data))
            .catch((err) => console.log(err));
    }, []);
    return (
        <aside className={cx('category')}>
            <div className={cx('category-lable')}>Danh mục</div>
            <div className={cx('category-container')}>
                <Link to="/category" className={cx('category-item')}>
                    <FontAwesomeIcon className={cx('category-item-icon')} icon={faCircleRight} />
                    Tất cả sản phẩm
                </Link>
                {categories.map((category) => {
                    return (
                        <Link key={category._id} to={`/category/${category._id}`} className={cx('category-item')}>
                            <FontAwesomeIcon className={cx('category-item-icon')} icon={faCircleRight} />
                            {category.name}
                        </Link>
                    );
                })}
                <img
                    className={cx('category-img')}
                    src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/bg-cate.jpg"
                    alt=""
                />
            </div>
        </aside>
    );
}

export default Nav;
