import classNames from 'classnames/bind';
import styles from './Intro.module.scss';

const cx = classNames.bind(styles);

function Content() {
    return (
        <div>
            <h1 className={cx('intro-lable')}>Giới thiệu</h1>
            <h3 className={cx('intro-slogan')}>Đến với KidShop Giá cả luôn thấp hơn so với những nơi khác</h3>
            <p className={cx('intro-parag')}>
                Bởi chúng tôi làm việc theo phương châm “Tất cả vì con yêu” con của bạn cũng như con của chúng tôi nên
                về mặt an toàn của sản phẩm cũng như giá cả đều được chúng tôi lựa chọn, tính toán kỹ lưỡng để bé có
                được nhiều món đồ chơi tốt mà mẹ cũng không quá đau ví tiền của mình.
            </p>
            <p className={cx('intro-parag')}>
                Với đội ngũ nhân viên làm việc chuyên nghiệp và nhiệt tình quý phụ huynh sẽ hài lòng và yên tâm hơn khi
                lựa chọn các sản phẩm đồ chơi, đồ dùng trẻ em tại hệ thống ToysStore.
            </p>
            <p className={cx('intro-parag')}>
                Các mặt hàng ToysStore cung cấp cũng rất đa dạng về chủng loại và mẫu mã từ đồ chơi bằng gỗ, đồ chơi
                bằng nhựa an toàn, các món đồ chơi kích thích trí tuệ cho bé…hay các món đồ tăng cường vận động cho bé
                như xe đạp cho bé, bể bơi bơm hơi, cầu trượt xích đu…các món đồ dùng tiện ích cho bé như nôi, giường cũi
                hay xe đẩy trẻ em…
            </p>
            <p className={cx('intro-parag')}>
                Hãy đến với chúng tôi để có được những sự lựa chọn tốt nhất và trở thành bà mẹ thông thái của các con mẹ
                nhé!
            </p>
            <div>
                <img
                    src="https://bizweb.dktcdn.net/100/117/632/files/1.png?v=1473010170674"
                    alt=""
                    className={cx('intro-img')}
                />
            </div>
            <p className={cx('intro-parag')}>
                Và điều tuyệt vời nhất là khi thấy con khôn lớn mỗi ngày. Là cha mẹ, việc chăm sóc, quan tâm, dạy dỗ cho
                con luôn là niềm vui, niềm hạnh phúc. Và ai cũng muốn dành cho con những điều tốt đẹp nhất. Beetlets
                Kids là website chuyên cung cấp quần áo hợp thời trang cho bé, phụ kiện trẻ em, đồ chơi tiện ích, đồ
                nhập khẩu cao cấp của các hãng nổi tiếng của châu Âu như: Ikea Thụy Điển, Elmich C.H Séc, từ các nước
                Nhật Bản, Thái Lan,...
            </p>
        </div>
    );
}

export default Content;
