import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { GetProducts } from '../../apicalls/products';
import { Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Filters from './filters';

function Home() {
  const [showFilters, setShowFilters] = React.useState(true);
  const [products, setProducts] = React.useState([])
  const [filters, setFilters] = React.useState({
    status: 'approved',
    category : [],
    yearsused : [],
  })
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
  const getData = async () => {
    try {
      const response = await GetProducts(filters);
      if (response.success) {
        setProducts(response.data);

      }

    } catch (error) {
      message.error(error.message)
    }
  };

  useEffect(() => {
    getData();
  }, [filters])


  return (
    <div className='flex gap-5 p-5'>
      {showFilters && <Filters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters} />}
      <div className='flex flex-col gap-5 w-full'>
        <div className='flex gap-5 items-center'>
          {!showFilters && 
          (<i className="ri-equalizer-line text-xl cursor-pointer "
            onClick={() => setShowFilters(!showFilters)}>

          </i>
          )}
          <input type="text"
            placeholder='Search Products here...'
            className='border border-gray-300 rounded border-solid w-full p-2 h-14' />
        </div>
        <div
          className={` grid gap-5  ${showFilters ? "grid-cols-4" : "grid-cols-5"}`}

        >
          {products?.map((product) => {
            return (
              <div className='border border-gray-300 rounded border-solid flex flex-col cursor-pointer'
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}>
                <img src={product.Images[0]}
                  className='w-full h-52 h-40 p-1 rounded-md '
                  alt='' />

                <div className='p-2 flex flex-col gap-1'>
                  <h1 className='text-lg font-semibold'>{product.name}</h1>
                  <p className='text-sm '>
                    {product.yearsused} {' '}
                    {product.yearsused === 1 ? 'year' : 'years'} old</p>
                  <Divider />
                  <span className='text-l
                 font-semibold text-green-700 '>
                    Rs. {product.price}
                  </span>
                </div>

              </div>
            )
          })}
        </div>

      </div>
    </div>


  )
}

export default Home