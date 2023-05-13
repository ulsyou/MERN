import classNames from 'classnames/bind';
import styles from './Services.module.scss';

const cx = classNames.bind(styles);

function Content() {
    return (
        <div>
            <h1 className={cx('service-lable')}>Dịch vụ Kidshop</h1>
            <h3 className={cx('service-desc')}>Bán buôn, bán sỉ quần áo trẻ em tại Kids Shop</h3>
            <p className={cx('service-parag')}>
                Với nguồn hàng ổn định. độc đáo, hàng về hàng tháng với số lượng lớn và hàng trăm mẫu mã mới ko đụng
                hàng trên thị trường.
            </p>
            <p className={cx('service-parag')}>Các dòng hàng ổn định bao gồm:</p>
            <h4 className={cx('service-title')}>1. Baby gap</h4>
            <p className={cx('service-parag')}>
                - Hàng về hàng tháng theo đợt lớn, từ 30-50 mẫu mới tinh ko đụng hàng trên thị trường. Chất vải mịn,
                đẹp, hình thêu tinh tế, hình dán chắc và ko bị nứt. Sản lượng trên 10.000 bộ / đợt.
            </p>
            <p className={cx('service-parag')}>
                - Chất lượng hoàn toàn được khẳng định qua hơn 2 năm shop cung ứng dòng hàng này, với nhiều khách lẻ đến
                từ các thị trường Việt Nam, Mỹ, Singapore, Úc, Malaysia....
            </p>
            <p className={cx('service-parag')}>
                - Bán buôn bán lẻ số lượng lớn toàn quốc, giá cạnh tranh nhất thị trường.
            </p>
            <h4 className={cx('service-title')}>2. GW</h4>
            <p className={cx('service-parag')}>- Hàng có mình vải chắc, đẹp, mẫu mã dễ thương phong phú</p>
            <p className={cx('service-parag')}>
                - Hàng về ổn định mỗi đợt, giá gốc tốt nhất cho partner thân thiết của nhà máy và tổng nhập từ 6.000
                -10.000 bộ / đợt
            </p>
            <p className={cx('service-parag')}>
                - Số lượng nhập lớn, full mẫu. Giá để sỉ tốt nhất cho các bạn hàng, có khả năng deal giá tùy theo số
                lượng
            </p>
            <p className={cx('service-parag')}>- Hàng về sớm nhất ngay trong ngày xuất xưởng</p>
            <h4 className={cx('service-title')}>3. Top Baby</h4>
            <p className={cx('service-parag')}>- Dòng phụ kiện chủ lực của shop</p>
            <p className={cx('service-parag')}>- Nhập gốc từ xưởng sản xuất</p>
            <p className={cx('service-parag')}>- Số lượng lớn với giá thành tốt nhất</p>
            <h4 className={cx('service-title')}>4. Áo thun Coddle Me, Baby Gap, Disney</h4>
            <p className={cx('service-parag')}>- Số lượng nhập lớn, phong phú với hàng trăm mẫu mỗi tháng</p>
            <p className={cx('service-parag')}>- Nhập gốc từ nhà máy</p>
            <p className={cx('service-parag')}>- Hàng bảo đảm đẹp, chất và giá cạnh tranh nhất thị trường</p>
            <h4 className={cx('service-title')}>5. ZARA</h4>
            <p className={cx('service-parag')}>- Số lượng nhập ko lớn nhưng hàng được tuyển chọn cực kỹ</p>
            <p className={cx('service-parag')}>- Giá thành cao, đảm bảo chất lượng</p>
            <p className={cx('service-parag')}>- Hàng về hàng tháng mẫu cập nhật liên tục</p>
            <h4 className={cx('service-title')}>6. NEXT</h4>
            <p className={cx('service-parag')}>
                - Dòng hàng đại diện cho nguồn hàng đồ sơ sinh cao cấp tại shop bé tom
            </p>
            <p className={cx('service-parag')}>- Hàng đặt, chất lượng và mẫu mã cực kỳ ấn tượng</p>
            <p className={cx('service-parag')}>
                - Giá thành cao nhưng shop khẳng định ko hề cao so với chất lượng sản phẩm
            </p>
            <h4 className={cx('service-title')}>7. Magic Cube</h4>
            <p className={cx('service-parag')}>- Dòng hàng đại diện cho nguồn hàng váy cao cấp tạo shop bé tom</p>
            <p className={cx('service-parag')}>
                - Thời trang, phong cách với các bộ sưu tập váy theo mùa cực kỳ ấn tượng
            </p>
        </div>
    );
}

export default Content;
