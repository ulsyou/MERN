import Carousel from 'react-bootstrap/Carousel';

import classNames from 'classnames/bind';
import styles from './Banner.module.scss';

const cx = classNames.bind(styles);

function Banner() {
    return (
        <div className={cx('banner')}>
            <Carousel>
                <Carousel.Item>
                    <img
                        className={cx('banner-img')}
                        src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/slideshow_image_1.jpg?1564585558451"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className={cx('banner-img')}
                        src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/slideshow_image_2.jpg?1564585558451"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className={cx('banner-img')}
                        src="https://bizweb.dktcdn.net/100/117/632/themes/157694/assets/slideshow_image_3.jpg?1564585558451"
                        alt="First slide"
                    />
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Banner;
