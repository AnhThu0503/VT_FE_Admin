import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Menu } from 'antd';
import { BsBarChartFill, BsFillPersonFill, BsListUl, BsCardHeading, BsBoxSeamFill, BsReceiptCutoff, BsTicketPerforated, BsFillTagsFill } from "react-icons/bs";
const Nav = () => {
    return (
        <Menu mode="inline" className='fs-6 menu-item mt-3' defaultSelectedKeys={['1']} style={{
            backgroundColor: '#ffffff',
        }}>
            <Menu.Item key="1" className='py-4'>
                <Link to="/" style={{ textDecoration: 'none' }}> <BsBarChartFill className='fs-5 mb-2 me-3' />Xem thống kê</Link>
            </Menu.Item>
            <Menu.Item key="2" className='py-4'>
                <Link to="/blog" style={{ textDecoration: 'none' }}><BsCardHeading className='fs-5 mb-1 me-3' />Quản lý Blog</Link>
            </Menu.Item>
            <Menu.Item key="3" className='py-4'>
                <Link to="/voucher" style={{ textDecoration: 'none' }}><BsTicketPerforated className='fs-5 mb-1 me-3' />Quản lý voucher</Link>
            </Menu.Item>
            <Menu.Item key="4" className='py-4'>
                <Link to="/category" style={{ textDecoration: 'none' }}> <BsListUl className='fs-5 mb-1 me-3' />Quản lý danh mục</Link>
            </Menu.Item>
            <Menu.Item key="5" className='py-4'>
                <Link to="/product" style={{ textDecoration: 'none' }}> <BsFillTagsFill className='fs-5 mb-2 me-3' />Quản lý sản phẩm</Link>
            </Menu.Item>

            <Menu.Item key="6" className='py-4'>
                <Link to="/order" style={{ textDecoration: 'none' }}><BsBoxSeamFill className='fs-5 mb-2 me-3' />Quản lý đơn hàng</Link>
            </Menu.Item>
            <Menu.Item key="7" className='py-4'>
                <Link to="/order-nhap" style={{ textDecoration: 'none' }}><BsReceiptCutoff className='fs-5 mb-2 me-3' />Quản lý đơn nhập</Link>
            </Menu.Item>
            <Menu.Item key="8" className='py-4'>
                <Link to="/user" style={{ textDecoration: 'none' }}> <BsFillPersonFill className='fs-5 mb-1 me-3' />Quản lý người dùng</Link>
            </Menu.Item>


        </Menu>

    )
}
export default Nav;