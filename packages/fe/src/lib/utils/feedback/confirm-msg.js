import { ElMessageBox } from 'element-plus';

export const $confirm = (message, title, options = {}) => {
    return new Promise((resolve, reject) => {
      ElMessageBox.confirm(message, title, {
        confirmButtonText: options.confirmButtonText || 'OK',
        cancelButtonText: options.cancelButtonText || 'Cancel',
        type: options.type || 'warning', // types ('info', 'success', 'warning')
        ...options
      })
        .then(() => resolve(true))   
        .catch(() => reject(false)); 
    });
};

