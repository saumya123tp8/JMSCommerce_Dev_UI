import { useAppDispatch } from "@/redux/hooks";
import { renewAuthStoreAction } from "@/redux/slices/authSlice";
import { refreshToken } from "@/Service/AuthServices";
import type { LoginResponse, renewAuthStore } from "@/types/auth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function OathSuccess() {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    async function getAccessToken() {
        try{
      if (!isRefreshing) {
        setIsRefreshing(true);
        const refreshResponse: LoginResponse = await refreshToken();
        const renewAuthStoreData: renewAuthStore = {
          accessToken: refreshResponse?.accessToken,
          user: refreshResponse?.userDto,
        };
        //  store.getState().auth.accessToken = newAccessToken;// also updated in redux store
        dispatch(renewAuthStoreAction(renewAuthStoreData));
        toast.success("Login Successful");
        navigate("/");
      }
     
    }catch(error : any){
    toast.success("Login Failed");
    console.log(error);
    }finally{
        setIsRefreshing(false);
    }
    }
     getAccessToken();
  }, []);

  return (
    <>
      <h1>oauthSuccess</h1>
    </>
  );
}

export default OathSuccess;
