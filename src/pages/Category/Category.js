import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Button, Input } from 'antd';
import './Category.scss'
function Category() {
    const [name, setName] = useState();
    const [categorys, setCategorys] = useState([])
    const uploadProductCategory = async () => {
        const response = await axios.post('/api/admin/category', {
            name,
        })
    }
    useEffect(() => {
        getAllCategory()
    }, [])
    const getAllCategory = async () => {
        try {
            const response = await axios.get('/api/admin/category')
            const formattedData = response.data.map((item, index) => ({

                key: item.DMSP_id,
                index: index + 1,
                name: item.DMSP_ten,

            }));
            setCategorys(formattedData)
        } catch (error) {
            console.error('Error fetching products:', error);
        }

    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
        },
        {
            title: 'TÊN DANH MỤC',
            dataIndex: 'name',
            filters: [
                {
                    text: 'Bánh',
                    value: 'Bánh',
                },
                {
                    text: 'Hoa Quả',
                    value: 'Hoa quả',
                },
                {
                    text: 'Lạp xưởng',
                    value: 'Lạp xưởng',
                },
                {
                    text: 'khô',
                    value: 'khô',
                },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.name.includes(value),
        },
        {
            title: '',
            dataIndex: '',
            render: (text, record) => (
                <div style={{ textAlign: 'right' }} > <Button >Cập nhật</Button>
                    <Button
                        className="mx-2"
                        type="primary"
                        danger
                        ghost

                    >
                        Xóa
                    </Button>
                </div>


            ),
        },
    ];

    return (
        <div className="container-category">
            <div className="text-center title-primary pb-4">Quản lý danh mục</div>
            <div className="col-sm-6 pb-4" style={{ textAlign: 'left' }}>
                <Input size="large" placeholder="Nhập tên danh mục" style={{ width: '70%', borderRadius: '0' }} value={name} onChange={e => setName(e.target.value)} />
                <Button onClick={uploadProductCategory} className="btn-upload-category" size="large" style={{ borderRadius: '0' }}>Thêm</Button>

            </div>
            <Table columns={columns} dataSource={categorys} />

        </div>
    );
}
export default Category;