import { Upload, Button, message } from 'antd'
import React from 'react'
import { useDispatch } from 'react-redux';
import { EditProduct, UploadProductImage, uploadProductImage } from '../../../apicalls/products';

function Images({
    selectedProduct,
    setShowProductForm,
    getData,
}) {

    const [showPreview = false, setShowPreview] = React.useState(true);
    const [file = null, setFile] = React.useState(null);
    const [images = [], setImages] = React.useState(selectedProduct.Images)
    const upload = async () => {
        try {
            //Upload Image Logic to cloudinary 
            const formData = new FormData();
            formData.append("file", file);
            formData.append("productId", selectedProduct._id);
            const response = await UploadProductImage(formData);
            if (response.success) {
                message.success(response.message);
                setImages([...images, response.data]);
                setShowPreview(false);
                setFile(null);
                getData();


            }
            else {
                message.error(response.message)
            }
        } catch (error) {
            message.error(error.message);
        }
    };

    const deleteImage= async(image) => {
        try {
          const updatedImagesArray= images.filter((img) => img !== image);
          const updatedProduct ={ ...selectedProduct, images: updatedImagesArray};
          const response = await EditProduct(
            selectedProduct._id,
            updatedProduct
          );
          if (response.success){
            message.success(response.message);
            setImages(updatedImagesArray);
            setFile(null);
            getData();
          }else{
            throw new Error(response.message)
          }
        } catch (error) {
            message.error(error.message)
        }
    }

    return (
        <div>
            <div className='flex gap-5 mb-5'>
                {images.map((image) => {
                    return (<div className='flex gap-2 border border-solid border-gray-500 rounded p-2'>
                        <img className='h-20 w-20 object-cover' src={image} alt="" />
                        <i className="ri-delete-bin-7-line cursor-pointer"
                            onClick={() => 
                             deleteImage(image)
                            }>

                        </i>
                    </div>
                )})}
            </div>
            <Upload
                listType='picture'
                beforeUpload={() => false}
                onChange={(info) => {
                    setFile(info.file);
                    setShowPreview(true);

                }}
                fileList={file? [file] : []}
                showUploadList={showPreview}

            >



                <Button type="default">
                    Upload Image
                </Button>
            </Upload>

            <div className='flex justify-end gap-5 mt-5'>
                <Button type='primary'
                    onClick={() => {
                        setShowProductForm(false)
                    }}>
                    Cancel
                </Button>
                <Button type='primary'
                    disabled={!file}
                    onClick={upload}
                >
                    Upload
                </Button>
            </div>
        </div>
    )
}


export default Images