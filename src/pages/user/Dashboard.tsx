import Layout from "@/components/layout/Layout";
import { getUserByEmail } from "@/Service/AuthServices";
import toast from "react-hot-toast";

const Dashboard = () => {
    return (
        <Layout>
            <div>
                <h1>Dashboard</h1>
                <p>Welcome to your dashboard!</p>
                <button
                    onClick={async () => {
                        try {
                            const response = await getUserByEmail("tonyfakekesarvani6475@gmail.com"); // replace with a valid email
                            console.log(response);
                            toast.success("user data fetched")
                        } catch (error:any) {
                            console.error(error);
                            toast.error("fetching user has some error : "+ error?.message)
                        }
                    }}
                >
                    Click me
                </button>
            </div>
        </Layout>
    );
};

export default Dashboard;