import React, { useEffect } from 'react'
import { Button, Table, message } from 'antd'
import ProductsForm from './ProductsForm';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteProduct, GetProducts } from '../../../apicalls/products';
import Bids from './Bids';

function Products() {
  const [showBids, setShowBids] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [products, setProducts] = React.useState([]);
  const [showProductForm, setShowProductForm] = React.useState(false);
  const { user } = useSelector((state) => state.users);


  const getData = async () => {
    try {
      const response = await GetProducts({
        seller: user._id,
      });
      if (response.success) {
        setProducts(response.data);

      }

    } catch (error) {
      message.error(error.message)
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await DeleteProduct(id);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message)
      }

    } catch (error) {
      message.error(error.message)
    }
  }


  const columns = [
    {
      title:"Product",
      dataIndex:"Image",
      render: (text,record) => {
        return <img src={record.Images?.length > 0 ? record.Images[0] : " "}
        alt=""
        className='w-20 h-20 object-cover rounded-mt'/>
      }
    },
    {
      title: "Name",
      dataIndex: "name",
    },
   
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Years Used",
      dataIndex: "yearsused",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Added on",
      dataIndex: "createdAt",
      render: (text, record) => moment(record.createdAt).format("DD/MM/YYYY hh:mm A"),

    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (<div className='flex gap-6 items-center'>
          <i className="ri-delete-bin-7-line cursor-pointer"
            onClick={() => {
              deleteProduct(record._id);
            }}>
          </i>
          <i className="ri-edit-box-line cursor-pointer"
            onClick={() => {
              setSelectedProduct(record);
              setShowProductForm(true);
            }}
          ></i>
          <span className='underline cursor-pointer'
            onClick={() => {
              setSelectedProduct(record);
              setShowBids(true);
            }}>
            Show Bids
          </span>

        </div >

        )
      }

    },
  ];



  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className='flex justify-end mb-2'>
        <Button type='default'
          onClick={() => {
            setSelectedProduct(null)
            setShowProductForm(true)

          }}>
          Add Product
        </Button>
      </div>

      <Table columns={columns} dataSource={products} />

      {showProductForm && (
        <ProductsForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />)}

      {
        showBids && (
          <Bids
            showBidsModal={showBids}
            setShowBidsModal={setShowBids}
            selectedProduct={selectedProduct}
          />
        )
      }
    </div>
  )
}

export default Products