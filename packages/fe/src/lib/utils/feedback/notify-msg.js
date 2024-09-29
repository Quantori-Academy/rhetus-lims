import { ElNotification } from 'element-plus';

export const $notify = (options = {}) => {
    ElNotification({
      title: options.title || 'Notification', 
      message: options.message || '',
      type: options.type || 'info', // types ('info', 'success', 'warning')
      ...options, 
    });
};

export const $notifyUserAboutError = (error) => {
    ElNotification({
        title: 'Error', 
        message: error,
        type: 'error'
      });
};

export const $notifyUserAboutSuccess = (success) => {
  ElNotification({
      title: 'Success', 
      message: success,
      type: 'success'
    });
}