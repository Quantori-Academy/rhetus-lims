<script setup>

import { $api } from '../lib/api';
import { $confirm } from '../lib/utils/feedback/confirm-msg'
import { $notify, $notifyUserAboutError } from '../lib/utils/feedback/notify-msg'
import { $error } from '../lib/utils/errors/errorMessages'
import { $notifyUserAboutError } from '../lib/utils/feedback/notify-msg'

async function deleteUser(id){
    const user = inject('user');
    
    if (user.role !== 'admin') {
        $notifyUserAboutError('Only admin can delete users');
        return;
    }

    $confirm('Will permanently delete the user. Continue?', 'Warning', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning'
	}).then(async () => {
        const response = await $api.usersDelete.deleteUser(id)
        if(response) {
            $notify({
                title: 'Success',
                message: 'User deleted',
                type: 'success',
            })
        } else {
            $notifyUserAboutError('error occured')
        }

	}).catch((action) => {
        $notify({
            title: 'Canceled',
            message: 'User deletion canceled',
            type: 'info'
        });
		

	}) 
	
    console.log(response)
};

const errorMsg = $error(404)
console.log(errorMsg)
</script>

