import { Table, Button } from 'antd';
import "./Voucher.scss";

function Voucher() {
    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
        },
        {
            title: 'VOUCHER CODE',
            dataIndex: 'code',
        },
        {
            title: 'TIỀN GIẢM',
            dataIndex: 'discountPrice',
            sorter: (a, b) => a.discountPrice - b.discountPrice,

        },
        {
            title: 'NGÀY PHÁT HÀNH',
            dataIndex: 'discountDate',
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'state',
            render: (text, record) => (
                <div className={record.state ? 'isUse' : ''} style={{ textAlign: 'center' }}>
                    {record.state ? <span style={{ color: '#333' }}>Đã sử dụng</span> : 'Chưa sử dụng'}
                </div>
            ),
            filters: [
                {
                    text: 'Đã sử dụng',
                    value: true,
                },
                {
                    text: 'Chưa sử dụng',
                    value: false,
                },

            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.state === value,
            width: '10%'
        },
        {
            title: '',
            dataIndex: '',
            render: (text, record) => (
                <div style={{ textAlign: 'right' }}> <Button >Cập nhật</Button>
                    <Button className='mx-2' type="primary" danger ghost>Xóa</Button>

                </div>


            ),
        },
    ];
    const data = [
        {
            key: '1',
            code: 'TTTT',
            discountPrice: 30000,
            discountDate: '05/03/2002',
            state: true,
        },
        {
            key: '2',
            code: 'TTTT3',
            discountPrice: 40000,
            discountDate: '05/03/2002',
            state: false,
        },
    ];
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div className="container-voucher ">
            <div className="title-primary pb-4">
                Quản lý khuyến mãi
            </div>
            <Table columns={columns} dataSource={data} />
        </div >
    )
}
export default Voucher;