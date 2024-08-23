import Row from 'react-bootstrap/esm/Row';
import classNames from 'classnames/bind';
import styles from './SellestProduct.module.scss';

import SellProduct from './SellProduct/SellProduct';

const cx = classNames.bind(styles);

function SellestProduct() {
    return (
        <Row>
            <h5 className={cx('sellest-product-lable')}>Sản phẩm bán chạy</h5>
            <SellProduct
                src="https://bizweb.dktcdn.net/thumb/compact/100/117/632/products/aovay12.jpg?v=1473606357990"
                title="Váy liền thân KIDS-02"
                oldPrice="250.000"
                newPrice="250.000"
            />
            <SellProduct
                src="https://bizweb.dktcdn.net/thumb/compact/100/117/632/products/aovay12.jpg?v=1473606357990"
                title="Váy liền thân KIDS-02"
                oldPrice="250.000"
                newPrice="250.000"
            />
            <SellProduct
                src="https://bizweb.dktcdn.net/thumb/compact/100/117/632/products/aovay12.jpg?v=1473606357990"
                title="Váy liền thân KIDS-02"
                oldPrice="250.000"
                newPrice="250.000"
            />
            <SellProduct
                src="https://bizweb.dktcdn.net/thumb/compact/100/117/632/products/aovay12.jpg?v=1473606357990"
                title="Váy liền thân KIDS-02"
                oldPrice="250.000"
                newPrice="250.000"
            />
        </Row>
    );
}

export default SellestProduct;
