import { Modal, Table, message } from "antd";
import React, { useEffect } from 'react'
import { GetAllBids } from "../../../apicalls/products"; 
import moment from "moment"; 
import Divider from "../../../components/Divider";


function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = React.useState([]);

    
  
    const getData = async () => {
      try { 
      const response = await GetAllBids({ 
         product: selectedProduct._id,
      });
  
      if (response.success) { 
         setBidsData(response.data);
      }
  
    } catch (error) {
      message.error(error.message);
      }
  
    };
  
    const columns = [
      {
        title: "Bid Placed On",
        dataIndex: "createdAt",
        render: (text,record) => {
          return moment(text).format("DD-MM-YYYY hh:mm a");
        }
      },
  {
    title: "Name",
    dataIndex: "name",
    render: (text, record) => { 
    return record.buyer.name}
  
    
  },
  
  {
    title: "Bid Amount",
    dataIndex: "bidAmount",
  },
  
  
  {
    title: "Message", 
    dataIndex: "message"
  },
  
  {
    title:"Contact Details",
    dataIndex:"contactDetails",
    render: (text,record) => {
      return (
        <div>
        <p>Phone:{record.mobile}</p>
        <p>Email: {record.buyer.email}</p>
        </div>
      );
    }
  }
  
  
    ];
  
    useEffect(() => {
      if (selectedProduct) {
        getData();
      }
    }, [selectedProduct]);
  

  return (
    <Modal
      title="Bids"
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={1500}
      footer={null}
    >
      <div className="flex gap-3 flex-col">
        <h1 className="text-primary">Bids</h1>
        <Divider />
        <h1 className="text-xl text-gray-500">
		   Product Name: {selectedProduct.name}
        </h1>

        <Table columns={columns} dataSource={bidsData} />

      </div>



    </Modal>

  );
}


export default Bids