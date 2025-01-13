import React, { useEffect } from 'react';
import { Modal, Tabs, Form, Input, Col, Row, message } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import Item from 'antd/es/list/Item';
import { useSelector } from "react-redux"
import { AddProduct, EditProduct } from '../../../apicalls/products';
import Images from './Images';

const additionalThings = [
  {
    label: "Bill Available",
    name: "billavailable",
  },
  {
    label: "Warranty Available",
    name: "warrantyavailable",
  },
  {
    label: "Accessories Available",
    name: "accessoriesavailable",
  },
  {
    label: "Box Available",
    name: "boxavailable",
  },
];

const rules = [
  {
    required: true,
    message: "Required"
  }
]





function ProductsForm({
  showProductForm,
  setShowProductForm,
  selectedProduct,
  getData

}) {
  const [selectedTab = "1" , setSelectedTab] = React.useState("1")
  const { user } = useSelector(state => state.users)
  const onFinish = async (values) => {
    try {

      let response = null;
      if (selectedProduct) {
        response = await EditProduct(selectedProduct._id, values);
      }
      else {
        values.seller = user._id;
        values.status = "pending";
        response = await AddProduct(values)
      }


      if (response.success) {
        message.success(response.message);
        getData();
        setShowProductForm(false);
      }
      else {
        message.error(response.message);
      }


    } catch (error) {
      message.error(error.message)
    }
  }

  const formRef = React.useRef(null);
  useEffect(() => {
    if (selectedProduct) {
      formRef.current.setFieldsValue(selectedProduct);
    }
  }, [selectedProduct]);
  return (
    <Modal title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => {
        formRef.current.submit();
      }}
      {...(selectedTab==="2" && {footer : false})}
     >

      <div>
        <h1 className="text-primary text-xl text-center font-semibold ">
          {selectedProduct ? "Edit Product" : "Add Product"}
        </h1>
        <Tabs defaultActiveKey="1"
        activeKey={selectedTab}
        onChange={(key) => setSelectedTab(key)}>
          <Tabs.TabPane tab="General" key="1" >
            <Form layout='vertical' ref={formRef}
              onFinish={onFinish}>
              <Form.Item label="Name" name="name" rules={rules}>
                <Input type="text" />
              </Form.Item>

              <Form.Item label="Description" name="description" rules={rules}>
                <TextArea type="text" />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item label="Price" name="price" rules={rules}>
                    <Input type="number" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Category" name="category" rules={rules}>
                    <select>

                      <option value="">Select</option>
                      <option value="electronics">
                        Electronics
                      </option>
                      <option value="books">
                        Books
                      </option>
                      <option value="instruments">
                        Instruments
                      </option>
                      <option value="notes">
                        Notes
                      </option>
                      <option value="others">
                        Others
                      </option>
                    </select>
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Years used" name="yearsused" rules={rules}>
                    <Input type="number" />
                  </Form.Item>
                </Col>
              </Row>

              <div className='flex gap-10'>
                {additionalThings.map((item) => {
                  return (
                    <Form.Item
                      label={item.label}
                      name={item.name}
                      valuePropName="checked">
                      <Input type='checkbox'
                        value={item.name}
                        onChange={(e) => {
                          formRef.current.setFieldsValue({
                            [item.name]: e.target.checked,
                          });
                        }}
                        checked={formRef.current?.getFieldsValue(item.name)} />

                    </Form.Item>
                  );
                })}


              </div>

              <Form.Item
                      label='Show Bids on Product Page'
                      name='showBidsOnProductPage'
                      valuePropName="checked">
                      <Input type='checkbox'

                        onChange={(e) => {
                          formRef.current.setFieldsValue({
                            showBidsOnProductPage: e.target.checked,
                          });
                        }}
                        checked={formRef.current?.getFieldsValue('showBidsOnProductPage')} 
                        style={{ width: 50, marginLeft:25}}/>

                    </Form.Item>

            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2"
            disabled={!selectedProduct}>
            <Images selectedProduct={selectedProduct} 
            getData={getData}
            setShowProductForm={setShowProductForm}/>
          </Tabs.TabPane>

        </Tabs>
      </div>
    </Modal>
  )

}

export default ProductsForm