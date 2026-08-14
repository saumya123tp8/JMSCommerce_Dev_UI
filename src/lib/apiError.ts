export const extractApiErrorMessage = (err:any)=>{
    const message =
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    "Something went wrong";
    return message;
}