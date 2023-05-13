import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useEffect, useState } from 'react';
import axios from 'axios';

import NormalProduct from '../Product/NormalProduct/NormalProduct';
import classNames from 'classnames/bind';
import styles from './CareAbout.module.scss';

const cx = classNames.bind(styles);

function CareAbout() {
    const [products, setProducts] = useState([]);

    //
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(`https://jsonplaceholder.typicode.com/photos`);
                setProducts(res.data.slice(0, 4));
            } catch (e) {
                console.log(e);
            }
        };
        getProducts();
    }, []);

    return (
        <Container>
            <h2 className={cx('careabout-lable')}>Có thể bạn quan tâm</h2>
            <h4 className={cx('careabout-desc')}>
                Bạn có thể tìm thấy những phẩm tốt và chi phí được giảm tới 70% với những mẫu mã đa dạng và phù hợp với
                hầu bao cả các bà mẹ. Chúng tôi cam kết luôn mang đến cho các mẹ và bé những sản phẩm tốt nhất, chất
                lượng nhất.
            </h4>

            <Row className={cx('careabout-row')}>
                {products.map((product) => {
                    return (
                        <Col xl={3} md={3} xs={6}>
                            <NormalProduct
                                src="https://bizweb.dktcdn.net/thumb/large/100/117/632/products/giay5-6ad05ccc-be71-4eca-83f8-3e73a5570372-42da6097-d9b3-437a-afe5-66c1be4352b4-8a365fca-ef0a-415a-838e-f172e148cb7c.jpg?v=1473603367790"
                                oldPrice="450.000"
                                newPrice="450.000"
                                discount="0"
                                title="giầy thể thao buộc dây - f56"
                            />
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
}

export default CareAbout;
