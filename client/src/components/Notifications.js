import { Modal, message } from 'antd'
import React from 'react'
import Divider from './Divider'
import { useNavigate } from 'react-router-dom';
import momen from 'moment';
import moment from 'moment';
import { DeleteNotification } from '../apicalls/notifications';


function Notifications({
    notifications = [],
    reloadNotifications,
    showNotifications,
    setShowNotifications,
}
) {
    const navigate = useNavigate();

   const deleteNotification = async (id) => {
    try{
        const response = await DeleteNotification(id);
        if(response.success){
            message.success(response.message);
            reloadNotifications();
        }
        else{
            throw new Error(response.message);
        }
    }
    catch(error){
        message.error(error.message)
    }
   };


    return (
        <Modal
            title="Notifications"
            open={showNotifications}
            onCancel={() => setShowNotifications(false)}
            footer={null}
            centered
            width={1000}>

            <div className="flex flex-col gap-2">
                {notifications.map((notification) => (
                    <div className="flex flex-col border border-solid border-gray-300 rounded p-2 cursor-pointer"
                        key={notification._id}
                        
                    >
                        <div className='flex justify-between items-center'>
                            <div
                            onClick={() => {
                                navigate(notification.onClick);
                                setShowNotifications(false);
                            }}>
                                <h1 className='text-gray-700'>
                                    {notification.title}
                                </h1>
                            
                                <span className='text-gray-500 cursor-pointer'>
                                    {notification.message}
                                </span>
                                <h1 className='text-gray-400 text-sm'>
                                    {moment(notification.createdAt).fromNow()}
                                </h1>
                            </div>
                            <i className="ri-delete-bin-7-line cursor-pointer"
                                onClick={() => {
                                    deleteNotification(notification._id);
                        }}>
                            </i>


                        </div>

                    </div>
                ))
                }


            </div>

        </Modal >
    )
}

export default Notifications



/*//notifications.js

import {Modal} from 'antd'
import React from 'react'
function Notifications({

}){
return (
   
</Modal>
export default Notifications








const getNotifications=async () => {
try {
dispatch(SetLoader(true));
const response=await GetAllNotifications();
dispatch(SetLoader(false)); 
if (response.success) {
  setNotifications(response.data);
} else {
  throw new Error(response.message);
}
} catch (error) { 
  dispatch(SetLoader(false)); 
  message.error(error.message);
}
}; */ 