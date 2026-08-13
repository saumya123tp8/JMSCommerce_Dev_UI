import { Navigate, Outlet } from "react-router"
import { useAppSelector } from "../../redux/hooks"

const AdminRoute =()=>{
    const {roles} = useAppSelector((state:any)=>state.auth?.user?.roles)
    return (roles?.includes("ADMIN")) ? <Outlet/> : <Navigate to="/login"/>
}

export default AdminRoute