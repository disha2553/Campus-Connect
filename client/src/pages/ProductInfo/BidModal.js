import { Form, message } from 'antd'
import Input from 'antd/es/input/Input'
import Modal from 'antd/es/modal/Modal'
import React from 'react'
import { useSelector } from 'react-redux'
import { PlaceNewBid } from '../../apicalls/products'
import { AddNotification } from '../../apicalls/notifications'

function BidModal({
    showBidModal,
    setShowBidModal,
    product,
    reloadData
}) {
    const { user } = useSelector((state) => state.users);
    const formRef = React.useRef(null);
    const rules = [{ required: true, message: "Required" }];
    const onFinish = async (values) => {
        try {
            const response = await PlaceNewBid({
                ...values,
                product: product._id,
                seller: product.seller._id,
                buyer: user._id,
            });
            if (response.success) {
                message.success("Bid added successfully");

                // send notification to seller 
                await AddNotification({
                    title: "A new bid has been placed",
                    message: `A new bid has been placed on your product ${product.name} by ${user.name} for Rs. ${values.bidAmount}`,
                    user: product.seller._id,
                    onClick: '/profile',
                    read: false,
                })
                reloadData();
                setShowBidModal(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message)
        }
    };
    return (
        <Modal
            onCancel={() => setShowBidModal(false)}
            open={showBidModal}
            centered
            width={600}
            onOk={() => formRef.current.submit()}
        >

            <div className='flex flex-col gap-5 mb-5'>
                <h1 className="text-2xl font-semibold text-center">
                    New Bid
                </h1>

                <Form layout="vertical"
                    ref={formRef}
                    onFinish={onFinish}>
                    <Form.Item label="Bid Amount" name="bidAmount"
                        rules={rules}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Message" name="message"
                        rules={rules}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item label="Mobile" name="mobile"
                        rules={rules}
                    >
                        <Input type="number" />
                    </Form.Item>

                </Form>




            </div>
        </Modal>
    )
}
export default BidModal