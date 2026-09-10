export const extractApiErrorMessage = (err:any)=>{
    console.log("error print")
    console.log(err)
    const message =
    err?.message && err?.error
      ? `${err.message} : ${err.error}`
      : err?.message || err?.error || "Something went wrong";
    return message;
}