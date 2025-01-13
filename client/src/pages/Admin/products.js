import React, { useEffect } from 'react'
import { Button, Table, message } from 'antd'
import { GetProducts, UpdateProductStatus } from '../../apicalls/products';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';


function Products() {

  const [products, setProducts] = React.useState([]);




  const getData = async () => {
    try {
      const response = await GetProducts(null);
      if (response.success) {
        setProducts(response.data);

      }

    } catch (error) {
      message.error(error.message)
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      const response = await UpdateProductStatus(id, status);
    
      if (response.success) {
        message.success(response.message)
        getData();
      } 
      else{
        throw new Error(response.message);
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
      title: "Product",
      dataIndex: "name",
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text, record) => {
        return record.seller.name
      }
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
      render : (text, record) => {
        return record.status.toUpperCase();
      }
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
        const { status, _id } = record
        return (<div className='flex gap-3'>
          {status === "pending" && (
            <span
              className='underline cursor-pointer'
              onClick={() => onStatusUpdate(_id, "approved")}>
              Approve
            </span>)}

          {status === "pending" && (
            <span
              className="underline cursor-pointer"
              onClick={() => onStatusUpdate(_id, "rejected")}
            >
              Reject
            </span>
          )}

          {
            status === "approved" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}


          {
            status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "approved")}
              >
                Unblock
              </span>
            )}

        </div>
        );
      },
    }
  ];



  useEffect(() => {
    getData();
  }, []);

  return (
    <div>

      <Table columns={columns} dataSource={products} />


    </div>
  )
}

export default Products