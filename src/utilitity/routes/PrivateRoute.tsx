import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../redux/hooks"

const PrivateRoute =()=>{
    const {isAuthenticated} = useAppSelector((state:any)=>state.auth)
    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
}

export default PrivateRoute