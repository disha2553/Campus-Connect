import { Modal, Table, message } from "antd";
import React, { useEffect } from 'react'
import { GetAllBids } from "../../../apicalls/products"; 
import moment from "moment"; 
import Divider from "../../../components/Divider";
import { useSelector } from "react-redux";


function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
  const [bidsData, setBidsData] = React.useState([]);
  const {user} =useSelector((state) => state.users);

    
  
    const getData = async () => {
      try { 
      const response = await GetAllBids({ 

         buyer : user._id,
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
        title: "Product",
        dataIndex:"product",
        render : (text, record) => {
            return record.product.name;
        }
      },
      {
        title: "Bid Placed On",
        dataIndex: "createdAt",
        render: (text,record) => {
          return moment(text).format("DD-MM-YYYY hh:mm a");
        }
      },
  {
    title: "Seller",
    dataIndex: "name",
    render: (text, record) => { 
    return record.seller.name}
  
    
  },

  {
    title: "Offered Price",
    dataIndex: "offeredPrice",
    render:(text,record) => {
        return record.product.price;
    },
  },
  
  {
    title: "Bid Amount",
    dataIndex: "bidAmount",
  },
  

  
  {
    title: "Message", 
    dataIndex: "message"
  },
  
 
    ];
  
    useEffect(() => {
     
        getData();
  
    }, []);
  

  return (
   
      <div className="flex gap-3 flex-col">
    

        <Table columns={columns} dataSource={bidsData} />

      </div>



  

  );
}


export default Bids