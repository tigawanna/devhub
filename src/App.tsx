import "./App.css";
import { RouterProvider } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QueryStateWrapper } from "./shared/wrappers/QueryStateWrapper";
import { LoaderElipse } from "./shared/loaders/Loaders";
import { appRoutes } from "./routes";
import { getUser } from "./utils/pb/config";
import { Notification } from "./components/index/Notification";

function App() {
    const query = useQuery(["user"], getUser);

    const user = query.data;

    // //no-console("notification in App === ",notificationSignal.value.message)
    return (
        <QueryStateWrapper query={query} loader={<LoaderElipse />}>
            <div className=" dark:bg-slate-900 h-full dark:text-white dark:shadow-white ">
                <RouterProvider router={appRoutes(user)} />
            </div>
            <div className="w-full fixed bottom-3 flex items-center justify-center ">
                <Notification />
            </div>
        </QueryStateWrapper>
    );
}

export default App;
