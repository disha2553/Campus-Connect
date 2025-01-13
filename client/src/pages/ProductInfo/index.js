import React from 'react'
import { useSelector } from 'react-redux'
import { GetAllBids, GetProductById, GetProducts } from '../../apicalls/products';
import { message, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Divider from '../../components/Divider'
import moment from 'moment';
import BidModal from './BidModal';

function ProductInfo() {
  const { user } = useSelector((state) => state.users)
  const [showAddNewBid, setShowAddNewBid] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [product, setProduct] = React.useState(null)
  const navigate = useNavigate();
  const { id } = useParams();
  const getData = async () => {
    try {
      const response = await GetProductById(id);
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id })
        setProduct({
          ...response.data,
          bids: bidsResponse.data
        });

      }

    } catch (error) {
      message.error(error.message)
    }
  };

  React.useEffect(() => {
    getData()
  }, [])

  return (
    product && (<div className='p-5'>
      <div className='grid grid-cols-2 gap-5 mt-5'>
        {/*images*/}
        <div className='flex flex-col gap-5'>
          <img src={product.Images[selectedImageIndex]} alt=""
            className='w-full h-96 object-cover rounded-md' />

          <div className='flex-gap-5'>
            {product.Images.map((image, index) => {
              return (
                <img className={'w-20 h-20 object-cover rounded-md cursor-pointer p-1 '
                  + (selectedImageIndex == index ? "border-2 border-gray-400 border-solid p-1" : "")}
                  onClick={() => setSelectedImageIndex(index)}
                  src={image}
                  alt="" />

              )
            })}
          </div>

          <Divider />

          <div className='text-gray-600'>
            <h1>
              Added On
            </h1>
            <span>
              {moment(product.createdAt).format("MMM D , YYYY hh:mm A")}
            </span>
          </div>





        </div>

        {/*details*/}
        <div className='flex flex-col gap-3 '>
          <div>
            <h1 className='text-2xl font-semibold  uppercase'>{product.name}</h1>
            <span>
              {product.description}
            </span>
          </div>

          <Divider />

          <div className='flex flex-col'>
            <h1 className='text-2xl font-semibold uppercase '>Product Details</h1>
            <div className='flex justify-between mt-2'>
              <span>Price</span>
              <span>Rs. {product.price}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Category</span>
              <span>{product.category}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Bill Available</span>
              <span>{product.billAvailable ? "Yes" : "No"}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Box Available</span>
              <span>{product.boxAvailable ? "Yes" : "No"}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Accesories Available</span>
              <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Warranty Available</span>
              <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Purchase Year</span>
              <span>{moment().subtract(product.yearsused, 'years').format('YYYY')}</span>
            </div>


          </div>

          <Divider />

          <div className='flex flex-col'>
            <h1 className='text-2xl font-semibold uppercase '>Seller Details</h1>
            <div className='flex justify-between mt-2'>
              <span>Name</span>
              <span>{product.seller.name}</span>
            </div>

            <div className='flex justify-between mt-2'>
              <span>Email</span>
              <span>{product.seller.email}</span>
            </div>


          </div>

          <Divider />
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h1 className="text-2xl font-semibold uppercase">Bids</h1>
              <Button
                onClick={() => setShowAddNewBid(!showAddNewBid)}
                disabled={user._id === product.seller._id} >
                New Bid</Button>

            </div>

            {product.showBidsOnProductPage && 
            product?.bids?.map((bid) => {
              return (<div className="border border-gray-300 border-solid p-2 rounded mt-3 mb-3">
                <div className="flex justify-between text-gray-600">
                  <span>Name</span>
                  <span> {bid.buyer.name}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Bid Amount</span>
                  <span> Rs. {bid.bidAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Bid Place on</span>
                  <span>
                    {" "}
                    {moment(bid.createdAt).format("MMM D, YYYY hh:mm A")}</span>
                </div>

              </div>
        );
    })}
          </div>
        </div>
      </div >

      {showAddNewBid && (<BidModal
        product={product}
        reloadData={getData}
        showBidModal={showAddNewBid}
        setShowBidModal={setShowAddNewBid}
      />
      )
      }
    </div >
    )
  )
}

export default ProductInfo