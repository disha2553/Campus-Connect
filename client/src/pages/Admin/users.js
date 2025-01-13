import React, { useEffect } from 'react'
import { Button, Table, message } from 'antd'
import { GetProducts, UpdateProductStatus } from '../../apicalls/products';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllUsers, UpdateUserStatus } from '../../apicalls/users';


function Users() {

  const [users, setUsers] = React.useState([]);




  const getData = async () => {
    try {
      const response = await GetAllUsers(null);
      if (response.success) {
        setUsers(response.data);

      }

    } catch (error) {
      message.error(error.message)
    }
  };

  const onStatusUpdate = async (id, status) => {
    try {
      const response = await UpdateUserStatus(id, status);
    
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
      title: "Name",
      dataIndex: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Role",
        dataIndex: "role",
        render : (text, record) => {
            return record.role.toUpperCase();
        }
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        render: (text, record) => moment(record.createdAt).format("DD/MM/YYYY hh:mm A"),
  
      },

    {
      title: "Status",
      dataIndex: "status",
      render : (text, record) => {
        return record.status.toUpperCase();
      }
    },
   


    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record
        return (<div className='flex gap-3'>
          {status === "active" && (
            <span
              className='underline cursor-pointer'
              onClick={() => onStatusUpdate(_id, "blocked")}>
              Block
            </span>)}

          {status === "blocked" && (
            <span
              className="underline cursor-pointer"
              onClick={() => onStatusUpdate(_id, "active")}
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

      <Table columns={columns} dataSource={users} />


    </div>
  )
}

export default Users;