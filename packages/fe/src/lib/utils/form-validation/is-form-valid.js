export async function $isFormValid(formEl) {
	try {
		return await formEl.value.validate();
	} catch {
		return false;
	}
}
